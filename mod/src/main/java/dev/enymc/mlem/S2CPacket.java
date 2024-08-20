package dev.enymc.mlem;

import com.google.gson.JsonElement;

import net.minecraft.server.MinecraftServer;

public interface S2CPacket {
    JsonElement json();

    MinecraftServer server();

    default void broadcast() {
        Util.mlem(this.server()).broadcast(this.json().toString());
    }
}
