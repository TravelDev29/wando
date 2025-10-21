"use client";
import { useState } from "react";
import { AppLayout } from "../../layouts/app-layout";
import { ChatProvider } from "../../providers/chat-provider";
import { Banner } from "../../components/custom/banner";

type Stop = { time: string; title: string; note?: string };
type Day = { title: string; stops: Stop[]; budget?: string };

const CITY_PRESETS: Record<string, Day[]> = {
  Dublin: [
    {
      title: "Day 1 — City Core & Guinness",
      stops: [
        { time: "09:30", title: "Trinity College & Book of Kells" },
        { time: "11:30", title: "Grafton St. coffee stroll" },
        { time: "13:00", title: "Lunch in Temple Bar (avoid tourist traps!)" },
        { time: "15:00", title: "Guinness Storehouse tour" },
        { time: "18:00", title: "Dinner around Camden St." },
      ],
      budget: "~€70/day (food + tickets)",
    },
    {
      title: "Day 2 — Coast & Howth",
      stops: [
        { time: "10:00", title: "DART to Howth" },
        { time: "11:00", title: "Cliff walk (easy loop)" },
        { time: "13:30", title: "Seafood lunch by the harbour" },
        { time: "16:00", title: "Back to city — Merrion Sq." },
        { time: "19:00", title: "Pints & trad music (The Cobblestone)" },
      ],
      budget: "~€65/day",
    },
  ],
  Paris: [
    {
      title: "Day 1 — Left Bank Classics",
      stops: [
        { time: "09:30", title: "Notre-Dame (exterior) & Île de la Cité" },
        { time: "11:00", title: "Sainte-Chapelle" },
        { time: "13:00", title: "Bistro lunch in Latin Quarter" },
        { time: "15:00", title: "Musée d'Orsay (2–3h)" },
        { time: "18:30", title: "Seine sunset walk" },
      ],
      budget: "~€75/day",
    },
    {
      title: "Day 2 — Right Bank & Eiffel",
      stops: [
        { time: "10:00", title: "Louvre (morning entry) — highlights route" },
        { time: "13:00", title: "Tuileries → Place de la Concorde" },
        { time: "15:00", title: "Champs-Élysées → Arc de Triomphe" },
        { time: "18:00", title: "Eiffel Tower view from Trocadéro" },
      ],
      budget: "~€80/day",
    },
  ],
  Rome: [
    {
      title: "Day 1 — Ancient Rome Loop",
      stops: [
        { time: "09:00", title: "Colosseum (skip-the-line if possible)" },
        { time: "11:30", title: "Roman Forum & Palatine Hill" },
        { time: "14:00", title: "Carbonara in Monti" },
        { time: "16:00", title: "Trevi Fountain → Spanish Steps" },
        { time: "19:00", title: "Trastevere dinner" },
      ],
      budget: "~€65/day",
    },
    {
      title: "Day 2 — Vatican & Centro",
      stops: [
        { time: "08:30", title: "Vatican Museums → Sistine Chapel" },
        { time: "12:00", title: "St. Peter's Basilica & dome" },
        { time: "15:00", title: "Pantheon & gelato stop" },
        { time: "18:30", title: "Piazza Navona → Aperitivo" },
      ],
      budget: "~€70/day",
    },
  ],
};

export default function ChatPage() {
  const [city, setCity] = useState<string | null>(null);
  const [days, setDays] = useState<Day[] | null>(null);
  const [loading, setLoading] = useState(false);

  function chooseCity(c: string) {
    setLoading(true);
    setDays(null);
    setCity(c);
    setTimeout(() => {
      setDays(CITY_PRESETS[c]);
      setLoading(false);
    }, 700);
  }

  return (
    <AppLayout>
      <Banner />
      <ChatProvider>
        <main className="min-h-screen max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-semibold">Wando Chat (Demo)</h1>
          <p className="text-gray-600 mt-2">
            Pick a city chip below. Wando will show a free 2-day preview.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {Object.keys(CITY_PRESETS).map((c) => (
              <button
                key={c}
                onClick={() => chooseCity(c)}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  city === c ? "bg-cyan-600 text-white border-cyan-600" : "hover:bg-gray-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-6 h-40 w-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center text-gray-500">
            [ static map preview — Days 1–2 only ]
          </div>

          {loading && (
            <div className="mt-6 text-sm text-gray-600">
              <span className="inline-block rounded-full bg-gray-100 px-3 py-2">
                Wando is planning…
              </span>
            </div>
          )}

          {!loading && !days && (
            <div className="mt-6 text-gray-600">Select a city to see your 2-day plan.</div>
          )}

          {!loading && days && (
            <div className="mt-6 space-y-4">
              <div className="text-sm text-gray-500">
                Hours and tickets can change — double-check official sites.
              </div>

              {days.map((d, i) => (
                <div key={i} className="rounded-2xl border p-4">
                  <h3 className="font-medium">{d.title}</h3>
                  <ul className="mt-2 space-y-1">
                    {d.stops.map((s, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="font-mono text-xs mr-2 text-gray-500">{s.time}</span>
                        {s.title}
                      </li>
                    ))}
                  </ul>
                  {d.budget && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Rough budget:</span> {d.budget}
                    </div>
                  )}
                </div>
              ))}

              <div className="rounded-2xl border border-dashed p-4 text-gray-500">
                Days 3–14 are locked in the demo. Full route + transit shown after unlock.
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  disabled
                  title="Demo only — coming soon"
                  className="px-4 py-2 rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed"
                >
                  Export PDF (teaser)
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white"
                  onClick={() => alert("Demo: paywall coming soon")}
                >
                  Unlock full trip
                </button>
              </div>
            </div>
          )}
        </main>
      </ChatProvider>
    </AppLayout>
  );
}
