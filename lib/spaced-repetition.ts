export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

export type Rating = "again" | "hard" | "good" | "easy";

export const RATING_TO_GRADE: Record<Rating, Grade> = {
  again: 2,
  hard: 3,
  good: 4,
  easy: 5,
};

export type SchedulerInput = {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
};

export type SchedulerResult = SchedulerInput & {
  nextReviewAt: Date;
};

export const DEFAULT_REVIEW_STATE: SchedulerInput = {
  easeFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
};

const MIN_EASE_FACTOR = 1.3;

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function updateEaseFactor(current: number, grade: Grade): number {
  const delta = 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
  return Math.max(MIN_EASE_FACTOR, current + delta);
}

export function schedule(
  input: SchedulerInput,
  grade: Grade,
  now: Date = new Date(),
): SchedulerResult {
  const easeFactor = updateEaseFactor(input.easeFactor, grade);

  if (grade < 3) {
    return {
      easeFactor,
      intervalDays: 1,
      repetitions: 0,
      nextReviewAt: addDays(now, 1),
    };
  }

  const repetitions = input.repetitions + 1;
  let intervalDays: number;

  if (repetitions === 1) {
    intervalDays = 1;
  } else if (repetitions === 2) {
    intervalDays = 6;
  } else {
    intervalDays = Math.round(input.intervalDays * easeFactor);
  }

  return {
    easeFactor,
    intervalDays,
    repetitions,
    nextReviewAt: addDays(now, intervalDays),
  };
}

export function ratingToGrade(rating: Rating): Grade {
  return RATING_TO_GRADE[rating];
}
