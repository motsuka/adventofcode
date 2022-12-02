import * as fs from 'fs';
import * as readline from 'readline';

export * from './heap';

export function openFile(filename: string) {
  return readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity,
  });
}
