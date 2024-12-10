'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Alert, AlertDescription } from "../../../../../components/ui/alert";
import { 
  Database, FileJson, FileText, Table, AlertCircle, 
  Loader2, Plus, Download, Calendar, Clock, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import api from '../../../../../lib/api';
import getFormattedData from '@/app/utils/getFormattedData';
import { formatDistanceToNow } from 'date-fns';

interface TestData {
  id: string;
  name: string;
  description: string;
  data_template: any; 
  format_type: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  test_cases: Array<{
      id: string;
      title: string;
  }>;
}

const TestDataPage = () => {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testDataList, setTestDataList] = useState<TestData[]>([]);
  const [selectedData, setSelectedData] = useState<TestData | null>(null);

  useEffect(() => {
    fetchTestData();
  }, []);

  const fetchTestData = async () => {
    try {
      const response = await api.get('/test-data/');
      setTestDataList(response.data);
      console.log(response.data)
    } catch (err) {
      setError('Failed to fetch test data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (data: any, format: string, filename: string) => {
    if (!data) {
        console.error('No data available for download');
        return;
    }

    const formattedData = getFormattedData(data, format);
    if (!formattedData) {
        console.error('Failed to format data');
        return;
    }

    const mimeTypes = {
        json: 'application/json',
        csv: 'text/csv',
        sql: 'application/sql'
    };
    
    const blob = new Blob([formattedData], { type: mimeTypes[format] });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${format}`;
    a.click();
    window.URL.revokeObjectURL(url);
};

  // Reuse the getFormattedData function from before...

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0)_50%)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(66,65,110,0.1),rgba(0,0,0,0)_50%)] animate-pulse duration-[8000ms]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Data</h1>
            <p className="text-gray-500 dark:text-gray-400">View and manage your generated test data</p>
          </div>
          
          <Link 
            href="./test-data/create" 
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Generate New Data
          </Link>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-12">
            {/* Test Data List */}
            <div className="md:col-span-8">
              <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    Generated Test Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testDataList.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No test data available. Generate some data to get started!
                      </div>
                    ) : (
                      testDataList.map((data) => (
                        <div
                          key={data.id}
                          onClick={() => setSelectedData(data)}
                          className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md
                            ${selectedData?.id === data.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700'
                            }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {data.name}
                              </h3>
                              <p className="text-sm text-gray-500">{data.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                <Clock className="h-4 w-4 inline-block mr-1" />
                                {formatDistanceToNow(new Date(data.created_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          
                          {data.test_cases.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">Linked Test Cases:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {data.test_cases.map(tc => (
                                  <span
                                    key={tc.id}
                                    className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                                  >
                                    {tc.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview and Download Section */}
            <div className="md:col-span-4 space-y-6">
              {selectedData && (
                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Preview</CardTitle>
                      <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
                      >
                        <option value="json">JSON</option>
                        <option value="csv">CSV</option>
                        <option value="sql">SQL</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                    <button
    onClick={() => handleDownload(selectedData.data_template, selectedFormat, selectedData.name)}
    className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
>
    <Download className="h-4 w-4 mr-2" />
    Download {selectedFormat.toUpperCase()}
</button>
                    </div>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-96 text-xs">
    {getFormattedData(selectedData.data_template, selectedFormat)}
</pre>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDataPage;