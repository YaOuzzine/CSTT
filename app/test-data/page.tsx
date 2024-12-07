'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Database, FileJson, FileText, Table, AlertCircle, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

// Mock data for available templates
const dataTemplates = [
  {
    id: 1,
    name: "E-commerce Data",
    description: "Product catalog, user profiles, and order data",
    fields: ["product_id", "name", "price", "category", "user_id", "order_date"],
    format: "JSON"
  },
  {
    id: 2,
    name: "Banking Transactions",
    description: "Account transactions and customer data",
    fields: ["account_id", "transaction_type", "amount", "timestamp"],
    format: "CSV"
  },
  {
    id: 3,
    name: "User Profiles",
    description: "Personal information and user preferences",
    fields: ["user_id", "name", "email", "address", "preferences"],
    format: "SQL"
  }
];

const TestDataPage = () => {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedData, setGeneratedData] = useState(null);

  const handleGenerateData = async () => {
    if (!selectedTemplate) {
      setError('Please select a template first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated data
      const mockData = {
        json: [
          {
            product_id: "P123",
            name: "Premium Headphones",
            price: 199.99,
            category: "Electronics"
          },
          {
            product_id: "P124",
            name: "Wireless Mouse",
            price: 49.99,
            category: "Accessories"
          }
        ]
      };

      setGeneratedData(mockData);
    } catch (err) {
      setError('Failed to generate test data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <p className="text-gray-500 dark:text-gray-400">Generate realistic test data for your applications</p>
          </div>
          
          <Link href="/test-data/create" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
            <Plus className="h-5 w-5 mr-2" />
            New Template
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Templates Section */}
          <div className="md:col-span-8">
            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Data Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {dataTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 rounded-lg border transition-all cursor-pointer
                        ${selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {template.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {template.format}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{template.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {template.fields.map((field, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Section */}
          <div className="md:col-span-4 space-y-6">
            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <CardHeader>
                <CardTitle>Output Format</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedFormat} onValueChange={setSelectedFormat}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="json" className="flex items-center gap-2">
                      <FileJson className="h-4 w-4" />
                      JSON
                    </TabsTrigger>
                    <TabsTrigger value="csv" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CSV
                    </TabsTrigger>
                    <TabsTrigger value="sql" className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      SQL
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <button
                  onClick={handleGenerateData}
                  disabled={loading || !selectedTemplate}
                  className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Data'
                  )}
                </button>
              </CardContent>
            </Card>

            {generatedData && (
              <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle>Generated Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
                    {JSON.stringify(generatedData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDataPage;