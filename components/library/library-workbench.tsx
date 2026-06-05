"use client";

import { CodeBlock } from "@/components/ai-elements/code-block";
import InspectorOverlay from "@/components/editor/inspector-overlay";
import ThemePresetSelect from "@/components/editor/theme-preset-select";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useThemeInspector } from "@/hooks/use-theme-inspector";
import {
  getDefaultPreviewState,
  getLibraryCatalogEntry,
  getLibraryCatalogGroups,
  libraryCatalogEntries,
} from "@/lib/library/catalog";
import type {
  LibraryCatalogEntry,
  LibraryCatalogGroup,
  LibraryPreviewState,
} from "@/lib/library/types";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { usePreferencesStore } from "@/store/preferences-store";
import { generateThemeCode } from "@/utils/theme-style-generator";
import {
  Check,
  Code2,
  Copy,
  ExternalLink,
  FileCode2,
  Inspect,
  Layers3,
  Package,
  Search,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const groupLabels: Record<LibraryCatalogGroup, string> = {
  components: "Components",
  blocks: "Blocks",
  custom: "Custom",
};

const getInitialEntry = () => libraryCatalogEntries[0];

function getEntriesForGroup(group: LibraryCatalogGroup, query: string) {
  const groups = getLibraryCatalogGroups();
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return groups[group];
  }

  return groups[group].filter((entry) => {
    return [entry.title, entry.description, entry.category, entry.sourcePath]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });
}

function usePreviewState(entry: LibraryCatalogEntry) {
  const [previewState, setPreviewState] = React.useState<LibraryPreviewState>(
    getDefaultPreviewState(entry)
  );

  React.useEffect(() => {
    setPreviewState(getDefaultPreviewState(entry));
  }, [entry]);

  const updatePreviewState = React.useCallback((key: string, value: string) => {
    setPreviewState((current) => ({ ...current, [key]: value }));
  }, []);

  return { previewState, updatePreviewState };
}

export function LibraryWorkbench() {
  const initialEntry = getInitialEntry();
  const [activeGroup, setActiveGroup] = React.useState<LibraryCatalogGroup>(
    initialEntry.group
  );
  const [selectedEntryId, setSelectedEntryId] = React.useState(initialEntry.id);
  const [query, setQuery] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);

  const themeState = useEditorStore((state) => state.themeState);
  const colorFormat = usePreferencesStore((state) => state.colorFormat);
  const tailwindVersion = usePreferencesStore((state) => state.tailwindVersion);

  const selectedEntry =
    getLibraryCatalogEntry(selectedEntryId) ?? getInitialEntry();
  const { previewState, updatePreviewState } = usePreviewState(selectedEntry);
  const Preview = selectedEntry.Preview;
  const themeCode = React.useMemo(
    () => generateThemeCode(themeState, colorFormat, tailwindVersion),
    [themeState, colorFormat, tailwindVersion]
  );

  const {
    rootRef,
    inspector,
    inspectorEnabled,
    handleMouseMove,
    handleMouseLeave,
    toggleInspector,
  } = useThemeInspector();

  const handleGroupChange = (group: string) => {
    const nextGroup = group as LibraryCatalogGroup;
    const nextEntries = getEntriesForGroup(nextGroup, query);
    setActiveGroup(nextGroup);
    if (nextEntries[0]) {
      setSelectedEntryId(nextEntries[0].id);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-background flex h-dvh min-h-0 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-muted flex size-8 items-center justify-center rounded-full">
            <Layers3 />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-medium">Library Workbench</h1>
            <p className="text-muted-foreground truncate text-xs">
              Token-aware components, blocks, and custom Figma-derived entries
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden w-72 md:block">
            <ThemePresetSelect className="h-9 rounded-full border" />
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/editor/theme">
              <ExternalLink data-icon="inline-start" />
              Theme editor
            </Link>
          </Button>
          <ThemeToggle variant="ghost" size="icon" />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)_340px]">
        <aside className="flex min-h-0 flex-col border-b md:border-r md:border-b-0">
          <div className="flex flex-col gap-3 border-b p-3">
            <div className="relative">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search catalog"
                className="pl-9"
              />
            </div>
            <Tabs value={activeGroup} onValueChange={handleGroupChange}>
              <TabsList className="w-full">
                {(Object.keys(groupLabels) as LibraryCatalogGroup[]).map((group) => (
                  <TabsTrigger key={group} value={group}>
                    {groupLabels[group]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-1 p-2">
              {getEntriesForGroup(activeGroup, query).map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedEntryId(entry.id)}
                  className={cn(
                    "hover:bg-muted flex min-h-20 w-full flex-col gap-2 rounded-lg p-3 text-left transition-colors",
                    selectedEntry.id === entry.id && "bg-accent text-accent-foreground"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{entry.title}</div>
                      <div className="text-muted-foreground text-xs">{entry.category}</div>
                    </div>
                    <Badge variant="outline">{entry.type}</Badge>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {entry.description}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        <main className="flex min-h-0 flex-col">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b p-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-medium">{selectedEntry.title}</h2>
                <Badge variant="secondary">{selectedEntry.category}</Badge>
              </div>
              <p className="text-muted-foreground truncate text-sm">
                {selectedEntry.description}
              </p>
            </div>
            <Button
              variant={inspectorEnabled ? "secondary" : "ghost"}
              size="sm"
              onClick={toggleInspector}
            >
              <Inspect data-icon="inline-start" />
              Inspector
            </Button>
          </div>

          <div className="min-h-0 flex-1 p-4">
            <div
              ref={rootRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-background relative isolate size-full overflow-hidden rounded-lg border"
            >
              <ScrollArea className="size-full">
                <div className="min-h-full p-6">
                  <Preview state={previewState} />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <InspectorOverlay
                inspector={inspector}
                enabled={inspectorEnabled}
                rootRef={rootRef}
              />
            </div>
          </div>
        </main>

        <aside className="flex min-h-0 flex-col border-t md:border-t-0 md:border-l">
          <Tabs defaultValue="variants" className="min-h-0 flex-1 gap-0">
            <div className="border-b p-3">
              <TabsList className="w-full">
                <TabsTrigger value="variants">Variants</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="variants" className="min-h-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-5 p-4">
                  {selectedEntry.variants.length > 0 ? (
                    selectedEntry.variants.map((variant) => (
                      <section key={variant.id} className="flex flex-col gap-2">
                        <div className="text-sm font-medium">{variant.label}</div>
                        <ToggleGroup
                          type="single"
                          value={previewState[variant.id]}
                          onValueChange={(value) => {
                            if (value) updatePreviewState(variant.id, value);
                          }}
                          className="flex-wrap"
                        >
                          {variant.options.map((option) => (
                            <ToggleGroupItem key={option.id} value={option.value}>
                              {option.label}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </section>
                    ))
                  ) : (
                    <div className="text-muted-foreground flex min-h-32 items-center justify-center rounded-lg border border-dashed p-4 text-center text-sm">
                      This entry has no curated v1 variants. It still responds to
                      the active theme tokens.
                    </div>
                  )}

                  {selectedEntry.figma && (
                    <>
                      <Separator />
                      <section className="flex flex-col gap-2">
                        <div className="text-sm font-medium">Figma reference</div>
                        <p className="text-muted-foreground text-sm">
                          {selectedEntry.figma.note}
                        </p>
                        {selectedEntry.figma.url && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={selectedEntry.figma.url} target="_blank">
                              <ExternalLink data-icon="inline-start" />
                              Open Figma
                            </Link>
                          </Button>
                        )}
                      </section>
                    </>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="code" className="min-h-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-4 p-4">
                  <section className="flex flex-col gap-2 rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <FileCode2 />
                        Source path
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopy("source", selectedEntry.sourcePath)}
                        aria-label="Copy source path"
                      >
                        {copied === "source" ? <Check /> : <Copy />}
                      </Button>
                    </div>
                    <code className="bg-muted rounded-md px-2 py-1 font-mono text-xs break-all">
                      {selectedEntry.sourcePath}
                    </code>
                    {selectedEntry.installNotes && (
                      <p className="text-muted-foreground text-xs">
                        {selectedEntry.installNotes}
                      </p>
                    )}
                  </section>

                  <section className="flex flex-col gap-2 rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Package />
                        Current theme CSS
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopy("theme", themeCode)}
                        aria-label="Copy theme CSS"
                      >
                        {copied === "theme" ? <Check /> : <Copy />}
                      </Button>
                    </div>
                    <div className="max-h-96 overflow-hidden rounded-md border">
                      <CodeBlock
                        code={themeCode}
                        language="css"
                        className="max-h-96 rounded-none border-0"
                      />
                    </div>
                  </section>

                  <section className="flex flex-col gap-2 rounded-lg border p-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Code2 />
                      V1 boundary
                    </div>
                    <p className="text-muted-foreground text-sm">
                      This workbench previews curated variants and theme tokens.
                      It does not edit arbitrary class names, persist libraries,
                      or automate Figma import in v1.
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
}
