import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ReviewSession } from "@/components/review-session";

export default async function ReviewPage() {
  const now = new Date();

  const cards = await prisma.card.findMany({
    where: {
      OR: [{ review: null }, { review: { nextReviewAt: { lte: now } } }],
    },
    select: {
      id: true,
      prompt: true,
      answer: true,
      hint: true,
    },
    orderBy: [{ review: { nextReviewAt: "asc" } }],
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to courses
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Review</h1>
        <p className="text-sm text-muted-foreground">
          Cards due for review today
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Nothing due — you&apos;re all caught up.
          </p>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to courses
          </Link>
        </div>
      ) : (
        <ReviewSession cards={cards} />
      )}
    </main>
  );
}
