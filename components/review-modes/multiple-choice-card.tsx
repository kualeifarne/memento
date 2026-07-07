import { ClassicCard } from "./classic-card";
import type { ModeCardProps } from "./types";

export function MultipleChoiceCard(props: ModeCardProps) {
  return <ClassicCard {...props} />;
}
