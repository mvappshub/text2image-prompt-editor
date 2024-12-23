export interface CsvVariable {
  name: string;
  tags: string[];
  type: string;
  value: string;
}

// Helper function to parse CSV line respecting quotes
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let cell = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        cell += '"';
        i++;
      } else {
        // Toggle quotes state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of cell
      result.push(cell.trim());
      cell = '';
    } else {
      cell += char;
    }
  }
  
  // Add the last cell
  result.push(cell.trim());
  return result;
}

export const parseCsvContent = (content: string): CsvVariable[] => {
  // Split into lines and remove empty lines
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return [];

  // Parse header row to get variable names
  const variableNames = parseCSVLine(lines[0]);
  
  // Initialize variables array
  const variables: CsvVariable[] = variableNames.map(name => ({
    name,
    tags: [],
    type: 'variable',
    value: ''
  }));

  // Process remaining rows as tags
  for (let i = 1; i < lines.length; i++) {
    const tagValues = parseCSVLine(lines[i]);
    tagValues.forEach((tag, columnIndex) => {
      if (tag && columnIndex < variables.length) {
        variables[columnIndex].tags.push(tag);
      }
    });
  }

  return variables;
};

export const importCsvVariables = async (file: File): Promise<CsvVariable[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const variables = parseCsvContent(content);
        resolve(variables);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
