import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const INPUT_FILEPATH = path.resolve(__dirname, 'input.txt');

type DiagnosticReportColumn = {zeros: number; ones: number};
type DiagnosticReport = DiagnosticReportColumn[];
type DiagnosticSummary = {gamma: number; epsilon: number};

export default async function main() {
  const readlineInterface = readline.createInterface({
    input: fs.createReadStream(INPUT_FILEPATH),
    crlfDelay: Infinity,
  });

  const result = await buildDiagnosticSummary(readlineInterface);
  console.log(`Gamma rate: ${result.gamma}`);
  console.log(`Epsilon rate: ${result.epsilon}`);
  console.log(`Product: ${result.gamma * result.epsilon}`);
}

async function buildDiagnosticSummary(
  file: readline.Interface
): Promise<DiagnosticSummary> {
  let report: DiagnosticReport = [];
  for await (const line of file) {
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
  return summarizeReport(report);
}

function summarizeReport(report: DiagnosticReport): DiagnosticSummary {
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
