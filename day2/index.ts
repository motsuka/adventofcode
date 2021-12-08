import * as path from 'path';
import * as readline from 'readline';
import {openFile} from '../util';

const INPUT_FILEPATH = path.resolve(__dirname, 'input.txt');
const INPUT_LINE_FORMAT = /(?<direction>\w+)\s(?<magnitude>\d+)/;

type Coordinates = {x: number; y: number};

export default async function main() {
  const result = await calculatePosition(openFile(INPUT_FILEPATH));
  console.log(`Final coordinates: ${result.x}, ${result.y}`);
  console.log(`Product: ${result.x * result.y}`);
}

async function calculatePosition(
  file: readline.Interface
): Promise<Coordinates> {
  let coordinates: Coordinates = {x: 0, y: 0};
  for await (const line of file) {
    const match = line.match(INPUT_LINE_FORMAT);
    if (!match?.groups) {
      throw new Error(`unexpected statement format: ${line}`);
    }

    const magnitude = parseInt(match.groups.magnitude, 10);
    switch (match.groups.direction) {
      case 'forward':
        coordinates.x = coordinates.x + magnitude;
        break;
      case 'down':
        coordinates.y = coordinates.y + magnitude;
        break;
      case 'up':
        coordinates.y = coordinates.y - magnitude;
        break;
      default:
        throw new Error(`unexpected direction: ${match.groups.direction}`);
    }
  }
  return coordinates;
}
