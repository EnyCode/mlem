package dev.enymc.mlem.message;

import org.java_websocket.WebSocket;

import com.google.gson.JsonObject;

import net.minecraft.text.Text;
import dev.enymc.mlem.MessageC2S;
import dev.enymc.mlem.MlemServer;

public class BroadcastC2S implements MessageC2S {
    @Override
    public void execute(MlemServer server, JsonObject json, WebSocket conn) {
        Text text = Text.SerializationUtil.fromJson(json.get("message").toString(),
                server.server.getRegistryManager());

        for (var player : server.server.getPlayerManager().getPlayerList()) {
            player.sendSystemMessage(text);
        }
    }
}
