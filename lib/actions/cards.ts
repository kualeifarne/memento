"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

function required(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name} is required`);
  }
  return value.trim();
}

export async function createCard(formData: FormData) {
  const deckId = required(formData, "deckId");
  const prompt = required(formData, "prompt");
  const answer = required(formData, "answer");

  const deck = await prisma.deck.findUniqueOrThrow({
    where: { id: deckId },
    select: { courseId: true },
  });

  const cardCount = await prisma.card.count({ where: { deckId } });

  await prisma.card.create({
    data: {
      deckId,
      prompt,
      answer,
      order: cardCount,
    },
  });

  revalidatePath(`/courses/${deck.courseId}`);
}

export async function updateCard(id: string, formData: FormData) {
  const prompt = required(formData, "prompt");
  const answer = required(formData, "answer");

  const card = await prisma.card.update({
    where: { id },
    data: { prompt, answer },
    select: { deck: { select: { courseId: true } } },
  });

  revalidatePath(`/courses/${card.deck.courseId}`);
}

export async function deleteCard(id: string, courseId: string) {
  await prisma.card.delete({ where: { id } });

  revalidatePath(`/courses/${courseId}`);
}
