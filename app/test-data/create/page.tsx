'use client'
// components/test-data/TemplateCreator.tsx
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  TestTube2,
  AlertCircle,
  Loader2,
  Save,
  X,
  Plus,
  Wand2
} from 'lucide-react';

interface TemplateCreatorProps {
  onClose: () => void;
}

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

const TemplateCreator: React.FC<TemplateCreatorProps> = ({ onClose }) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Submitted template:', formData);
      onClose(); // Close the dialog on success
    } catch (err) {
      setError('Failed to create template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ... Rest of your component logic (handleFieldChange, handleAddField, etc.) ...

  return (
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
              onClick={() => {
                setSelectedTestCase(testCase.id);
                generateSuggestedFields(testCase.id);
              }}
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
      <div className="grid gap-4">
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

      {/* AI Suggestions Section */}
      {suggestedFields.length > 0 && (
        <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">
              AI-Suggested Fields
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

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || formData.fields.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
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
  );
};

export default TemplateCreator;