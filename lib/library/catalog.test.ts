import assert from "node:assert/strict";

import {
  getLibraryCatalogEntry,
  getLibraryCatalogGroups,
  libraryCatalogEntries,
} from "@/lib/library/catalog";

assert.ok(libraryCatalogEntries.length >= 6, "catalog should seed multiple local entries");

const ids = new Set(libraryCatalogEntries.map((entry) => entry.id));
assert.equal(ids.size, libraryCatalogEntries.length, "catalog entry ids should be unique");

const button = getLibraryCatalogEntry("button");
assert.equal(button?.type, "component");
assert.equal(button?.sourcePath, "components/ui/button.tsx");
assert.ok(button?.variants.length, "button entry should expose curated variants");

const cards = getLibraryCatalogEntry("cards-block");
assert.equal(cards?.type, "block");
assert.equal(cards?.sourcePath, "components/examples/cards/index.tsx");

const custom = getLibraryCatalogEntry("figma-kpi-card");
assert.equal(custom?.figma?.mode, "manual");
assert.equal(custom?.sourcePath, "components/library/custom/figma-kpi-card.tsx");

const groups = getLibraryCatalogGroups();
assert.ok(groups.components.length >= 1, "component group should not be empty");
assert.ok(groups.blocks.length >= 1, "block group should not be empty");
assert.ok(groups.custom.length >= 1, "custom group should not be empty");
