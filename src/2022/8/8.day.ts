import {parseListString} from "../../utils/parse-input";
import {readFileSync} from "fs";

const dirs = [
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, 0],
];

export default class Day8 {

    constructor() {
        this.how_many_trees_are_visible_from_outside();
        this.get_highest_scenic_score();
    }


    /**
     * 30373
     * 25512
     * 65332
     * 33549
     * 35390
     * Each tree is represented as a single digit whose value is its height, where 0 is the shortest and 9 is the tallest.
     *
     * A tree is visible if all of the other trees between it and an edge of the grid are shorter than it. Only consider trees in the same row or column; that is, only look up, down, left, or right from any given tree.
     *
     * All of the trees around the edge of the grid are visible - since they are already on the edge, there are no trees to block the view. In this example, that only leaves the interior nine trees to consider:
     *
     * The top-left 5 is visible from the left and top. (It isn't visible from the right or bottom since other trees of height 5 are in the way.)
     * The top-middle 5 is visible from the top and right.
     * The top-right 1 is not visible from any direction; for it to be visible, there would need to only be trees of height 0 between it and an edge.
     * The left-middle 5 is visible, but only from the right.
     * The center 3 is not visible from any direction; for it to be visible, there would need to be only trees of at most height 2 between it and an edge.
     * The right-middle 3 is visible from the right.
     * In the bottom row, the middle 5 is visible, but the 3 and 4 are not.
     * With 16 trees visible on the edge and another 5 visible in the interior, a total of 21 trees are visible in this arrangement.
     *
     * Consider your map; how many trees are visible from outside the grid?
     */
    how_many_trees_are_visible_from_outside() {
        const data = parseListString(__dirname + '/DAY_8_INPUTS');
        const grid = this.buildGrid(data);
        const count = this.countNumberOfVisibleTree(grid);
        console.assert(count === 1647, 'You break the working code')
        console.log('DAY 8 => how many trees are visible from outside', count);
    }

    get_highest_scenic_score() {
        const data = parseListString(__dirname + '/DAY_8_INPUTS');
        const grid = this.buildGrid(data);

        let scenicScores = new Array<number>();
        for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
            const currentRow = grid[rowIndex];
            for (let colIndex = 0; colIndex < currentRow.length; colIndex++) {
                scenicScores.push(this.computeScenicScore(rowIndex, colIndex, grid));
            }
        }

        console.log('DAY 8 => best scenic score', Math.max(...scenicScores));
    }


    countNumberOfVisibleTree(grid: Array<Array<number>>) {
        let counter = 0;
        for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
            const currentRow = grid[rowIndex];
            for (let colIndex = 0; colIndex < currentRow.length; colIndex++) {
                if (this.checkIfTreeIsVisible(rowIndex, colIndex, grid)) {
                    counter++;
                }
            }
        }
        return counter;
    }

    checkIfTreeIsVisible(rowIndex: number, colIndex: number, grid: Array<Array<number>>): boolean {
        const column = grid.map(row => row[colIndex]);
        const row = grid[rowIndex];

        const treeHeight = grid[rowIndex][colIndex];
        const directions: Array<Array<number>> = new Array<Array<number>>();
        directions.push(column.slice(0, rowIndex)); // colTop
        directions.push(column.slice(rowIndex + 1, column.length)) // colBottom;
        directions.push(row.slice(0, colIndex)); // rowLeft
        directions.push(row.slice(colIndex + 1, row.length)) // rowRight;

        return directions.filter(direction => direction.find(otherTree => otherTree >= treeHeight) === undefined).length > 0;
    }

    buildGrid(data: Array<string>) {
        const grid = new Array<Array<number>>()
        data.forEach(row => {
            grid.push(row.split('').map(item => parseInt(item)));
        })
        return grid;
    }

    private computeScenicScore(rowIndex: number, colIndex: number, grid: Array<number>[]): number {
        const column = grid.map(row => row[colIndex]);
        const row = grid[rowIndex];

        const treeHeight = grid[rowIndex][colIndex];
        const directions: Array<Array<number>> = new Array<Array<number>>();
        directions.push(column.slice(0, rowIndex).reverse()); // colTop
        directions.push(column.slice(rowIndex + 1, column.length)) // colBottom;
        directions.push(row.slice(0, colIndex).reverse()); // rowLeft
        directions.push(row.slice(colIndex + 1, row.length)) // rowRight;

        const scenicValues = new Array<number>();
        directions.forEach(direction => {
            const index = direction.findIndex(tree => tree >= treeHeight);

            scenicValues.push(index > -1 ? index + 1 : direction.length);
        })
        return scenicValues.reduce((total, value) => total * value)
    }


}