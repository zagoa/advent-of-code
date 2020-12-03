export function day3Part1(inputs: Array<string>) {
    return inputs.reduce((count: number, input: string, index: number) => {
        const charIndex: number = (index * 3) + 1;
        input = completeLine(charIndex, input);
        const char = input[charIndex - 1];
        if (char === '#' && index !== 0) {
            count++;
        }
        return count;
    }, 0)
}

export function day3Part2(inputs: Array<string>) {
    const arrayOfPatterns = [
        {x: 1, y: 1},
        {x: 3, y: 1},
        {x: 5, y: 1},
        {x: 7, y: 1},
        {x: 1, y: 2}
    ]

    return arrayOfPatterns
        .map((item) => {
            const partialRes = findTreesForOnePattern(inputs, item.x, item.y);
            console.info('day3Part2 -> partial result ', partialRes);
            return partialRes;
        })
        .reduce((previous, item) => item * previous);
}


function findTreesForOnePattern(inputs: Array<string>, x: number, y: number) {
    return inputs.reduce((count: number, input: string, index: number) => {
        if (y === 1 || (y > 1 && index % y === 0)) {
            const charIndex: number = index * x;
            input = completeLine(charIndex, input);
            const char = input[charIndex / y];
            if (char === '#') {
                count++;
            }
        }
        return count;
    }, 0)
}

function completeLine(charIndex: number, line: string): string {
    while (charIndex > line.length - 1) {
        line += line;
    }
    return line;
}
