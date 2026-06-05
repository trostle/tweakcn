"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { LibraryPreviewProps } from "@/lib/library/types";
import { ArrowRight, Bell, Mail } from "lucide-react";
import { FigmaKpiCard } from "./custom/figma-kpi-card";
import CardsDemo from "@/components/examples/cards";
import PricingDemo from "@/components/examples/pricing/pricing";

export function ButtonLibraryPreview({ state }: LibraryPreviewProps) {
  const variant = state.variant as React.ComponentProps<typeof Button>["variant"];
  const size = state.size as React.ComponentProps<typeof Button>["size"];

  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4">
      <Button variant={variant} size={size}>
        Launch workflow
        <ArrowRight data-icon="inline-end" />
      </Button>
      <Button variant={variant} size={size} disabled>
        Disabled state
      </Button>
    </div>
  );
}

export function BadgeLibraryPreview({ state }: LibraryPreviewProps) {
  const variant = state.variant as React.ComponentProps<typeof Badge>["variant"];

  return (
    <div className="flex min-h-64 flex-wrap items-center justify-center gap-3">
      <Badge variant={variant}>Status</Badge>
      <Badge variant={variant}>
        <Bell data-icon="inline-start" />
        Alerts
      </Badge>
      <Badge variant={variant}>Design token</Badge>
    </div>
  );
}

export function InputLibraryPreview({ state }: LibraryPreviewProps) {
  const status = state.status;

  return (
    <div className="mx-auto flex min-h-64 w-full max-w-sm flex-col justify-center gap-3">
      <Input placeholder="Email address" aria-invalid={status === "invalid"} />
      <Input placeholder="Disabled input" disabled={status === "disabled"} />
      <p className="text-muted-foreground text-sm">
        Inputs use semantic border, ring, foreground, and input tokens.
      </p>
    </div>
  );
}

export function CardLibraryPreview({ state }: LibraryPreviewProps) {
  const size = state.size as React.ComponentProps<typeof Card>["size"];

  return (
    <div className="mx-auto flex min-h-64 w-full max-w-md items-center">
      <Card size={size} className="w-full">
        <CardHeader>
          <CardTitle>Component health</CardTitle>
          <CardDescription>Previewing card composition under the active theme.</CardDescription>
          <CardAction>
            <Badge variant="secondary">Live</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="bg-muted flex items-center gap-3 rounded-3xl p-3">
            <div className="bg-background flex size-9 items-center justify-center rounded-full border">
              <Mail />
            </div>
            <div className="min-w-0">
              <div className="font-medium">New component review</div>
              <div className="text-muted-foreground truncate text-sm">
                Tokens, radius, typography, and shadows are applied globally.
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">
            Review
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function CardsBlockLibraryPreview() {
  return (
    <div className="min-w-[980px]">
      <CardsDemo />
    </div>
  );
}

export function PricingBlockLibraryPreview() {
  return (
    <div className="min-w-[980px]">
      <PricingDemo />
    </div>
  );
}

export function FigmaKpiCardLibraryPreview({ state }: LibraryPreviewProps) {
  const tone = state.tone as React.ComponentProps<typeof FigmaKpiCard>["tone"];

  return (
    <div className="mx-auto flex min-h-64 w-full max-w-md items-center">
      <FigmaKpiCard tone={tone} />
    </div>
  );
}
