import * as path from 'path';
import * as readline from 'readline';
import {openFile} from '../util';

const INPUT_FILEPATH = path.resolve(__dirname, 'input.txt');

type ColumnSummary = {zeros: number; ones: number};
type PowerConsumption = {gamma: number; epsilon: number};
type LifeSupportRating = {oxygenGen: number; co2Scrub: number};
type DiagnosticReport = PowerConsumption & LifeSupportRating;

export default async function main() {
  const diagnosticReport = await calculateDiagnosticReport(
    openFile(INPUT_FILEPATH)
  );
  console.log(`Gamma rate: ${diagnosticReport.gamma}`);
  console.log(`Epsilon rate: ${diagnosticReport.epsilon}`);
  console.log(
    `Power consumption: ${diagnosticReport.gamma * diagnosticReport.epsilon}`
  );
  console.log(`Oxygen generator rating: ${diagnosticReport.oxygenGen}`);
  console.log(`CO2 scrubber rating: ${diagnosticReport.co2Scrub}`);
  console.log(
    `Life support rating: ${
      diagnosticReport.oxygenGen * diagnosticReport.co2Scrub
    }`
  );
}

async function calculateDiagnosticReport(
  file: readline.Interface
): Promise<DiagnosticReport> {
  const lines: string[] = [];
  const report: ColumnSummary[] = [];
  for await (const line of file) {
    lines.push(line);
    for (let i = 0; i < line.length; ++i) {
      if (report.length <= i) {
        report.push({zeros: 0, ones: 0});
      }

      switch (line.charAt(i)) {
        case '0':
          report[i].zeros += 1;
          break;
        case '1':
          report[i].ones += 1;
          break;
        default:
          throw new Error(`unexpected characters in line: ${line}`);
      }
    }
  }

  const oxygenGeneratorRating = calculateRatingValue(lines, true);
  const co2ScrubberRating = calculateRatingValue(lines, false);

  return {
    ...calculatePowerConsumption(report),
    oxygenGen: parseInt(oxygenGeneratorRating, 2),
    co2Scrub: parseInt(co2ScrubberRating, 2),
  };
}

function calculatePowerConsumption(report: ColumnSummary[]): PowerConsumption {
  let gammaRate = '';
  let epsilonRate = '';
  for (const column of report) {
    const hasMoreZerosThanOnes = column.zeros > column.ones;
    gammaRate += hasMoreZerosThanOnes ? '0' : '1';
    epsilonRate += hasMoreZerosThanOnes ? '1' : '0';
  }
  return {
    gamma: parseInt(gammaRate, 2),
    epsilon: parseInt(epsilonRate, 2),
  };
}

/**
 * Finds + returns the rating value (a binary number in string form) for a
 * given set of lines. Defaults to searching using most-common digit, unless
 * leastCommon is true.
 */
function calculateRatingValue(lines: string[], leastCommon: boolean): string {
  let candidates = lines;
  for (let i = 0; i < lines[0].length; ++i) {
    const column = candidates.reduce(
      (columnSummary: ColumnSummary, candidate: string) => {
        switch (candidate.charAt(i)) {
          case '0':
            return {zeros: columnSummary.zeros + 1, ones: columnSummary.ones};
          case '1':
            return {zeros: columnSummary.zeros, ones: columnSummary.ones + 1};
          default:
            return columnSummary;
        }
      },
      {zeros: 0, ones: 0}
    );

    const mostCommonDigit = column.zeros > column.ones ? '0' : '1';
    candidates = candidates.filter(candidate =>
      leastCommon
        ? candidate.charAt(i) !== mostCommonDigit
        : candidate.charAt(i) === mostCommonDigit
    );
    if (candidates.length === 1) {
      return candidates[0];
    }
  }
  throw new Error(
    `Could not find ${
      leastCommon ? 'CO2 scrubber' : 'oxygen generator'
    } rating value!`
  );
}
