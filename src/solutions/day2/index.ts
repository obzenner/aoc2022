import loadFile from "../../utils/loadFile"
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";

type STRATEGY = "X" | "Y" | "Z";
type PLAY = "A" | "B" | "C";

const SCORE_MAP = {
    "A": 1,
    "B": 2,
    "C": 3,
} as const;

const ROUND_SCORE_MAP = {
    "win": 6,
    "tie": 3,
    "loose": 0,
} as const;

const ELEMENT_MAP = {
    "X": "A", // rock
    "Y": "B", // paper
    "Z": "C", // scissors
} as const;

const WIN = {
    "AC": true,
    "BA": true,
    "CB": true,
} as const;

const LOOSE_STR = {
    "A": "C",
    "B": "A",
    "C": "B",
} as const;

const WIN_STR = {
    "A": "B",
    "B": "C",
    "C": "A",
} as const;

const STRATEGY_MAP = {
    "X": "loose",
    "Y": "tie",
    "Z": "win",
} as const;

const play = (opponent: PLAY, you: PLAY) => {
    let result: "win" | "tie" | "loose" = "tie";

    if (opponent === you) {
        result = 'tie'; 
    } else {
        const win = WIN[`${you}${opponent}` as keyof typeof WIN];
        result = win ? 'win' : 'loose';
    }

    const roundScore = ROUND_SCORE_MAP[result];
    const gameScore = SCORE_MAP[you];

    return gameScore + roundScore;
}

const playGame = (opp: PLAY, you: STRATEGY) => {
    const strategy = STRATEGY_MAP[you];
    let move;

    switch (strategy) {
        case "win":
            move = WIN_STR[opp as keyof typeof WIN_STR];
            break;
        case "loose":
            move = LOOSE_STR[opp as keyof typeof LOOSE_STR];
            break
        default:
            move = opp;
            break;
    }

    return play(opp, move as PLAY);        
}

export const day2 = async () => {
    const input = splitByEmptyLine(await loadFile('day2.txt'))
        .reduce((acc, round) => {
            const r = round.split(' ');
            acc.push(r);
            return acc;
        }, []) as Array<PLAY[]>

    const gameWithUnclearStrategy = input.reduce((acc: number, round: PLAY[]): number => {
        const [opponent, you] = round;
        const mapped = ELEMENT_MAP[you as keyof typeof ELEMENT_MAP] as PLAY;
        const score = play(opponent, mapped);
        acc += score;
        return acc;
    }, 0);

    const finalGame = input.reduce((acc, round) => {
        const [opponent, you] = round;
        const score = playGame(opponent, you as STRATEGY);
        acc += score;
        return acc;
    }, 0);

    return {
        part1: gameWithUnclearStrategy,
        part2: finalGame
    }
}