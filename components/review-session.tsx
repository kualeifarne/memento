"use client";

import { useState, useTransition } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gradeCard } from "@/lib/actions/reviews";
import { type Rating, ratingToGrade } from "@/lib/spaced-repetition";

export type ReviewCard = {
  id: string;
  prompt: string;
  answer: string;
  hint: string | null;
  deckId: string;
};

type ReviewSessionProps = {
  cards: ReviewCard[];
  answerPool: Record<string, string[]>;
};

const RATINGS: { rating: Rating; label: string; variant?: "destructive" }[] = [
  { rating: "again", label: "Again", variant: "destructive" },
  { rating: "hard", label: "Hard" },
  { rating: "good", label: "Good" },
  { rating: "easy", label: "Easy" },
];

export function ReviewSession({ cards, answerPool: _answerPool }: ReviewSessionProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const total = cards.length;
  const card = cards[index];
  const isComplete = index >= total;

  function handleGrade(rating: Rating) {
    if (!card || isPending) return;

    startTransition(async () => {
      await gradeCard(card.id, ratingToGrade(rating));
      setRevealed(false);
      setIndex((current) => current + 1);
    });
  }

  if (isComplete) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Session complete — you reviewed {total} {total === 1 ? "card" : "cards"}.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {index + 1} / {total}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Prompt</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="whitespace-pre-wrap">{card.prompt}</p>
          {card.hint ? (
            <p className="text-sm text-muted-foreground">
              Hint: {card.hint}
            </p>
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
            <Button onClick={() => setRevealed(true)} disabled={isPending}>
              Show answer
            </Button>
          ) : (
            RATINGS.map(({ rating, label, variant }) => (
              <Button
                key={rating}
                variant={variant ?? "outline"}
                onClick={() => handleGrade(rating)}
                disabled={isPending}
              >
                {label}
              </Button>
            ))
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
