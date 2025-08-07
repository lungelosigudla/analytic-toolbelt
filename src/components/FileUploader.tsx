import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FILE_FORMATS, getFormatFromExtension } from '@/utils/fileFormats';
import { FileFormat } from '@/types/fileConverter';

interface FileUploaderProps {
  onFileSelect: (file: File, format: FileFormat) => void;
  acceptedFormats: FileFormat[];
}

export const FileUploader = ({ onFileSelect, acceptedFormats }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const detectedFormat = getFormatFromExtension(file.name);
      if (detectedFormat && acceptedFormats.includes(detectedFormat)) {
        onFileSelect(file, detectedFormat);
      }
    }
  }, [onFileSelect, acceptedFormats]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.sql', '.py', '.R', '.txt', '.md'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/x-parquet': ['.parquet'],
      'text/yaml': ['.yaml', '.yml'],
      'application/xml': ['.xml'],
      'text/tab-separated-values': ['.tsv'],
      'application/x-ipynb+json': ['.ipynb']
    },
    multiple: false
  });

  const supportedExtensions = acceptedFormats.flatMap(format => 
    FILE_FORMATS[format].extensions
  ).join(', ');

  return (
    <Card className="p-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isDragActive ? 'Drop your file here' : 'Upload your data file'}
            </h3>
            <p className="text-muted-foreground">
              Drag and drop or click to browse
            </p>
          </div>
          
          <Button variant="outline" type="button">
            <File className="h-4 w-4 mr-2" />
            Choose File
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Supported formats: {supportedExtensions}
          </div>
        </div>
      </div>
    </Card>
  );
};