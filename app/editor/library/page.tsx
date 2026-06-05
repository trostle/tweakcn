import { LibraryWorkbench } from "@/components/library/library-workbench";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "tweakcn — Component Library Workbench",
  description:
    "Browse token-aware shadcn components, local blocks, and custom design-system entries.",
};

export default function LibraryWorkbenchPage() {
  return <LibraryWorkbench />;
}
