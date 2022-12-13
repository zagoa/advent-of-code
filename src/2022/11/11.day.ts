import {parseListString} from "../../utils/parse-input";
import {BigIntStats} from "fs";

class Monkey {
    monkeyNumber: number;
    items: Array<bigint>;
    operationFunc: (item) => bigint;
    conditionFunc: (item) => boolean;
    ifTrueThrowTo: number;
    ifFalseThrowTo: number;
    itemsInspected = 0;
    divideBy: bigint;

    constructor(monkeyNumber: number) {
        this.monkeyNumber = monkeyNumber;
    }
}

export default class Day11 {
    MONKEY_DEF_LENGTH = 7;

    constructor() {
        this.get_level_of_business_20_rounds();
        this.get_level_of_business_10000_rounds(); //skip for now the compute time is too long
    }

    get_level_of_business_20_rounds() {
        const data = parseListString(`${__dirname}/DAY_11_INPUTS`);
        //const data = parseListString(`${__dirname}/UNIT_TEST_DATA`);
        const monkeys = this.parseMonkeyData(data);

        for (let round = 0; round < 20; round++) {
            monkeys.forEach((monkey, index, arrayMonkeys) => {
                this.doAMonkeyRound(arrayMonkeys[index], arrayMonkeys);
            });
        }

        const result = monkeys
            .map((monkey) => monkey.itemsInspected)
            .sort((a, b) => b - a)
            .slice(0, 2)
            .reduce((total, value) => total * value);
        console.log(`Day 11 => level of monkey business after 20 rounds`, result);
    }


    get_level_of_business_10000_rounds() {
        const data = parseListString(`${__dirname}/DAY_11_INPUTS`);
        //const data = parseListString(`${__dirname}/UNIT_TEST_DATA`);
        const monkeys = this.parseMonkeyData(data);
        const denominator = monkeys.map(monkey => monkey.divideBy).reduce((total, value) => total * value);

        for (let round = 0; round < 10_000; round++) {
            monkeys.forEach((monkey, index, arrayMonkeys) => {
                this.doAMonkeyComplexRound(arrayMonkeys[index], arrayMonkeys, denominator);
            });
        }

        const result = monkeys
            .map((monkey) => monkey.itemsInspected)
            .sort((a, b) => b - a)
            .slice(0, 2)
            .reduce((total, value) => total * value);
        console.log(`Day 11 => level of monkey business after 10000 rounds`, result);
    }

    doAMonkeyRound(monkey: Monkey, arrayOfMonkeys: Array<Monkey>) {
        monkey.items.forEach((item, index, itemsArray) => {
            const opsResult = monkey.operationFunc(item);
            const finalValue = this.decreaseWorryLevel(opsResult);
            const isConditionTrue = monkey.conditionFunc(finalValue);
            if (isConditionTrue) {
                arrayOfMonkeys
                    .find(
                        (monkeyFromArray) =>
                            monkeyFromArray.monkeyNumber === monkey.ifTrueThrowTo,
                    )
                    .items.push(finalValue);
            } else {
                arrayOfMonkeys
                    .find(
                        (monkeyFromArray) =>
                            monkeyFromArray.monkeyNumber === monkey.ifFalseThrowTo,
                    )
                    .items.push(finalValue);
            }
            monkey.itemsInspected++;
        });

        monkey.items = [];
    }

    doAMonkeyComplexRound(monkey: Monkey, arrayOfMonkeys: Array<Monkey>, denominator: bigint) {
        monkey.items.forEach((item, index, itemsArray) => {
            const opsResult = monkey.operationFunc(item) % denominator;
            const isConditionTrue = monkey.conditionFunc(opsResult);

            if (isConditionTrue) {
                arrayOfMonkeys
                    .find(
                        (monkeyFromArray) =>
                            monkeyFromArray.monkeyNumber === monkey.ifTrueThrowTo,
                    )
                    .items.push(opsResult);
            } else {
                arrayOfMonkeys
                    .find(
                        (monkeyFromArray) =>
                            monkeyFromArray.monkeyNumber === monkey.ifFalseThrowTo,
                    )
                    .items.push(opsResult);
            }
            monkey.itemsInspected++;
        });

        monkey.items = [];
    }


    decreaseWorryLevel(value: bigint): bigint {
        return BigInt(value / BigInt(3))
    }

    parseMonkeyData(data: Array<string>): Array<Monkey> {
        const monkeys = new Array<Monkey>();
        for (let index = 0; index < data.length; index += this.MONKEY_DEF_LENGTH) {
            const monkey = new Monkey(index / this.MONKEY_DEF_LENGTH);
            monkey.items = data[index + 1]
                .split(":")[1]
                .split(",")
                .map((value) => BigInt(value));
            monkey.operationFunc = (value: bigint) => {
                let bigInt1: bigint, bigInt2: bigint, ops: string;
                const sentence = data[index + 2].split("=")[1].trim().split(' ');
                bigInt1 = sentence[0] === 'old' ? value : BigInt(sentence[0]);
                bigInt2 = sentence[2] === 'old' ? value : BigInt(sentence[2]);
                ops = sentence[1];

                switch (ops) {
                    case '+':
                        return bigInt1 + bigInt2;
                    case '-':
                        return bigInt1 - bigInt2;
                    case '*':
                        return bigInt1 * bigInt2;
                    case '/':
                        return bigInt1 / bigInt2;
                    default:
                        break;
                }

            };
            monkey.divideBy = BigInt(data[index + 3].split("by")[1])
            monkey.conditionFunc = (value: bigint) =>
                value % monkey.divideBy === BigInt(0);
            monkey.ifTrueThrowTo = parseInt(data[index + 4].split("monkey")[1]);
            monkey.ifFalseThrowTo = parseInt(data[index + 5].split("monkey")[1]);

            monkeys.push(monkey);
        }
        return monkeys;
    }
}
