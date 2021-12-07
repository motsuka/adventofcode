import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const INTPUT_FILEPATH = path.resolve(__dirname, 'input.txt');

export default async function main() {
  const result = await processContents(INTPUT_FILEPATH);
  console.log(`Number of increases: ${result}`);
}

async function processContents(filename: string): Promise<number> {
  const fileIterator = readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity,
  });

  let increasesCount = 0;
  let previousValue: number | undefined;
  for await (const line of fileIterator) {
    const currentValue = parseInt(line, 10);
    if (previousValue && currentValue > previousValue) {
      ++increasesCount;
    }
    previousValue = currentValue;
  }
  return increasesCount;
}
