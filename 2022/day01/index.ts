import * as path from 'path';
import * as readlime from 'readline';
import {openFile} from '../util';

const INPUT_FILENAME = path.join(__dirname, 'input.txt');

export default async function main() {
  const heaviest = await findHeaviestLoad(openFile(INPUT_FILENAME));
  console.log(`The elf carrying the most is carrying ${heaviest} calories.`);
}

async function findHeaviest(): number {
  let heaviestLoad = 0;
  let currentLoad = 0;
  for await (const line of file) {
    const item = parseInt(line, 10);
    if (item !== NaN) {
      currentLoad += item;
    } else {
      if (currentLoad > heaviestLoad) {
        heaviestLoad = currentLoad;
      }
    }
  }
  return heaviestIndex;
}
