import loadFile from "../../utils/loadFile";
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";

const lowercase: string[] = Array.from(Array(26)).map((e, i) => i + 97).map(x => String.fromCharCode(x))

type Point = [number, number]
type Matrix<T> = T[][]
type ElevMap = Matrix<number>

function parseMap(input: string[]): [Point, Point, Point, ElevMap] {
  let start: Point = [0, 0]
  let target: Point = [0, 0]
  const chartDim: Point = [input.length, input[0].length]
  const elevMap: ElevMap = Array(chartDim[0]).fill(0).map(_ => new Array(chartDim[1]))
  input.forEach((row, x) => {
    row.split('').forEach((square, y) => {
      if (square === 'S') {
        start = [x, y]
        elevMap[x][y] = lowercase.indexOf('a')
      } else if (square === 'E') {
        target = [x, y]
        elevMap[x][y] = lowercase.indexOf('z')
      } else {
        elevMap[x][y] = lowercase.indexOf(square)
      }
    })
  })
  return [start, target, chartDim, elevMap]
}

function getNeighbors([x, y]: Point, chartDim: Point): Point[] {
  const offsets: Point[] = [[-1, 0], [1, 0], [0, 1], [0, -1]]
  const points: Point[] = offsets.map(([dx, dy]) => [x + dx, y + dy])
  return points.filter(point => point.every(x => x >= 0) && point[0] < chartDim[0] && point[1] < chartDim[1])
}

function part1(input: string[]): (string | number) {
  const [start, end, charDim, elevMap] = parseMap(input)
  let queue: [Point, number][] = [[start, 0]]
  const visited: Set<string> = new Set()
  while (queue.length) {
    const [currentPoint, steps] = queue.shift()!
    if (visited.has(currentPoint.toString())) {
      continue;
    }
    visited.add(currentPoint.toString())
    if (currentPoint.toString() === end.toString()) {
      return steps
    }
    // just if current point isn't the tartet add to queue all possible next steps.
    // do it as long as you hit the target
    const neighbors: Point[] = getNeighbors(currentPoint, charDim)
    const possibleValues: Point[] = neighbors.filter(point => elevMap[point[0]][point[1]] <= elevMap[currentPoint[0]][currentPoint[1]] + 1)
    queue = queue.concat(possibleValues.map(point => [point, steps + 1]))
  }
  return 'Shortest path not found'
}

// find shortest path from any point with elevation 'a' (0)
// so in reverse, we can find shortest path from end to first 'a'
function part2(input: string[]): (string | number) {
  const [start, end, charDim, elevMap] = parseMap(input)
  let queue: [Point, number][] = [[end, 0]]
  const visited: Set<string> = new Set()

  while (queue.length) {
    const [currentPoint, steps] = queue.shift()!
    if (visited.has(currentPoint.toString())) {
      continue
    }
    visited.add(currentPoint.toString())
    if (elevMap[currentPoint[0]][currentPoint[1]] === 0) {
      return steps
    }
    const neighbors: Point[] = getNeighbors(currentPoint, charDim)
    const possibleValues: Point[] = neighbors.filter(point => elevMap[point[0]][point[1]] >= elevMap[currentPoint[0]][currentPoint[1]] - 1)
    queue = queue.concat(possibleValues.map(point => [point, steps + 1]))
  }
  return 'Shortest path not found'
}


export const day12 = async () => {
  const input = splitByEmptyLine(await loadFile('day12.txt'));

  return {
    part1: part1(input),
    part2: part2(input)
  }
}