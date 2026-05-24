import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { IndianRupee, Clock, XCircle, RefreshCcw } from 'lucide-react';
import FinanceService from '../../../services/financeService';

const FinancialAnalytics = () => {
  const [metrics, setMetrics] = useState({
    total_revenue: 0,
    pending_verifications: 0,
    failed_transactions: 0,
    refunded_amount: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    try {
      setLoading(true);
      const data = await FinanceService.getRevenueAnalytics();
      if (data && data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error("Failed to fetch financial metrics", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Financial Overview</h2>
        <button 
          onClick={fetchMetrics} 
          className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md transition-colors"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh Data
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              ₹{parseFloat(metrics.total_revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-green-700 mt-1">SaaS Subscriptions & Platform Fees</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">Pending Verification</CardTitle>
            <Clock className="h-4 w-4 text-amber-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {metrics.pending_verifications}
            </div>
            <p className="text-xs text-amber-700 mt-1">Manual uploads awaiting review</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Failed Transactions</CardTitle>
            <XCircle className="h-4 w-4 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {metrics.failed_transactions}
            </div>
            <p className="text-xs text-red-700 mt-1">Declined or bounced payments</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
