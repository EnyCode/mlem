package dev.enymc.mlem;

import com.google.gson.JsonElement;

import net.minecraft.server.MinecraftServer;

public interface S2CPacket {
    JsonElement json();

    default void broadcast(MinecraftServer server) {
        Util.mlem(server).broadcast(this.json().toString());
    }
}
