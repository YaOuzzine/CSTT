"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../../../components/ui/card";
import { Alert, AlertDescription } from "../../../../../../../../components/ui/alert";
import { 
  Pencil, Save, X, AlertCircle, Loader2, CheckCircle2,
  ArrowLeft, Tag, Calendar, User, Plus, Trash2
} from "lucide-react";
import api from "../../../../../../../../lib/api";

function TestCasePage({ params }) {
  const { teamId, projectId, testSuiteId, testCaseId } = params;
  const router = useRouter();
  
  // State management
  const [testCase, setTestCase] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [testSteps, setTestSteps] = useState([]);
  const [editedSteps, setEditedSteps] = useState({
  existing: {},  // Track modifications to existing steps
  added: [],     // Track newly added steps
  deleted: new Set() // Track deleted step IDs
  });
  const [editedFields, setEditedFields] = useState({});

  // Fetch test case and steps data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Get test case details
      const testCaseResponse = await api.get(`/test-cases/${testCaseId}/`);
      setTestCase(testCaseResponse.data);
      
      // Reset edited fields when fetching new data
      setEditedFields({});
      
      // Get test steps
      const testStepsResponse = await api.post(`/test-cases/${testCaseId}/steps/batch/`, {});
      const steps = testStepsResponse.data || [];
      
      setTestSteps(steps);
      
      // Reset step tracking
      setEditedSteps({
        existing: {},
        added: [],
        deleted: new Set()
      });

    } catch (error) {
      console.error("Failed to load test case or steps:", error);
      setError("Failed to load test case data. Please try again.");
    } finally {
      setLoading(false);
    }
};

  useEffect(() => {
    fetchData();
  }, [testCaseId]);

  // Test steps management
  const addNewStep = () => {
    const newStep = {
      id: `temp-${Date.now()}`,
      action: "",
      expected_result: "",
    };
    setTestSteps(prev => [...prev, newStep]);
    setEditedSteps(prev => ({
      ...prev,
      added: [...prev.added, newStep]
    }));
  };
  
  const updateStep = (index, field, value) => {
    const step = testSteps[index];
    setTestSteps(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  
    if (step.id.toString().startsWith('temp-')) {
      // Update in added steps
      setEditedSteps(prev => ({
        ...prev,
        added: prev.added.map(s => 
          s.id === step.id ? { ...s, [field]: value } : s
        )
      }));
    } else {
      // Update in existing steps
      setEditedSteps(prev => ({
        ...prev,
        existing: {
          ...prev.existing,
          [step.id]: {
            ...(prev.existing[step.id] || {}),
            [field]: value
          }
        }
      }));
    }
  };
  
  const removeStep = (index) => {
    const step = testSteps[index];
    setTestSteps(prev => prev.filter((_, i) => i !== index));
    
    if (!step.id?.toString().startsWith('temp-')) {
      setEditedSteps(prev => ({
        ...prev,
        deleted: new Set([...prev.deleted, step.id])
      }));
    } else {
      setEditedSteps(prev => ({
        ...prev,
        added: prev.added.filter(s => s.id !== step.id)
      }));
    }
  };

  const handleFieldChange = (field, value) => {
    setEditedFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save changes
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      
      // Only send changed fields
      if (Object.keys(editedFields).length > 0) {
        await api.put(`/test-cases/${testCaseId}/edit/`, editedFields);
      }
  
      // Process steps changes
      const stepsToUpdate = [];
      const currentSteps = testSteps.filter(step => !editedSteps.deleted.has(step.id));
      
      // Add modified existing steps
      currentSteps.forEach((step, index) => {
        if (editedSteps.existing[step.id]) {
          stepsToUpdate.push({
            ...step,
            ...editedSteps.existing[step.id],
            order_number: index + 1,
            test_case: testCaseId
          });
        }
      });
  
      // Add new steps
      editedSteps.added.forEach((step, index) => {
        stepsToUpdate.push({
          ...step,
          order_number: currentSteps.length + index + 1,
          test_case: testCaseId
        });
      });
  
      if (stepsToUpdate.length > 0) {
        await api.post(`/test-cases/${testCaseId}/steps/batch/`, { steps: stepsToUpdate });
      }
  
      setTestCase(prev => ({ ...prev, ...editedFields }));
      setIsEditing(false);
      setSuccessMessage("Test case updated successfully!");
      await fetchData();
      
      // Reset change tracking
      setEditedFields({});
      setEditedSteps({ existing: {}, added: [], deleted: new Set() });
    } catch (error) {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Utility functions for styling
  const getPriorityColor = (priority) => {
    const colors = {
      High: "text-red-500 bg-red-50 dark:bg-red-900/20",
      Medium: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
      Low: "text-green-500 bg-green-50 dark:bg-green-900/20"
    };
    return colors[priority] || "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: "text-green-500 bg-green-50 dark:bg-green-900/20",
      Draft: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
      Archived: "text-gray-500 bg-gray-50 dark:bg-gray-900/20"
    };
    return colors[status] || "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!testCase) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Test case not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header with navigation and actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Test Suite
          </button>
          
          <div className="flex items-center space-x-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status messages */}
        {successMessage && (
          <Alert className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main content card */}
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
            {isEditing ? (
                <input
                    type="text"
                    value={editedFields.title ?? testCase.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Test Case Title"
                />
                ) : (
                testCase.title
                )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(testCase.priority)}`}>
                {testCase.priority}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(testCase.status)}`}>
                {testCase.status}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Type and Creation Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  <Tag className="h-4 w-4 mr-2" />
                  Type
                </label>
                {isEditing ? (
  <select
    value={editedFields.type ?? testCase.type}
    onChange={(e) => handleFieldChange('type', e.target.value)}
    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
  >
    <option value="Functional">Functional</option>
    <option value="Integration">Integration</option>
    <option value="Performance">Performance</option>
    <option value="Security">Security</option>
  </select>
) : (
  <p className="text-gray-900 dark:text-white">{testCase.type}</p>
)}
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  Created At
                </label>
                <p className="text-gray-900 dark:text-white">
                  {testCase.created_at ? new Date(testCase.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Preconditions
              </label>
              {isEditing ? (
  <textarea
    value={editedFields.description ?? testCase.description}
    onChange={(e) => handleFieldChange('description', e.target.value)}
    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
    rows={4}
    placeholder="Test case description"
  />
) : (
  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
    {testCase.description}
  </p>
)}
            </div>

            {/* Priority and Status selectors (editing mode) */}
            {isEditing && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Priority
                  </label>
                  <select
  value={editedFields.priority ?? testCase.priority}
  onChange={(e) => handleFieldChange('priority', e.target.value)}
  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
>
  <option value="High">High</option>
  <option value="Medium">Medium</option>
  <option value="Low">Low</option>
</select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </label>
                  <select
  value={editedFields.status ?? testCase.status}
  onChange={(e) => handleFieldChange('status', e.target.value)}
  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
>
  <option value="Active">Active</option>
  <option value="Draft">Draft</option>
  <option value="Archived">Archived</option>
</select>
                </div>
              </div>
            )}

            {/* Test Steps Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Test Steps</h3>
                {isEditing && (
                  <button
                    onClick={addNewStep}
                    className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Step
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {testSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-grow space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Action
                        </label>
                        {isEditing ? (
                          <textarea
                            value={step.action}
                            onChange={(e) => updateStep(index, 'action', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                            rows={2}
                            placeholder="Describe what action should be taken"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{step.action}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Expected Result
                        </label>
                        {isEditing ? (
                          <textarea
                            value={step.expected_result}
                            onChange={(e) => updateStep(index, 'expected_result', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                            rows={2}
                            placeholder="Describe what should happen after the action"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{step.expected_result}</p>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeStep(index)}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Remove step"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                {testSteps.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No test steps defined yet.
                    {isEditing && (
                      <button
                        onClick={addNewStep}
                        className="text-blue-500 hover:text-blue-600 ml-2 underline"
                      >
                        Add one now
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Created by {testCase.created_by || "Unknown"}
                </div>
                <div>•</div>
                <div>Last updated {testCase.updated_at ? new Date(testCase.updated_at).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TestCasePage;