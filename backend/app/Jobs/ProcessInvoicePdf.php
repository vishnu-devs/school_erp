<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\FinancialTransaction;
use Illuminate\Support\Facades\Log;

class ProcessInvoicePdf implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $transaction;

    /**
     * Create a new job instance.
     */
    public function __construct(FinancialTransaction $transaction)
    {
        $this->transaction = $transaction;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Processing Invoice PDF for Transaction: " . $this->transaction->enterprise_transaction_id);
        
        // Simulating PDF generation engine
        // In production, this would compile a view using mpdf/dompdf
        // and save it to storage/app/invoices/
        
        sleep(2); // Simulate heavy PDF processing
        
        Log::info("Invoice Generated: " . $this->transaction->enterprise_transaction_id);
    }
}
