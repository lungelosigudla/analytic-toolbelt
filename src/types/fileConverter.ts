export type FileFormat = 
  | 'csv' 
  | 'json' 
  | 'sql' 
  | 'python' 
  | 'excel' 
  | 'parquet' 
  | 'yaml' 
  | 'xml' 
  | 'tsv' 
  | 'jupyter' 
  | 'r' 
  | 'markdown'
  | 'txt'
  | 'html'
  | 'pdf'
  | 'pbix'
  | 'tbwx'
  | 'notebook';

export interface ConversionOption {
  from: FileFormat;
  to: FileFormat;
  label: string;
  description: string;
  icon: string;
}

export interface FileConverterState {
  selectedFile: File | null;
  sourceFormat: FileFormat | null;
  targetFormat: FileFormat | null;
  convertedContent: string | null;
  isConverting: boolean;
  error: string | null;
}

export interface FormatInfo {
  format: FileFormat;
  name: string;
  extensions: string[];
  description: string;
  icon: string;
  category: 'data' | 'code' | 'markup' | 'document' | 'visualization';
}