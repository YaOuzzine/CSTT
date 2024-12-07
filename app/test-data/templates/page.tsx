'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { 
  Database, 
  FileJson, 
  TestTube2,
  AlertCircle,
  Loader2,
  Save,
  X,
  Plus,
  Wand2
} from 'lucide-react';
import Link from 'next/link';

// Mock test cases - in real app would come from your API
const mockTestCases = [
  {
    id: 1,
    title: "User Registration Flow",
    type: "Functional",
    requirements: [
      "Valid email format",
      "Password minimum 8 characters",
      "Username unique",
      "Age must be 18+"
    ]
  },
  {
    id: 2,
    title: "Payment Processing",
    type: "Integration",
    requirements: [
      "Valid card number",
      "Future expiry date",
      "Valid CVV",
      "Amount > 0"
    ]
  }
];

const TemplateCreator = () => {
  const [loading, setLoading] = useState(false);
  const [generatingData, setGeneratingData] = useState(false);
  const [error, setError] = useState('');
  const [selectedTestCase, setSelectedTestCase] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dataType: 'json',
    fields: [] as { name: string; type: string; constraints: string }[]
  });
  const [suggestedFields, setSuggestedFields] = useState<{ name: string; type: string; constraints: string }[]>([]);

  // When a test case is selected, generate suggested fields
  const generateSuggestedFields = async (testCaseId: number) => {
    setGeneratingData(true);
    try {
      const testCase = mockTestCases.find(tc => tc.id === testCaseId);
      if (!testCase) return;

      // Simulate AI analysis of test case requirements
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock AI-generated field suggestions based on test case
      const suggestions = testCase.title.includes("User") ? [
        { name: "email", type: "email", constraints: "valid email format" },
        { name: "password", type: "string", constraints: "min length: 8" },
        { name: "username", type: "string", constraints: "unique" },
        { name: "age", type: "number", constraints: "min: 18" }
      ] : [
        { name: "cardNumber", type: "string", constraints: "valid card format" },
        { name: "expiryDate", type: "date", constraints: "future date" },
        { name: "cvv", type: "string", constraints: "3-4 digits" },
        { name: "amount", type: "number", constraints: "greater than 0" }
      ];

      setSuggestedFields(suggestions);
    } catch (err) {
      setError('Failed to generate field suggestions');
    } finally {
      setGeneratingData(false);
    }
  };

  const handleTestCaseSelect = (testCaseId: number) => {
    setSelectedTestCase(testCaseId);
    generateSuggestedFields(testCaseId);
  };

  const handleAddField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, { name: '', type: 'string', constraints: '' }]
    }));
  };

  const handleFieldChange = (index: number, field: string, value: string) => {
    const newFields = [...formData.fields];
    newFields[index] = { ...newFields[index], [field]: value };
    setFormData(prev => ({ ...prev, fields: newFields }));
  };

  const handleRemoveField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Submitted template:', formData);
      // Would redirect to template list after successful creation
    } catch (err) {
      setError('Failed to create template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0)_50%)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(66,65,110,0.1),rgba(0,0,0,0)_50%)] animate-pulse duration-[8000ms]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Test Data Template</h1>
          <p className="text-gray-500 dark:text-gray-400">Define a template for generating test data based on test cases</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Test Case Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Test Case
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  {mockTestCases.map(testCase => (
                    <div
                      key={testCase.id}
                      onClick={() => handleTestCaseSelect(testCase.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedTestCase === testCase.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {testCase.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Type: {testCase.type}
                          </p>
                        </div>
                        <TestTube2 className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Details */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Template Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dataType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data Format
                  </label>
                  <select
                    id="dataType"
                    value={formData.dataType}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataType: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800"
                  rows={3}
                />
              </div>

              {/* AI Suggested Fields */}
              {suggestedFields.length > 0 && (
                <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Wand2 className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Suggested Fields
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {suggestedFields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-md bg-white dark:bg-gray-800"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{field.name}</p>
                          <p className="text-sm text-gray-500">{field.type} - {field.constraints}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            fields: [...prev.fields, field]
                          }))}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Fields */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Custom Fields
                  </label>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Field
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.fields.map((field, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                          placeholder="Field name"
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800"
                        />
                      </div>
                      <div className="flex-1">
                        <select
                          value={field.type}
                          onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="date">Date</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.constraints}
                          onChange={(e) => handleFieldChange(index, 'constraints', e.target.value)}
                          placeholder="Constraints (optional)"
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Link
                  href="/test-data/templates"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading || formData.fields.length === 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Template...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Template
                    </>
                  )}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        {formData.fields.length > 0 && (
          <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-blue-500" />
                Template Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify({
                  template: {
                    name: formData.name || "Template Name",
                    type: formData.dataType,
                    fields: formData.fields.map(field => ({
                      name: field.name || "field_name",
                      type: field.type,
                      constraints: field.constraints || "none"
                    }))
                  }
                }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TemplateCreator;