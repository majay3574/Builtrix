import * as fs from 'fs';
import * as path from 'path';

export function readCSVSync(filePath: string): any[] {
  const data = fs.readFileSync(path.resolve(filePath), 'utf-8');
  const [headerLine, ...lines] = data.trim().split('\n');
  const headers = headerLine.split(',');

  return lines.map(line => {
    const values = line.split(',');
    const row: any = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    return row;
  });
}
