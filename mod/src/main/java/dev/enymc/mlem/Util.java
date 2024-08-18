package dev.enymc.mlem;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import net.minecraft.server.MinecraftServer;
import net.minecraft.server.network.ServerPlayerEntity;

public class Util {
    public static MlemServer mlem(MinecraftServer server) {
        // TODO: this will probably explode on single player
        return ((MlemParent) (Object) server).mlem();
    }

    public static JsonElement serializePlayer(ServerPlayerEntity player) {
        var obj = new JsonObject();
        obj.addProperty("name", player.getProfileName());
        obj.addProperty("uuid", player.getUuidAsString());
        return obj;
    }
}
