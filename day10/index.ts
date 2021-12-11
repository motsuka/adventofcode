import * as path from 'path';
import * as readline from 'readline';
import { openFile } from '../util';

const INPUT_FILEPATH = path.resolve(__dirname, 'input.txt');
const OPEN_TO_CLOSE_CHAR_MAP: Map<string, string> = new Map()
  .set('(', ')')
  .set('[', ']')
  .set('{', '}')
  .set('<', '>');
const CHAR_TO_SCORE_MAP: Map<string, number> = new Map()
  .set(')', 3)
  .set(']', 57)
  .set('}', 1197)
  .set('>', 25137);


export default async function main() {
  const result = await calculateScore(openFile(INPUT_FILEPATH));
  console.log(`Score: ${result}`);
}

async function calculateScore(file: readline.Interface): Promise<number> {
  let score = 0;
  for await (const line of file) {
    let foundCorruption = false;
    const stack: Array<string | undefined> = [];
    for (let i = 0; !foundCorruption && i < line.length; ++i) {
      const char = line[i];
      switch (char) {
        case '(':
        case '[':
        case '{':
        case '<':
          stack.push(OPEN_TO_CLOSE_CHAR_MAP.get(char));
          break;
        case ')':
        case ']':
        case '}':
        case '>':
          if (stack.pop() === char) {
            break;
          }
        default:
          foundCorruption = true;
          score += CHAR_TO_SCORE_MAP.get(char) || 0;
      }

    }
  }
  return score;
}