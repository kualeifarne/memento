export type ReviewCard = {
  id: string;
  prompt: string;
  answer: string;
  hint: string | null;
};

type ReviewSessionProps = {
  cards: ReviewCard[];
};

// Placeholder — full UI implemented in todo 5
export function ReviewSession({ cards }: ReviewSessionProps) {
  return (
    <p className="text-sm text-muted-foreground">
      {cards.length} {cards.length === 1 ? "card" : "cards"} due
    </p>
  );
}
