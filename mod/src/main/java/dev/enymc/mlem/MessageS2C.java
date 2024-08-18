package dev.enymc.mlem;

import com.google.gson.JsonElement;

import net.minecraft.server.MinecraftServer;

public interface MessageS2C {
    JsonElement json();

    default void broadcast(MinecraftServer server) {
        // TODO: this will probably explode on single player
        ((MlemParent) (Object) server).mlem().broadcast(this.json().toString());
    }
}
