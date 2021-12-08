import * as path from 'path';
import * as readline from 'readline';
import {openFile} from '../util';

const INPUT_FILEPATH = path.resolve(__dirname, 'input.txt');

export default async function main() {
  const result = await countIncreases(openFile(INPUT_FILEPATH));
  console.log(`Number of increases: ${result}`);
}

async function countIncreases(file: readline.Interface): Promise<number> {
  let increasesCount = 0;
  let previousValue: number | undefined;
  for await (const line of file) {
    const currentValue = parseInt(line, 10);
    if (previousValue && currentValue > previousValue) {
      ++increasesCount;
    }
    previousValue = currentValue;
  }
  return increasesCount;
}
