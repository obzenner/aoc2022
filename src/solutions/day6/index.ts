import loadFile from "../../utils/loadFile";

const processDataScream = (input: string, limit = 4) => {
    const temp = new Set();

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const hasChar = temp.has(char);

        if (hasChar) {
            i = i - temp.size; // reset i
            temp.clear();
        } else {
            temp.add(char);

            if (temp.size === limit) {
                return i + 1;
            }
        }
    }
}

export const day6 = async () => {
    const input = await loadFile('day6.txt');

    return {
        part1: processDataScream(input),
        part2: processDataScream(input, 14)
    }
}