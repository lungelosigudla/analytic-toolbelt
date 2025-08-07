import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, RefreshCw, Zap, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FileUploader } from '@/components/FileUploader';
import { FormatSelector } from '@/components/FormatSelector';
import { ConversionResult } from '@/components/ConversionResult';
import { FileConverterState, FileFormat } from '@/types/fileConverter';
import { FILE_FORMATS, getSupportedConversions } from '@/utils/fileFormats';
import { FileConverterUtils } from '@/utils/fileConverters';

const Index = () => {
  const { toast } = useToast();
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

  const supportedFormats = Object.keys(FILE_FORMATS) as FileFormat[];
  const targetFormats = state.sourceFormat ? getSupportedConversions(state.sourceFormat) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DataFlow Converter
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your data science files between formats instantly. 
            Convert CSV, JSON, SQL, Python, Excel, and more with ease.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['CSV', 'JSON', 'SQL', 'Python', 'Excel', 'Parquet'].map((format) => (
              <Badge key={format} variant="secondary" className="text-xs">
                {format}
              </Badge>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Step 1: File Upload */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <h2 className="text-xl font-semibold">Upload Your File</h2>
              {state.selectedFile && (
                <Badge variant="outline" className="ml-auto">
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
              <div className="flex items-center justify-between p-4 border rounded-lg bg-success/10 border-success/20">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{FILE_FORMATS[state.sourceFormat!].icon}</div>
                  <div>
                    <div className="font-medium">{state.selectedFile.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {FILE_FORMATS[state.sourceFormat!].name} • {(state.selectedFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Change File
                </Button>
              </div>
            )}
          </Card>

          {/* Step 2: Target Format Selection */}
          {state.sourceFormat && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <h2 className="text-xl font-semibold">Choose Target Format</h2>
                {state.targetFormat && (
                  <Badge variant="outline" className="ml-auto">
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
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <h2 className="text-xl font-semibold">Convert File</h2>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="gap-1">
                    {FILE_FORMATS[state.sourceFormat].icon} {FILE_FORMATS[state.sourceFormat].name}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="gap-1">
                    {FILE_FORMATS[state.targetFormat].icon} {FILE_FORMATS[state.targetFormat].name}
                  </Badge>
                </div>
                
                <Button 
                  onClick={handleConvert}
                  disabled={state.isConverting}
                  size="lg"
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
                  <p className="text-sm text-muted-foreground mt-2">
                    Processing your file...
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Error Display */}
          {state.error && (
            <Card className="p-6 border-destructive/50 bg-destructive/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive">Conversion Error</h3>
                  <p className="text-sm text-destructive/80 mt-1">{state.error}</p>
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
      </div>
    </div>
  );
};

export default Index;
