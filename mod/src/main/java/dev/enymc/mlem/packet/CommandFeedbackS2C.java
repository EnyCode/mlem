package dev.enymc.mlem.packet;

import java.util.Optional;

import org.jetbrains.annotations.Nullable;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import net.minecraft.server.MinecraftServer;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;
import dev.enymc.mlem.S2CPacket;
import dev.enymc.mlem.Util;

public class CommandFeedbackS2C implements S2CPacket {
    private final MinecraftServer server;
    private final Text text;
    private final Text sharedText;
    private final Optional<ServerPlayerEntity> sender;

    public CommandFeedbackS2C(MinecraftServer server, Text text, Text sharedText, @Nullable ServerPlayerEntity sender) {
        this.server = server;
        this.text = text;
        this.sharedText = sharedText;
        this.sender = Optional.ofNullable(sender);
    }

    @Override
    public JsonElement json() {
        JsonObject obj = new JsonObject();
        obj.addProperty("type", "command_feedback");
        obj.add("feedback", Util.serializeText(this.text, this.server));
        obj.add("shared_feedback", Util.serializeText(this.sharedText, this.server));

        if (this.sender.isPresent()) {
            obj.add("sender", Util.serializePlayer(this.sender.get()));
        }

        return obj;
    }

    @Override
    public MinecraftServer server() {
        return this.server;
    }
}
