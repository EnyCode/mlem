package dev.enymc.mlem.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import net.minecraft.entity.damage.DamageSource;
import net.minecraft.entity.passive.VillagerEntity;
import dev.enymc.mlem.packet.VillagerDeathS2C;

@Mixin(VillagerEntity.class)
public class VillagerEntityMixin {
    @Inject(method = "onDeath", at = @At("HEAD"))
    private void onDeath(DamageSource source, CallbackInfo ci) {
        VillagerEntity self = (VillagerEntity) (Object) this;
        new VillagerDeathS2C(self, source.getDeathMessage(self)).broadcast();
    }
}
