import loadFile from "../../utils/loadFile";
import { quickSort } from "../../utils/quickSort";
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";

const inReverse = (arr: number[], height: number) => {
    let result = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
        const tree = arr[i];
        if (tree < height) {
            result++;
        } else if (tree >= height) {
            result++;
            break;
        }
    }

    return result;
}

const inOrder = (arr: number[], height: number) => {
    let result = 0;
    for (let i = 0; i < arr.length; i++) {
        const tree = arr[i];
        if (tree < height) {
            result++;
        } else if (tree >= height) {
            result++;
            break;
        }
    }

    return result;
}

export const day8 = async () => {
    const input = splitByEmptyLine(await loadFile('day8.txt'));

    const result = input.reduce((acc, curr, index) => {
        if (index === 0 || index === input.length - 1) {
            acc.trees = acc.trees + curr.length; // upper lower edge trees
        } else {
            for (let i = 1; i < curr.length - 1; i++) {
                const innerTree = parseInt(curr[i]);
                const vertical = input.reduce((a, tr) => {                  
                    a.push(Number(tr[i]));
                    return a;
                }, []);

                const left = curr.slice(0, i).split('').map(Number);
                const right = curr.slice(i + 1, curr.length).split('').map(Number);
                const top = vertical.slice(0, index);
                const bottom = vertical.slice(index + 1, vertical.length);

                const leftScore = inReverse(left, innerTree);
                const rightScore = inOrder(right, innerTree);
                const topScore = inReverse(top, innerTree);
                const bottomScore = inOrder(bottom, innerTree);
            
                const score = leftScore * rightScore * topScore * bottomScore;
                acc.scenicScore.add(score);

                const isVisibleLeft = !left.some((t: number) => innerTree <= t);
                const isVisibleRight = !right.some((t: number) => innerTree <= t);
                const isVisibleTop = !top.some((t: number) => innerTree <= t);
                const isVisibleBottom = !bottom.some((t: number) => innerTree <= t);

                const isVisible = isVisibleLeft || isVisibleRight || isVisibleTop || isVisibleBottom;

                if (isVisible) {
                    acc.trees = acc.trees + 1;
                }
            }

            acc.trees = acc.trees + 2; // edge trees
        }

        return acc;
    }, { trees: 0, scenicScore: new Set<number>() })
    
    const sortedScores = quickSort([...result.scenicScore.values()]);

    return {
        part1: result.trees,
        part2: sortedScores[sortedScores.length - 1]
    }
}