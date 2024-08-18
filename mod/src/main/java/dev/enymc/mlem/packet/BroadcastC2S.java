package dev.enymc.mlem.packet;

import org.java_websocket.WebSocket;

import com.google.gson.JsonObject;

import net.minecraft.text.Text;
import dev.enymc.mlem.C2SPacket;
import dev.enymc.mlem.MlemServer;

public class BroadcastC2S implements C2SPacket {
    @Override
    public void execute(MlemServer server, JsonObject json, WebSocket conn) {
        Text text = Text.SerializationUtil.fromJson(json.get("message"),
                server.server.getRegistryManager());

        for (var player : server.server.getPlayerManager().getPlayerList()) {
            player.sendSystemMessage(text);
        }
    }
}
