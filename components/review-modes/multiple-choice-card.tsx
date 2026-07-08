"use client";

import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  buildChoices,
  canBuildChoices,
  normalizeAnswer,
} from "@/lib/learning-modes";
import { cn } from "@/lib/utils";

import { ClassicCard } from "./classic-card";
import type { ModeCardProps } from "./types";

export function MultipleChoiceCard({
  card,
  pool,
  onGrade,
  disabled,
}: ModeCardProps) {
  const choices = useMemo(() => {
    if (!canBuildChoices(card.answer, pool)) {
      return null;
    }
    return buildChoices(card.answer, pool, card.id);
  }, [card.answer, card.id, pool]);

  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;
  const isCorrect =
    selected !== null &&
    normalizeAnswer(selected) === normalizeAnswer(card.answer);

  if (!choices) {
    return (
      <ClassicCard
        card={card}
        pool={pool}
        onGrade={onGrade}
        disabled={disabled}
      />
    );
  }

  function handleSelect(choice: string) {
    if (answered || disabled) return;
    setSelected(choice);
  }

  function handleContinue() {
    onGrade(isCorrect ? "easy" : "again");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multiple choice</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="whitespace-pre-wrap">{card.prompt}</p>
        {card.hint ? (
          <p className="text-sm text-muted-foreground">Hint: {card.hint}</p>
        ) : null}

        <div className="flex flex-col gap-2">
          {choices.map((choice, index) => {
            const isThisCorrect =
              normalizeAnswer(choice) === normalizeAnswer(card.answer);
            const isThisSelected = selected === choice;

            return (
              <Button
                key={`${index}-${normalizeAnswer(choice)}`}
                type="button"
                variant="outline"
                className={cn(
                  "h-auto min-h-8 w-full justify-start px-3 py-3 text-left whitespace-pre-wrap",
                  answered &&
                    isThisCorrect &&
                    "border-green-600 bg-green-50 dark:bg-green-950/30",
                  answered &&
                    isThisSelected &&
                    !isThisCorrect &&
                    "border-destructive bg-destructive/10",
                )}
                onClick={() => handleSelect(choice)}
                disabled={disabled || answered}
              >
                {choice}
              </Button>
            );
          })}
        </div>

        {answered ? (
          <div className="flex flex-col gap-3">
            <p
              className={cn(
                "text-sm font-medium",
                isCorrect ? "text-green-700 dark:text-green-400" : "text-destructive",
              )}
            >
              {isCorrect ? "Correct!" : "Incorrect."}
            </p>
            {!isCorrect ? (
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="mb-2 text-sm font-medium">Correct answer</p>
                <p className="whitespace-pre-wrap">{card.answer}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>

      {answered ? (
        <CardFooter>
          <Button onClick={handleContinue} disabled={disabled}>
            Continue
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
