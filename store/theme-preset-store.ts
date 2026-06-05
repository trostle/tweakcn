import { create } from "zustand";
import { ThemePreset } from "@/types/theme";
import { defaultPresets } from "@/utils/theme-presets";
import { getThemes } from "@/actions/themes";

const LOCAL_THEME_PRESET_PREFIX = "local-";
const LOCAL_THEME_PRESETS_STORAGE_KEY = "tweakcn-local-theme-presets";

function getLocalThemePresets(): Record<string, ThemePreset> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(LOCAL_THEME_PRESETS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ThemePreset>;

    return Object.fromEntries(
      Object.entries(parsed).filter(([id]) => id.startsWith(LOCAL_THEME_PRESET_PREFIX))
    );
  } catch (error) {
    console.error("Failed to load local theme presets:", error);
    return {};
  }
}

function persistLocalThemePresets(presets: Record<string, ThemePreset>) {
  if (typeof window === "undefined") return;

  const localPresets = Object.fromEntries(
    Object.entries(presets).filter(([id]) => id.startsWith(LOCAL_THEME_PRESET_PREFIX))
  );

  try {
    window.localStorage.setItem(LOCAL_THEME_PRESETS_STORAGE_KEY, JSON.stringify(localPresets));
  } catch (error) {
    console.error("Failed to persist local theme presets:", error);
  }
}

interface ThemePresetStore {
  presets: Record<string, ThemePreset>;
  registerPreset: (name: string, preset: ThemePreset) => void;
  unregisterPreset: (name: string) => void;
  updatePreset: (name: string, preset: ThemePreset) => void;
  getPreset: (name: string) => ThemePreset | undefined;
  getAllPresets: () => Record<string, ThemePreset>;
  loadSavedPresets: () => Promise<void>;
  unloadSavedPresets: () => void;
}

export const useThemePresetStore = create<ThemePresetStore>()((set, get) => ({
  presets: {
    ...defaultPresets,
    ...getLocalThemePresets(),
  },
  registerPreset: (name: string, preset: ThemePreset) => {
    set((state) => {
      const presets = {
        ...state.presets,
        [name]: preset,
      };

      persistLocalThemePresets(presets);

      return {
        presets,
      };
    });
  },
  unregisterPreset: (name: string) => {
    set((state) => {
      const { [name]: _, ...remainingPresets } = state.presets;

      persistLocalThemePresets(remainingPresets);

      return {
        presets: remainingPresets,
      };
    });
  },
  loadSavedPresets: async () => {
    try {
      const savedThemes = await getThemes();
      const savedPresets = savedThemes.reduce(
        (acc, theme) => {
          acc[theme.id] = {
            label: theme.name,
            styles: theme.styles,
            source: "SAVED",
          };
          return acc;
        },
        {} as Record<string, ThemePreset>
      );

      set((state) => ({
        presets: {
          ...state.presets,
          ...savedPresets,
        },
      }));
    } catch (error) {
      console.error("Failed to load saved presets:", error);
    }
  },
  unloadSavedPresets: () => {
    set({
      presets: {
        ...defaultPresets,
        ...getLocalThemePresets(),
      },
    });
  },
  updatePreset: (name: string, preset: ThemePreset) => {
    set((state) => {
      const presets = {
        ...state.presets,
        [name]: preset,
      };

      persistLocalThemePresets(presets);

      return {
        presets,
      };
    });
  },
  getPreset: (name: string) => {
    return get().presets[name];
  },
  getAllPresets: () => {
    return get().presets;
  },
}));
