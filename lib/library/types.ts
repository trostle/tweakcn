import type React from "react";

export type LibraryCatalogEntryType = "component" | "block";
export type LibraryCatalogGroup = "components" | "blocks" | "custom";

export interface LibraryVariantOption {
  id: string;
  label: string;
  value: string;
}

export interface LibraryVariantControl {
  id: string;
  label: string;
  defaultValue: string;
  options: LibraryVariantOption[];
}

export type LibraryPreviewState = Record<string, string>;

export interface LibraryPreviewProps {
  state: LibraryPreviewState;
}

export interface LibraryCatalogEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  group: LibraryCatalogGroup;
  type: LibraryCatalogEntryType;
  sourcePath: string;
  installNotes?: string;
  figma?: {
    mode: "manual";
    url?: string;
    note: string;
  };
  variants: LibraryVariantControl[];
  Preview: React.ComponentType<LibraryPreviewProps>;
}

export type LibraryCatalogGroups = Record<LibraryCatalogGroup, LibraryCatalogEntry[]>;
