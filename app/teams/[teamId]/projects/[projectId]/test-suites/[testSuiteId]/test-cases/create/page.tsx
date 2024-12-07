"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../../../../components/ui/tabs";
import { AlertCircle, Code, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../../../../../../../../components/ui/alert";

const TestCaseGenerator = () => {
  const [generateLoading, setGenerateLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [inputType, setInputType] = useState('text');
  const [codeInput, setCodeInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [generatedTestCases, setGeneratedTestCases] = useState([]); // Initialize as empty array
  const [error, setError] = useState('');

  const handleGenerateTestCases = async () => {
    setGenerateLoading(true);
    setError('');
    
    try {
      let content = '';

      if (inputType === 'text') {
        content = textInput;
      } else if (inputType === 'code') {
        content = codeInput;
      } else if (inputType === 'image') {
        setError('Image input is not supported yet.');
        setLoading(false);
        return;
      }

      if (!content.trim()) {
        setError('Please enter some content before generating test cases.');
        setLoading(false);
        return;
      }

      // Send a POST request to your Django backend
      const response = await axios.post('http://127.0.0.1:8000/generate-test-case/', { content });
      
      if (response.data.error) {
        setError(response.data.error);
        setGeneratedTestCases([]); // Clear existing test cases
      } else {
        // Handle the single test case response
        const testCase = {
          test_case_description: response.data.test_case_description,
          preconditions: response.data.preconditions,
          test_steps: response.data.test_steps
            .split(/\d+\.\s*/)  // Split by numbered lists (e.g., "1.", "2.")
            .filter(step => step.trim().length > 0)  // Remove empty steps
            .map(step => step.trim()),  // Clean up whitespace
          expected_results: response.data.expected_results,
          type: 'Functional' // Default type
        };
        setGeneratedTestCases([testCase]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate test cases. Please try again.');
      setGeneratedTestCases([]); // Clear existing test cases
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleSaveTestCases = async () => {
    setSaveLoading(true);
    setError('');
  
    try {
      const promises = generatedTestCases.map(async (testCase) => {
        // First create the test case
        const testCaseResponse = await axios.post('http://127.0.0.1:8000/save-test-case/', {
          title: testCase.test_case_description,
          description: testCase.preconditions, // Store preconditions in description
          priority: "Medium",
          type: "Functional",
          status: "Draft",
          suite: '950ee866-d2d4-42a2-a175-dae773ace12b',  // Should come from your suite selection UI
          metadata: {
            generated: true,
            source_type: inputType // 'text', 'code', or 'image'
          }
        });
  
        // Then create the steps for this test case
        const testCaseId = testCaseResponse.data.id;
        console.log(testCaseId)
        const steps = testCase.test_steps.map((step, index) => ({
          test_case_id: testCaseId,
          order_number: index + 1,
          action: step,
          expected_result: index === testCase.test_steps.length - 1 
            ? testCase.expected_results  // Put expected results on last step
            : "Step completed successfully" // Default for intermediate steps
        }));
  
        // Save all steps
        await axios.post(`http://127.0.0.1:8000/save-test-steps/`, {
          steps: steps
        });
  
        return testCaseResponse.data;
      });
  
      const results = await Promise.all(promises);
      console.log('Saved test cases:', results);
      setError('');
      alert('Test cases saved successfully!');
    } catch (err) {
      console.error('Save error:', err.response?.data || err);
      setError(err.response?.data?.detail || 'Failed to save test cases. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0)_50%)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(66,65,110,0.1),rgba(0,0,0,0)_50%)] animate-pulse duration-[8000ms]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Generate Test Cases</h1>
          <p className="text-gray-500 dark:text-gray-400">Create comprehensive test cases from your requirements</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardHeader>
            <CardTitle>Input Source</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text" onValueChange={setInputType}>
              <TabsList className="grid grid-cols-3 gap-4 bg-transparent">
                <TabsTrigger 
                  value="text"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Text/User Stories
                </TabsTrigger>
                <TabsTrigger 
                  value="code"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger 
                  value="image"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Image
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="text">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter your requirements or user stories here..."
                    className="w-full h-64 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                  />
                </TabsContent>
                
                <TabsContent value="code">
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Paste your code here..."
                    className="w-full h-64 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all font-mono"
                  />
                </TabsContent>
                
                <TabsContent value="image">
                  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">
                        {imageFile ? imageFile.name : 'Upload an image'}
                      </span>
                    </label>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleGenerateTestCases}
                disabled={generateLoading}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generateLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Test Cases'
                )}
              </button>
              <button
                onClick={handleSaveTestCases}
                disabled={saveLoading || generatedTestCases.length === 0}
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ml-2"
              >
                {saveLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Test Cases'
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {Array.isArray(generatedTestCases) && generatedTestCases.length > 0 && (
          <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <CardHeader>
              <CardTitle>Generated Test Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {generatedTestCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {testCase.test_case_description || 'Test Case'}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {testCase.type || 'Functional'}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Preconditions:</h4>
                      <p className="text-gray-600 dark:text-gray-300">{testCase.preconditions}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Steps:</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        {Array.isArray(testCase.test_steps) ? (
                          testCase.test_steps.map((step, idx) => (
                            <li key={idx} className="text-gray-600 dark:text-gray-300">{step}</li>
                          ))
                        ) : (
                          <li className="text-gray-600 dark:text-gray-300">{testCase.test_steps}</li>
                        )}
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Expected Results:</h4>
                      <p className="text-gray-600 dark:text-gray-300">{testCase.expected_results}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestCaseGenerator;