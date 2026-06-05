import {
  BadgeLibraryPreview,
  ButtonLibraryPreview,
  CardLibraryPreview,
  CardsBlockLibraryPreview,
  FigmaKpiCardLibraryPreview,
  InputLibraryPreview,
  PricingBlockLibraryPreview,
} from "@/components/library/library-previews";
import type {
  LibraryCatalogEntry,
  LibraryCatalogGroups,
  LibraryPreviewState,
} from "./types";

export const getDefaultPreviewState = (entry: LibraryCatalogEntry): LibraryPreviewState => {
  return Object.fromEntries(
    entry.variants.map((variant) => [variant.id, variant.defaultValue])
  );
};

export const libraryCatalogEntries: LibraryCatalogEntry[] = [
  {
    id: "button",
    title: "Button",
    description: "Primary actions, secondary actions, destructive actions, links, and icon sizing.",
    category: "Actions",
    group: "components",
    type: "component",
    sourcePath: "components/ui/button.tsx",
    installNotes: "Already available through the local shadcn source component.",
    Preview: ButtonLibraryPreview,
    variants: [
      {
        id: "variant",
        label: "Variant",
        defaultValue: "default",
        options: [
          { id: "default", label: "Default", value: "default" },
          { id: "secondary", label: "Secondary", value: "secondary" },
          { id: "outline", label: "Outline", value: "outline" },
          { id: "ghost", label: "Ghost", value: "ghost" },
          { id: "destructive", label: "Destructive", value: "destructive" },
        ],
      },
      {
        id: "size",
        label: "Size",
        defaultValue: "default",
        options: [
          { id: "xs", label: "XS", value: "xs" },
          { id: "sm", label: "Small", value: "sm" },
          { id: "default", label: "Default", value: "default" },
          { id: "lg", label: "Large", value: "lg" },
        ],
      },
    ],
  },
  {
    id: "badge",
    title: "Badge",
    description: "Compact labels for status, metadata, and contextual annotations.",
    category: "Data display",
    group: "components",
    type: "component",
    sourcePath: "components/ui/badge.tsx",
    Preview: BadgeLibraryPreview,
    variants: [
      {
        id: "variant",
        label: "Variant",
        defaultValue: "default",
        options: [
          { id: "default", label: "Default", value: "default" },
          { id: "secondary", label: "Secondary", value: "secondary" },
          { id: "outline", label: "Outline", value: "outline" },
          { id: "destructive", label: "Destructive", value: "destructive" },
        ],
      },
    ],
  },
  {
    id: "input",
    title: "Input",
    description: "Text input states using input, border, ring, destructive, and foreground tokens.",
    category: "Forms",
    group: "components",
    type: "component",
    sourcePath: "components/ui/input.tsx",
    Preview: InputLibraryPreview,
    variants: [
      {
        id: "status",
        label: "State",
        defaultValue: "default",
        options: [
          { id: "default", label: "Default", value: "default" },
          { id: "invalid", label: "Invalid", value: "invalid" },
          { id: "disabled", label: "Disabled", value: "disabled" },
        ],
      },
    ],
  },
  {
    id: "card",
    title: "Card",
    description: "Full card composition with header, content, action, footer, shadow, and radius tokens.",
    category: "Layout",
    group: "components",
    type: "component",
    sourcePath: "components/ui/card.tsx",
    Preview: CardLibraryPreview,
    variants: [
      {
        id: "size",
        label: "Size",
        defaultValue: "default",
        options: [
          { id: "default", label: "Default", value: "default" },
          { id: "sm", label: "Small", value: "sm" },
        ],
      },
    ],
  },
  {
    id: "cards-block",
    title: "Cards Block",
    description: "Existing Tweakcn card examples rendered as a seeded block entry.",
    category: "Examples",
    group: "blocks",
    type: "block",
    sourcePath: "components/examples/cards/index.tsx",
    installNotes: "Copy the example files under components/examples/cards and their local data needs.",
    Preview: CardsBlockLibraryPreview,
    variants: [],
  },
  {
    id: "pricing-block",
    title: "Pricing Block",
    description: "Existing pricing example rendered under the active token set.",
    category: "Examples",
    group: "blocks",
    type: "block",
    sourcePath: "components/examples/pricing/pricing.tsx",
    installNotes: "Copy the pricing example and keep its shadcn component imports aligned.",
    Preview: PricingBlockLibraryPreview,
    variants: [],
  },
  {
    id: "figma-kpi-card",
    title: "Figma KPI Card",
    description: "Manual Figma-derived custom component slot for design-system additions.",
    category: "Custom",
    group: "custom",
    type: "component",
    sourcePath: "components/library/custom/figma-kpi-card.tsx",
    installNotes: "Use this folder pattern for manually recreated Figma components.",
    figma: {
      mode: "manual",
      note: "V1 stores a reference only; conversion from Figma is manual.",
    },
    Preview: FigmaKpiCardLibraryPreview,
    variants: [
      {
        id: "tone",
        label: "Tone",
        defaultValue: "default",
        options: [
          { id: "default", label: "Default", value: "default" },
          { id: "muted", label: "Muted", value: "muted" },
          { id: "accent", label: "Accent", value: "accent" },
        ],
      },
    ],
  },
];

export const getLibraryCatalogEntry = (id: string) => {
  return libraryCatalogEntries.find((entry) => entry.id === id);
};

export const getLibraryCatalogGroups = (): LibraryCatalogGroups => {
  return {
    components: libraryCatalogEntries.filter((entry) => entry.group === "components"),
    blocks: libraryCatalogEntries.filter((entry) => entry.group === "blocks"),
    custom: libraryCatalogEntries.filter((entry) => entry.group === "custom"),
  };
};
