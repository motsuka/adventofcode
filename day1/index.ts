import * as path from 'path';
import * as readline from 'readline';
import {openFile} from '../util';

const INPUT_FILEPATH = path.resolve(__dirname, 'input.txt');

export default async function main() {
  const singleResult = await countSingleIncreases(openFile(INPUT_FILEPATH));
  console.log(`Number of increases with window size 1: ${singleResult}`);

  const trioResult = await countTrioIncreases(openFile(INPUT_FILEPATH));
  console.log(`Number of increases with window size 1: ${trioResult}`);
}

async function countSingleIncreases(file: readline.Interface): Promise<number> {
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

async function countTrioIncreases(file: readline.Interface): Promise<number> {
  let increasesCount = 0;
  let previousValue: number | undefined;
  let twoPreviousValue: number | undefined;
  let threePreviousValue: number | undefined;
  for await (const line of file) {
    const currentValue = parseInt(line, 10);
    if (previousValue && twoPreviousValue && threePreviousValue) {
      const currentSum = currentValue + previousValue + twoPreviousValue;
      const previousSum = previousValue + twoPreviousValue + threePreviousValue;
      if (currentSum > previousSum) {
        ++increasesCount;
      }
    }
    threePreviousValue = twoPreviousValue;
    twoPreviousValue = previousValue;
    previousValue = currentValue;
  }
  return increasesCount;
}
