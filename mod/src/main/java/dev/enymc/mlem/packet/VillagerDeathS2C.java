package dev.enymc.mlem.packet;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import net.minecraft.entity.passive.VillagerEntity;
import net.minecraft.server.MinecraftServer;
import net.minecraft.text.Text;
import net.minecraft.village.VillagerProfession;
import dev.enymc.mlem.S2CPacket;
import dev.enymc.mlem.Util;

public class VillagerDeathS2C implements S2CPacket {
    private final VillagerEntity villager;
    private final Text message;

    public VillagerDeathS2C(VillagerEntity villager, Text message) {
        this.villager = villager;
        this.message = message;
    }

    @Override
    public JsonElement json() {
        JsonObject obj = new JsonObject();
        obj.addProperty("type", "villager_death");
        obj.add("message", Util.serializeText(this.message, this.server()));

        var data = this.villager.getVillagerData();
        JsonObject villagerObj = new JsonObject();
        villagerObj.addProperty("type", data.getType().toString());
        villagerObj.addProperty("profession",
                data.getProfession().equals(VillagerProfession.NONE) ? null : data.getProfession().name());
        villagerObj.addProperty("level", data.getLevel());
        obj.add("villager", villagerObj);

        return obj;
    }

    @Override
    public MinecraftServer server() {
        return villager.getServer();
    }
}
