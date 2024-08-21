package dev.enymc.mlem.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import com.llamalad7.mixinextras.sugar.Local;

import net.minecraft.entity.damage.DamageSource;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;
import dev.enymc.mlem.packet.PlayerDeathS2C;

@Mixin(ServerPlayerEntity.class)
public class ServerPlayerEntityMixin {
    @Inject(method = "onDeath", at = @At(value = "INVOKE_ASSIGN", target = "Lnet/minecraft/entity/damage/DamageTracker;getDeathMessage()Lnet/minecraft/text/Text;"))
    private void onDeath(DamageSource source, CallbackInfo ci, @Local(ordinal = 0) Text deathMessage) {
        new PlayerDeathS2C((ServerPlayerEntity) (Object) this, deathMessage).broadcast();
    }
}
