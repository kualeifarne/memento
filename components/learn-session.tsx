"use client";

import { useState, useTransition } from "react";

import { ClassicCard } from "@/components/review-modes/classic-card";
import { MultipleChoiceCard } from "@/components/review-modes/multiple-choice-card";
import { TypingCard } from "@/components/review-modes/typing-card";
import { WordBankCard } from "@/components/review-modes/word-bank-card";
import type { ReviewCard } from "@/components/review-session";
import { recordLearnAttempt } from "@/lib/actions/learn";
import { LEARN_TARGET, pickLearnMode } from "@/lib/learn-progress";
import type { LearningMode } from "@/lib/learning-modes";
import type { Rating } from "@/lib/spaced-repetition";

export type LearnCard = ReviewCard & {
  correctCount: number;
};

type LearnSessionProps = {
  cards: LearnCard[];
  answerPool: Record<string, string[]>;
};

const MODE_COMPONENTS = {
  classic: ClassicCard,
  multipleChoice: MultipleChoiceCard,
  typing: TypingCard,
  wordBank: WordBankCard,
} as const satisfies Record<LearningMode, React.ComponentType<import("@/components/review-modes/types").ModeCardProps>>;

export function LearnSession({ cards, answerPool }: LearnSessionProps) {
  const [index, setIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  const total = cards.length;
  const card = cards[index];
  const isComplete = index >= total;

  function handleGrade(rating: Rating) {
    if (!card || isPending) return;

    startTransition(async () => {
      await recordLearnAttempt(card.id, rating);
      setIndex((current) => current + 1);
    });
  }

  if (isComplete) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Session complete — you practiced {total}{" "}
          {total === 1 ? "card" : "cards"}.
        </p>
      </div>
    );
  }

  const pool = answerPool[card.deckId] ?? [];
  const mode = pickLearnMode(
    card.correctCount,
    { id: card.id, answer: card.answer },
    pool,
  );
  const ModeComponent = MODE_COMPONENTS[mode];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <p>
          {index + 1} / {total}
        </p>
        <p>
          Learn progress: {card.correctCount} / {LEARN_TARGET}
        </p>
      </div>

      <ModeComponent
        key={`${card.id}-${card.correctCount}`}
        card={card}
        pool={pool}
        onGrade={handleGrade}
        disabled={isPending}
      />
    </div>
  );
}
