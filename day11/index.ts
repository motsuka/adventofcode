import * as path from 'path';
import * as readline from 'readline';
import {openFile} from '../util';

const INPUT_FILEPATH = path.resolve(__dirname, 'input.txt');

type Octopus = {energyLevel: number; isFlashing: boolean};
type Cavern = Array<Array<Octopus>>;
type Coordinates = {x: number; y: number};
type FlashData = {totalFlashes: number; firstSynchronizedFlash: number};

export default async function main() {
  const flashData = await calculateFlashData(openFile(INPUT_FILEPATH));
  console.log(`${flashData.totalFlashes} flashes occurred in 100 steps`);
  console.log(
    'the first synchronized flash occurred at step ' +
      flashData.firstSynchronizedFlash
  );
}

/** calculates the total # of flashes over 100 steps */
async function calculateFlashData(
  file: readline.Interface
): Promise<FlashData> {
  let totalFlashes = 0;
  const cavern: Cavern = [];

  // build the initial state
  for await (const line of file) {
    const row: Octopus[] = [];
    for (const char of line) {
      row.push({
        energyLevel: parseInt(char, 10),
        isFlashing: false,
      });
    }
    cavern.push(row);
  }

  // trigger a step 100 times
  let i: number;
  let firstSynchronizedFlash: number | null = null;
  for (i = 1; i <= 100; ++i) {
    totalFlashes += processStep(cavern);
    if (!firstSynchronizedFlash && isSynchronizedFlash(cavern)) {
      firstSynchronizedFlash = i;
    }
    resetEnergyLevels(cavern);
  }

  // keep going if we haven't yet seen a synchronized flash
  while (!firstSynchronizedFlash) {
    processStep(cavern);
    if (isSynchronizedFlash(cavern)) {
      firstSynchronizedFlash = i;
    }
    resetEnergyLevels(cavern);
    ++i;
  }

  return {totalFlashes, firstSynchronizedFlash};
}

/** calculates the # of flashes a given step will cause */
function processStep(cavern: Cavern): number {
  let initiallyFlashing: Coordinates[] = [];
  for (let y = 0; y < cavern.length; ++y) {
    const row = cavern[y];
    for (let x = 0; x < row.length; ++x) {
      const octopus = row[x];
      octopus.energyLevel += 1;
      if (octopus.energyLevel > 9) {
        octopus.isFlashing = true;
        initiallyFlashing.push({x, y});
      }
    }
  }

  return processCascadingFlashes(cavern, initiallyFlashing);
}

/** calculates the # of flashes that will be indirectly caused by this step */
function processCascadingFlashes(
  cavern: Cavern,
  initiallyFlashing: Coordinates[]
): number {
  let numFlashes = 0;
  const queueToProcess = [...initiallyFlashing];
  while (queueToProcess.length > 0) {
    const currentCoords = queueToProcess.shift()!;
    const currentOctopus = cavern[currentCoords?.y][currentCoords?.x];

    if (currentOctopus?.isFlashing) {
      numFlashes += 1;
      const neighbors = calculateNeighbors(cavern, currentCoords);
      for (const neighborCoords of neighbors) {
        const neighborOctopus = cavern[neighborCoords.y][neighborCoords.x];
        if (!neighborOctopus.isFlashing) {
          neighborOctopus.energyLevel += 1;
          if (neighborOctopus.energyLevel > 9) {
            neighborOctopus.isFlashing = true;
            queueToProcess.push(neighborCoords);
          }
        }
      }
    }
  }
  return numFlashes;
}

/** returns a list of all the valid neighboring coordinates */
function calculateNeighbors(
  cavern: Cavern,
  coordinates: Coordinates
): Coordinates[] {
  const neighbors: Coordinates[] = [];
  if (coordinates.x > 0) {
    // left
    neighbors.push({x: coordinates.x - 1, y: coordinates.y});
    if (coordinates.y > 0) {
      // up-left
      neighbors.push({x: coordinates.x - 1, y: coordinates.y - 1});
    }
  }
  if (coordinates.y > 0) {
    // up
    neighbors.push({x: coordinates.x, y: coordinates.y - 1});
    if (coordinates.x < cavern[coordinates.y].length - 1) {
      // up-right
      neighbors.push({x: coordinates.x + 1, y: coordinates.y - 1});
    }
  }
  if (coordinates.x < cavern[coordinates.y].length - 1) {
    // right
    neighbors.push({x: coordinates.x + 1, y: coordinates.y});
    if (coordinates.y < cavern.length - 1) {
      // down-right
      neighbors.push({x: coordinates.x + 1, y: coordinates.y + 1});
    }
  }
  if (coordinates.y < cavern.length - 1) {
    // down
    neighbors.push({x: coordinates.x, y: coordinates.y + 1});
    if (coordinates.x > 0) {
      // down-left
      neighbors.push({x: coordinates.x - 1, y: coordinates.y + 1});
    }
  }
  return neighbors;
}

/** reset all the isFlashing values and energy levels after a completed step */
function resetEnergyLevels(cavern: Cavern) {
  for (const row of cavern) {
    for (const octopus of row) {
      if (octopus.isFlashing) {
        octopus.energyLevel = 0;
        octopus.isFlashing = false;
      }
    }
  }
}

/** return true iff all octopuses are flashing at the same time */
function isSynchronizedFlash(cavern: Cavern) {
  for (const row of cavern) {
    for (const octopus of row) {
      if (!octopus.isFlashing) {
        return false;
      }
    }
  }
  return true;
}
