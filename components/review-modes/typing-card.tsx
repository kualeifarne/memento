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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkTyped } from "@/lib/learning-modes";
import { cn } from "@/lib/utils";

import type { ModeCardProps } from "./types";

export function TypingCard({ card, onGrade, disabled }: ModeCardProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    input: string;
    isCorrect: boolean;
  } | null>(null);

  const submitted = result !== null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (disabled || submitted || input.trim() === "") return;

    setResult({
      input,
      isCorrect: checkTyped(input, card.answer),
    });
  }

  function handleContinue() {
    if (!result) return;
    onGrade(result.isCorrect ? "easy" : "again");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Type the answer</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="whitespace-pre-wrap">{card.prompt}</p>
        {card.hint ? (
          <p className="text-sm text-muted-foreground">Hint: {card.hint}</p>
        ) : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="typing-answer">Your answer</Label>
            <Input
              id="typing-answer"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={disabled || submitted}
              autoComplete="off"
              autoFocus
            />
          </div>

          {!submitted ? (
            <div>
              <Button type="submit" disabled={disabled || input.trim() === ""}>
                Check
              </Button>
            </div>
          ) : null}
        </form>

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
