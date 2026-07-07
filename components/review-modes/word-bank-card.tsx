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
  buildTokenBank,
  canBuildTokenBank,
  checkWordBank,
} from "@/lib/learning-modes";
import { cn } from "@/lib/utils";

import { ClassicCard } from "./classic-card";
import type { ModeCardProps } from "./types";

type Chip = {
  id: number;
  token: string;
};

export function WordBankCard({
  card,
  pool,
  onGrade,
  disabled,
}: ModeCardProps) {
  const chips = useMemo<Chip[] | null>(() => {
    if (!canBuildTokenBank(card.answer, pool)) {
      return null;
    }
    return buildTokenBank(card.answer, pool).map((token, id) => ({
      id,
      token,
    }));
  }, [card.answer, pool]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [result, setResult] = useState<{ isCorrect: boolean } | null>(null);

  if (!chips) {
    return (
      <ClassicCard
        card={card}
        pool={pool}
        onGrade={onGrade}
        disabled={disabled}
      />
    );
  }

  const submitted = result !== null;
  const orderedSelectedTokens = selectedIds.map(
    (id) => chips.find((chip) => chip.id === id)!.token,
  );
  const availableChips = chips.filter((chip) => !selectedIds.includes(chip.id));

  function addChip(id: number) {
    if (disabled || submitted) return;
    setSelectedIds((current) => [...current, id]);
  }

  function removeChip(id: number) {
    if (disabled || submitted) return;
    setSelectedIds((current) => current.filter((chipId) => chipId !== id));
  }

  function clearSelection() {
    if (disabled || submitted) return;
    setSelectedIds([]);
  }

  function handleCheck() {
    if (disabled || submitted || selectedIds.length === 0) return;

    setResult({
      isCorrect: checkWordBank(orderedSelectedTokens, card.answer),
    });
  }

  function handleContinue() {
    if (!result) return;
    onGrade(result.isCorrect ? "good" : "again");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word bank</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="whitespace-pre-wrap">{card.prompt}</p>
        {card.hint ? (
          <p className="text-sm text-muted-foreground">Hint: {card.hint}</p>
        ) : null}

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Your answer</p>
          <div
            className={cn(
              "flex min-h-12 flex-wrap gap-2 rounded-lg border p-3",
              selectedIds.length === 0 && "text-sm text-muted-foreground",
            )}
          >
            {selectedIds.length === 0 ? (
              <span>Tap words below to build the answer</span>
            ) : (
              selectedIds.map((id) => {
                const chip = chips.find((item) => item.id === id)!;
                return (
                  <Button
                    key={id}
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => removeChip(id)}
                    disabled={disabled || submitted}
                  >
                    {chip.token}
                  </Button>
                );
              })
            )}
          </div>
          {selectedIds.length > 0 && !submitted ? (
            <div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                disabled={disabled}
              >
                Clear
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Word bank</p>
          <div className="flex flex-wrap gap-2">
            {availableChips.map((chip) => (
              <Button
                key={chip.id}
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addChip(chip.id)}
                disabled={disabled || submitted}
              >
                {chip.token}
              </Button>
            ))}
          </div>
        </div>

        {!submitted ? (
          <div>
            <Button
              type="button"
              onClick={handleCheck}
              disabled={disabled || selectedIds.length === 0}
            >
              Check
            </Button>
          </div>
        ) : null}

        {submitted ? (
          <div className="flex flex-col gap-3">
            <p
              className={cn(
                "text-sm font-medium",
                result.isCorrect
                  ? "text-green-700 dark:text-green-400"
                  : "text-destructive",
              )}
            >
              {result.isCorrect ? "Correct!" : "Incorrect."}
            </p>
            {!result.isCorrect ? (
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="mb-2 text-sm font-medium">Correct answer</p>
                <p className="whitespace-pre-wrap">{card.answer}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>

      {submitted ? (
        <CardFooter>
          <Button onClick={handleContinue} disabled={disabled}>
            Continue
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
