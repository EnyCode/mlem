package dev.enymc.mlem;

import java.net.InetSocketAddress;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.jetbrains.annotations.Nullable;

import net.minecraft.server.dedicated.DedicatedServer;

public class MlemServer extends WebSocketServer {
    private MlemServer(InetSocketAddress addr) {
        super(addr);
    }

    public static MlemServer create(DedicatedServer server) {
        String hostname = server.getHostname();
        if (hostname.isEmpty())
            hostname = "0.0.0.0";

        // TODO: don't hardcode port
        MlemServer mlem = new MlemServer(new InetSocketAddress(hostname, 1701));
        mlem.start();
        return mlem;
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        Mlem.LOGGER
                .info("Connection to mlem server from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        Mlem.LOGGER.info("message from ws: " + message);
    }

    @Override
    public void onError(@Nullable WebSocket conn, Exception ex) {
        if (conn == null) {
            Mlem.LOGGER.error("Error with mlem server", ex);
        } else {
            Mlem.LOGGER.error("Error with mlem client " + conn.getRemoteSocketAddress().getAddress().getHostAddress(),
                    ex);
        }
    }

    @Override
    public void onStart() {
    }
}
