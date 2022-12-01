import * as fs from 'fs';
import * as readline from 'readline';

export function openFile(filename: string) {
  return readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity,
  });
}
