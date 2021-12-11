import day1 from './day1';
import day2 from './day2';
import day3 from './day3';
import day5 from './day5';
import day10 from './day10';

type Solution = () => Promise<void>;

export default [
  /*day0=*/ null,
  day1,
  day2,
  day3,
  /*day4=*/ null,
  day5,
  /*day6=*/ null,
  /*day7=*/ null,
  /*day8=*/ null,
  /*day9=*/ null,
  day10,
] as Solution[];
