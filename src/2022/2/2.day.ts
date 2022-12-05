import {readFileSync} from "fs";
import {parseListString} from "../../utils/parse-input";

enum Shape {
    ROCK = 1,
    PAPER = 2,
    SCISSORS = 3
}

enum ShapeCode {
    A = Shape.ROCK,
    B = Shape.PAPER,
    C = Shape.SCISSORS,
    X,
    Y,
    Z
}

enum RoundResult {
    WIN = 6,
    DRAW = 3,
    LOOSE = 0
}

export class Day2 {

    constructor() {
        this.total_with_perfect_plan();
        this.total_following_plan_with_goal_for_result_round();
    }


    /**
     * Appreciative of your help yesterday, one Elf gives you an encrypted strategy guide (your puzzle input) that they say will be sure to help you win. "The first column is what your opponent is going to play: A for Rock, B for Paper, and C for Scissors. The second column--" Suddenly, the Elf is called away to help with someone's tent.
     *
     * The second column, you reason, must be what you should play in response: X for Rock, Y for Paper, and Z for Scissors. Winning every time would be suspicious, so the responses must have been carefully chosen.
     *
     * The winner of the whole tournament is the player with the highest score. Your total score is the sum of your scores for each round. The score for a single round is the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors) plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).
     *
     * Since you can't be sure if the Elf is trying to help you or trick you, you should calculate the score you would get if you were to follow the strategy guide.
     *
     * For example, suppose you were given the following strategy guide:
     *
     * A Y
     * B X
     * C Z
     * This strategy guide predicts and recommends the following:
     *
     * In the first round, your opponent will choose Rock (A), and you should choose Paper (Y). This ends in a win for you with a score of 8 (2 because you chose Paper + 6 because you won).
     * In the second round, your opponent will choose Paper (B), and you should choose Rock (X). This ends in a loss for you with a score of 1 (1 + 0).
     * The third round is a draw with both players choosing Scissors, giving you a score of 3 + 3 = 6.
     * In this example, if you were to follow the strategy guide, you would get a total score of 15 (8 + 1 + 6).
     */
    total_with_perfect_plan() {
        const couples = parseListString(__dirname + '/DAY_2_INPUTS');


        const result = couples.reduce((points, couple) => {
            const coupleSplit = couple.split(' ')
            const opponentShape = ShapeCode[coupleSplit[0]];
            const myShape = this.decodeShape(coupleSplit[1]);
            points += this.countPoints(opponentShape, myShape);
            return points;
        }, 0)

        console.log('DAY 2 => total with perfect plan', result);
        return result;
    }

    /**
     * The Elf finishes helping with the tent and sneaks back over to you. "Anyway, the second column says how the round needs to end: X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win. Good luck!"
     *
     * The total score is still calculated in the same way, but now you need to figure out what shape to choose so the round ends as indicated. The example above now goes like this:
     *
     * In the first round, your opponent will choose Rock (A), and you need the round to end in a draw (Y), so you also choose Rock. This gives you a score of 1 + 3 = 4.
     * In the second round, your opponent will choose Paper (B), and you choose Rock so you lose (X) with a score of 1 + 0 = 1.
     * In the third round, you will defeat your opponent's Scissors with Rock for a score of 1 + 6 = 7.
     * Now that you're correctly decrypting the ultra top secret strategy guide, you would get a total score of 12.
     *
     * Following the Elf's instructions for the second column, what would your total score be if everything goes exactly according to your strategy guide?
     */
    total_following_plan_with_goal_for_result_round() {
        const couples = parseListString(__dirname + '/DAY_2_INPUTS');

        const result = couples.reduce((points, couple) => {
            const coupleSplit = couple.split(' ')
            const opponentShape = ShapeCode[coupleSplit[0]];
            const myShape = this.findShapeToSatisfyRoundResult(opponentShape, this.decodeResult(coupleSplit[1]));
            points += this.countPoints(opponentShape, myShape);
            return points;
        }, 0)

        console.log('DAY 2 => total following plan with goal for each round', result);
        return result;
    }


    countPoints(opponentShape, myShape): number {
        let result = 0;
        switch (myShape) {
            case Shape.ROCK:
                if (opponentShape === Shape.ROCK) {
                    result = RoundResult.DRAW
                } else if (opponentShape === Shape.PAPER) {
                    result = RoundResult.LOOSE;
                } else {
                    result = RoundResult.WIN
                }
                break;
            case Shape.PAPER:
                if (opponentShape === Shape.ROCK) {
                    result = RoundResult.WIN
                } else if (opponentShape === Shape.PAPER) {
                    result = RoundResult.DRAW;
                } else {
                    result = RoundResult.LOOSE;
                }
                break;
            case Shape.SCISSORS:
                if (opponentShape === Shape.ROCK) {
                    result = RoundResult.LOOSE
                } else if (opponentShape === Shape.PAPER) {
                    result = RoundResult.WIN;
                } else {
                    result = RoundResult.DRAW;
                }
                break;
            default:
                break;

        }
        return result + myShape;
    }

    decodeShape(enumStr: string): Shape {
        switch (enumStr) {
            case 'X':
                return Shape.ROCK
            case 'Y':
                return Shape.PAPER
            case 'Z':
                return Shape.SCISSORS
        }
    }

    decodeResult(enumStr: string): RoundResult {
        switch (enumStr) {
            case 'X':
                return RoundResult.LOOSE
            case 'Y':
                return RoundResult.DRAW
            case 'Z':
                return RoundResult.WIN
        }
    }

    findShapeToSatisfyRoundResult(opponentShape, goal: RoundResult): Shape {
        if (goal === RoundResult.DRAW) {
            return opponentShape;
        }


        switch (opponentShape) {
            case Shape.PAPER:
                switch (goal) {
                    case RoundResult.LOOSE:
                        return Shape.ROCK;
                    case RoundResult.WIN:
                        return Shape.SCISSORS
                }
                break;
            case Shape.ROCK:
                switch (goal) {
                    case RoundResult.LOOSE:
                        return Shape.SCISSORS;
                    case RoundResult.WIN:
                        return Shape.PAPER
                }
                break;
            case Shape.SCISSORS:
                switch (goal) {
                    case RoundResult.LOOSE:
                        return Shape.PAPER;
                    case RoundResult.WIN:
                        return Shape.ROCK
                }
                break;
            default:
                return undefined;
        }


    }


}