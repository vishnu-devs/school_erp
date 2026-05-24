import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const TenantManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">Tenant Schools</h2>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
          + Add New School
        </button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">All Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-400">
              <thead className="text-xs text-slate-300 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">School Name</th>
                  <th className="px-6 py-4">Domain</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">Greenwood High School</td>
                  <td className="px-6 py-4 font-mono text-emerald-400">greenwood.codebyvishu.in</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-xs">Premium</span></td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs">Active</span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-emerald-400 hover:text-emerald-300 transition-colors">Impersonate</button>
                    <span className="text-slate-700">|</span>
                    <button className="text-red-400 hover:text-red-300 transition-colors">Suspend</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantManagement;
