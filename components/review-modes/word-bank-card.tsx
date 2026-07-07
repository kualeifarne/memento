import { ClassicCard } from "./classic-card";
import type { ModeCardProps } from "./types";

export function WordBankCard(props: ModeCardProps) {
  return <ClassicCard {...props} />;
}
