import { useState } from "react";
import Intro from "./Intro";
import LoadingScreen from "./LoadingScreen";
import ShiftRoom from "./ShiftRoom";

export default function App() {
  const [phase, setPhase] = useState("intro");

  if (phase === "intro") {
    return <Intro onStart={() => setPhase("loading")} />;
  }

  if (phase === "loading") {
    return <LoadingScreen onLoaded={() => setPhase("shift")} />;
  }

  return <ShiftRoom />;
}
