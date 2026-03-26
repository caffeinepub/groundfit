import { useCallback, useEffect, useRef, useState } from "react";
import type { View } from "../App";
import {
  getDailyWorkout,
  getDayLabel,
  getExerciseDuration,
} from "../utils/schedule";

interface Props {
  onNavigate: (view: View) => void;
}

function playTimerEndSound() {
  try {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    const playBeep = (startTime: number, freq: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.5, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    const now = ctx.currentTime;
    playBeep(now, 880, 0.18);
    playBeep(now + 0.22, 880, 0.18);
    playBeep(now + 0.44, 1100, 0.35);
  } catch {
    // AudioContext not supported — silently skip
  }
}

// ── Background beat engine ──────────────────────────────────────────────────
class BeatEngine {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private schedulerTimer: ReturnType<typeof setInterval> | null = null;
  private nextBeatTime = 0;
  private beatIndex = 0;
  private readonly bpm = 148;
  private readonly scheduleAhead = 0.12; // seconds
  private readonly scheduleInterval = 50; // ms

  constructor() {
    this.ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  private scheduleNote(type: "kick" | "snare" | "hihat", time: number) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    if (type === "kick") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(80, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.07);
      gain.gain.setValueAtTime(1.0, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
      osc.start(time);
      osc.stop(time + 0.13);
    } else if (type === "snare") {
      // white-noise-like via sawtooth at mid-freq
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, time);
      gain.gain.setValueAtTime(0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
      osc.start(time);
      osc.stop(time + 0.09);
    } else {
      // hi-hat: square at high freq, very short
      osc.type = "square";
      osc.frequency.setValueAtTime(8000, time);
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
      osc.start(time);
      osc.stop(time + 0.035);
    }
  }

  private scheduleBeat() {
    const beatDuration = 60 / this.bpm;
    const eighth = beatDuration / 2;

    while (this.nextBeatTime < this.ctx.currentTime + this.scheduleAhead) {
      const beat = this.beatIndex % 8; // 8 eighth notes in a bar
      const t = this.nextBeatTime;

      // Kick on beats 1 (0) and 3 (4)
      if (beat === 0 || beat === 4) this.scheduleNote("kick", t);
      // Snare on beats 2 (2) and 4 (6)
      if (beat === 2 || beat === 6) this.scheduleNote("snare", t);
      // Hi-hat on every eighth note
      this.scheduleNote("hihat", t);

      this.nextBeatTime += eighth;
      this.beatIndex++;
    }
  }

  start() {
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.nextBeatTime = this.ctx.currentTime + 0.05;
    this.schedulerTimer = setInterval(
      () => this.scheduleBeat(),
      this.scheduleInterval,
    );
  }

  pause() {
    if (this.schedulerTimer !== null) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    this.ctx.suspend();
  }

  resume() {
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.nextBeatTime = this.ctx.currentTime + 0.05;
    this.schedulerTimer = setInterval(
      () => this.scheduleBeat(),
      this.scheduleInterval,
    );
  }

  setMuted(muted: boolean) {
    this.masterGain.gain.setTargetAtTime(
      muted ? 0 : 0.28,
      this.ctx.currentTime,
      0.05,
    );
  }

  stop() {
    if (this.schedulerTimer !== null) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    try {
      this.ctx.close();
    } catch {
      // ignore
    }
  }
}
// ────────────────────────────────────────────────────────────────────────────

export default function WorkoutView({ onNavigate }: Props) {
  const dailyExercises = getDailyWorkout();
  const TOTAL_TIME = getExerciseDuration();
  const dayLabel = getDayLabel();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  // Keep ref in sync so the isRunning effect can read it without dep
  useEffect(() => {
    musicEnabledRef.current = musicEnabled;
  }, [musicEnabled]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const beatRef = useRef<BeatEngine | null>(null);
  const musicEnabledRef = useRef(true);

  // Start / pause beat when isRunning changes
  useEffect(() => {
    if (isComplete) return;
    if (isRunning) {
      if (!beatRef.current) {
        try {
          beatRef.current = new BeatEngine();
          beatRef.current.setMuted(!musicEnabledRef.current);
          beatRef.current.start();
        } catch {
          // Web Audio not supported
        }
      } else {
        beatRef.current.resume();
      }
    } else {
      beatRef.current?.pause();
    }
  }, [isRunning, isComplete]);

  // Mute / unmute on toggle
  useEffect(() => {
    beatRef.current?.setMuted(!musicEnabled);
  }, [musicEnabled]);

  // Stop beat when workout completes
  useEffect(() => {
    if (isComplete) {
      beatRef.current?.stop();
      beatRef.current = null;
    }
  }, [isComplete]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      beatRef.current?.stop();
      beatRef.current = null;
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const goToNext = useCallback(() => {
    clearTimer();
    const next = currentIndex + 1;
    if (next >= dailyExercises.length) {
      setIsComplete(true);
      setIsRunning(false);
    } else {
      setCurrentIndex(next);
      setTimeLeft(TOTAL_TIME);
      setIsRunning(false);
      setShowVideo(false);
    }
  }, [currentIndex, clearTimer, dailyExercises.length, TOTAL_TIME]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [isRunning, clearTimer]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      clearTimer();
      setIsRunning(false);
      playTimerEndSound();
      setTimeout(() => goToNext(), 800);
    }
  }, [timeLeft, isRunning, clearTimer, goToNext]);

  const handleStart = () => {
    if (isComplete) return;
    setIsRunning(true);
  };

  const handleNext = () => {
    setShowVideo(false);
    goToNext();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setTimeLeft(TOTAL_TIME);
    setIsRunning(false);
    setIsComplete(false);
    setShowVideo(false);
  };

  const exercise = dailyExercises[currentIndex];
  const progress = (timeLeft / TOTAL_TIME) * 100;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="min-h-screen bg-hero-bg flex flex-col">
      {/* Nav */}
      <header className="bg-white border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img
            src="/assets/generated/homefit-logo-transparent.dim_400x200.png"
            alt="HomeFit"
            className="h-9 w-auto"
          />
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {dayLabel}
            </span>
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              data-ocid="workout.back.link"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {isComplete ? (
            <div className="bg-white rounded-3xl shadow-card border border-border p-10 text-center animate-fade-in">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-extrabold text-foreground mb-3">
                Workout Complete!
              </h2>
              <p className="text-muted-foreground mb-8">
                Amazing work! You finished today's {dayLabel}.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                  data-ocid="workout.restart.button"
                >
                  🔁 Restart Workout
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("home")}
                  className="border-2 border-border text-muted-foreground font-semibold px-8 py-3.5 rounded-xl hover:border-primary hover:text-primary transition-colors"
                  data-ocid="workout.home.button"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-card border border-border p-8 md:p-10 animate-fade-in">
              {/* Progress indicator */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-semibold text-muted-foreground">
                  Exercise {currentIndex + 1} of {dailyExercises.length}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {dailyExercises.map((ex, i) => (
                      <div
                        key={ex.id}
                        className={`h-2 w-8 rounded-full transition-colors ${
                          i < currentIndex
                            ? "bg-primary"
                            : i === currentIndex
                              ? isRunning
                                ? "bg-accent"
                                : "bg-primary/40"
                              : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  {/* Mute toggle */}
                  <button
                    type="button"
                    onClick={() => setMusicEnabled((v) => !v)}
                    title={musicEnabled ? "Mute music" : "Unmute music"}
                    className="ml-1 text-lg leading-none text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid="workout.music.toggle"
                  >
                    {musicEnabled ? "🔊" : "🔇"}
                  </button>
                </div>
              </div>

              {/* Exercise name */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{exercise.icon}</div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
                  {exercise.name}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {exercise.description}
                </p>
              </div>

              {/* Watch Demo button and video */}
              {exercise.videoUrl && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setShowVideo((v) => !v)}
                    className="w-full text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5"
                    data-ocid="workout.watch_demo.button"
                  >
                    {showVideo ? "✕ Hide Demo" : "▶ Watch Demo"}
                  </button>
                  {showVideo && (
                    <div
                      className="mt-3 w-full"
                      style={{ aspectRatio: "16/9" }}
                    >
                      <iframe
                        src={exercise.videoUrl}
                        title={`${exercise.name} demo`}
                        className="w-full h-full rounded-xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Circular timer */}
              <div className="flex justify-center mb-8">
                <div className="relative" style={{ width: 140, height: 140 }}>
                  <svg
                    width="140"
                    height="140"
                    className="-rotate-90"
                    role="img"
                    aria-label="Workout timer progress"
                  >
                    <circle
                      cx="70"
                      cy="70"
                      r="54"
                      fill="none"
                      stroke="oklch(var(--border))"
                      strokeWidth="10"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r="54"
                      fill="none"
                      stroke={
                        isRunning
                          ? "oklch(var(--accent))"
                          : "oklch(var(--primary))"
                      }
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      style={{
                        transition:
                          "stroke-dashoffset 0.9s linear, stroke 0.3s ease",
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={`text-4xl font-extrabold ${
                        isRunning ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {timeLeft}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      sec
                    </span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                {!isRunning ? (
                  <button
                    type="button"
                    onClick={handleStart}
                    className="flex-1 bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                    data-ocid="workout.start.button"
                  >
                    ▶ Start
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      clearTimer();
                      setIsRunning(false);
                    }}
                    className="flex-1 bg-primary/10 text-primary font-bold py-3.5 rounded-xl hover:bg-primary/20 transition-colors"
                    data-ocid="workout.pause.button"
                  >
                    ⏸ Pause
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-accent text-accent-foreground font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                  data-ocid="workout.next.button"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
