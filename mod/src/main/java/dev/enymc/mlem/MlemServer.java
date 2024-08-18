package dev.enymc.mlem;

import java.net.InetSocketAddress;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.jetbrains.annotations.Nullable;

import net.minecraft.server.dedicated.MinecraftDedicatedServer;

public class MlemServer extends WebSocketServer {
    public final MinecraftDedicatedServer server;

    private MlemServer(InetSocketAddress addr, MinecraftDedicatedServer server) {
        super(addr);

        this.server = server;
    }

    public static MlemServer create(MinecraftDedicatedServer server) {
        String hostname = server.getHostname();
        if (hostname.isEmpty())
            hostname = "0.0.0.0";

        // TODO: don't hardcode port
        MlemServer mlem = new MlemServer(new InetSocketAddress(hostname, 1701), server);
        mlem.start();
        return mlem;
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        Mlem.LOGGER.info("Connection to mlem server from " + ipFor(conn));
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        if (C2SPacket.execute(this, message, conn).isEmpty()) {
            Mlem.LOGGER.debug("error in JSON from client " + ipFor(conn) + ": " + message);
        }
    }

    @Override
    public void onError(@Nullable WebSocket conn, Exception ex) {
        if (conn == null) {
            Mlem.LOGGER.error("Error with mlem server", ex);
        } else {
            Mlem.LOGGER.error("Error with mlem client " + ipFor(conn), ex);
        }
    }

    @Override
    public void onStart() {
    }

    private static String ipFor(WebSocket conn) {
        return conn.getRemoteSocketAddress().getAddress().getHostAddress().replaceFirst("(?:^|:)0(:0)+(?:$|:)", "::");
    }
}
