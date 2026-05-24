<?php

namespace App\Services;

use App\Models\DocumentTemplate;
use Illuminate\Support\Facades\Blade;

class TemplateService
{
    /**
     * Renders a dynamic HTML template with the given data.
     * 
     * @param string $type The template type (e.g. 'id_card', 'fee_receipt')
     * @param array $data The data to inject (e.g. ['student_name' => 'John'])
     * @return string Compiled HTML
     */
    public function renderTemplate(string $type, array $data = []): string
    {
        // Fetch the active template for the current tenant
        // Since we are in the stancl/tenancy context, tenant() is available
        $template = DocumentTemplate::where('school_id', tenant('id'))
                        ->where('type', $type)
                        ->where('is_active', true)
                        ->first();
                        
        if (!$template) {
            return "<div style='color:red;'>Template not found for type: {$type}</div>";
        }

        // We compile the blade string stored in the database
        // e.g. "<h1>{{ $student_name }}</h1>"
        try {
            return Blade::render($template->html_content, $data);
        } catch (\Exception $e) {
            return "<div style='color:red;'>Template Error: " . $e->getMessage() . "</div>";
        }
    }
}
