package dev.enymc.mlem.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import net.minecraft.advancement.AdvancementDisplay;
import net.minecraft.advancement.AdvancementHolder;
import net.minecraft.advancement.PlayerAdvancementTracker;
import net.minecraft.server.network.ServerPlayerEntity;
import dev.enymc.mlem.packet.AdvancementS2C;

@Mixin(PlayerAdvancementTracker.class)
public class PlayerAdvancementTrackerMixin {
    @Shadow
    private ServerPlayerEntity owner;

    @Inject(method = "method_53637(Lnet/minecraft/advancement/AdvancementHolder;Lnet/minecraft/advancement/AdvancementDisplay;)V", at = @At(value = "INVOKE", target = "Lnet/minecraft/server/PlayerManager;broadcastSystemMessage(Lnet/minecraft/text/Text;Z)V"))
    private void onReceiveAdvancement(AdvancementHolder advancement, AdvancementDisplay display, CallbackInfo ci) {
        new AdvancementS2C(display, advancement, this.owner).broadcast();
    }
}
