import { Badge } from "@/components/ui/badge";
import type { View } from "../App";
import {
  getDailyWorkout,
  getDayLabel,
  getExerciseDuration,
} from "../utils/schedule";

interface Props {
  onNavigate: (view: View) => void;
  onSignOut?: () => void;
}

const features = [
  {
    id: "intervals",
    icon: "⏱️",
    title: "Progressive Intervals",
    desc: "Timer increases by 5 seconds every week so you keep getting stronger.",
  },
  {
    id: "equipment",
    icon: "🏠",
    title: "Zero Equipment",
    desc: "Your bodyweight is your gym. No dumbbells, no machines needed.",
  },
  {
    id: "rotation",
    icon: "🔄",
    title: "Daily Rotation",
    desc: "Different exercises every day of the week to target all muscle groups.",
  },
];

export default function HomeView({ onNavigate, onSignOut }: Props) {
  const dailyExercises = getDailyWorkout();
  const duration = getExerciseDuration();
  const dayLabel = getDayLabel();
  const dayName = dayLabel.replace(" Routine", "");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img
            src="/assets/generated/groundfit-logo-transparent.dim_200x200.png"
            alt="GroundFit"
            className="h-10 w-auto"
          />
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.features.link"
            >
              Features
            </a>
            <a
              href="#workouts"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.workouts.link"
            >
              Workouts
            </a>
            <a
              href="#exercises"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.exercises.link"
            >
              Exercises
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("workout")}
              className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-xl hover:opacity-90 transition-opacity"
              data-ocid="nav.start_workout.button"
            >
              Get Started
            </button>
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="text-sm font-medium text-muted-foreground hover:text-foreground border border-border px-4 py-2 rounded-xl transition-colors"
                data-ocid="nav.signout.button"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-hero-bg py-24 px-6" id="workouts">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                🏠 No Equipment Needed
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
                Train Anywhere.
                <br />
                <span className="text-primary">No Equipment</span> Needed.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Build strength, endurance, and flexibility from the comfort of
                your home. Different exercises every day — progressively longer
                each week — just you and your goals.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate("workout")}
                  className="bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity text-base"
                  data-ocid="hero.start_workout.button"
                >
                  🚀 Start Workout
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("exercises")}
                  className="border-2 border-primary text-primary font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/5 transition-colors text-base"
                  data-ocid="hero.view_exercises.button"
                >
                  View Exercises
                </button>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4">
              {dailyExercises.map((ex, i) => (
                <div
                  key={ex.id}
                  className="bg-white rounded-2xl p-5 shadow-card border border-border animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="text-3xl mb-2">{ex.icon}</div>
                  <div className="font-bold text-foreground text-sm">
                    {ex.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {duration}s
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6" id="features">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Why GroundFit?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Everything you need for a complete workout session, right at
                home.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((f) => (
                <div
                  key={f.id}
                  className="bg-card rounded-2xl p-7 shadow-card border border-border"
                >
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="font-bold text-foreground text-lg mb-2">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exercise Preview */}
        <section className="py-20 px-6 bg-hero-bg" id="exercises">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                {dayName}'s Exercises
              </h2>
              <p className="text-muted-foreground text-lg">
                Four movements. Total body workout.
              </p>
              <p className="mt-2 text-sm font-semibold text-accent">
                ⏱ {duration}s per exercise this week
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
              {dailyExercises.map((ex, i) => (
                <div
                  key={ex.id}
                  className="bg-white rounded-2xl p-6 shadow-card border border-border text-center"
                  data-ocid={`exercises.item.${i + 1}`}
                >
                  <div className="text-5xl mb-4">{ex.icon}</div>
                  <h3 className="font-bold text-foreground text-lg mb-2">
                    {ex.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {ex.description}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {duration}s
                    </Badge>
                    <Badge className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/10">
                      {ex.difficulty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <button
                type="button"
                onClick={() => onNavigate("workout")}
                className="bg-accent text-accent-foreground font-bold px-10 py-4 rounded-xl hover:opacity-90 transition-opacity text-base"
                data-ocid="exercises.start_workout.button"
              >
                🔥 Start Full Workout
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img
            src="/assets/generated/groundfit-logo-transparent.dim_200x200.png"
            alt="GroundFit"
            className="h-8 w-auto opacity-70"
          />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GroundFit. Built with ❤️ using{" "}
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
