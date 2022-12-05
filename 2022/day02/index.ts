import * as path from 'path';
import { openFile } from '../util';
import { calculateScore as calculatePartOneScore } from './part_one';

const INPUT_FILENAME = path.join(__dirname, 'input.txt');

export default async function main() {
  const partOneScore = await calculatePartOneScore(openFile(INPUT_FILENAME));
  console.log(`The projected score if X/Y/Z represent the player move is ${partOneScore}.`);
}
