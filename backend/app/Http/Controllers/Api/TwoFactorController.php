<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class TwoFactorController extends Controller
{
    public function setup(Request $request)
    {
        $user = $request->user();
        $google2fa = new Google2FA();

        // Generate a new secret if one doesn't exist
        $secret = $user->two_factor_secret;
        if (!$secret) {
            $secret = $google2fa->generateSecretKey();
            $user->update(['two_factor_secret' => $secret]);
        }

        // Generate QR code URL
        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name', 'School ERP'),
            $user->email,
            $secret
        );

        // Render QR Code as SVG
        $renderer = new ImageRenderer(
            new RendererStyle(256),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $svg = $writer->writeString($qrCodeUrl);

        return response()->json([
            'secret' => $secret,
            'qr_code_svg' => $svg,
            'is_enabled' => $user->two_factor_enabled
        ]);
    }

    public function enable(Request $request)
    {
        $request->validate(['otp' => 'required|string']);

        $user = $request->user();
        $google2fa = new Google2FA();

        if (!$user->two_factor_secret) {
            return response()->json(['message' => 'Please setup 2FA first'], 400);
        }

        $valid = $google2fa->verifyKey($user->two_factor_secret, $request->otp);

        if ($valid) {
            $user->update(['two_factor_enabled' => true]);
            return response()->json(['message' => 'Two-Factor Authentication enabled successfully']);
        }

        return response()->json(['message' => 'Invalid OTP Code'], 400);
    }

    public function disable(Request $request)
    {
        $user = $request->user();
        
        $user->update([
            'two_factor_enabled' => false,
            // Optionally clear the secret to force new setup next time
            // 'two_factor_secret' => null
        ]);

        return response()->json(['message' => 'Two-Factor Authentication disabled successfully']);
    }
}
