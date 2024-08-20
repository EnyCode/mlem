package dev.enymc.mlem.packet;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import net.minecraft.server.MinecraftServer;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;
import dev.enymc.mlem.S2CPacket;
import dev.enymc.mlem.Util;

public class PlayerListUpdateS2C implements S2CPacket {
    private final MinecraftServer server;

    private final Type type;
    private final ServerPlayerEntity player;

    private PlayerListUpdateS2C(MinecraftServer server, Type type, ServerPlayerEntity player) {
        this.server = server;
        this.type = type;
        this.player = player;
    }

    public static PlayerListUpdateS2C join(MinecraftServer server, ServerPlayerEntity player) {
        return new PlayerListUpdateS2C(server, Type.JOIN, player);
    }

    public static PlayerListUpdateS2C leave(MinecraftServer server, ServerPlayerEntity player) {
        return new PlayerListUpdateS2C(server, Type.LEAVE, player);
    }

    @Override
    public JsonElement json() {
        JsonObject obj = new JsonObject();
        obj.addProperty("type", this.type.id);
        obj.addProperty("joined", this.type.equals(Type.JOIN));
        obj.add("player", Util.serializePlayer(this.player));
        obj.add("message", Util.serializeText(this.type.text(this.player), this.server));
        return obj;
    }

    public enum Type {
        JOIN("player_join"),
        LEAVE("player_leave");

        public final String id;

        private Type(String id) {
            this.id = id;
        }

        public Text text(ServerPlayerEntity player) {
            // see PlayerManager#onPlayerConnect and
            // ServerPlayNetworkHandler#removePlayerFromWorld
            return switch (this) {
                case JOIN -> Text.translatable("multiplayer.player.joined", player.getDisplayName());
                case LEAVE -> Text.translatable("multiplayer.player.left", player.getDisplayName());
            };
        }
    }
}
