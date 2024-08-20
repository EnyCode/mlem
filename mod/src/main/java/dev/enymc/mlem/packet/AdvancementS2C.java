package dev.enymc.mlem.packet;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import net.minecraft.advancement.AdvancementDisplay;
import net.minecraft.advancement.AdvancementHolder;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.network.ServerPlayerEntity;
import dev.enymc.mlem.S2CPacket;
import dev.enymc.mlem.Util;

public class AdvancementS2C implements S2CPacket {
    private final AdvancementDisplay display;
    private final AdvancementHolder advancement;
    private final ServerPlayerEntity player;

    public AdvancementS2C(AdvancementDisplay display, AdvancementHolder advancement,
            ServerPlayerEntity player) {
        this.display = display;
        this.advancement = advancement;
        this.player = player;
    }

    @Override
    public JsonElement json() {
        JsonObject obj = new JsonObject();
        obj.addProperty("type", "advancement");
        obj.add("player", Util.serializePlayer(this.player));

        obj.addProperty("advancement", this.advancement.id().toString());
        obj.addProperty("advancement_type", this.display.getType().asString());

        obj.add("message",
                Util.serializeText(this.display.getType().getFormatted(this.advancement, this.player), this.server()));
        obj.add("title", Util.serializeText(this.display.getTitle(), this.server()));
        obj.add("description", Util.serializeText(this.display.getDescription(), this.server()));

        return obj;
    }

    @Override
    public MinecraftServer server() {
        return this.player.getServer();
    }
}
