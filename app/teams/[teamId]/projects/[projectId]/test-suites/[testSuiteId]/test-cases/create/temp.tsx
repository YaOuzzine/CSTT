'use client'

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../../../../components/ui/tabs";
import { Alert, AlertDescription } from "../../../../../../../../components/ui/alert";
import { AlertCircle, Code, FileText, Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import api from "../../../../../../../../lib/api";

const TestCaseGenerator = ({ params }: { params: { teamId: string; projectId: string; testSuiteId: string } }) => {
  const { testSuiteId, projectId } = params;
  const [generateLoading, setGenerateLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [inputType, setInputType] = useState("text");
  const [codeInput, setCodeInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [type, setType] = useState("Functional");
  const [generatedTestCases, setGeneratedTestCases] = useState([]);
  const [error, setError] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch project description when component mounts
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/`);
        setProjectDescription(response.data.description);
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      }
    };
    fetchProjectDetails();
  }, [projectId]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateTestCases = async () => {
    setGenerateLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("project_description", projectDescription);

      let content = inputType === "text" ? textInput : codeInput;
      if (!content.trim() && !selectedImage) {
        setError("Please enter some content or upload an image before generating test cases.");
        setGenerateLoading(false);
        return;
      }

      if (selectedImage && inputType === "image") {
        formData.append("image", selectedImage);
      } else {
        formData.append("content", content);
      }
      formData.append("input_type", inputType);

      const response = await api.post("/generate-test-case/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.error) {
        setError(response.error);
        setGeneratedTestCases([]);
      } else {
        const testCase = {
          test_case_description: response.data.test_case_description,
          preconditions: response.data.preconditions,
          test_steps: response.data.test_steps
            .split(/\d+\.\s*/)
            .filter(step => step.trim().length > 0)
            .map(step => step.trim()),
          expected_results: response.data.expected_results,
          type: type,
        };
        setGeneratedTestCases([testCase]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate test cases. Please try again.");
      setGeneratedTestCases([]);
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleSaveTestCases = async () => {
    setSaveLoading(true);
      setError("");
    
      try {
        const promises = generatedTestCases.map(async (testCase) => {
          // Save the test case and get its ID
          const testCaseResponse = await api.post("/save-test-case/", {
            title: testCase.test_case_description,
            description: testCase.preconditions,
            priority,
            type,
            status: "Draft",
            suite: testSuiteId,
            is_active: true,
            metadata: {
              generated: true,
              source_type: inputType,
            },
          });
    
          const testCaseId = testCaseResponse.data.test_case.id; // Extract test case ID from the response
          console.log("tescaseId: :: ", testCaseResponse.data)
          // Prepare steps data with the test case ID
          const steps = testCase.test_steps.map((step, index) => ({
            test_case: testCaseId, // Use the test case ID here
            order_number: index + 1,
            action: step,
            expected_result:
              index === testCase.test_steps.length - 1
                ? testCase.expected_results
                : "Step completed successfully",
          }));
    
          // Save the steps
          await api.post("/save-test-steps/", { steps });
          return testCaseResponse.data.test_case;
        });
    
        const results = await Promise.all(promises);
        alert("Test cases and steps saved successfully!");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Failed to save test cases. Please try again.");
      } finally {
        setSaveLoading(false);
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
                <TabsTrigger value="text" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Text/User Stories
                </TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="image" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG or JPEG (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    {imagePreview && (
                      <div className="relative w-full h-64">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview("");
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
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

            {/* Priority and Type selectors remain the same */}

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
                {saveLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : "Save Test Cases"}
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
                        {testCase.test_case_description || "Test Case"}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {testCase.type || "Functional"}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Preconditions:</h4>
                      <p className="text-gray-600 dark:text-gray-300">{testCase.preconditions}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Steps:</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        {testCase.test_steps.map((step, idx) => (
                          <li key={idx} className="text-gray-600 dark:text-gray-300">{step}</li>
                        ))}
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