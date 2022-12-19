const printTable = (table: {
  [x: string]: {
      vertex: string;
      cost: number;
  };
}) => {
  return Object.keys(table)
    .map((vertex) => {
      const { vertex: from, cost } = table[vertex];
      return `${vertex}: ${cost} via ${from}`;
    })
    .join("\n");
};

const tracePath = (table: {
  [x: string]: {
      vertex: string;
      cost: number;
  };
}, start: string, end: string) => {
  const path = [];
  let next = end;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    path.unshift(next);
    if (next === start) {
      break;
    }
    next = table[next].vertex;
  }

  return path;
};

const formatGraph = (g: Record<string, Record<string, number>>) => {
  const tmp: Record<string, Array<{vertex: string; cost: number}>> = {};
  Object.keys(g).forEach((k) => {
    const obj = g[k];
    const arr: Array<{vertex: string; cost: number}> = [];
    Object.keys(obj)
      .forEach((v) => arr.push({ vertex: v, cost: obj[v] }));
    tmp[k] = arr;
  });
  return tmp;
};

export const dijkstra = (graph: Record<string, Record<string, number>>, start: string, end: string) => {
  const map = formatGraph(graph);
  console.log(map)

  const visited: Set<string> = new Set();
  const unvisited = [start];
  const shortestDistances = { [start]: { vertex: start, cost: 0 } };

  let vertex;
  while ((vertex = unvisited.shift())) {
    // Explore unvisited neighbors
    const neighbors = map[vertex].filter((n) => !visited.has(n.vertex));

    // Add neighbors to the unvisited list
    unvisited.push(...neighbors.map((n) => n.vertex));

    const costToVertex = shortestDistances[vertex].cost;

    for (const { vertex: to, cost } of neighbors) {
      const currCostToNeighbor =
        shortestDistances[to] && shortestDistances[to].cost;
      const newCostToNeighbor = costToVertex + cost;

      if (
        currCostToNeighbor == undefined ||
        newCostToNeighbor < currCostToNeighbor
      ) {
        // Update the table
        shortestDistances[to] = { vertex, cost: newCostToNeighbor };
      }
    }

    visited.add(vertex);
  }

  console.log("Table of costs:");
  console.log(printTable(shortestDistances));

  const path = tracePath(shortestDistances, start, end);

  console.log(
    "Shortest path is: ",
    path.join(" -> "),
    " with weight ",
    shortestDistances[end].cost
  );
};