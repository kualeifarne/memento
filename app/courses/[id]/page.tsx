import Link from "next/link";
import { notFound } from "next/navigation";

import { CardForm } from "@/components/card-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deleteCard } from "@/lib/actions/cards";
import {
  createDeck,
  deleteCourse,
  deleteDeck,
  updateCourse,
} from "@/lib/actions/courses";
import { prisma } from "@/lib/prisma";

type CoursePageProps = {
  params: Promise<{ id: string }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      decks: {
        orderBy: { order: "asc" },
        include: {
          cards: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to courses
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{course.title}</h1>
      </div>

      <section className="flex max-w-lg flex-col gap-6">
        <h2 className="text-lg font-medium">Course details</h2>
        <form action={updateCourse.bind(null, id)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={course.title} required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={course.description ?? ""}
              rows={3}
            />
          </div>

          <Button type="submit">Save course</Button>
        </form>

        <form action={deleteCourse.bind(null, id)}>
          <Button type="submit" variant="destructive">
            Delete course
          </Button>
        </form>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">Decks</h2>
        </div>

        <form
          action={createDeck.bind(null, id)}
          className="flex max-w-lg flex-col gap-4 rounded-xl border p-4"
        >
          <h3 className="text-sm font-medium">Add deck</h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="deck-title">Deck title</Label>
            <Input id="deck-title" name="title" required />
          </div>
          <div>
            <Button type="submit" size="sm">
              Add deck
            </Button>
          </div>
        </form>

        {course.decks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No decks yet. Add a deck to start creating cards.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {course.decks.map((deck) => (
              <Card key={deck.id}>
                <CardHeader className="flex-row items-center justify-between gap-4">
                  <CardTitle>{deck.title}</CardTitle>
                  <form action={deleteDeck.bind(null, deck.id, id)}>
                    <Button type="submit" variant="destructive" size="sm">
                      Delete deck
                    </Button>
                  </form>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {deck.cards.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No cards in this deck yet.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-6">
                      {deck.cards.map((card) => (
                        <li
                          key={card.id}
                          className="flex flex-col gap-4 rounded-lg border p-4"
                        >
                          <CardForm deckId={deck.id} card={card} />
                          <form action={deleteCard.bind(null, card.id, id)}>
                            <Button type="submit" variant="destructive" size="sm">
                              Delete card
                            </Button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="rounded-lg border border-dashed p-4">
                    <h4 className="mb-4 text-sm font-medium">Add card</h4>
                    <CardForm deckId={deck.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
