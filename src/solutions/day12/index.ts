import loadFile from "../../utils/loadFile";
import { splitByEmptyLine } from "../../utils/splitByEmptyLine";

const weightsAlpha: Record<string, number> = {
  S: 1,
  E: 27,
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

      if (nh1) {
        const nh1Weight = weightsAlpha[nh1];
        graph[currKey] = Object.assign(currNodes, {
          [nh1Key]: Math.abs(nh1Weight),
        });
      }

      if (nh2) {
        const nh2Weight = weightsAlpha[nh2];
        graph[currKey] = Object.assign(currNodes, {
          [nh2Key]: Math.abs(nh2Weight),
        });
      }

      if (nv1) {
        const nv1Weight = weightsAlpha[nv1];
        graph[currKey] = Object.assign(currNodes, {
          [nv1Key]: Math.abs(nv1Weight),
        });
      }

      if (nv2) {
        const nv2Weight = weightsAlpha[nv2];
        graph[currKey] = Object.assign(currNodes, {
          [nv2Key]: Math.abs(nv2Weight),
        });
      }
    }
  }

  return graph;
}

const bfsNodes = (graph: Record<string, Record<string, number>>, startNode: string, endNode: string) => {
  const nodes: Record<string, string> = {};
  nodes[startNode] = null;
  const visited: Set<string> = new Set();
  const queue = [startNode];

  while (queue.length > 0) {
    const currNode = queue.shift();
    const currNodeNeighbors = graph[currNode];
    const currWeight = weightsAlpha[currNode[0]];
    
    const destinations = Object.keys(currNodeNeighbors)
    .filter(k => currNodeNeighbors[k] <= currWeight + 1);
    
    for (const d of destinations) {
      if (!visited.has(d)) {
        visited.add(d);
        // eslint-disable-next-line no-prototype-builtins
        if (!nodes.hasOwnProperty(d)) {
          nodes[d] = currNode;
        }
        queue.push(d);
      }
      
      console.log(d, currNode);
      if (d === endNode) {
        return nodes;
      }
    }
  }

  return nodes;
}

export const day12 = async () => {
  const input = splitByEmptyLine(await loadFile('day12.txt'));

  const graph = buildGraph(input);
  const startNode = Object.keys(graph).find(k => k.includes('S'));
  const endNode = Object.keys(graph).find(k => k.includes('E'));

  // console.log(graph)
  const nodes = bfsNodes(graph, startNode, endNode);
	const steps = [];
	let node = endNode;

	while (nodes[node]) {
		steps.push(node);
		node = nodes[node];
	}

  return {
    part1: steps.length,
    part2: 2
  }
}