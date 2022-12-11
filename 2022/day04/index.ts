import * as path from 'path';
import * as readline from 'readline';
import {openFile} from '../util';

const INPUT_FILENAME = path.join(__dirname, 'input.txt');

export default async function main() {
  const subsets = await calculateSubsets(openFile(INPUT_FILENAME));
  console.log(
    `The number of ranges where one contains all of the other is ${subsets}.`
  );

  const overlappingSets = await calculateOverlappingSets(
    openFile(INPUT_FILENAME)
  );
  console.log(
    `The number of ranges with any overlap at all of the other is ${overlappingSets}.`
  );
}

async function calculateSubsets(file: readline.Interface): Promise<number> {
  let total = 0;
  for await (const line of file) {
    const [firstRangeBegin, firstRangeEnd, secondRangeBegin, secondRangeEnd] =
      line
        .split(',')
        .map(range => range.split('-'))
        .flat()
        .map(val => parseInt(val, 10));
    if (
      firstRangeBegin <= secondRangeBegin &&
      firstRangeEnd >= secondRangeEnd
    ) {
      total += 1;
    } else if (
      firstRangeBegin >= secondRangeBegin &&
      firstRangeEnd <= secondRangeEnd
    ) {
      total += 1;
    }
  }
  return total;
}

async function calculateOverlappingSets(
  file: readline.Interface
): Promise<number> {
  let total = 0;
  for await (const line of file) {
    const [firstRangeBegin, firstRangeEnd, secondRangeBegin, secondRangeEnd] =
      line
        .split(',')
        .map(range => range.split('-'))
        .flat()
        .map(val => parseInt(val, 10));
    if (firstRangeEnd < secondRangeBegin) {
      continue; // No overlap.
    } else if (secondRangeEnd < firstRangeBegin) {
      continue; // No overlap.
    } else {
      total += 1;
    }
  }
  return total;
}
