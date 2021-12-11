import * as path from 'path';
import * as readline from 'readline';
import {openFile} from '../util';

const INPUT_FILEPATH = path.resolve(__dirname, 'input.txt');
const OPEN_TO_CLOSE_CHAR_MAP: Map<string, string> = new Map()
  .set('(', ')')
  .set('[', ']')
  .set('{', '}')
  .set('<', '>');
const OPEN_CHAR_SET = new Set(OPEN_TO_CLOSE_CHAR_MAP.keys());
const CLOSE_CHAR_SET = new Set(OPEN_TO_CLOSE_CHAR_MAP.values());
const SYNTAX_ERROR_SCORE_MAP: Map<string, number> = new Map()
  .set(')', 3)
  .set(']', 57)
  .set('}', 1197)
  .set('>', 25137);
const AUTOCOMPLETE_SCORE_MAP: Map<string, number> = new Map()
  .set(')', 1)
  .set(']', 2)
  .set('}', 3)
  .set('>', 4);

type Scores = {syntaxError: number; autocomplete: number};

export default async function main() {
  const scores = await calculateScores(openFile(INPUT_FILEPATH));
  console.log(`Syntax error score: ${scores.syntaxError}`);
  console.log(`Median autocomplete score: ${scores.autocomplete}`);
}

async function calculateScores(file: readline.Interface): Promise<Scores> {
  let syntaxErrorScore = 0;
  let autocompleteScores: number[] = [];
  for await (const line of file) {
    let foundCorruption = false;
    const stack: string[] = [];
    for (const char of line) {
      if (OPEN_CHAR_SET.has(char)) {
        stack.push(OPEN_TO_CLOSE_CHAR_MAP.get(char) || '');
      } else if (CLOSE_CHAR_SET.has(char)) {
        if (stack.pop() !== char) {
          foundCorruption = true;
          syntaxErrorScore += SYNTAX_ERROR_SCORE_MAP.get(char) || 0;
        }
      } else {
        throw new Error(`found unexpected character: ${char}`);
      }
    }

    if (!foundCorruption) {
      autocompleteScores.push(calculateAutocompleteScore(stack));
    }
  }
  return {
    syntaxError: syntaxErrorScore,
    autocomplete: findMedianScore(autocompleteScores),
  };
}

function calculateAutocompleteScore(remainingStack: string[]): number {
  let score = 0;
  while (remainingStack.length > 0) {
    const char = remainingStack.pop() || '';
    score *= 5;
    score += AUTOCOMPLETE_SCORE_MAP.get(char) || 0;
  }
  return score;
}

function findMedianScore(scores: number[]): number {
  return (
    scores.sort((a, b) => a - b).at(Math.floor(scores.length / 2.0)) || Infinity
  );
}
