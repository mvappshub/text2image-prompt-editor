export interface CsvVariable {
  name: string;
  tags: string;
}

export const parseCsvContent = (content: string): CsvVariable[] => {
  const lines = content.split('\n').filter(line => line.trim());
  const [header, ...rows] = lines;
  
  // Check header format
  const headerFields = header.toLowerCase().split(',');
  const nameIndex = headerFields.indexOf('name');
  const tagsIndex = headerFields.indexOf('tags');
  
  if (nameIndex === -1 || tagsIndex === -1) {
    throw new Error('CSV must contain a "name" and "tags" column');
  }

  return rows.map(row => {
    const fields = row.split(',').map(field => {
      // Remove quotes if present
      const trimmed = field.trim();
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1).replace(/""/g, '"');
      }
      return trimmed;
    });

    return {
      name: fields[nameIndex] || '',
      tags: fields[tagsIndex] || ''
    };
  });
};

export const convertCsvToVariables = (csvVariables: CsvVariable[]): any[] => {
  return csvVariables.map(csv => ({
    name: csv.name,
    tags: csv.tags.split(';').filter(Boolean),
    type: 'variable',
    value: ''
  }));
};

export const importCsvVariables = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const csvVariables = parseCsvContent(content);
        const variables = convertCsvToVariables(csvVariables);
        resolve(variables);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};
