import * as path from 'path';
import * as readline from 'readline';
import {openFile} from '../util';

const INPUT_FILEPATH = path.resolve(__dirname, 'input.txt');
const SMALL_ROOM = /^[a-z]+$/;

// TODO: do we care if this bleeds betwen runs?
let paths = new Map<string, Set<string>>();

export default async function main() {
  const numPaths = await calculateTotalPaths(openFile(INPUT_FILEPATH));
  console.log(`found ${numPaths} paths from start to end`);
}

async function calculateTotalPaths(file: readline.Interface): Promise<number> {
  for await (const line of file) {
    const [left, right] = line.split('-');
    if (paths.has(left)) {
      paths.get(left)!.add(right);
    } else {
      paths.set(left, new Set([right]));
    }
    if (paths.has(right)) {
      paths.get(right)!.add(left);
    } else {
      paths.set(right, new Set([left]));
    }
  }

  return calculateNumPathsFrom('start', new Set(['start']));
}

function calculateNumPathsFrom(source: string, visited: Set<string>): number {
  let numPaths = 0;
  for (const nextRoom of paths.get(source) || []) {
    if (nextRoom === 'end') {
      numPaths += 1;
    } else if (SMALL_ROOM.test(nextRoom) && visited.has(nextRoom)) {
      continue;
    } else {
      numPaths += calculateNumPathsFrom(
        nextRoom,
        new Set(visited).add(nextRoom)
      );
    }
  }
  return numPaths;
}
