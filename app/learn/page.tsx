import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LEARN_TARGET } from "@/lib/learn-progress";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function LearnPage() {
  const courses = await prisma.course.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      decks: { select: { id: true } },
    },
  });

  const learnableByDeck = await prisma.card.groupBy({
    by: ["deckId"],
    where: {
      OR: [{ learn: null }, { learn: { correctCount: { lt: LEARN_TARGET } } }],
    },
    _count: { _all: true },
  });

  const countByDeck = new Map(
    learnableByDeck.map((group) => [group.deckId, group._count._all]),
  );

  const learnableCourses = courses
    .map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      learnableCount: course.decks.reduce(
        (sum, deck) => sum + (countByDeck.get(deck.id) ?? 0),
        0,
      ),
    }))
    .filter((course) => course.learnableCount > 0);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to courses
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Learn</h1>
        <p className="text-sm text-muted-foreground">
          Choose a course to learn from
        </p>
      </div>

      {learnableCourses.length === 0 ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Nothing to learn — all cards are ready for review.
          </p>
          <Link
            href="/review"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Go to review
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {learnableCourses.map((course) => (
            <li key={course.id}>
              <Link href={`/learn/${course.id}`} className="block">
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    {course.description ? (
                      <CardDescription>{course.description}</CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {course.learnableCount}{" "}
                    {course.learnableCount === 1 ? "card" : "cards"} to learn
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
