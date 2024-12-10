"use client"
import React, { useState, useEffect } from 'react';
import api from "../../../../../../lib/api";
import { 
  Database, 
  TestTube2,
  AlertCircle,
  Loader2,
  Save,
  X,
  Plus,
  Trash2,
  Wand2,
  Code,
  Eye
} from 'lucide-react';
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { Alert, AlertDescription } from "../../../../../../components/ui/alert";
import SaveNotification from '@/app/components/SavedNotification';
import { Parser } from 'json2csv';
import { sql } from 'sql-template-strings';
import getFormattedData from '@/app/utils/getFormattedData';

interface TemplateCreatorProps {
  onClose: () => void;
  projectId: string;
}

const TestDataGenerator: React.FC<TemplateCreatorProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [generatingData, setGeneratingData] = useState(false);
  const [error, setError] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [selectedTestCase, setSelectedTestCase] = useState<String | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fields: [] as { name: string; type: string; constraints: string }[]
});
  const [suggestedFields, setSuggestedFields] = useState<{ name: string; type: string; constraints: string }[]>([]);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [newField, setNewField] = useState({ name: '', type: 'string', constraints: '' });
  const { projectId } = useParams();
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [showGeneratedData, setShowGeneratedData] = useState(false);
  const [dataFormat, setDataFormat] = useState('json');
  const [saving, setSaving] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [displayFormat, setDisplayFormat] = useState('json');

  // Existing useEffect and API calls remain the same...
  useEffect(() => {
    const fetchTestCases = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/projects/${projectId}/test-cases/`);
        setTestCases(response.data);
      } catch (err) {
        console.error('Failed to fetch test cases:', err);
        setError('Failed to load test cases.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestCases();
  }, []);

  const generateSuggestedFields = async (testCaseId: number) => {
    setGeneratingData(true);
    setError('');
    try {
      const response = await api.get(`/test-cases/${testCaseId}/template-suggestions/`);
      setSuggestedFields(response.data.fields);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setError('Failed to generate field suggestions.');
    } finally {
      setGeneratingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const generatePayload = {
            template: {
                name: formData.name,
                fields: formData.fields.reduce((acc, field) => ({
                    ...acc,
                    [field.name]: {
                        type: field.type,
                        constraints: field.constraints
                    }
                }), {})
            },
            testCaseId: selectedTestCase
        };

        const response = await api.post('/test-data/generate/', generatePayload);
        setGeneratedData(response.data);
        setShowGeneratedData(true);
    } catch (err) {
        console.error('Failed to generate test data:', err);
        setError('Failed to generate test data. Please try again.');
    } finally {
        setLoading(false);
    }
};

const handleSaveData = async () => {
  setSaving(true);
  try {
      await api.post('/test-data/save/', {
          name: formData.name,
          data: generatedData,
          template: formData.fields,
          testCaseId: selectedTestCase,
          format: formData.dataType
      });
      setShowSaveNotification(true);
  } catch (error) {
      setError('Failed to save test data');
  } finally {
      setSaving(false);
  }
};

const convertToFormat = (data: any, format: string) => {
  switch (format) {
      case 'csv':
          try {
              const parser = new Parser();
              return parser.parse(data);
          } catch (err) {
              console.error('Error converting to CSV:', err);
              return JSON.stringify(data, null, 2);
          }
      case 'sql':
          try {
              // Assuming data is an array of objects
              const tableName = formData.name.toLowerCase().replace(/\s+/g, '_');
              const fields = Object.keys(data[0]);
              
              // Create table
              let sqlString = `CREATE TABLE ${tableName} (\n`;
              sqlString += fields.map(field => {
                  const fieldType = inferSqlType(data[0][field]);
                  return `  ${field} ${fieldType}`;
              }).join(',\n');
              sqlString += '\n);\n\n';

              // Insert data
              data.forEach(row => {
                  const values = fields.map(field => 
                      typeof row[field] === 'string' ? `'${row[field]}'` : row[field]
                  );
                  sqlString += `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${values.join(', ')});\n`;
              });
              
              return sqlString;
          } catch (err) {
              console.error('Error converting to SQL:', err);
              return JSON.stringify(data, null, 2);
          }
      default:
          return JSON.stringify(data, null, 2);
  }
};

const inferSqlType = (value: any): string => {
  switch (typeof value) {
      case 'number':
          return Number.isInteger(value) ? 'INTEGER' : 'DECIMAL(10,2)';
      case 'boolean':
          return 'BOOLEAN';
      case 'string':
          return value.length > 255 ? 'TEXT' : 'VARCHAR(255)';
      default:
          return 'TEXT';
  }
};



const handleDownload = () => {
  const mimeTypes = {
      json: 'application/json',
      csv: 'text/csv',
      sql: 'application/sql'
  };
  
  const formattedData = getFormattedData(generatedData, displayFormat);
  const blob = new Blob([formattedData], { type: mimeTypes[displayFormat] });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${formData.name}_data.${displayFormat}`;
  a.click();
  window.URL.revokeObjectURL(url);
};

  const addNewField = () => {
    if (newField.name && newField.type) {
      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
      setNewField({ name: '', type: 'string', constraints: '' });
    }
  };

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const getTemplatePreview = () => {
    const template = {
      name: formData.name,
      type: formData.dataType,
      fields: formData.fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: {
          type: field.type,
          constraints: field.constraints
        }
      }), {})
    };
    return JSON.stringify(template, null, 2);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Main Form */}
        <div className="col-span-12 md:col-span-7 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TestTube2 className="h-5 w-5 text-blue-500" />
                Select Test Case
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {testCases.map((testCase: any) => (
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
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" />
                Test Data Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Test Data Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  placeholder="Enter template name"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Fields and Preview */}
        <div className="col-span-12 md:col-span-5 space-y-6">
          {/* AI Suggestions */}
          {suggestedFields.length > 0 && (
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-blue-500" />
                  AI-Suggested Fields
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {suggestedFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md bg-blue-50 dark:bg-blue-900/20"
                    >
                      <div className="flex-1 mr-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{field.name}</p>
                        <p className="text-xs text-gray-500">{field.type}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          fields: [...prev.fields, field]
                        }))}
                        className="text-blue-500 hover:text-blue-600 p-1"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manual Field Addition */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4 text-green-500" />
                Add Field Manually
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newField.name}
                    onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Field name"
                    className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-800"
                  />
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
                    className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-800"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={newField.constraints}
                  onChange={(e) => setNewField(prev => ({ ...prev, constraints: e.target.value }))}
                  placeholder="Constraints (optional)"
                  className="w-full px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-800"
                />
                <button
                  type="button"
                  onClick={addNewField}
                  className="w-full px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                >
                  Add Field
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Template Preview */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-500" />
                  Template Preview
                </CardTitle>
                <button
                  type="button"
                  onClick={() => setShowTemplatePreview(!showTemplatePreview)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  {showTemplatePreview ? 'Hide' : 'Show'} Preview
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {showTemplatePreview && (
                <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-xs overflow-x-auto">
                  {getTemplatePreview()}
                </pre>
              )}
              <div className="mt-3 space-y-2">
                {formData.fields.map((field, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{field.name}</p>
                      <p className="text-xs text-gray-500">{field.type} {field.constraints && `(${field.constraints})`}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="h-4 w-4 mr-2 inline-block" />
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || formData.fields.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 inline-block animate-spin" />
              Generating Data...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2 inline-block" />
              Generate Data From Template
            </>
          )}
        </button>
      </div>
      {showGeneratedData && generatedData && (
    <Card>
        <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Database className="h-4 w-4 text-green-500" />
                    Generated Test Data
                </CardTitle>
                <div className="flex items-center space-x-4">
                    <select
                        value={displayFormat}
                        onChange={(e) => setDisplayFormat(e.target.value)}
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
                    >
                        <option value="json">JSON</option>
                        <option value="csv">CSV</option>
                        <option value="sql">SQL</option>
                    </select>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSaveData}
                            disabled={saving}
                            className="text-sm text-green-500 hover:text-green-600 px-2 py-1 rounded-md border border-green-500 flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Data'
                            )}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="text-sm text-blue-500 hover:text-blue-600 px-2 py-1 rounded-md border border-blue-500"
                        >
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-xs overflow-x-auto">
                {getFormattedData(generatedData, displayFormat)}
            </pre>
        </CardContent>
    </Card>
)}
  <SaveNotification 
    show={showSaveNotification}
    message="Test data saved successfully!"
    onClose={() => setShowSaveNotification(false)}
/>
    </div>
    
  );
};

export default TestDataGenerator;