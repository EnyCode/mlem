package dev.enymc.mlem.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Unique;
import org.spongepowered.asm.mixin.injection.At;

import com.llamalad7.mixinextras.injector.ModifyReturnValue;

import net.minecraft.server.dedicated.MinecraftDedicatedServer;
import dev.enymc.mlem.Mlem;
import dev.enymc.mlem.MlemServer;

@Mixin(MinecraftDedicatedServer.class)
public class MinecraftDedicatedServerMixin {
    @Unique
    private MlemServer mlemServer;

    @ModifyReturnValue(method = "setupServer", at = @At("RETURN"))
    private boolean setupMlemServer(boolean successfullyStarted) {
        if (successfullyStarted) {
            Mlem.LOGGER.info("Starting mlem server");
            this.mlemServer = MlemServer.create((MinecraftDedicatedServer) (Object) this);
        }

        return successfullyStarted;
    }
}
