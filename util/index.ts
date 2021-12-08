import * as fs from 'fs';
import * as readline from 'readline';

export function openFile(filename: string): readline.Interface {
  return readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity,
  });
}
