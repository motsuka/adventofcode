import * as readline from 'readline';

enum Move {
  ROCK = 'A',
  PAPER = 'B',
  SCISSORS = 'C',
}

const MOVE_SCORES: Map<string, number> = new Map()
  .set(Move.ROCK, 1)
  .set(Move.PAPER, 2)
  .set(Move.SCISSORS, 3);
const WINNING_MOVES: Map<string, string> = new Map()
  .set(Move.ROCK, Move.PAPER)
  .set(Move.PAPER, Move.SCISSORS)
  .set(Move.SCISSORS, Move.ROCK);
const LOSING_MOVES: Map<string, string> = new Map()
  .set(Move.ROCK, Move.SCISSORS)
  .set(Move.PAPER, Move.ROCK)
  .set(Move.SCISSORS, Move.PAPER);

export async function calculateScore(file: readline.Interface): Promise<number> {
  let score = 0;
  for await (const line of file) {
    const [opponent, outcome] = line.split(' ');
    switch (outcome) {
      case 'Z':
        score += 6 + MOVE_SCORES.get(WINNING_MOVES.get(opponent)!)!;
        break;
      case 'Y':
        score += 3 + MOVE_SCORES.get(opponent)!;
        break;
      case 'X':
        score += MOVE_SCORES.get(LOSING_MOVES.get(opponent)!)!;
        break;
    }
  }
  return score;
}
