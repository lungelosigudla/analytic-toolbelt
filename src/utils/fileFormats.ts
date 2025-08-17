import { FormatInfo, FileFormat } from '@/types/fileConverter';

export const FILE_FORMATS: Record<FileFormat, FormatInfo> = {
  csv: {
    format: 'csv',
    name: 'CSV',
    extensions: ['.csv'],
    description: 'Comma-separated values file',
    icon: '📊',
    category: 'data'
  },
  json: {
    format: 'json',
    name: 'JSON',
    extensions: ['.json'],
    description: 'JavaScript Object Notation',
    icon: '📋',
    category: 'data'
  },
  sql: {
    format: 'sql',
    name: 'SQL',
    extensions: ['.sql'],
    description: 'Structured Query Language',
    icon: '🗃️',
    category: 'code'
  },
  python: {
    format: 'python',
    name: 'Python',
    extensions: ['.py'],
    description: 'Python script file',
    icon: '🐍',
    category: 'code'
  },
  excel: {
    format: 'excel',
    name: 'Excel',
    extensions: ['.xlsx', '.xls'],
    description: 'Microsoft Excel spreadsheet',
    icon: '📈',
    category: 'data'
  },
  parquet: {
    format: 'parquet',
    name: 'Parquet',
    extensions: ['.parquet'],
    description: 'Apache Parquet columnar storage',
    icon: '🗂️',
    category: 'data'
  },
  yaml: {
    format: 'yaml',
    name: 'YAML',
    extensions: ['.yaml', '.yml'],
    description: 'YAML Ain\'t Markup Language',
    icon: '⚙️',
    category: 'markup'
  },
  xml: {
    format: 'xml',
    name: 'XML',
    extensions: ['.xml'],
    description: 'eXtensible Markup Language',
    icon: '🏷️',
    category: 'markup'
  },
  tsv: {
    format: 'tsv',
    name: 'TSV',
    extensions: ['.tsv'],
    description: 'Tab-separated values file',
    icon: '📋',
    category: 'data'
  },
  jupyter: {
    format: 'jupyter',
    name: 'Jupyter Notebook',
    extensions: ['.ipynb'],
    description: 'Jupyter notebook file',
    icon: '📓',
    category: 'code'
  },
  r: {
    format: 'r',
    name: 'R Script',
    extensions: ['.R', '.r'],
    description: 'R programming language script',
    icon: '📊',
    category: 'code'
  },
  markdown: {
    format: 'markdown',
    name: 'Markdown',
    extensions: ['.md', '.markdown'],
    description: 'Markdown markup language',
    icon: '📝',
    category: 'markup'
  },
  txt: {
    format: 'txt',
    name: 'Text',
    extensions: ['.txt'],
    description: 'Plain text file',
    icon: '📄',
    category: 'document'
  },
  html: {
    format: 'html',
    name: 'HTML',
    extensions: ['.html', '.htm'],
    description: 'HyperText Markup Language',
    icon: '🌐',
    category: 'markup'
  },
  pdf: {
    format: 'pdf',
    name: 'PDF',
    extensions: ['.pdf'],
    description: 'Portable Document Format',
    icon: '📄',
    category: 'document'
  },
  pbix: {
    format: 'pbix',
    name: 'Power BI',
    extensions: ['.pbix'],
    description: 'Microsoft Power BI file',
    icon: '📊',
    category: 'visualization'
  },
  tbwx: {
    format: 'tbwx',
    name: 'Tableau Workbook',
    extensions: ['.twbx', '.twb'],
    description: 'Tableau workbook file',
    icon: '📈',
    category: 'visualization'
  },
  notebook: {
    format: 'notebook',
    name: 'Generic Notebook',
    extensions: ['.nb', '.notebook'],
    description: 'Generic notebook format',
    icon: '📔',
    category: 'code'
  }
};

export const getFormatFromExtension = (filename: string): FileFormat | null => {
  const extension = '.' + filename.split('.').pop()?.toLowerCase();
  
  for (const [format, info] of Object.entries(FILE_FORMATS)) {
    if (info.extensions.includes(extension)) {
      return format as FileFormat;
    }
  }
  
  return null;
};

export const getSupportedConversions = (sourceFormat: FileFormat): FileFormat[] => {
  // Define conversion matrix
  const conversions: Record<FileFormat, FileFormat[]> = {
    csv: ['json', 'excel', 'sql', 'python', 'tsv', 'yaml', 'xml', 'markdown', 'pbix'],
    json: ['csv', 'excel', 'python', 'yaml', 'xml', 'sql', 'markdown', 'pbix'],
    sql: ['python', 'csv', 'json', 'markdown', 'txt'],
    python: ['jupyter', 'sql', 'markdown', 'txt', 'notebook'],
    excel: ['csv', 'json', 'python', 'tsv', 'yaml', 'pbix'],
    parquet: ['csv', 'json', 'python', 'excel', 'pbix'],
    yaml: ['json', 'xml', 'python', 'markdown'],
    xml: ['json', 'yaml', 'csv', 'python', 'markdown'],
    tsv: ['csv', 'json', 'excel', 'python', 'yaml'],
    jupyter: ['python', 'markdown', 'html', 'notebook'],
    r: ['python', 'csv', 'markdown', 'txt'],
    markdown: ['html', 'txt', 'pdf'],
    txt: ['markdown', 'python', 'sql', 'yaml'],
    html: ['markdown', 'txt', 'pdf'],
    pdf: ['txt', 'markdown'],
    pbix: ['python', 'csv', 'json', 'excel', 'tbwx'],
    tbwx: ['python', 'csv', 'json', 'excel', 'pbix'],
    notebook: ['python', 'jupyter', 'markdown']
  };

  return conversions[sourceFormat] || [];
};