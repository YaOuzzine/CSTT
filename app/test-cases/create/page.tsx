"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { AlertCircle, Code, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";

const TestCaseGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('text');
  const [codeInput, setCodeInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [generatedTestCases, setGeneratedTestCases] = useState([]);
  const [error, setError] = useState('');

  const handleGenerateTestCases = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call for test case generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTestCases = [
        {
          id: Date.now(),
          title: "Input Validation Test",
          description: "Verify that the system properly validates all input fields",
          preconditions: "System is accessible and user is logged in",
          steps: [
            "Enter valid data in all required fields",
            "Submit the form",
            "Verify response"
          ],
          expectedResults: "Form should be submitted successfully",
          priority: "High",
          type: "Functional"
        }
      ];
      
      setGeneratedTestCases(mockTestCases);
    } catch (err) {
      setError('Failed to generate test cases. Please try again.');
    } finally {
      setLoading(false);
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
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Test Cases'
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {generatedTestCases.length > 0 && (
          <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <CardHeader>
              <CardTitle>Generated Test Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {generatedTestCases.map((testCase) => (
                  <div
                    key={testCase.id}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {testCase.title}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {testCase.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300">{testCase.description}</p>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Preconditions:</h4>
                      <p className="text-gray-600 dark:text-gray-300">{testCase.preconditions}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Steps:</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        {testCase.steps.map((step, index) => (
                          <li key={index} className="text-gray-600 dark:text-gray-300">{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Expected Results:</h4>
                      <p className="text-gray-600 dark:text-gray-300">{testCase.expectedResults}</p>
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