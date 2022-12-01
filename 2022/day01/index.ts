import * as path from 'path';
import * as readlime from 'readline';
import {openFile} from '../util';

const INPUT_FILENAME = path.join(__dirname, 'input.txt');

export default async function main() {
  const index = await findHeaviestLoad(openFile(INPUT_FILENAME));
  console.log(`Elf ${index} is carrying the most calories.`);
}

async function findHeaviest(): number {
  let heaviestLoad = 0;
  let heaviestIndex = -1;
  let currentLoad = 0;
  let currentIndex = 0;
  for await (const line of file) {
    const item = parseInt(line, 10);
    if (item !== NaN) {
      currentLoad += item;
    } else {
      if (currentLoad > heaviestLoad) {
        heaviestLoad = currentLoad;
        heaviestIndex = currentIndex;
      }
      currentIndex++;
    }
  }
  return heaviestIndex;
}
