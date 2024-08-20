package dev.enymc.mlem.mixin;

import java.util.function.Predicate;

import org.jetbrains.annotations.Nullable;
import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import net.minecraft.network.ClientConnection;
import net.minecraft.network.ConnectedClientData;
import net.minecraft.network.message.MessageType;
import net.minecraft.network.message.SignedChatMessage;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.PlayerManager;
import net.minecraft.server.network.ServerPlayerEntity;
import dev.enymc.mlem.Util;
import dev.enymc.mlem.packet.ChatS2C;
import dev.enymc.mlem.packet.PlayerListUpdateS2C;

@Mixin(PlayerManager.class)
public class PlayerManagerMixin {
    @Shadow
    @Final
    private MinecraftServer server;

    @Inject(method = "Lnet/minecraft/server/PlayerManager;sendChatMessage(Lnet/minecraft/network/message/SignedChatMessage;Ljava/util/function/Predicate;Lnet/minecraft/server/network/ServerPlayerEntity;Lnet/minecraft/network/message/MessageType$Parameters;)V", at = @At("TAIL"))
    private void sendChatMessage(SignedChatMessage message, Predicate<ServerPlayerEntity> shouldFilter,
            @Nullable ServerPlayerEntity sender, MessageType.Parameters parameters, CallbackInfo ci) {
        ChatS2C.create(Util.mlem(this.server), message, sender, parameters)
                .ifPresent(packet -> packet.broadcast());
    }

    @Inject(method = "onPlayerConnect", at = @At("TAIL"))
    private void onPlayerConnect(ClientConnection conn, ServerPlayerEntity player, ConnectedClientData connData,
            CallbackInfo ci) {
        PlayerListUpdateS2C.join(player).broadcast();
    }

    @Inject(method = "remove", at = @At("TAIL"))
    private void onPlayerRemove(ServerPlayerEntity player, CallbackInfo ci) {
        PlayerListUpdateS2C.leave(player).broadcast();
    }
}
