package dev.enymc.mlem.packet;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import net.minecraft.server.MinecraftServer;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;
import dev.enymc.mlem.S2CPacket;
import dev.enymc.mlem.Util;

public class PlayerDeathS2C implements S2CPacket {
    private final ServerPlayerEntity player;
    private final Text message;

    public PlayerDeathS2C(ServerPlayerEntity player, Text message) {
        this.player = player;
        this.message = message;
    }

    @Override
    public JsonElement json() {
        JsonObject obj = new JsonObject();
        obj.addProperty("type", "player_death");
        obj.add("player", Util.serializePlayer(this.player));
        obj.add("message", Util.serializeText(this.message, this.server()));
        return obj;
    }

    @Override
    public MinecraftServer server() {
        return this.player.getServer();
    }
}
