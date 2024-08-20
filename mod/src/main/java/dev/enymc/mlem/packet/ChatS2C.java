package dev.enymc.mlem.packet;

import java.util.Optional;

import org.jetbrains.annotations.Nullable;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import net.minecraft.network.message.MessageType;
import net.minecraft.network.message.SignedChatMessage;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.network.ServerPlayerEntity;
import dev.enymc.mlem.MlemServer;
import dev.enymc.mlem.S2CPacket;
import dev.enymc.mlem.Util;

public class ChatS2C implements S2CPacket {
    private final MinecraftServer server;

    private final ChatType type;
    private final SignedChatMessage message;
    @Nullable
    private final ServerPlayerEntity author;

    private ChatS2C(MlemServer server, SignedChatMessage message, @Nullable ServerPlayerEntity author, ChatType type) {
        this.server = server.server;
        this.type = type;
        this.message = message;
        this.author = author;
    }

    public static Optional<ChatS2C> create(MlemServer server, SignedChatMessage chatMessage,
            @Nullable ServerPlayerEntity author, MessageType.Parameters parameters) {
        parameters.messageType().isRegistryKey(MessageType.CHAT);

        var messageType = parameters.messageType();
        ChatType type = author == null ? ChatType.SERVER_MESSAGE
                : messageType.isRegistryKey(MessageType.CHAT) ? ChatType.CHAT
                        : messageType.isRegistryKey(MessageType.SAY_COMMAND) ? ChatType.SAY_COMMAND
                                : messageType.isRegistryKey(MessageType.EMOTE_COMMAND) ? ChatType.ME_COMMAND : null;

        if (type == null)
            return Optional.empty();

        return Optional.of(new ChatS2C(server, chatMessage, author, type));
    }

    @Override
    public JsonElement json() {
        JsonObject obj = new JsonObject();
        obj.addProperty("type", this.type.id);
        obj.add("chat", Util.serializeText(this.message.getUnsignedContent(), this.server));

        if (this.author != null) {
            obj.add("player", Util.serializePlayer(this.author));
        }

        return obj;
    }

    public enum ChatType {
        CHAT("chat"),
        SAY_COMMAND("chat_say"),
        ME_COMMAND("chat_me"),
        SERVER_MESSAGE("server_message");

        public final String id;

        private ChatType(String id) {
            this.id = id;
        }
    }
}
