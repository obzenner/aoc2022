import loadFile from "../../utils/loadFile";
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";

const weightsAlpha: Record<string, number> = {
  S: 0,
  E: 0,
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10,
  k: 11,
  l: 12,
  m: 13,
  n: 14,
  o: 15,
  p: 16,
  q: 17,
  r: 18,
  s: 19,
  t: 20,
  u: 21,
  v: 22,
  w: 23,
  x: 24,
  y: 25,
  z: 26
} as const;

const walk = (graph: Record<string, Record<string, number>>, start: string, end: string) => {
  const visited: Record<string, boolean> = {};
  const queue = [start];
  const distances: Record<string, number> = {};
  distances[start] = 0;

  while (queue.length > 0) {
    const current = queue.shift();
    const currentDistance = distances[current];

    if (current === end) {
      return {
        distance: currentDistance,
        path: Object.keys(distances)
      };
    }

    if (visited[current]) {
      continue;
    }

    visited[current] = true;

    const neighbors = graph[current];
    for (const neighbor in neighbors) {
      const distance = neighbors[neighbor];
      const newDistance = currentDistance + distance;

      if (!distances[neighbor] || newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        queue.push(neighbor);
      }
    }
  }
}


const buildGraph = (input: string[]) => {
  const graph: Record<string, Record<string, number>> = {};

  for (let i = 0; i < input.length; i++) {
    const xEls = input[i];

    for (let j = 0; j < xEls.length; j++) {
      const currentEl = xEls[j];
      const nh1 = xEls[j + 1];
      const nh2 = xEls[j - 1];
      const nv1 = input[i - 1] ? input[i - 1][j] : null;
      const nv2 = input[i + 1] ? input[i + 1][j] : null;

      const currKey = `${currentEl}-${i}-${j}`;
      const nh1Key = `${nh1}-${i}-${j + 1}`;
      const nh2Key = `${nh2}-${i}-${j - 1}`;
      const nv1Key = `${nv1}-${i - 1}-${j}`;
      const nv2Key = `${nv2}-${i + 1}-${j}`;

      const currNodes = {};

      const currWeight = weightsAlpha[currentEl];
      if (nh1) {
        const nh1Weight = weightsAlpha[nh1];
        graph[currKey] = Object.assign(currNodes, {
          [nh1Key]: Math.abs(nh1Weight - currWeight),
        });
      }

      if (nh2) {
        const nh2Weight = weightsAlpha[nh2];
        graph[currKey] = Object.assign(currNodes, {
          [nh2Key]: Math.abs(nh2Weight - currWeight),
        });
      }

      if (nv1) {
        const nv1Weight = weightsAlpha[nv1];
        graph[currKey] = Object.assign(currNodes, {
          [nv1Key]: Math.abs(nv1Weight - currWeight),
        });
      }

      if (nv2) {
        const nv2Weight = weightsAlpha[nv2];
        graph[currKey] = Object.assign(currNodes, {
          [nv2Key]: Math.abs(nv2Weight - currWeight),
        });
      }
    }
  }

  return graph;
}

export const day12 = async () => {
  const input = splitByEmptyLine(await loadFile('day12.txt'));

  const graph = buildGraph(input);
  const findEndNode = Object.keys(graph).find(k => k.includes('E'));
  console.log(graph)

  const res = walk(graph, 'S-0-0', 'E-20-146');
  console.log(res)

  return {
    part1: 1,
    part2: 2
  }
}