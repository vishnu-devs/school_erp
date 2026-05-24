import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { CheckCircle, XCircle, Search, Eye } from 'lucide-react';
import FinanceService from '../../../services/financeService';

const VerificationQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  async function fetchQueue() {
    try {
      setLoading(true);
      const data = await FinanceService.getVerificationQueue();
      if (data && data.data) {
        setQueue(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch verification queue", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, action) => {
    const confirmAction = window.confirm(`Are you sure you want to ${action} this payment?`);
    if (!confirmAction) return;

    try {
      const notes = prompt("Any notes for this verification?");
      await FinanceService.verifyPayment(id, action, notes || '');
      
      // Remove from queue UI instantly
      setQueue(queue.filter(item => item.id !== id));
      alert(`Payment successfully ${action}ed.`);
    } catch (error) {
      console.error(`Failed to ${action} payment`, error);
      alert("Verification failed. See console.");
    }
  };

  return (
    <Card className="mt-8 border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
          Manual Payment Verification Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">UTR / Ref</th>
                <th className="px-6 py-4">Proof</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading queue...</td></tr>
              ) : queue.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-medium">No pending payments in queue! 🎉</td></tr>
              ) : queue.map((txn) => (
                <tr key={txn.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {txn.enterprise_transaction_id}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    ₹{parseFloat(txn.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-mono border border-blue-100">
                      {txn.transaction_reference || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {txn.proof_image_path ? (
                      <a href={txn.proof_image_path} target="_blank" rel="noreferrer" className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                        <Eye className="w-4 h-4 mr-1" /> View Image
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No proof uploaded</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleVerify(txn.id, 'approve')}
                      className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded shadow-sm transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </button>
                    <button 
                      onClick={() => handleVerify(txn.id, 'reject')}
                      className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold rounded border border-red-200 transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationQueue;
