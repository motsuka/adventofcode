import * as path from 'path';
import * as readline from 'readline';
import {openFile, Heap} from '../util';

const INPUT_FILENAME = path.join(__dirname, 'input.txt');

export default async function main() {
  const heap = await findHeaviest(openFile(INPUT_FILENAME));
  const first = heap.remove();
  const second = heap.remove();
  const third = heap.remove();
  console.log(`The top three elves are carrying ${first}, ${second}, and ${third} calories.`);
}

async function findHeaviest(file: readline.Interface): Promise<Heap> {
  const heap = new Heap();
  let current = 0;
  for await (const line of file) {
    const item = parseInt(line, 10);
    if (!Number.isNaN(item)) {
      current += item;
    } else {
      heap.add(current);
      current = 0;
    }
  }
  return heap;
}
