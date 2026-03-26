export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  icon: string;
  videoUrl?: string;
}

export const exercises: Exercise[] = [
  {
    id: "push-ups",
    name: "Push-ups",
    description: "Works chest, shoulders, and triceps.",
    duration: 30,
    difficulty: "Beginner",
    icon: "💪",
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
  },
  {
    id: "squats",
    name: "Squats",
    description: "Strengthens legs and glutes.",
    duration: 30,
    difficulty: "Beginner",
    icon: "🦵",
    videoUrl: "https://www.youtube.com/embed/aclHkVaku9U",
  },
  {
    id: "plank",
    name: "Plank",
    description: "Core stability and endurance.",
    duration: 30,
    difficulty: "Beginner",
    icon: "🧘",
    videoUrl: "https://www.youtube.com/embed/pSHjTRCQxIw",
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    description: "Full-body cardio warmup.",
    duration: 30,
    difficulty: "Beginner",
    icon: "⚡",
    videoUrl: "https://www.youtube.com/embed/iSSAk4XCsRA",
  },
  {
    id: "lunges",
    name: "Lunges",
    description: "Tones legs and improves balance.",
    duration: 30,
    difficulty: "Beginner",
    icon: "🚶",
    videoUrl: "https://www.youtube.com/embed/QOVaHwm-Q6U",
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    description: "High-intensity full-body cardio.",
    duration: 30,
    difficulty: "Intermediate",
    icon: "🏔️",
    videoUrl: "https://www.youtube.com/embed/nmwgirgXLYM",
  },
  {
    id: "burpees",
    name: "Burpees",
    description: "Total body strength and cardio blast.",
    duration: 30,
    difficulty: "Intermediate",
    icon: "🔥",
    videoUrl: "https://www.youtube.com/embed/dZgVxmf6jkA",
  },
  {
    id: "high-knees",
    name: "High Knees",
    description: "Boosts cardio and leg drive.",
    duration: 30,
    difficulty: "Beginner",
    icon: "🏃",
    videoUrl: "https://www.youtube.com/embed/tx5rgpDAJRI",
  },
];
