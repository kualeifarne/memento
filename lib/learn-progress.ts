import {
  canBuildChoices,
  canBuildTokenBank,
  type LearningMode,
  type PickModeInput,
  tokenize,
} from "@/lib/learning-modes";
import type { Rating } from "@/lib/spaced-repetition";

export const LEARN_TARGET = 6;

export function getCorrectCount(
  state: { correctCount: number } | null | undefined,
): number {
  return state?.correctCount ?? 0;
}

function learnRatingDelta(rating: Rating): number {
  switch (rating) {
    case "good":
      return 1;
    case "easy":
      return 0;
    case "again":
    case "hard":
      return -1;
  }
}

export function applyLearnRating(count: number, rating: Rating): number {
  const next = count + learnRatingDelta(rating);
  return Math.min(LEARN_TARGET, Math.max(0, next));
}

export function isGraduated(count: number): boolean {
  return count >= LEARN_TARGET;
}

export function pickLearnMode(
  correctCount: number,
  card: PickModeInput,
  pool: string[],
): LearningMode {
  if (correctCount <= 0) {
    return "classic";
  }

  if (correctCount === 1) {
    return canBuildChoices(card.answer, pool) ? "multipleChoice" : "classic";
  }

  if (correctCount <= 3) {
    if (canBuildTokenBank(card.answer, pool)) {
      return "wordBank";
    }
    return tokenize(card.answer).length >= 1 ? "typing" : "classic";
  }

  if (correctCount <= 5) {
    return "typing";
  }

  return "classic";
}
