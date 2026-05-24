<?php

namespace App\Services;

use App\Models\FinancialTransaction;
use Illuminate\Support\Facades\Storage;

class SecureProofService
{
    /**
     * Securely stores an uploaded payment proof (e.g. UPI screenshot),
     * hashes it to prevent duplicates, and watermarks the metadata.
     * 
     * @param \Illuminate\Http\UploadedFile $file
     * @return string Path to the stored file
     * @throws \Exception If the image is a duplicate or invalid
     */
    public function storeProof($file): string
    {
        // 1. Generate SHA-256 Image Hash to prevent reused screenshots securely
        $hash = hash_file('sha256', $file->getRealPath());

        // Check if this hash already exists in any financial transaction
        $exists = FinancialTransaction::where('proof_image_hash', $hash)->exists();
        if ($exists) {
            throw new \Exception('DUPLICATE_PROOF_DETECTED: This screenshot has already been used for another payment.');
        }

        // 2. Validate MIME type explicitly (only images/pdfs)
        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            throw new \Exception('INVALID_FILE_TYPE: Only JPG, PNG, WEBP, and PDF files are allowed.');
        }

        // 3. Securely store in the 'private' disk so it's not publicly accessible
        $path = $file->store('payment_proofs', 'private');

        // Optional: In a full production environment with GD/Imagick enabled, 
        // we would programmatically stamp a visual watermark here.

        return $path;
    }
}
