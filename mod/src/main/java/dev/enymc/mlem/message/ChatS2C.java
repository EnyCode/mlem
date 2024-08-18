package dev.enymc.mlem.message;

import java.util.Optional;

import org.jetbrains.annotations.Nullable;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import net.minecraft.network.message.MessageType;
import net.minecraft.network.message.SignedChatMessage;
import net.minecraft.server.network.ServerPlayerEntity;
import dev.enymc.mlem.MessageS2C;

public class ChatS2C implements MessageS2C {
    private final ChatType type;
    private final SignedChatMessage message;

    private ChatS2C(SignedChatMessage message, @Nullable ServerPlayerEntity author, ChatType type) {
        this.type = type;
        this.message = message;
    }

    public static Optional<ChatS2C> create(SignedChatMessage chatMessage, @Nullable ServerPlayerEntity author,
            MessageType.Parameters parameters) {
        parameters.messageType().isRegistryKey(MessageType.CHAT);

        var messageType = parameters.messageType();
        ChatType type = messageType.isRegistryKey(MessageType.CHAT) ? ChatType.CHAT
                : messageType.isRegistryKey(MessageType.SAY_COMMAND) ? ChatType.SAY_COMMAND
                        : messageType.isRegistryKey(MessageType.EMOTE_COMMAND) ? ChatType.ME_COMMAND : null;

        if (type == null)
            return Optional.empty();

        return Optional.of(new ChatS2C(chatMessage, author, type));
    }

    @Override
    public JsonElement json() {
        var obj = new JsonObject();
        obj.addProperty("type", this.type.id);
        obj.addProperty("message", this.message.getContent());
        return obj;
    }

    public enum ChatType {
        CHAT("chat"),
        SAY_COMMAND("chat_say"),
        ME_COMMAND("chat_me");

        public final String id;

        private ChatType(String id) {
            this.id = id;
        }
    }
}
