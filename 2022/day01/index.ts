import * as path from 'path';
import * as readline from 'readline';
import {openFile} from '../util';

const INPUT_FILENAME = path.join(__dirname, 'input.txt');

export default async function main() {
  const heaviest = await findHeaviest(openFile(INPUT_FILENAME));
  console.log(`The elf carrying the most is carrying ${heaviest} calories.`);
}

async function findHeaviest(file: readline.Interface): Promise<number> {
  let heaviest = 0;
  let current = 0;
  for await (const line of file) {
    const item = parseInt(line, 10);
    if (!Number.isNaN(item)) {
      current += item;
    } else {
      if (current > heaviest) {
        heaviest = current;
      }
      current = 0;
    }
  }
  return heaviest;
}
