<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class SecureFileUpload
{
    /**
     * Allowed MIME types and extensions
     */
    protected $allowedMimes = [
        'image/jpeg' => ['jpg', 'jpeg'],
        'image/png' => ['png'],
        'image/webp' => ['webp'],
        'application/pdf' => ['pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => ['docx'],
    ];

    /**
     * Store a file securely.
     *
     * @param UploadedFile $file
     * @param string $disk
     * @param string $path
     * @param int $maxSizeKB
     * @return string
     * @throws ValidationException
     */
    public function store(UploadedFile $file, string $disk = 'private', string $path = 'documents', int $maxSizeKB = 5120): string
    {
        $this->validateSize($file, $maxSizeKB);
        $this->validateMimeAndExtension($file);

        // Generate a cryptographically secure random name
        $extension = $file->getClientOriginalExtension();
        $filename = bin2hex(random_bytes(16)) . '.' . $extension;

        // Store file
        $filePath = $file->storeAs($path, $filename, $disk);

        return $filePath;
    }

    /**
     * Validate the file size.
     */
    protected function validateSize(UploadedFile $file, int $maxSizeKB)
    {
        if ($file->getSize() > ($maxSizeKB * 1024)) {
            throw ValidationException::withMessages([
                'file' => "File exceeds maximum allowed size of {$maxSizeKB}KB.",
            ]);
        }
    }

    /**
     * Validate MIME type strictly.
     */
    protected function validateMimeAndExtension(UploadedFile $file)
    {
        $mime = $file->getMimeType();
        $extension = strtolower($file->getClientOriginalExtension());

        if (!array_key_exists($mime, $this->allowedMimes)) {
            throw ValidationException::withMessages([
                'file' => "File type {$mime} is not allowed. Only JPG, PNG, WEBP, PDF, and DOCX are permitted.",
            ]);
        }

        if (!in_array($extension, $this->allowedMimes[$mime])) {
            throw ValidationException::withMessages([
                'file' => "File extension {$extension} does not match the file's content type.",
            ]);
        }
        
        // Prevent executable scripts disguised as other types
        $dangerousExtensions = ['php', 'exe', 'sh', 'bat', 'js', 'py', 'pl'];
        if (in_array($extension, $dangerousExtensions)) {
            throw ValidationException::withMessages([
                'file' => "Dangerous file extension detected.",
            ]);
        }
    }
}
