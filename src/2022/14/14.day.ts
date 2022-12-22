import {parseListString} from "../../utils/parse-input";
import fs from "fs";

enum MaterialType {
    SAND = 'SAND',
    SAND_SOURCE = 'SAND_SOURCE',
    ROCK = 'ROCK',
    AIR = 'AIR'
}

enum DrawType {
    SAND = 'o',
    SAND_SOURCE = '+',
    ROCK = '#',
    AIR = '.'
}

class Cave {
    grid: Array<Array<CaveItem>>;
    sandSource: { row: number, col: number };
    highestRock: CaveItem;

    constructor(grid: Array<Array<CaveItem>>, highestRock?: CaveItem) {
        this.grid = grid;
        this.highestRock = highestRock;
    }

    setSandSource(param: { row: number; col: number }) {
        this.sandSource = param;
        this.grid[param.row][param.col] = new CaveItem(MaterialType.SAND_SOURCE);
    }

    setGridItem(caveItem: CaveItem) {
        this.grid[caveItem.row][caveItem.col] = caveItem;
    }

    setFloor() {
        const floorRow = this.grid[this.highestRock.row + 2];
        for (let index = 0; index < floorRow.length; index++) {
            floorRow[index].type = MaterialType.ROCK;
        }
    }
}

class CaveItem {
    type: MaterialType;
    row: number;
    col: number;

    constructor(type: MaterialType = MaterialType.AIR, row?: number, col?: number) {
        this.type = type;
        this.row = row;
        this.col = col;
    }
}


export default class Day14 {
    constructor() {
        this.part1();
        this.part2()
    }

    part1(setHighestFloor: boolean = false) {
        const data = parseListString(`${__dirname}/DAY_14_INPUTS`);
        //const data = parseListString(`${__dirname}/UNIT_TEST_DATA`);
        const cave = this.createCaveFromData(data);
        cave.setSandSource({row: 0, col: 500});
        if (setHighestFloor) {
            cave.setFloor();
        }
        this.drawCave(cave);


        let sendSand = true;
        let sandNumber = 0;
        while (sendSand) {
            const nextItem = this.fallingOnePieceOfSand(cave, cave.sandSource.row, cave.sandSource.col)
            if (nextItem !== undefined) {
                cave.setGridItem(nextItem);
                //this.drawCave(cave);
                sandNumber++;
                if (setHighestFloor) {
                    if (cave.sandSource.row === nextItem.row && cave.sandSource.col === nextItem.col) {
                        sendSand = false;
                    }
                }
            } else {
                sendSand = false;
            }
        }

        this.drawCave(cave);
        console.log(`Day 14 => ${sandNumber} units of sands have fallen`)

    }

    part2() {
        this.part1(true)
    }

    fallingOnePieceOfSand(cave: Cave, row: number, col: number): CaveItem {
        const nextRow = row + 1;
        if (nextRow > cave.grid.length - 1) {
            return undefined;
        }

        const nextDiagRightItem = cave.grid[nextRow][col + 1];
        const nextDiagLeftItem = cave.grid[nextRow][col - 1];
        const nextYItem = cave.grid[nextRow][col];


        if (nextYItem.type !== MaterialType.AIR) {
            if (nextDiagLeftItem.type === MaterialType.AIR) {
                return this.fallingOnePieceOfSand(cave, nextRow, col - 1);
            } else if (nextDiagRightItem.type === MaterialType.AIR) {
                return this.fallingOnePieceOfSand(cave, nextRow, col + 1);
            } else {
                // final position
                const caveItem = new CaveItem(MaterialType.SAND);
                caveItem.row = row;
                caveItem.col = col;
                return caveItem;
            }
        } else {
            return this.fallingOnePieceOfSand(cave, nextRow, col);
        }
    }


    createCaveFromData(data: Array<string>): Cave {
        let grid = this.fillGrid(200, 1000);
        let highestRock = null;
        data.forEach(instruction => {
            const instructionSplit = instruction.split('->')
            let previous: { row: number, col: number } = null;
            instructionSplit.forEach(direction => {
                const [col, row] = direction.trim().split(',').map(value => parseInt(value));
                if (previous) {
                    if (previous.row === row) {
                        for (let index = Math.min(previous.col, col); index <= Math.max(previous.col, col); index++) {
                            grid[row][index] = new CaveItem(MaterialType.ROCK, row, index);
                        }
                    } else {
                        for (let index = Math.min(row, previous.row); index <= Math.max(row, previous.row); index++) {
                            const newCaveItem = new CaveItem(MaterialType.ROCK, index, col);
                            // check if it's the highest rock
                            if (highestRock && newCaveItem.row > highestRock.row) {
                                highestRock = newCaveItem;
                            } else if (!highestRock) {
                                highestRock = newCaveItem;
                            }
                            grid[index][col] = newCaveItem;
                        }
                    }
                } else {
                    // continue;
                }
                previous = {row: row, col: col};
            })
        })

        return new Cave(grid, highestRock);

    }

    fillGrid(x: number, y: number): Array<Array<CaveItem>> {
        let grid = new Array<Array<CaveItem>>();
        for (let indexX = 0; indexX < x; indexX++) {
            for (let indexY = 0; indexY < y; indexY++) {
                if (!grid[indexX]) {
                    grid[indexX] = new Array<CaveItem>();
                }
                grid[indexX][indexY] = new CaveItem();
            }
        }
        return grid;
    }

    drawCave(cave: Cave): void {
        let map = '';
        cave.grid.forEach((row, index) => {
            let rowBuilder = '';
            row.forEach(item => {
                rowBuilder += DrawType[item.type];
            })
            map += rowBuilder;
            map += '\n';
        });


        fs.writeFileSync(
            `${__dirname}/map.visual`,
            map
        );
    }
}