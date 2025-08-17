
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertCircle, 
  RefreshCw, 
  Zap, 
  ArrowRight, 
  Database, 
  BarChart3, 
  FileText, 
  Calculator,
  Brain,
  TrendingUp,
  PieChart,
  Settings
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FileUploader } from '@/components/FileUploader';
import { FormatSelector } from '@/components/FormatSelector';
import { ConversionResult } from '@/components/ConversionResult';
import { FileConverterState, FileFormat } from '@/types/fileConverter';
import { FILE_FORMATS, getSupportedConversions } from '@/utils/fileFormats';
import { FileConverterUtils } from '@/utils/fileConverters';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('converter');
  const [state, setState] = useState<FileConverterState>({
    selectedFile: null,
    sourceFormat: null,
    targetFormat: null,
    convertedContent: null,
    isConverting: false,
    error: null
  });

  const handleFileSelect = async (file: File, format: FileFormat) => {
    try {
      const content = await file.text();
      setState({
        selectedFile: file,
        sourceFormat: format,
        targetFormat: null,
        convertedContent: null,
        isConverting: false,
        error: null
      });
      
      toast({
        title: "File uploaded",
        description: `${file.name} loaded successfully`,
        duration: 2000,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to read file content'
      }));
      
      toast({
        title: "Upload failed",
        description: "Could not read the file content",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleTargetFormatSelect = (format: FileFormat) => {
    setState(prev => ({
      ...prev,
      targetFormat: format,
      convertedContent: null,
      error: null
    }));
  };

  const handleConvert = async () => {
    if (!state.selectedFile || !state.sourceFormat || !state.targetFormat) return;

    setState(prev => ({ ...prev, isConverting: true, error: null }));

    try {
      const fileContent = await state.selectedFile.text();
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const convertedContent = FileConverterUtils.convert(
        fileContent,
        state.sourceFormat,
        state.targetFormat
      );

      setState(prev => ({
        ...prev,
        convertedContent,
        isConverting: false
      }));

      toast({
        title: "Conversion successful!",
        description: `File converted from ${FILE_FORMATS[state.sourceFormat].name} to ${FILE_FORMATS[state.targetFormat].name}`,
        duration: 3000,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isConverting: false
      }));

      toast({
        title: "Conversion failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleReset = () => {
    setState({
      selectedFile: null,
      sourceFormat: null,
      targetFormat: null,
      convertedContent: null,
      isConverting: false,
      error: null
    });
  };

  const tools = [
    {
      id: 'converter',
      name: 'File Converter',
      icon: RefreshCw,
      description: 'Convert between CSV, JSON, SQL, Python, Excel and more',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      id: 'analyzer',
      name: 'Data Analyzer',
      icon: BarChart3,
      description: 'Analyze datasets and generate insights',
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-600'
    },
    {
      id: 'visualizer',
      name: 'Data Visualizer',
      icon: PieChart,
      description: 'Create beautiful charts and graphs',
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-purple-600'
    },
    {
      id: 'calculator',
      name: 'Statistics Calculator',
      icon: Calculator,
      description: 'Perform statistical calculations',
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-orange-600'
    },
    {
      id: 'ml',
      name: 'ML Assistant',
      icon: Brain,
      description: 'Machine learning tools and helpers',
      color: 'bg-pink-500 hover:bg-pink-600',
      textColor: 'text-pink-600'
    },
    {
      id: 'trends',
      name: 'Trend Analysis',
      icon: TrendingUp,
      description: 'Identify patterns and trends in your data',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      textColor: 'text-indigo-600'
    }
  ];

  const supportedFormats = Object.keys(FILE_FORMATS) as FileFormat[];
  const targetFormats = state.sourceFormat ? getSupportedConversions(state.sourceFormat) : [];

  const renderConverterTool = () => (
    <div className="space-y-8">
      {/* Step 1: File Upload */}
      <Card className="p-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <h2 className="text-xl font-semibold text-blue-900">Upload Your File</h2>
          {state.selectedFile && (
            <Badge variant="outline" className="ml-auto border-blue-300 text-blue-700">
              {state.selectedFile.name}
            </Badge>
          )}
        </div>
        
        {!state.selectedFile ? (
          <FileUploader 
            onFileSelect={handleFileSelect}
            acceptedFormats={supportedFormats}
          />
        ) : (
          <div className="flex items-center justify-between p-4 border-2 rounded-lg bg-green-50 border-green-300">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{FILE_FORMATS[state.sourceFormat!].icon}</div>
              <div>
                <div className="font-medium text-green-800">{state.selectedFile.name}</div>
                <div className="text-sm text-green-600">
                  {FILE_FORMATS[state.sourceFormat!].name} • {(state.selectedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset} className="border-green-300 text-green-700 hover:bg-green-100">
              <RefreshCw className="h-4 w-4 mr-2" />
              Change File
            </Button>
          </div>
        )}
      </Card>

      {/* Step 2: Target Format Selection */}
      {state.sourceFormat && (
        <Card className="p-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <h2 className="text-xl font-semibold text-purple-900">Choose Target Format</h2>
            {state.targetFormat && (
              <Badge variant="outline" className="ml-auto border-purple-300 text-purple-700">
                {FILE_FORMATS[state.targetFormat].name}
              </Badge>
            )}
          </div>
          
          <FormatSelector
            title="Convert to"
            selectedFormat={state.targetFormat}
            availableFormats={targetFormats}
            onFormatSelect={handleTargetFormatSelect}
          />
        </Card>
      )}

      {/* Step 3: Convert */}
      {state.sourceFormat && state.targetFormat && (
        <Card className="p-6 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <h2 className="text-xl font-semibold text-green-900">Convert File</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-1 border-green-300 text-green-700">
                {FILE_FORMATS[state.sourceFormat].icon} {FILE_FORMATS[state.sourceFormat].name}
              </Badge>
              <ArrowRight className="h-4 w-4 text-green-600" />
              <Badge variant="outline" className="gap-1 border-green-300 text-green-700">
                {FILE_FORMATS[state.targetFormat].icon} {FILE_FORMATS[state.targetFormat].name}
              </Badge>
            </div>
            
            <Button 
              onClick={handleConvert}
              disabled={state.isConverting}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {state.isConverting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Convert File
                </>
              )}
            </Button>
          </div>
          
          {state.isConverting && (
            <div className="mt-4">
              <Progress value={75} className="w-full" />
              <p className="text-sm text-green-700 mt-2">
                Processing your file...
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Error Display */}
      {state.error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Conversion Error</h3>
              <p className="text-sm text-red-600 mt-1">{state.error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Step 4: Preview & Download */}
      {state.convertedContent && state.selectedFile && state.sourceFormat && state.targetFormat && (
        <ConversionResult
          selectedFile={state.selectedFile}
          convertedContent={state.convertedContent}
          sourceFormat={state.sourceFormat}
          targetFormat={state.targetFormat}
        />
      )}
    </div>
  );

  const renderComingSoon = (toolName: string) => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
        <Settings className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{toolName}</h3>
      <p className="text-gray-600 mb-4">This powerful tool is coming soon!</p>
      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
        Under Development
      </Badge>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Database className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-800 dark:text-slate-100">
              Tools for Data Scientists & Analysts
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Your comprehensive toolkit for data analysis, visualization, and transformation. 
            Streamline your workflow with powerful tools designed specifically for data professionals.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['CSV', 'JSON', 'SQL', 'Python', 'Excel', 'Parquet', 'R', 'Jupyter'].map((format) => (
              <Badge key={format} variant="secondary" className="text-sm bg-blue-100 text-blue-700 border-blue-200">
                {format}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tools Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={tool.id}
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                    activeTab === tool.id 
                      ? 'border-blue-400 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tool.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${tool.textColor} mb-1`}>
                        {tool.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Active Tool Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'converter' && renderConverterTool()}
          {activeTab !== 'converter' && renderComingSoon(tools.find(t => t.id === activeTab)?.name || '')}
        </div>
      </div>
    </div>
  );
};

export default Index;
