import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type { View } from "../App";
import { exercises } from "../data/exercises";
import { getDailyWorkout, getExerciseDuration } from "../utils/schedule";

interface Props {
  onNavigate: (view: View) => void;
}

const steps = [
  {
    step: "1",
    title: "Pick Your Exercise",
    desc: "Start with Push-ups to warm up your upper body.",
  },
  {
    step: "2",
    title: "Timed Intervals",
    desc: "Give it your all for your week's duration, then rest briefly.",
  },
  {
    step: "3",
    title: "Advance & Repeat",
    desc: "Move to the next exercise until you've done all four.",
  },
];

export default function ExerciseListView({ onNavigate }: Props) {
  const todaysIds = getDailyWorkout().map((e) => e.id);
  const duration = getExerciseDuration();
  const [openVideos, setOpenVideos] = useState<Set<string>>(new Set());

  const toggleVideo = (id: string) => {
    setOpenVideos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img
            src="/assets/generated/homefit-logo-transparent.dim_400x200.png"
            alt="HomeFit"
            className="h-9 w-auto"
          />
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            data-ocid="exercises.back.link"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Exercise Library
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Eight equipment-free movements. Different ones rotate in each day
              for a complete full-body program.
            </p>
            <p className="mt-3 text-sm font-semibold text-accent">
              ⏱ {duration}s per exercise this week
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {exercises.map((ex, i) => (
              <div
                key={ex.id}
                className="bg-white rounded-2xl p-7 shadow-card border border-border flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
                data-ocid={`exercises.item.${i + 1}`}
              >
                <div className="text-5xl mb-4">{ex.icon}</div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-foreground text-xl">
                    {ex.name}
                  </h3>
                  {todaysIds.includes(ex.id) && (
                    <Badge className="bg-primary text-primary-foreground text-xs font-bold shrink-0">
                      Today
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed flex-1">
                  {ex.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="font-semibold">
                    {duration}s
                  </Badge>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10 font-semibold">
                    {ex.difficulty}
                  </Badge>
                </div>
                {ex.videoUrl && (
                  <div className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleVideo(ex.id)}
                      className="w-full text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors px-4 py-2 rounded-lg flex items-center justify-center gap-1.5"
                      data-ocid={`exercises.watch_demo.button.${i + 1}`}
                    >
                      {openVideos.has(ex.id) ? "✕ Hide Demo" : "▶ Watch Demo"}
                    </button>
                    {openVideos.has(ex.id) && (
                      <div
                        className="mt-3 w-full"
                        style={{ aspectRatio: "16/9" }}
                      >
                        <iframe
                          src={ex.videoUrl}
                          title={`${ex.name} demo`}
                          className="w-full h-full rounded-xl"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="bg-hero-bg rounded-3xl p-8 md:p-10 mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((s) => (
                <div key={s.step} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-extrabold text-sm">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">
                      {s.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => onNavigate("workout")}
              className="bg-accent text-accent-foreground font-bold px-12 py-4 rounded-xl hover:opacity-90 transition-opacity text-base"
              data-ocid="exercises.start_workout.button"
            >
              🔥 Start Full Workout
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
