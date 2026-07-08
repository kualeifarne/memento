"use server";

import { revalidatePath } from "next/cache";

import { applyLearnRating, getCorrectCount } from "@/lib/learn-progress";
import { prisma } from "@/lib/prisma";
import { DEFAULT_REVIEW_STATE, type Rating } from "@/lib/spaced-repetition";

const RATINGS: Rating[] = ["again", "hard", "good", "easy"];

function assertRating(rating: string): Rating {
  if (!RATINGS.includes(rating as Rating)) {
    throw new Error("rating must be again, hard, good, or easy");
  }
  return rating as Rating;
}

export async function recordLearnAttempt(cardId: string, rating: string) {
  const validRating = assertRating(rating);
  const now = new Date();

  const card = await prisma.card.findUniqueOrThrow({
    where: { id: cardId },
    select: {
      learn: { select: { correctCount: true } },
      review: { select: { id: true } },
    },
  });

  const currentCount = getCorrectCount(card.learn);
  const newCount = applyLearnRating(currentCount, validRating);

  await prisma.$transaction(async (tx) => {
    await tx.learnState.upsert({
      where: { cardId },
      create: {
        cardId,
        correctCount: newCount,
      },
      update: {
        correctCount: newCount,
      },
    });

    if (newCount === 6 && !card.review) {
      await tx.reviewState.create({
        data: {
          cardId,
          easeFactor: DEFAULT_REVIEW_STATE.easeFactor,
          intervalDays: DEFAULT_REVIEW_STATE.intervalDays,
          repetitions: DEFAULT_REVIEW_STATE.repetitions,
          nextReviewAt: now,
        },
      });
    }
  });

  revalidatePath("/learn");
  revalidatePath("/review");
}
