import * as readline from 'readline';
import solutions from './solutions';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'choose a day> ',
});

rl.prompt();

rl.on('line', async (line: string) => {
  try {
    const day = parseInt(line, 10);
    const solution = solutions[day];
    await solution();
  } catch (e) {
    console.log(e);
    console.log(`seems like day ${line} hasn't been created yet.`);
  }
  rl.close();
});
