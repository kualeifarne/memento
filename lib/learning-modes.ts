export type LearningMode =
  | "classic"
  | "multipleChoice"
  | "typing"
  | "wordBank";

export type PickModeInput = {
  id: string;
  answer: string;
};

const MIN_MC_DISTRACTORS = 3;
const MIN_WORD_BANK_TOKENS = 2;
const WORD_BANK_DISTRACTOR_COUNT = 3;
const CHOICE_COUNT = 4;

export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?]+$/g, "");
}

export function checkTyped(input: string, answer: string): boolean {
  return normalizeAnswer(input) === normalizeAnswer(answer);
}

export function tokenize(answer: string): string[] {
  return normalizeAnswer(answer)
    .split(/\s+/)
    .filter(Boolean);
}

function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function shuffleSeeded<T>(items: T[], seed: number): T[] {
  const random = createRng(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function siblingAnswers(answer: string, pool: string[]): string[] {
  const normalizedAnswer = normalizeAnswer(answer);
  return pool.filter((candidate) => normalizeAnswer(candidate) !== normalizedAnswer);
}

export function canBuildChoices(answer: string, pool: string[]): boolean {
  return siblingAnswers(answer, pool).length >= MIN_MC_DISTRACTORS;
}

export function buildChoices(
  answer: string,
  pool: string[],
  seedKey: string,
): string[] {
  const distractors = shuffleSeeded(
    siblingAnswers(answer, pool),
    hashString(`${seedKey}:mc-distractors`),
  ).slice(0, CHOICE_COUNT - 1);

  if (distractors.length < MIN_MC_DISTRACTORS) {
    throw new Error("Not enough distractors to build multiple-choice options");
  }

  return shuffleSeeded(
    [answer, ...distractors],
    hashString(`${seedKey}:mc-choices`),
  );
}

export function canBuildTokenBank(answer: string, pool: string[]): boolean {
  const tokens = tokenize(answer);
  if (tokens.length < MIN_WORD_BANK_TOKENS) {
    return false;
  }

  return collectDistractorTokens(answer, pool).length >= 1;
}

function collectDistractorTokens(answer: string, pool: string[]): string[] {
  const answerTokens = new Set(tokenize(answer));
  const distractors = new Set<string>();

  for (const sibling of siblingAnswers(answer, pool)) {
    for (const token of tokenize(sibling)) {
      if (!answerTokens.has(token)) {
        distractors.add(token);
      }
    }
  }

  return [...distractors];
}

export function buildTokenBank(
  answer: string,
  pool: string[],
  seedKey: string,
): string[] {
  const answerTokens = tokenize(answer);
  const distractors = shuffleSeeded(
    collectDistractorTokens(answer, pool),
    hashString(`${seedKey}:wb-distractors`),
  ).slice(0, WORD_BANK_DISTRACTOR_COUNT);

  if (answerTokens.length < MIN_WORD_BANK_TOKENS) {
    throw new Error("Answer is too short to build a word bank");
  }

  if (distractors.length === 0) {
    throw new Error("Not enough distractor tokens to build a word bank");
  }

  return shuffleSeeded(
    [...answerTokens, ...distractors],
    hashString(`${seedKey}:wb-tokens`),
  );
}

export function checkWordBank(selected: string[], answer: string): boolean {
  return selected.join(" ") === tokenize(answer).join(" ");
}

function eligibleModes(card: PickModeInput, pool: string[]): LearningMode[] {
  const modes: LearningMode[] = ["classic"];
  const tokens = tokenize(card.answer);

  if (canBuildChoices(card.answer, pool)) {
    modes.push("multipleChoice");
  }

  if (tokens.length >= 1) {
    modes.push("typing");
  }

  if (canBuildTokenBank(card.answer, pool)) {
    modes.push("wordBank");
  }

  return modes;
}

export function pickMode(card: PickModeInput, pool: string[]): LearningMode {
  const modes = eligibleModes(card, pool);
  return modes[hashString(card.id) % modes.length]!;
}
