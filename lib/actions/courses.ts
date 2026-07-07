"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function required(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name} is required`);
  }
  return value.trim();
}

function optional(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export async function createCourse(formData: FormData) {
  const title = required(formData, "title");
  const description = optional(formData, "description");

  const course = await prisma.course.create({
    data: { title, description },
  });

  revalidatePath("/");
  redirect(`/courses/${course.id}`);
}

export async function updateCourse(id: string, formData: FormData) {
  const title = required(formData, "title");
  const description = optional(formData, "description");

  await prisma.course.update({
    where: { id },
    data: { title, description },
  });

  revalidatePath("/");
  revalidatePath(`/courses/${id}`);
}

export async function deleteCourse(id: string) {
  await prisma.course.delete({ where: { id } });

  revalidatePath("/");
  redirect("/");
}

export async function createDeck(courseId: string, formData: FormData) {
  const title = required(formData, "title");

  const deckCount = await prisma.deck.count({ where: { courseId } });

  await prisma.deck.create({
    data: {
      title,
      courseId,
      order: deckCount,
    },
  });

  revalidatePath(`/courses/${courseId}`);
}

export async function deleteDeck(id: string, courseId: string) {
  await prisma.deck.delete({ where: { id } });

  revalidatePath(`/courses/${courseId}`);
}
