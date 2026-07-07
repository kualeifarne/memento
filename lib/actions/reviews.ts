"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  DEFAULT_REVIEW_STATE,
  type Grade,
  schedule,
} from "@/lib/spaced-repetition";

function assertGrade(grade: number): Grade {
  if (!Number.isInteger(grade) || grade < 0 || grade > 5) {
    throw new Error("grade must be an integer between 0 and 5");
  }
  return grade as Grade;
}

export async function gradeCard(cardId: string, grade: number) {
  const validGrade = assertGrade(grade);
  const now = new Date();

  const card = await prisma.card.findUniqueOrThrow({
    where: { id: cardId },
    select: {
      review: {
        select: {
          easeFactor: true,
          intervalDays: true,
          repetitions: true,
        },
      },
    },
  });

  const current = card.review ?? DEFAULT_REVIEW_STATE;
  const result = schedule(current, validGrade, now);

  await prisma.$transaction([
    prisma.reviewState.upsert({
      where: { cardId },
      create: {
        cardId,
        easeFactor: result.easeFactor,
        intervalDays: result.intervalDays,
        repetitions: result.repetitions,
        nextReviewAt: result.nextReviewAt,
        lastReviewAt: now,
      },
      update: {
        easeFactor: result.easeFactor,
        intervalDays: result.intervalDays,
        repetitions: result.repetitions,
        nextReviewAt: result.nextReviewAt,
        lastReviewAt: now,
      },
    }),
    prisma.reviewLog.create({
      data: {
        cardId,
        grade: validGrade,
        easeFactor: result.easeFactor,
        intervalDays: result.intervalDays,
        repetitions: result.repetitions,
        reviewedAt: now,
      },
    }),
  ]);

  revalidatePath("/review");
}
