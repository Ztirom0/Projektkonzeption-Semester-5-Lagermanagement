import { useState, useEffect } from "react";
import { AlarmProvider } from "./context/AlarmContext";
import "./i18n";

import DummyHome from "./components/DummyHome";

export default function App() {
  return (
    <AlarmProvider>
      <DummyHome />
    </AlarmProvider>
  );
}
