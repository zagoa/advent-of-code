import {parseListString} from "../../utils/parse-input";

function generateNormalizedId(data: string, rowIndex: number, colIndex: number) {
    return data === 'E' ? SquareWithInterest.END : (data === 'S' ? SquareWithInterest.START : rowIndex + '-' + colIndex);
}

class Square {
    neighboursIds: Array<string> = new Array<string>();
    value: string;
    neighboursIdsOfStepOne: Array<string> = new Array<string>();
    rowIndex: number;
    colIndex: number;
    id: string;

    constructor(value: string, rowIndex: number, colIndex: number) {
        this.value = value;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.id = generateNormalizedId(value, rowIndex, colIndex);
    }

}

enum SquareWithInterest {
    END = 'END',
    START = 'START'
}


export default class Day12 {


    constructor() {
        this.get_shortest_path()
    }

    get_shortest_path() {
        const data = parseListString(`${__dirname}/DAY_12_INPUTS`);
        //const data = parseListString(`${__dirname}/UNIT_TEST_DATA`);
        const squares: Map<string, Square> = this.preProcess(data);
        const start = squares.get(SquareWithInterest.START);

        let paths = this.recursivelyGetPath(start, new Set<string>(), squares, []);

        const shortest = paths.sort((a, b) => a.size - b.size)[0]
        this.visualizePath(data, shortest, squares);
        console.log('Day 12 => shortest path length', shortest);
    }

    recursivelyGetPath(square: Square, path: Set<string>, allSquares: Map<string, Square>, allPaths: Array<Set<string>>): Array<Set<string>> {
        path.add(square.id);
        for (let i = 0; i < square.neighboursIdsOfStepOne.length; i++) {
            let squareNeighbourId = square.neighboursIdsOfStepOne[i];
            if (!path.has(squareNeighbourId)) {
                const nextSquare = allSquares.get(squareNeighbourId);
                if (nextSquare.id === SquareWithInterest.END) {
                    allPaths.push(path)
                    return allPaths;
                } else {
                    this.recursivelyGetPath(nextSquare, new Set<string>([...path]), allSquares, allPaths);
                }
            }
        }
        return allPaths;
    }

    preProcess(data: Array<string>): Map<string, Square> {
        const squares = new Map<string, Square>();
        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            for (let colIndex = 0; colIndex < data[rowIndex].length; colIndex++) {
                const currentSquare = data[rowIndex][colIndex];
                const squareObject = new Square(currentSquare, rowIndex, colIndex);
                const neighbours = [
                    this.getIdDefined(data, rowIndex + 1, colIndex),
                    this.getIdDefined(data, rowIndex - 1, colIndex),
                    this.getIdDefined(data, rowIndex, colIndex + 1),
                    this.getIdDefined(data, rowIndex, colIndex - 1),
                ].filter(item => item);
                squareObject.neighboursIds = [...neighbours] ?? [];
                squares.set(squareObject.id, squareObject);
            }
        }

        squares.forEach(squareObject => {
            squareObject.neighboursIdsOfStepOne = squareObject.neighboursIds.filter(item => {
                return this.canAccessSquare(squareObject.value, squares.get(item).value)
            });
        })


        return squares;

    }

    getIdDefined(data, rowIndex, colIndex) {
        if (data[rowIndex] && data[rowIndex][colIndex]) {
            return generateNormalizedId(data[rowIndex][colIndex], rowIndex, colIndex);
        } else {
            return undefined;
        }
    }

    private visualizePath(data: Array<string>, path: Set<string>, mapOfIds: Map<string, Square>) {
        const dataCopy = Object.assign([], [...data]);
        path.forEach((id, index) => {
            const square = mapOfIds.get(id);
            dataCopy[square.rowIndex] = dataCopy[square.rowIndex].substring(0, square.colIndex) + '@' + dataCopy[square.rowIndex].substring(square.colIndex + 1);

            console.log('\n')
            dataCopy.forEach(line => {
                console.log(line)
            })

        })


    }

    private canAccessSquare(from: string, to: string) {
        if (to === 'S' || from === 'S') {
            return true;
        } else if (to == 'E') {
            return 'z'.charCodeAt(0) <= from.charCodeAt(0) + 1 && Math.abs('z'.charCodeAt(0) - from.charCodeAt(0)) <= 1
        } else return to.charCodeAt(0) <= from.charCodeAt(0) + 1 && Math.abs(to.charCodeAt(0) - from.charCodeAt(0)) <= 1;
    }
}
