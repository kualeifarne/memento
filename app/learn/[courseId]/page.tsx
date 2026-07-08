import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LEARN_TARGET } from "@/lib/learn-progress";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

type LearnCoursePageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function LearnCoursePage({
  params,
}: LearnCoursePageProps) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      decks: {
        orderBy: { order: "asc" },
        select: { id: true, title: true },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const learnableByDeck = await prisma.card.groupBy({
    by: ["deckId"],
    where: {
      deck: { courseId },
      OR: [{ learn: null }, { learn: { correctCount: { lt: LEARN_TARGET } } }],
    },
    _count: { _all: true },
  });

  const countByDeck = new Map(
    learnableByDeck.map((group) => [group.deckId, group._count._all]),
  );

  const decks = course.decks.map((deck) => ({
    id: deck.id,
    title: deck.title,
    learnableCount: countByDeck.get(deck.id) ?? 0,
  }));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link
          href="/learn"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to courses
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {course.title}
        </h1>
        <p className="text-sm text-muted-foreground">Choose a deck to learn</p>
      </div>

      {decks.length === 0 ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            This course has no decks yet.
          </p>
          <Link
            href={`/courses/${course.id}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Edit course
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {decks.map((deck) => {
            const isLearnable = deck.learnableCount > 0;

            const content = (
              <Card
                className={cn(
                  "transition-colors",
                  isLearnable
                    ? "hover:bg-muted/50"
                    : "opacity-60",
                )}
              >
                <CardHeader className="flex-row items-center justify-between gap-4">
                  <CardTitle>{deck.title}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {isLearnable
                      ? `${deck.learnableCount} ${
                          deck.learnableCount === 1 ? "card" : "cards"
                        } to learn`
                      : "All learned"}
                  </span>
                </CardHeader>
              </Card>
            );

            return (
              <li key={deck.id}>
                {isLearnable ? (
                  <Link
                    href={`/learn/${course.id}/${deck.id}`}
                    className="block"
                  >
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
