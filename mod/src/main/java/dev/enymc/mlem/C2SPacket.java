package dev.enymc.mlem;

import java.util.Optional;

import org.java_websocket.WebSocket;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;

import dev.enymc.mlem.packet.BroadcastC2S;

public interface C2SPacket {
    public static final Gson GSON = new Gson();

    public static Optional<C2SPacket> execute(MlemServer server, String json, WebSocket conn) {
        JsonObject obj;
        try {
            obj = GSON.fromJson(json, JsonObject.class);
        } catch (JsonSyntaxException e) {
            return Optional.empty();
        }

        String type;
        try {
            type = obj.get("type").getAsString();
        } catch (UnsupportedOperationException | IllegalStateException | NullPointerException e) {
            return Optional.empty();
        }

        C2SPacket msg = type.equals("broadcast") ? new BroadcastC2S() : null;

        if (msg != null) {
            msg.execute(server, obj, conn);
            return Optional.of(msg);
        } else {
            return Optional.empty();
        }
    }

    void execute(MlemServer server, JsonObject json, WebSocket conn);
}
