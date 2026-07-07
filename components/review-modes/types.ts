import type { ReviewCard } from "@/components/review-session";
import type { Rating } from "@/lib/spaced-repetition";

export type ModeCardProps = {
  card: Pick<ReviewCard, "prompt" | "answer" | "hint">;
  pool: string[];
  onGrade: (rating: Rating) => void;
  disabled?: boolean;
};
