"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { Mode } from "@/data/types";
import {
  DEFAULT_MODE,
  getModeFromPathname,
  getValidMode,
} from "@/lib/modeUtils";

interface ModeContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [selectedMode, setSelectedMode] = useState<Mode>(DEFAULT_MODE);
  const routeMode = getModeFromPathname(pathname);
  const mode = routeMode || selectedMode;

  const value = useMemo<ModeContextValue>(
    () => ({
      mode,
      setMode: (nextMode) => setSelectedMode(getValidMode(nextMode)),
    }),
    [mode],
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const context = useContext(ModeContext);

  if (!context) {
    throw new Error("useMode must be used within ModeProvider");
  }

  return context;
}
