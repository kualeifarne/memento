import Link from "next/link";
import { notFound } from "next/navigation";

import { LearnSession } from "@/components/learn-session";
import { buttonVariants } from "@/components/ui/button";
import { LEARN_BATCH_SIZE, LEARN_TARGET } from "@/lib/learn-progress";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

type LearnDeckPageProps = {
  params: Promise<{ courseId: string; deckId: string }>;
};

export default async function LearnDeckPage({ params }: LearnDeckPageProps) {
  const { courseId, deckId } = await params;

  const deck = await prisma.deck.findFirst({
    where: { id: deckId, courseId },
    select: { id: true, title: true },
  });

  if (!deck) {
    notFound();
  }

  const cards = await prisma.card.findMany({
    where: {
      deckId,
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
    orderBy: { order: "asc" },
    take: LEARN_BATCH_SIZE,
  });

  const learnCards = cards.map((card) => ({
    id: card.id,
    prompt: card.prompt,
    answer: card.answer,
    hint: card.hint,
    deckId: card.deckId,
    correctCount: card.learn?.correctCount ?? 0,
  }));

  const poolCards = await prisma.card.findMany({
    where: { deckId },
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
          href={`/learn/${courseId}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to decks
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{deck.title}</h1>
        <p className="text-sm text-muted-foreground">
          Practice cards until you reach {LEARN_TARGET} correct answers each
        </p>
      </div>

      {learnCards.length === 0 ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Nothing to learn in this deck — all cards are ready for review.
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
