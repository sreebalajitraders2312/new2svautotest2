import type { Mode } from "@/data/types";

export const DEFAULT_MODE: Mode = "automobile";

const MODES: readonly Mode[] = ["automobile", "industrial"];

export function getModes(): Mode[] {
  return [...MODES];
}

export function isMode(value: unknown): value is Mode {
  return typeof value === "string" && MODES.includes(value as Mode);
}

export function getValidMode(value: unknown): Mode {
  return isMode(value) ? value : DEFAULT_MODE;
}

export function getModeFromPathname(pathname: string): Mode | null {
  const [firstSegment] = pathname.split("/").filter(Boolean);

  return isMode(firstSegment) ? firstSegment : null;
}

export function getModeFromSegments(segments: readonly string[]): Mode | null {
  const [firstSegment] = segments;

  return isMode(firstSegment) ? firstSegment : null;
}

export function getModeOrDefaultFromPathname(pathname: string): Mode {
  return getModeFromPathname(pathname) || DEFAULT_MODE;
}
