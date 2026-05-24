import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import FinanceService from '../../services/financeService';

const ManualProofUploader = ({ transactionId, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      // Basic frontend validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(selected.type)) {
        setError('Only JPG, PNG, WEBP, and PDF files are allowed.');
        setFile(null);
        return;
      }
      if (selected.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File must be smaller than 5MB.');
        setFile(null);
        return;
      }
      
      setError('');
      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!file || !transactionId) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('proof_image', file);
    formData.append('transaction_id', transactionId);

    try {
      await FinanceService.uploadPaymentProof(formData);
      onUploadComplete && onUploadComplete();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message?.includes('DUPLICATE_PROOF_DETECTED')) {
        setError('Security Error: This exact image has already been submitted for another payment.');
      } else {
        setError('Failed to upload proof. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">Upload Payment Proof</CardTitle>
        <CardDescription>Upload a screenshot of your UPI or Bank Transfer receipt.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
          <input
            type="file"
            id="proof-upload"
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFileChange}
          />
          <label htmlFor="proof-upload" className="cursor-pointer flex flex-col items-center justify-center">
            <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">
              {file ? file.name : "Click to select a file"}
            </span>
            <span className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 5MB</span>
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {uploading ? 'Uploading securely...' : 'Submit Payment Proof'}
          {!uploading && <CheckCircle className="w-4 h-4 ml-2" />}
        </button>
      </CardContent>
    </Card>
  );
};

export default ManualProofUploader;
