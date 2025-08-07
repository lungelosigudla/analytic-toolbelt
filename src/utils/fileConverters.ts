import { FileFormat } from '@/types/fileConverter';

export class FileConverterUtils {
  // CSV to JSON
  static csvToJson(csvContent: string): string {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
    return JSON.stringify(data, null, 2);
  }

  // JSON to CSV
  static jsonToCsv(jsonContent: string): string {
    const data = JSON.parse(jsonContent);
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('JSON must be an array of objects');
    }
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        return `"${value}"`;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }

  // CSV to SQL
  static csvToSql(csvContent: string, tableName: string = 'data_table'): string {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    let sql = `-- Generated SQL INSERT statements\n`;
    sql += `-- Table: ${tableName}\n\n`;
    
    // Generate CREATE TABLE statement
    sql += `CREATE TABLE ${tableName} (\n`;
    sql += headers.map(header => `  ${header} VARCHAR(255)`).join(',\n');
    sql += '\n);\n\n';
    
    // Generate INSERT statements
    lines.slice(1).forEach(line => {
      const values = line.split(',').map(v => `'${v.trim().replace(/"/g, '').replace(/'/g, "''")}'`);
      sql += `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values.join(', ')});\n`;
    });
    
    return sql;
  }

  // CSV to Python
  static csvToPython(csvContent: string): string {
    return `import pandas as pd
import io

# CSV data
csv_data = """${csvContent}"""

# Read CSV into DataFrame
df = pd.read_csv(io.StringIO(csv_data))

# Display basic information
print("Data shape:", df.shape)
print("\\nColumn names:", df.columns.tolist())
print("\\nFirst 5 rows:")
print(df.head())

# Basic statistics
print("\\nBasic statistics:")
print(df.describe())

# Example data manipulation
# df_filtered = df[df['column_name'] > threshold]
# df_grouped = df.groupby('column_name').agg({'another_column': 'mean'})
`;
  }

  // JSON to Python
  static jsonToPython(jsonContent: string): string {
    return `import json
import pandas as pd

# JSON data
json_data = ${jsonContent}

# Convert to DataFrame if it's a list of objects
if isinstance(json_data, list):
    df = pd.DataFrame(json_data)
    print("Data shape:", df.shape)
    print("\\nDataFrame:")
    print(df.head())
else:
    print("JSON data:")
    print(json.dumps(json_data, indent=2))

# Example operations
# df.to_csv('output.csv', index=False)
# filtered_data = [item for item in json_data if item.get('condition')]
`;
  }

  // SQL to Python
  static sqlToPython(sqlContent: string): string {
    return `import sqlite3
import pandas as pd

# SQL commands
sql_commands = """
${sqlContent}
"""

# Example database connection (SQLite)
# conn = sqlite3.connect('database.db')

# Example: Execute SQL and read into DataFrame
# df = pd.read_sql_query("SELECT * FROM table_name", conn)

# Alternative: Execute SQL commands
# cursor = conn.cursor()
# cursor.executescript(sql_commands)
# conn.commit()

print("SQL commands ready for execution:")
print(sql_commands)

# Example pandas SQL operations
# df.to_sql('table_name', conn, if_exists='replace', index=False)
`;
  }

  // Python to Jupyter
  static pythonToJupyter(pythonContent: string): string {
    const cells = pythonContent.split('\n\n').map(cell => ({
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: cell.split('\n').map(line => line + '\n')
    }));

    const notebook = {
      cells,
      metadata: {
        kernelspec: {
          display_name: "Python 3",
          language: "python",
          name: "python3"
        },
        language_info: {
          name: "python",
          version: "3.8.0"
        }
      },
      nbformat: 4,
      nbformat_minor: 4
    };

    return JSON.stringify(notebook, null, 2);
  }

  // JSON to YAML
  static jsonToYaml(jsonContent: string): string {
    const data = JSON.parse(jsonContent);
    return this.objectToYaml(data);
  }

  // YAML to JSON (simplified)
  static yamlToJson(yamlContent: string): string {
    // This is a simplified YAML parser - in production, use a proper YAML library
    const data = this.simpleYamlParse(yamlContent);
    return JSON.stringify(data, null, 2);
  }

  // CSV to TSV
  static csvToTsv(csvContent: string): string {
    return csvContent.replace(/,/g, '\t');
  }

  // TSV to CSV
  static tsvToCsv(tsvContent: string): string {
    return tsvContent.replace(/\t/g, ',');
  }

  // Helper methods
  private static objectToYaml(obj: any, indent: number = 0): string {
    const spaces = '  '.repeat(indent);
    
    if (typeof obj === 'string') {
      return `"${obj}"`;
    }
    
    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return obj.toString();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => `\n${spaces}- ${this.objectToYaml(item, indent + 1)}`).join('');
    }
    
    if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj)
        .map(([key, value]) => `\n${spaces}${key}: ${this.objectToYaml(value, indent + 1)}`)
        .join('');
    }
    
    return 'null';
  }

  private static simpleYamlParse(yamlContent: string): any {
    // Simplified YAML parser - handles basic key-value pairs
    const lines = yamlContent.split('\n').filter(line => line.trim());
    const result: any = {};
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        result[key.trim()] = value.replace(/"/g, '');
      }
    });
    
    return result;
  }

  // Main conversion method
  static convert(content: string, from: FileFormat, to: FileFormat, options?: any): string {
    try {
      switch (`${from}-${to}`) {
        case 'csv-json':
          return this.csvToJson(content);
        case 'json-csv':
          return this.jsonToCsv(content);
        case 'csv-sql':
          return this.csvToSql(content, options?.tableName);
        case 'csv-python':
          return this.csvToPython(content);
        case 'json-python':
          return this.jsonToPython(content);
        case 'sql-python':
          return this.sqlToPython(content);
        case 'python-jupyter':
          return this.pythonToJupyter(content);
        case 'json-yaml':
          return this.jsonToYaml(content);
        case 'yaml-json':
          return this.yamlToJson(content);
        case 'csv-tsv':
          return this.csvToTsv(content);
        case 'tsv-csv':
          return this.tsvToCsv(content);
        default:
          throw new Error(`Conversion from ${from} to ${to} is not yet implemented`);
      }
    } catch (error) {
      throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}