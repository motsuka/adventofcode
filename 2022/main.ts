import * as readline from 'readline';
import solutions from './solutions';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'choose a day> ',
});

rl.prompt();

rl.on('line', async (line: string) => {
  let solution: Function | undefined;
  try {
    solution = solutions[parseInt(line, 10)];
  } catch (e) {
    console.error(e);
  }

  if (solution) {
    await solution();
  } else {
    console.log(`seems like day ${line} hasn't been created yet.`);
  }
  rl.close();
});
