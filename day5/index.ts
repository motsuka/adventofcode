import * as path from 'path';
import * as readline from 'readline';
import {openFile} from '../util';

const INPUT_FILEPATH = path.resolve(__dirname, 'input.txt');

export default async function main() {
  const result = await calculateVeryDangerousAreas(openFile(INPUT_FILEPATH));
  console.log(`There are ${result.size} very dangerous areas`);
}

async function calculateVeryDangerousAreas(
  file: readline.Interface
): Promise<Set<string>> {
  const areasWithOneVent: Set<string> = new Set();
  const areasWithMultipleVents: Set<string> = new Set();

  for await (const line of file) {
    const [beginning, end] = line.split(' -> ');
    for (const coordinate of calculateLineCoordinates(beginning, end)) {
      if (areasWithMultipleVents.has(coordinate)) {
        // Do nothing
      } else if (areasWithOneVent.has(coordinate)) {
        areasWithMultipleVents.add(coordinate);
      } else {
        areasWithOneVent.add(coordinate);
      }
    }
  }

  return areasWithMultipleVents;
}

function calculateLineCoordinates(beginning: string, end: string): string[] {
  const [startX, startY] = beginning
    .split(',')
    .map(coordinate => parseInt(coordinate, 10));
  const [endX, endY] = end
    .split(',')
    .map(coordinate => parseInt(coordinate, 10));

  let x = startX;
  let y = startY;
  // initialize with the first postion
  let coordinates = [`${x},${y}`];
  while (x !== endX || y !== endY) {
    if (x !== endX) {
      x = x < endX ? x + 1 : x - 1;
    }
    if (y !== endY) {
      y = y < endY ? y + 1 : y - 1;
    }
    // move, then add the next position
    coordinates.push(`${x},${y}`);
  }

  return coordinates;
}
