export type PipeComponent = {
  id: string;
  provider: string;
  input?: Array<{ lane?: string; from: string }>;
  control?: Array<{ classType?: string; from: string }>;
  ui?: {
    position: { x: number; y: number };
    measured?: { width: number; height: number };
    nodeType?: string;
  };
};

export type PipeDefinition = {
  components: PipeComponent[];
  viewport?: { x: number; y: number; zoom: number };
  version?: number;
};

export type PipeEdge = { from: string; to: string };

export type LayoutNode = {
  id: string;
  provider: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const DEFAULT_W = 150;
const DEFAULT_H = 66;

export function extractEdges(components: PipeComponent[]): PipeEdge[] {
  const edges: PipeEdge[] = [];
  for (const c of components) {
    if (c.input) {
      for (const i of c.input) {
        edges.push({ from: i.from, to: c.id });
      }
    }
    if (c.control) {
      for (const ctl of c.control) {
        edges.push({ from: ctl.from, to: c.id });
      }
    }
  }
  return edges;
}

export function buildLayoutNodes(components: PipeComponent[]): LayoutNode[] {
  return components.map((c) => {
    const x = c.ui?.position.x ?? 0;
    const y = c.ui?.position.y ?? 0;
    const width = c.ui?.measured?.width ?? DEFAULT_W;
    const height = c.ui?.measured?.height ?? DEFAULT_H;
    return {
      id: c.id,
      provider: c.provider,
      x,
      y,
      width,
      height,
    };
  });
}

export function getGraphBounds(
  nodes: LayoutNode[],
  padding: number,
): { width: number; height: number; padding: number } {
  let maxX = 0;
  let maxY = 0;
  for (const n of nodes) {
    maxX = Math.max(maxX, n.x + n.width);
    maxY = Math.max(maxY, n.y + n.height);
  }
  return {
    width: maxX + padding * 2,
    height: maxY + padding * 2,
    padding,
  };
}

export function anchorRightCenter(n: LayoutNode, offset: number): { x: number; y: number } {
  return { x: n.x + n.width + offset, y: n.y + n.height / 2 + offset };
}

export function anchorLeftCenter(n: LayoutNode, offset: number): { x: number; y: number } {
  return { x: n.x + offset, y: n.y + n.height / 2 + offset };
}

export function anchorBottomCenter(n: LayoutNode, offset: number): { x: number; y: number } {
  return { x: n.x + n.width / 2 + offset, y: n.y + n.height + offset };
}

export function anchorTopCenter(n: LayoutNode, offset: number): { x: number; y: number } {
  return { x: n.x + n.width / 2 + offset, y: n.y + offset };
}

export type EdgeRoute = "horizontal" | "vertical-down" | "vertical-up";

/** Cubic bezier from exit point to entry point (smooth “canvas” wires). */
export function edgePath(from: LayoutNode, to: LayoutNode, pad: number, route: EdgeRoute): string {
  if (route === "horizontal") {
    const s = anchorRightCenter(from, pad);
    const e = anchorLeftCenter(to, pad);
    const mid = (s.x + e.x) / 2;
    return `M ${s.x} ${s.y} C ${mid} ${s.y}, ${mid} ${e.y}, ${e.x} ${e.y}`;
  }
  if (route === "vertical-down") {
    const s = anchorBottomCenter(from, pad);
    const e = anchorTopCenter(to, pad);
    const mid = (s.y + e.y) / 2;
    return `M ${s.x} ${s.y} C ${s.x} ${mid}, ${e.x} ${mid}, ${e.x} ${e.y}`;
  }
  const s = anchorTopCenter(from, pad);
  const e = anchorBottomCenter(to, pad);
  const mid = (s.y + e.y) / 2;
  return `M ${s.x} ${s.y} C ${s.x} ${mid}, ${e.x} ${mid}, ${e.x} ${e.y}`;
}

export function pickEdgeRoute(from: LayoutNode, to: LayoutNode): EdgeRoute {
  const fromBottom = from.y + from.height;
  const toBottom = to.y + to.height;
  const fromMidY = from.y + from.height / 2;
  const toMidY = to.y + to.height / 2;

  if (toBottom < from.y - 2) return "vertical-up";
  if (to.y > fromBottom + 2) return "vertical-down";

  const fromRight = from.x + from.width;
  const mostlyRight = to.x >= fromRight - 24;
  const rowAligned = Math.abs(toMidY - fromMidY) <= Math.max(from.height, to.height) * 0.85;
  if (mostlyRight && rowAligned) return "horizontal";

  if (to.x + to.width < from.x - 8) return "horizontal";

  return Math.abs(toMidY - fromMidY) > Math.abs(to.x + to.width / 2 - (from.x + from.width / 2)) * 0.35
    ? toMidY >= fromMidY
      ? "vertical-down"
      : "vertical-up"
    : "horizontal";
}
