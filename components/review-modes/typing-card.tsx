import { ClassicCard } from "./classic-card";
import type { ModeCardProps } from "./types";

export function TypingCard(props: ModeCardProps) {
  return <ClassicCard {...props} />;
}
