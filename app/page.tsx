import Link from "next/link";

import { CourseList } from "@/components/course-list";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function Home() {
  const courses = await prisma.course.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { decks: true },
      },
      decks: {
        select: {
          _count: { select: { cards: true } },
        },
      },
    },
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Memento</h1>
          <p className="text-sm text-muted-foreground">Your courses</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/learn"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Learn
          </Link>
          <Link
            href="/review"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Review
          </Link>
          <Link href="/courses/new" className={cn(buttonVariants())}>
            New course
          </Link>
        </div>
      </div>

      <CourseList courses={courses} />
    </main>
  );
}
