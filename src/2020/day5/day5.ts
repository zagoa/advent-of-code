export function day5part1(inputs: Array<string>) {
    return Math.max(...createIdsArray(inputs));
}

export function day5part2(inputs: Array<string>) {
    const mapOfIds = new Map()
    const idsArray = createIdsArray(inputs);
    const min = Math.min(...idsArray);
    const max = Math.max(...idsArray);
    idsArray.forEach(item => mapOfIds.set(item, 1));

    for(let index = min; index <=  max; index++){
        const itemGet = mapOfIds.get(index);
        if(!itemGet) {
            return index;
        }
    }

}


function createIdsArray(inputs: Array<string>): Array<number> {
    return inputs.map(input => {
        const rowCode: string = input.substring(0, 6);
        const rowSelectCode: string = input.substring(6, 7);
        const seatCode: string = input.substring(7, 9);
        const seatSelectCode: string = input.substring(9, 10);

        const row = findRow(rowCode, rowSelectCode, 0, 127);
        const seat = findSeat(seatCode, seatSelectCode, 0, 7);
        return row * 8 + seat;
    });
}

function findRow(rowCode: string, selectCode: string, min: number, max: number): number {
    Array.from(rowCode).forEach((rowOps) => {
        switch (rowOps) {
            case 'B':
                min = Math.ceil(max - ((max - min) / 2))
                break;
            case 'F':
                max = Math.floor((max - min) / 2 + (min))
                break;
            default:
                break;
        }
    });

    if (selectCode === 'F') {
        return Math.min(min, max);
    } else {
        return Math.max(min, max);
    }
}


function findSeat(seatCode: string, selectCode: string, min: number, max: number): number {
    Array.from(seatCode).forEach((rowOps: string) => {
        switch (rowOps) {
            case 'R':
                min = Math.ceil(max - ((max - min) / 2))
                break;
            case 'L':
                max = Math.floor((max - min) / 2 + (min))
                break;
            default:
                break;
        }
    });

    if (selectCode === 'L') {
        return Math.min(min, max);
    } else {
        return Math.max(min, max);
    }
}
