export function day7part1(inputs: Array<string>) {
    const mapOfBags = new Map<string, number>();
    inputs.forEach((input) => {
        const inputSplit = input.split('contain');
        const bagColors = inputSplit[0].split('bags')[0];
        if (inputSplit[1].includes('shiny gold')) {
            if (mapOfBags.has(bagColors)) {
                mapOfBags.set(bagColors, mapOfBags.get(bagColors) + 1);
            } else {
                mapOfBags.set(bagColors, 1);
            }
        }
    })

    return mapOfBags.size;
}
