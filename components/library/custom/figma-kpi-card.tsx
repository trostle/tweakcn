import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, CreditCard } from "lucide-react";

interface FigmaKpiCardProps {
  tone?: "default" | "muted" | "accent";
}

export function FigmaKpiCard({ tone = "default" }: FigmaKpiCardProps) {
  return (
    <Card
      className={
        tone === "accent"
          ? "bg-accent text-accent-foreground"
          : tone === "muted"
            ? "bg-muted text-muted-foreground"
            : undefined
      }
    >
      <CardHeader>
        <CardTitle>Recurring revenue</CardTitle>
        <CardDescription>Manual Figma-derived custom component</CardDescription>
        <CardAction>
          <Badge variant={tone === "accent" ? "secondary" : "outline"}>
            <ArrowUpRight data-icon="inline-start" />
            12.4%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-medium tracking-normal">$48,240</div>
            <p className="text-muted-foreground text-sm">Projected this month</p>
          </div>
          <div className="bg-background text-foreground flex size-12 items-center justify-center rounded-full border">
            <CreditCard />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
