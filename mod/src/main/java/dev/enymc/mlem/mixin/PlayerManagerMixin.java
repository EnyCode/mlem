package dev.enymc.mlem.mixin;

import java.util.function.Predicate;

import org.jetbrains.annotations.Nullable;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import net.minecraft.network.message.MessageType;
import net.minecraft.network.message.SignedChatMessage;
import net.minecraft.server.PlayerManager;
import net.minecraft.server.network.ServerPlayerEntity;

@Mixin(PlayerManager.class)
public class PlayerManagerMixin {
    @Inject(method = "Lnet/minecraft/server/PlayerManager;sendChatMessage(Lnet/minecraft/network/message/SignedChatMessage;Ljava/util/function/Predicate;Lnet/minecraft/server/network/ServerPlayerEntity;Lnet/minecraft/network/message/MessageType$Parameters;)V", at = @At("TAIL"))
    private void sendChatMessage(SignedChatMessage message, Predicate<ServerPlayerEntity> shouldFilter,
            @Nullable ServerPlayerEntity sender, MessageType.Parameters parameters, CallbackInfo ci) {
        System.out.println(sender.getName().getString() + " says: " + message.getContent());
    }
}
