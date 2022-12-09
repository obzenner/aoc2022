import loadFile from "../../utils/loadFile";


// solution taken from https://github.com/caderek/aoc2022/blob/main/src/day07/index.ts

type Command = {
    type: "command"
    command: "cd" | "ls"
    arg?: string
}

type File = {
    type: "file"
    size: number
    name: string
}

type Dir = {
    type: "dir"
    size: null
    name: string
}

type Entries = (Command | File | Dir)[]

type Disk = {
    [key: string]: Disk | number
}

const recreateDisk = (entries: Entries) => {
    const disk: Disk = {}
    const path: string[] = []

    const createFileOrDir = (name: string, val: number | Disk = {}) => {
        let cwd = disk

        path.forEach((step) => {
            if (cwd[step] === undefined) {
                cwd[step] = {} as Disk
            }
            cwd = cwd[step] as Disk
        })

        cwd[name] = val
    }

    for (const entry of entries) {
        switch (entry.type) {
            case "command": {
                switch (entry.command) {
                    case "ls":
                        break
                    case "cd":
                        if (entry.arg === "..") {
                            path.pop()
                        } else if (entry.arg === "/") {
                            path.length = 0
                        } else {
                            path.push(entry.arg as string)
                        }
                        break
                }
                break
            }

            case "dir": {
                createFileOrDir(entry.name)
                break
            }

            case "file": {
                createFileOrDir(entry.name, entry.size)
                break
            }
        }
    }

    return disk
}

const parseInput = (rawInput: string) => {
    const entries = rawInput.split("\n").map((line) => {
        if (line.startsWith("$")) {
            const [command, arg] = line.split(" ").slice(1)
            return { type: "command", command, arg } as Command
        }

        const [dirOrSize, name] = line.split(" ")

        if (dirOrSize === "dir") {
            return {
                type: "dir",
                name,
            } as Dir
        }

        return {
            type: "file",
            size: Number(dirOrSize),
            name,
        } as File
    })

    return recreateDisk(entries)
}

const getDirSizes = (rawInput: string) => {
    const input = parseInput(rawInput)
    const dirSizes: number[] = []

    const recur = (disk: Disk) => {
        let size = 0

        for (const [key, val] of Object.entries(disk)) {
            size += typeof val === "number" ? val : recur(val)
        }

        dirSizes.push(size)
        return size
    }

    recur(input)
    return dirSizes
}

const part1 = (rawInput: string) => {
    return getDirSizes(rawInput)
        .filter((size) => size <= 100000)
        .reduce((a, b) => a + b, 0)
}

const part2 = (rawInput: string) => {
    const dirSizes = getDirSizes(rawInput).sort((a, b) => a - b)
    const free = 70_000_000 - (dirSizes.at(-1) ?? 0)
    const required = 30_000_000 - free

    return dirSizes.find((size) => size >= required)
}

export const day7 = async () => {

    return {
        part1: part1(await loadFile('day7.txt')),
        part2: part2(await loadFile('day7.txt'))
    }
}