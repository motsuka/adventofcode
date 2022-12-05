import * as readline from 'readline';
import { Outcome } from './common';

const SCORES: Map<string, number> = new Map()
  .set('X', 1)
  .set('Y', 2)
  .set('Z', 3);
const A_OUTCOMES: Map<string, Outcome> = new Map()
  .set('X', Outcome.DRAW)
  .set('Y', Outcome.WIN)
  .set('Z', Outcome.LOSE);
const B_OUTCOMES: Map<string, Outcome> = new Map()
  .set('X', Outcome.LOSE)
  .set('Y', Outcome.DRAW)
  .set('Z', Outcome.WIN);
const C_OUTCOMES: Map<string, Outcome> = new Map()
  .set('X', Outcome.WIN)
  .set('Y', Outcome.LOSE)
  .set('Z', Outcome.DRAW);
const OUTCOMES: Map<string, Map<string, Outcome>> = new Map()
  .set('A', A_OUTCOMES)
  .set('B', B_OUTCOMES)
  .set('C', C_OUTCOMES);

export async function calculateScore(file: readline.Interface): Promise<number> {
  let score = 0;
  for await (const line of file) {
    const [opponent, player] = line.split(' ');
    const outcome = OUTCOMES.get(opponent)!.get(player)!;
    score += SCORES.get(player)!;
    switch (outcome) {
      case Outcome.WIN:
        score += 6;
        break;
      case Outcome.DRAW:
        score += 3;
        break;
      case Outcome.LOSE:
        break; // No points awarded.
    }
  }
  return score;
}
