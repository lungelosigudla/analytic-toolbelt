import { FileFormat } from '@/types/fileConverter';
import { FILE_FORMATS } from '@/utils/fileFormats';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FormatSelectorProps {
  title: string;
  selectedFormat: FileFormat | null;
  availableFormats: FileFormat[];
  onFormatSelect: (format: FileFormat) => void;
  disabled?: boolean;
}

export const FormatSelector = ({ 
  title, 
  selectedFormat, 
  availableFormats, 
  onFormatSelect,
  disabled = false 
}: FormatSelectorProps) => {
  const categoryColors = {
    data: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    code: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    markup: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    document: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {availableFormats.map((format) => {
          const formatInfo = FILE_FORMATS[format];
          const isSelected = selectedFormat === format;
          
          return (
            <Card
              key={format}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => !disabled && onFormatSelect(format)}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="text-2xl">{formatInfo.icon}</div>
                
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{formatInfo.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatInfo.extensions.join(', ')}
                  </div>
                </div>
                
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${categoryColors[formatInfo.category]}`}
                >
                  {formatInfo.category}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
      
      {availableFormats.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No formats available
        </div>
      )}
    </div>
  );
};