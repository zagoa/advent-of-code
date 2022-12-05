import {DAY_1} from "./day1_inputs";

export function day1Part1(): number {
    const RESULT_TO_FIND = 2020;
    const inputs = DAY_1;
    let resultA = 0, resultB = 0;

    for (let inputA of inputs) {
        const inputB = inputs.find(item2 => inputA + item2 === RESULT_TO_FIND);
        if (!!inputB) {
            resultA = inputA;
            resultB = inputB;
            break;
        }
    }
    console.info('Day1 -> part1 -> resultA', resultA, 'resultB', resultB);
    return (resultA * resultB);
}


export function day1Part2(): number {
    const RESULT_TO_FIND = 2020;
    const inputs = DAY_1;
    let resultA = 0, resultB = 0, resultC = 0;

    for (let inputA of inputs) {
        for (let inputB of inputs) {
            const inputC = inputs.find(item2 => inputA + inputB + item2 === RESULT_TO_FIND);
            if (!!inputC) {
                resultA = inputA;
                resultB = inputB;
                resultC = inputC;
                break;
            }
        }

    }
    console.info('Day1 -> part2 -> resultA', resultA, 'resultB', resultB, 'resultC', resultC);
    return (resultA * resultB * resultC);
}
