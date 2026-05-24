<?php

namespace App\Services;

use App\Models\FinancialTransaction;
use App\Models\TenantProfile;

class InvoiceService
{
    /**
     * Generates an immutable snapshot of the current receiver's configurations
     * at the moment the transaction is initiated.
     * 
     * @param int $schoolId
     * @param string $gatewayName
     * @return array
     */
    public function generateImmutableSnapshot(int $schoolId, string $gatewayName): array
    {
        $profile = TenantProfile::where('school_id', $schoolId)->first();
        
        return [
            'timestamp' => now()->toIso8601String(),
            'receiver' => [
                'school_id' => $schoolId,
                'name' => $profile->short_name ?? 'School',
                'contact_email' => $profile->support_email ?? null,
            ],
            'gateway_used' => $gatewayName,
            'branding' => [
                'logo_url' => $profile->favicon ?? null,
                'primary_color' => $profile->primary_color ?? '#000000',
            ],
            'legal_disclaimer' => 'This is a legally binding, immutable financial receipt.'
        ];
    }
}
