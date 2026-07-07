"use client";

import { useMemo, useState, useTransition } from "react";

import { ClassicCard } from "@/components/review-modes/classic-card";
import { MultipleChoiceCard } from "@/components/review-modes/multiple-choice-card";
import { TypingCard } from "@/components/review-modes/typing-card";
import { WordBankCard } from "@/components/review-modes/word-bank-card";
import { gradeCard } from "@/lib/actions/reviews";
import { type LearningMode, pickMode } from "@/lib/learning-modes";
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

const MODE_COMPONENTS = {
  classic: ClassicCard,
  multipleChoice: MultipleChoiceCard,
  typing: TypingCard,
  wordBank: WordBankCard,
} as const satisfies Record<LearningMode, React.ComponentType<import("@/components/review-modes/types").ModeCardProps>>;

export function ReviewSession({ cards, answerPool }: ReviewSessionProps) {
  const [index, setIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  const modesByCardId = useMemo(() => {
    const modes = new Map<string, LearningMode>();

    for (const card of cards) {
      const pool = answerPool[card.deckId] ?? [];
      modes.set(card.id, pickMode({ id: card.id, answer: card.answer }, pool));
    }

    return modes;
  }, [cards, answerPool]);

  const total = cards.length;
  const card = cards[index];
  const isComplete = index >= total;

  function handleGrade(rating: Rating) {
    if (!card || isPending) return;

    startTransition(async () => {
      await gradeCard(card.id, ratingToGrade(rating));
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

  const mode = modesByCardId.get(card.id) ?? "classic";
  const ModeComponent = MODE_COMPONENTS[mode];
  const pool = answerPool[card.deckId] ?? [];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {index + 1} / {total}
      </p>

      <ModeComponent
        key={card.id}
        card={card}
        pool={pool}
        onGrade={handleGrade}
        disabled={isPending}
      />
    </div>
  );
}
