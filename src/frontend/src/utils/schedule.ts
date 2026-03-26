import type { Exercise } from "../data/exercises";
import { exercises } from "../data/exercises";

// Returns 4 exercises for a given date based on day-of-week (0=Sun...6=Sat)
export function getDailyWorkout(date: Date = new Date()): Exercise[] {
  const day = date.getDay(); // 0-6
  const shifted = [
    ...exercises.slice(day % exercises.length),
    ...exercises.slice(0, day % exercises.length),
  ];
  return shifted.slice(0, 4);
}

// Returns exercise duration in seconds (fixed at 60s).
export function getExerciseDuration(_date: Date = new Date()): number {
  return 60;
}

// Returns a friendly day label like "Monday Routine"
export function getDayLabel(date: Date = new Date()): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return `${days[date.getDay()]} Routine`;
}
