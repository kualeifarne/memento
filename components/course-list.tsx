import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type CourseListItem = {
  id: string;
  title: string;
  description: string | null;
  _count: { decks: number };
  decks: { _count: { cards: number } }[];
};

type CourseListProps = {
  courses: CourseListItem[];
};

export function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No courses yet. Create your first course to get started.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {courses.map((course) => {
        const cardCount = course.decks.reduce(
          (sum, deck) => sum + deck._count.cards,
          0,
        );

        return (
          <li key={course.id}>
            <Link href={`/courses/${course.id}`} className="block">
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  {course.description ? (
                    <CardDescription>{course.description}</CardDescription>
                  ) : null}
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {course._count.decks}{" "}
                  {course._count.decks === 1 ? "deck" : "decks"} · {cardCount}{" "}
                  {cardCount === 1 ? "card" : "cards"}
                </CardContent>
              </Card>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
