import * as path from 'path';
import * as readline from 'readline';
import {openFile} from '../util';

const INPUT_FILEPATH = path.resolve(__dirname, 'input.txt');
const FOLD_FORMAT = /^fold along (?<axis>[xy])=(?<index>\d+)$/;

type Dot = {x: number; y: number};

export default async function main() {
  const dotsAfterOneFold = await calculateDotsAfterFolding(
    openFile(INPUT_FILEPATH),
    /*maxIterations=*/ 1
  );
  console.log(`${dotsAfterOneFold.size} dots after folding once`);

  const dotsAfterAllFolds = await calculateDotsAfterFolding(
    openFile(INPUT_FILEPATH),
    /*maxIterations=*/ Infinity
  );
  console.log(prettyPrintDots(dotsAfterAllFolds));
}

async function calculateDotsAfterFolding(
  file: readline.Interface,
  maxIterations: number
): Promise<Set<string>> {
  const dots = new Set<string>();
  const folds: string[] = [];
  let readingFolds = false;
  for await (const line of file) {
    if (!line) {
      readingFolds = true;
      continue;
    }

    if (readingFolds) {
      folds.push(line);
    } else {
      dots.add(line);
    }
  }

  console.log(`${dots.size} dots before folding`);

  let i = 1;
  for await (const entry of folds) {
    let match = entry.match(FOLD_FORMAT);
    const axis = match?.groups?.axis;
    const index = match?.groups?.index;
    if (!axis || !index) {
      throw new Error('unexpected fold instructions');
    }

    performFold(dots, axis, parseInt(index, 10));

    if (++i > maxIterations) {
      break;
    }
  }

  return dots;
}

function performFold(dots: Set<string>, axis: string, foldIndex: number) {
  for (const dotString of dots) {
    const dot = convertStringToDot(dotString);
    if (axis === 'x' && dot.x > foldIndex) {
      const distanceToFold = dot.x - foldIndex;
      dot.x = foldIndex - distanceToFold;
    } else if (axis == 'y' && dot.y > foldIndex) {
      const distanceToFold = dot.y - foldIndex;
      dot.y = foldIndex - distanceToFold;
    }
    const newDotString = `${dot.x},${dot.y}`;
    if (newDotString !== dotString) {
      dots.delete(dotString);
      dots.add(newDotString);
    }
  }
}

function convertStringToDot(str: string): Dot {
  const [x, y] = str.split(',');
  return {x: parseInt(x, 10), y: parseInt(y, 10)};
}

function prettyPrintDots(dots: Set<string>): string {
  let str = '';
  for (let y = 0; y < 10; ++y) {
    for (let x = 0; x < 40; ++x) {
      if (dots.has(`${x},${y}`)) {
        str += '#';
      } else {
        str += '-';
      }
    }
    str += '\n';
  }
  return str;
}
