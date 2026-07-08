import Link from "next/link";

import { LearnSession } from "@/components/learn-session";
import { buttonVariants } from "@/components/ui/button";
import { LEARN_TARGET } from "@/lib/learn-progress";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function LearnPage() {
  const cards = await prisma.card.findMany({
    where: {
      OR: [{ learn: null }, { learn: { correctCount: { lt: LEARN_TARGET } } }],
    },
    select: {
      id: true,
      prompt: true,
      answer: true,
      hint: true,
      deckId: true,
      learn: { select: { correctCount: true } },
    },
    orderBy: [{ deck: { order: "asc" } }, { order: "asc" }],
  });

  const learnCards = cards.map((card) => ({
    id: card.id,
    prompt: card.prompt,
    answer: card.answer,
    hint: card.hint,
    deckId: card.deckId,
    correctCount: card.learn?.correctCount ?? 0,
  }));

  const deckIds = [...new Set(learnCards.map((card) => card.deckId))];

  const poolCards =
    deckIds.length === 0
      ? []
      : await prisma.card.findMany({
          where: { deckId: { in: deckIds } },
          select: { deckId: true, answer: true },
        });

  const answerPool = poolCards.reduce<Record<string, string[]>>(
    (pool, card) => {
      const answers = pool[card.deckId] ?? [];
      answers.push(card.answer);
      pool[card.deckId] = answers;
      return pool;
    },
    {},
  );

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
          Practice cards until you reach {LEARN_TARGET} correct answers each
        </p>
      </div>

      {learnCards.length === 0 ? (
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
        <LearnSession cards={learnCards} answerPool={answerPool} />
      )}
    </main>
  );
}
