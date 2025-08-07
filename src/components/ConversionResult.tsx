import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, Eye, Code2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FILE_FORMATS } from '@/utils/fileFormats';
import { FileFormat } from '@/types/fileConverter';

interface ConversionResultProps {
  selectedFile: File;
  convertedContent: string;
  sourceFormat: FileFormat;
  targetFormat: FileFormat;
}

export const ConversionResult = ({
  selectedFile,
  convertedContent,
  sourceFormat,
  targetFormat
}: ConversionResultProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('converted');
  const [originalContent, setOriginalContent] = useState<string>('');

  useEffect(() => {
    const loadOriginalContent = async () => {
      try {
        const content = await selectedFile.text();
        setOriginalContent(content);
      } catch (error) {
        console.error('Failed to load original content:', error);
      }
    };

    loadOriginalContent();
  }, [selectedFile]);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDownload = (content: string, format: FileFormat) => {
    const fileExtension = FILE_FORMATS[format].extensions[0];
    const downloadFileName = selectedFile.name.replace(/\.[^/.]+$/, "") + fileExtension;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: `Downloading ${downloadFileName}`,
      duration: 2000,
    });
  };

  const formatContent = (content: string) => {
    // Truncate very long content for preview
    if (content.length > 10000) {
      return content.substring(0, 10000) + '\n\n... (content truncated for preview)';
    }
    return content;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Conversion Complete</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                {FILE_FORMATS[sourceFormat].icon} {FILE_FORMATS[sourceFormat].name}
              </Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="outline" className="gap-1">
                {FILE_FORMATS[targetFormat].icon} {FILE_FORMATS[targetFormat].name}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(convertedContent)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleDownload(convertedContent, targetFormat)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="original" className="gap-2">
              <Eye className="h-4 w-4" />
              Original ({FILE_FORMATS[sourceFormat].name})
            </TabsTrigger>
            <TabsTrigger value="converted" className="gap-2">
              <Code2 className="h-4 w-4" />
              Converted ({FILE_FORMATS[targetFormat].name})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="original" className="mt-4">
            <div className="relative">
              <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-auto max-h-96 font-mono whitespace-pre-wrap">
                {formatContent(originalContent)}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(originalContent)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="converted" className="mt-4">
            <div className="relative">
              <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-auto max-h-96 font-mono whitespace-pre-wrap">
                {formatContent(convertedContent)}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(convertedContent)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};