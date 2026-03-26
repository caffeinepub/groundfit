import { useState } from "react";
import ExerciseListView from "./views/ExerciseListView";
import HomeView from "./views/HomeView";
import SignInView from "./views/SignInView";
import WorkoutView from "./views/WorkoutView";

export type View = "home" | "workout" | "exercises";

function readStoredUser() {
  try {
    const raw = localStorage.getItem("homefit_user");
    if (raw) {
      JSON.parse(raw);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [isAuthenticated, setIsAuthenticated] = useState(readStoredUser);

  function handleSignOut() {
    localStorage.removeItem("homefit_user");
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <SignInView onSignIn={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {view === "home" && (
        <HomeView onNavigate={setView} onSignOut={handleSignOut} />
      )}
      {view === "workout" && <WorkoutView onNavigate={setView} />}
      {view === "exercises" && <ExerciseListView onNavigate={setView} />}
    </div>
  );
}
