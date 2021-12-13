import day01 from './day01';
import day02 from './day02';
import day03 from './day03';
import day05 from './day05';
import day10 from './day10';
import day11 from './day11';
import day12 from './day12';
import day13 from './day13';

type Solution = () => Promise<void>;

export default [
  /*day00=*/ null,
  day01,
  day02,
  day03,
  /*day04=*/ null,
  day05,
  /*day06=*/ null,
  /*day07=*/ null,
  /*day08=*/ null,
  /*day09=*/ null,
  day10,
  day11,
  day12,
  day13,
] as Solution[];
