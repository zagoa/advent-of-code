import {day1Part1, day1Part2} from "./day1/day1";
import {day2Part1, day2Part2} from "./day2/day2";
import {day3Part1, day3Part2} from "./day3/day3";
import {DAY3_INPUTS, TEST_EXAMPLE_DAY3} from "./day3/day3_inputs";
import {day4Part1, day4Part2} from "./day4/day4";
import {DAY4_INPUTS, DAY4_TEST} from "./day4/day4_inputs";

console.info('Day 1 -> part1 -> result', day1Part1());
console.info('Day 1 -> part2 -> result', day1Part2());

console.info('Day 2 -> part1 -> result', day2Part1());
console.info('Day 2 -> part1 -> result', day2Part2());

console.info('Day 3 -> part1 -> test must be 7', day3Part1(TEST_EXAMPLE_DAY3));
console.info('Day 3 -> part1 -> result', day3Part1(DAY3_INPUTS));

console.info('Day 3 -> part2 -> test must be 336', day3Part2(TEST_EXAMPLE_DAY3));
console.info('Day 3 -> part2 -> result', day3Part2(DAY3_INPUTS));

console.info('Day 4 -> part1 -> test must be 2', day4Part1(DAY4_TEST));
console.info('Day 4 -> part1 -> result', day4Part1(DAY4_INPUTS));
console.info('Day 4 -> part2 -> result', day4Part2(DAY4_INPUTS));
