package dev.enymc.mlem.mixin;

import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import com.llamalad7.mixinextras.sugar.Local;

import net.minecraft.server.MinecraftServer;
import net.minecraft.server.command.CommandOutput;
import net.minecraft.server.command.ServerCommandSource;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;
import dev.enymc.mlem.packet.CommandFeedbackS2C;

@Mixin(ServerCommandSource.class)
public class ServerCommandSourceMixin {
    @Shadow
    @Final
    private MinecraftServer server;

    @Shadow
    @Final
    private CommandOutput output;

    // the `sendToOps` method sends feedback twice, for op players (uses
    // sendCommandFeedback game rule) and for the server log (uses logAdminCommands
    // game rule). injecting after `getPlayerList` is invoked allows for using
    // sendCommandFeedback instead. (note that this means console commands aren't
    // logged.)
    @Inject(method = "sendToOps", at = @At(value = "INVOKE", target = "Lnet/minecraft/server/MinecraftServer;sendSystemMessage(Lnet/minecraft/text/Text;)V"))
    private void onCommandFeedback(Text message, CallbackInfo ci, @Local(ordinal = 1) Text sharedMessage) {
        var sender = this.output instanceof ServerPlayerEntity ? (ServerPlayerEntity) this.output : null;
        new CommandFeedbackS2C(this.server, message, sharedMessage, sender).broadcast();
    }
}
