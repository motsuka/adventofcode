import day01 from './day01';
import day02 from './day02';
import day03 from './day03';

type Solution = () => Promise<void>;

export default [
  /*day00=*/ null,
  day01,
  day02,
  day03,
] as Solution[];
