import * as path from 'path';
import * as readline from 'readline';
import { openFile } from '../util';

const INPUT_FILENAME = path.join(__dirname, 'input.txt');

export default async function main() {
  const total = await calculateTotalPriority(openFile(INPUT_FILENAME));
  console.log(`The total priority of all items present in both comparments is ${total}.`);
}

async function calculateTotalPriority(file: readline.Interface): Promise<number> {
  let total = 0;
  for await (const line of file) {
    const first = new Set<string>(line.slice(0, Math.floor(line.length / 2)));
    const second = new Set<string>(line.slice(Math.floor(line.length / 2)));
    for (const char of first) {
      if (second.has(char)) {
        total += getCharacterPriority(char);
      }
    }
  }
  return total;
}

function getCharacterPriority(char: string): number {
  if (/^[a-z]$/.test(char)) {
    // Characters a-z have values 97-122, so subtract 96 to get 1-26.
    return char.charCodeAt(0) - 96;
  } else if (/^[A-Z]$/.test(char)) {
    // characters A-Z have values 65-90, so subtract 38 to get to 27-52.
    return char.charCodeAt(0) - 38;
  } else {
    return 0;
  }
}