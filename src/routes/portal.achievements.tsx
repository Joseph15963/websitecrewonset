import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Crew On Set!" },
      { name: "description", content: "Track your on-set achievements and production milestones." },
      { property: "og:title", content: "Achievements — Crew On Set!" },
      { property: "og:description", content: "Track your on-set achievements and production milestones." },
    ],
  }),
  component: AchievementsPage,
});

import { useMemo, useState } from "react";
import {
  Award,
  Camera,
  CheckCircle2,
  Clapperboard,
  Crown,
  Film,
  Lock,
  Medal,
  Star,
  Trophy,
  Users,
  X,
} from "lucide-react";

type Achievement = {
  name: string;
  description: string;
  date?: string;
  unlocked: boolean;
  icon: typeof Star;
  progress?: string;
  percent?: number;
  requirement?: string;
};

const achievements: Achievement[] = [
  {
    name: "Perfect Take",
    description: "Earn a 100% production rating.",
    date: "Aug 02, 2026",
    unlocked: true,
    icon: Star,
    requirement: "Earn a perfect 100% production rating.",
  },
  {
    name: "Box Office Hit",
    description: "Score over 100,000 in one production.",
    date: "Jul 19, 2026",
    unlocked: true,
    icon: Trophy,
    requirement: "Score more than 100,000 points in a single production.",
  },
  {
    name: "First Day on Set",
    description: "Complete your first production.",
    date: "Mar 14, 2025",
    unlocked: true,
    icon: Clapperboard,
    requirement: "Complete your first production.",
  },
  {
    name: "One More Take",
    description: "Replay a production five times.",
    date: "Jun 04, 2026",
    unlocked: true,
    icon: Camera,
    requirement: "Replay any production five times.",
  },
  {
    name: "Production Veteran",
    description: "Complete 100 productions.",
    progress: "87/100 Productions",
    percent: 87,
    unlocked: false,
    icon: Film,
    requirement: "Complete 100 productions.",
  },
  {
    name: "Department Head",
    description: "Reach Crew Level 50.",
    progress: "27/50 Crew Level",
    percent: 54,
    unlocked: false,
    icon: Award,
    requirement: "Reach Crew Level 50.",
  },
  {
    name: "Legendary Crew",
    description: "Work with ten legendary players.",
    progress: "2/10 Legendary Crew",
    percent: 20,
    unlocked: false,
    icon: Users,
    requirement: "Work with ten legendary crew members.",
  },
  {
    name: "Flawless Reel",
    description: "Earn ten perfect scores.",
    progress: "3/10 Perfect Scores",
    percent: 30,
    unlocked: false,
    icon: Crown,
    requirement: "Earn ten perfect production scores.",
  },
];

function AchievementsPage() {
  const [filter, setFilter] = useState("All");
  const [achievementSort, setAchievementSort] = useState("Recent");

  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const shownAchievements = useMemo(() => {
    const filtered = achievements.filter((item) => {
      if (filter === "Unlocked") {
        return item.unlocked;
      }

      if (filter === "Locked") {
        return !item.unlocked;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (a.unlocked && b.unlocked) {
        const dateA = new Date(a.date ?? 0).getTime();
        const dateB = new Date(b.date ?? 0).getTime();

        if (achievementSort === "Oldest") {
          return dateA - dateB;
        }

        return dateB - dateA;
      }

      if (a.unlocked && !b.unlocked) {
        return -1;
      }

      if (!a.unlocked && b.unlocked) {
        return 1;
      }

      return 0;
    });
  }, [filter, achievementSort]);

  return (
    <div className="min-h-screen bg-[#0d121c] px-4 pb-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] pt-8 sm:pt-10">

        {/* =========================================================
            PAGE HEADER
        ========================================================= */}

        <header>
          <p className="text-xs font-black tracking-[.18em] text-coral">
            MILESTONES
          </p>

          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
            My Achievements
          </h1>
        </header>

        {/* =========================================================
            ACHIEVEMENTS
        ========================================================= */}

        <section className="mt-7">

          <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] sm:flex-row sm:items-end">

            <div className="flex gap-6">

              {["All", "Unlocked", "Locked"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`border-b-2 pb-3 text-xs font-black uppercase tracking-[0.1em] transition ${
                    filter === tab
                      ? "border-coral text-white"
                      : "border-transparent text-white/35 hover:text-white/70"
                  }`}
                >
                  {tab}
                </button>
              ))}

            </div>

            <select
              value={achievementSort}
              onChange={(e) =>
                setAchievementSort(e.target.value)
              }
              className="mb-2 rounded-md border border-white/10 bg-[#151c29] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white/70 outline-none transition focus:border-coral"
            >
              <option value="Recent">
                Recent
              </option>

              <option value="Oldest">
                Oldest
              </option>
            </select>

          </div>

          {/* ACHIEVEMENT CARDS */}

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {shownAchievements.map((achievement) => {
              const AchievementIcon = achievement.icon;

              return (
                <button
                  key={achievement.name}
                  type="button"
                  onClick={() =>
                    setSelectedAchievement(achievement)
                  }
                  className={`group rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-1 ${
                    achievement.unlocked
                      ? "border-yellow/20 bg-[#151c29] hover:border-yellow/40 hover:bg-[#182131]"
                      : "border-white/[0.06] bg-[#151c29] opacity-60 hover:opacity-100"
                  }`}
                >

                  <div className="flex items-start gap-4">

                    <div
                      className={`grid size-14 shrink-0 place-items-center rounded-lg ${
                        achievement.unlocked
                          ? "bg-yellow text-[#0d121c] shadow-lg"
                          : "bg-white/[0.06] text-white/25"
                      }`}
                    >
                      <AchievementIcon className="size-7" />
                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <h3 className="font-black uppercase text-white">
                          {achievement.name}
                        </h3>

                        {achievement.unlocked ? (
                          <Medal className="size-4 shrink-0 text-yellow" />
                        ) : (
                          <Lock className="size-3.5 shrink-0 text-white/25" />
                        )}

                      </div>

                      <p className="mt-1 text-sm leading-relaxed text-white/45">
                        {achievement.description}
                      </p>

                    </div>

                  </div>

                  {achievement.unlocked ? (
                    <div className="mt-5 flex items-center justify-between">

                      <p className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                        Unlocked {achievement.date}
                      </p>

                      <CheckCircle2 className="size-4 text-emerald-300" />

                    </div>
                  ) : (
                    <div className="mt-5">

                      <div className="mb-2 flex justify-between text-[10px] font-black uppercase text-white/30">

                        <span>
                          {achievement.progress}
                        </span>

                        <span>
                          {achievement.percent}%
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">

                        <div
                          className="h-full rounded-full bg-coral transition-all duration-500"
                          style={{
                            width: `${achievement.percent}%`,
                          }}
                        />

                      </div>

                    </div>
                  )}

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-white/20 transition-colors group-hover:text-coral">
                    View details →
                  </p>

                </button>
              );
            })}

          </div>

          {shownAchievements.length === 0 && (
            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#151c29] p-10 text-center">

              <Trophy className="mx-auto size-10 text-white/20" />

              <h3 className="mt-4 font-black uppercase text-white">
                No achievements found
              </h3>

              <p className="mt-2 text-sm text-white/35">
                Try switching to another achievement filter.
              </p>

            </div>
          )}

        </section>

        {/* =========================================================
            ACHIEVEMENT MODAL
        ========================================================= */}

        {selectedAchievement && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-[#05080d]/80 p-4 backdrop-blur-md"
            onMouseDown={() =>
              setSelectedAchievement(null)
            }
          >

            <div
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151c29] p-6 text-white shadow-2xl shadow-black/50"
              onMouseDown={(e) =>
                e.stopPropagation()
              }
            >

              {/* X */}

              <button
                type="button"
                aria-label="Close achievement"
                onClick={() =>
                  setSelectedAchievement(null)
                }
                className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-white/[0.06] text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>

              {/* CENTERED ICON */}

              <div className="flex justify-center pt-2">

                <div
                  className={`grid size-16 place-items-center rounded-xl ${
                    selectedAchievement.unlocked
                      ? "bg-yellow text-[#0d121c] shadow-lg"
                      : "bg-white/[0.06] text-white/25"
                  }`}
                >
                  <selectedAchievement.icon className="size-8" />
                </div>

              </div>

              {/* CENTERED TITLE */}

              <div className="mt-5 text-center">

                <div className="flex items-center justify-center gap-2">

                  <h2 className="text-xl font-black uppercase text-white">
                    {selectedAchievement.name}
                  </h2>

                  {selectedAchievement.unlocked && (
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-300" />
                  )}

                </div>

                <p className="mt-2 text-sm leading-relaxed text-white/45">
                  {selectedAchievement.description}
                </p>

              </div>

              {/* REQUIREMENT */}

              <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.035] p-4 text-center">

                <p className="text-[10px] font-black uppercase tracking-wider text-white/30">
                  Requirement
                </p>

                <p className="mt-1 text-sm font-bold text-white/80">
                  {selectedAchievement.requirement}
                </p>

              </div>

              {/* UNLOCKED */}

              {selectedAchievement.unlocked ? (

                <div className="mt-5 flex items-center justify-center gap-2 text-sm font-black text-emerald-300">

                  <Medal className="size-5" />

                  <span>
                    Unlocked on {selectedAchievement.date}
                  </span>

                </div>

              ) : (

                <div className="mt-5">

                  <div className="flex justify-between text-xs font-black uppercase text-white/30">

                    <span>
                      {selectedAchievement.progress}
                    </span>

                    <span>
                      {selectedAchievement.percent}%
                    </span>

                  </div>

                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full rounded-full bg-coral transition-all duration-500"
                      style={{
                        width: `${selectedAchievement.percent}%`,
                      }}
                    />

                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
