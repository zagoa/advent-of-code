import {day1Part1, day1Part2} from "./day1/day1";
import {DAY2_INPUTS_STRING} from "./day2/day2_inputs";

console.info('Day 1 -> part1 -> result', day1Part1());
console.info('Day 1 -> part2 -> result', day1Part2());

console.info('Day 2 -> format', formatInputsToArrayString(DAY2_INPUTS_STRING));


function formatInputsToArrayString(input: string): Array<string> {
    return input.split('\n');
}


function formatInputsToArrayNumber(input: string): Array<number> {
    return input.split('\n').map(item => +item);
}
