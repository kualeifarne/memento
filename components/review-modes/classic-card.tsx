"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Rating } from "@/lib/spaced-repetition";

import type { ModeCardProps } from "./types";

const RATINGS: { rating: Rating; label: string; variant?: "destructive" }[] = [
  { rating: "again", label: "Again", variant: "destructive" },
  { rating: "hard", label: "Hard" },
  { rating: "good", label: "Good" },
  { rating: "easy", label: "Easy" },
];

export function ClassicCard({ card, onGrade, disabled }: ModeCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="whitespace-pre-wrap">{card.prompt}</p>
        {card.hint ? (
          <p className="text-sm text-muted-foreground">Hint: {card.hint}</p>
        ) : null}

        {revealed ? (
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="mb-2 text-sm font-medium">Answer</p>
            <p className="whitespace-pre-wrap">{card.answer}</p>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        {!revealed ? (
          <Button onClick={() => setRevealed(true)} disabled={disabled}>
            Show answer
          </Button>
        ) : (
          RATINGS.map(({ rating, label, variant }) => (
            <Button
              key={rating}
              variant={variant ?? "outline"}
              onClick={() => onGrade(rating)}
              disabled={disabled}
            >
              {label}
            </Button>
          ))
        )}
      </CardFooter>
    </Card>
  );
}
