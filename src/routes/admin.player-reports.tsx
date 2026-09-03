import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/player-reports")({
  head: () => ({
    meta: [
      { title: "Player Reports — Crew On Set! Admin" },
      { name: "description", content: "Review player-submitted reports." },
    ],
  }),
  component: PlayerReportsRouteComponent,
});

import { useMemo, useState } from "react";
import { Eye, FileText, Search, UserRound, X } from "lucide-react";
import { playerReportsStore, type PlayerReport, type PlayerReportStatus } from "@/lib/demo/store";

const statuses: PlayerReportStatus[] = ["New", "Investigating", "Resolved"];
const statusStyles: Record<PlayerReportStatus, string> = {
  New: "bg-coral/15 text-[#ff7663]",
  Investigating: "bg-[#d9a514]/15 text-[#e1b42b]",
  Resolved: "bg-[#2d9d8f]/15 text-[#4bc4b4]",
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

function PlayerReportsRouteComponent() {
  const [reports, setReports] = playerReportsStore.useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All Statuses" | PlayerReportStatus>("All Statuses");
  const [selected, setSelected] = useState<PlayerReport | null>(null);
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return reports.filter(
      (report) =>
        (!search ||
          `${report.id} ${report.reporterName} ${report.reportedUsername} ${report.reportType} ${report.description}`
            .toLowerCase()
            .includes(search)) &&
        (status === "All Statuses" || report.status === status),
    );
  }, [reports, query, status]);

  function updateStatus(report: PlayerReport, next: PlayerReportStatus) {
    setReports(reports.map((item) => (item.id === report.id ? { ...item, status: next } : item)));
    if (selected?.id === report.id) setSelected({ ...report, status: next });
  }

  return (
    <div className="admin-page h-full overflow-y-auto bg-[#101923] text-white">
      <header className="mb-8">
        <p className="text-xs font-black tracking-[.18em] !text-coral">SUPPORT</p>
        <h1 className="admin-heading mt-2 !text-white">Player Reports</h1>
        <p className="admin-kicker !text-white/45">
          Review every player-submitted report and its supporting evidence.
        </p>
      </header>
      <section className="admin-card mb-4 flex flex-col gap-3 rounded-lg border border-white/[0.06] bg-[#182330] p-4 shadow-xl sm:flex-row">
        <label className="relative block flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 !text-white/30" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reports, players, or descriptions"
            className="admin-input h-11 w-full rounded-md border border-white/10 bg-[#101923] pl-10 pr-3 text-sm font-bold !text-white outline-none placeholder:!text-white/25 focus:border-coral"
          />
        </label>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof status)}
          className="admin-input h-11 rounded-md border border-white/10 bg-[#101923] px-3 text-sm font-bold !text-white outline-none focus:border-coral"
        >
          <option>All Statuses</option>
          {statuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </section>
      <section className="admin-table-wrap overflow-hidden rounded-lg border border-white/[0.06] bg-[#182330] shadow-xl">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[1050px] w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#141e29]">
                {[
                  "Report",
                  "Reporter",
                  "Reported Player",
                  "Type",
                  "Description",
                  "Submitted",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((report) => (
                <tr key={report.id} className="border-b border-white/[0.05] hover:bg-white/[0.025]">
                  <td className="px-5 py-4 text-xs font-black !text-coral">{report.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold !text-white">{report.reporterName}</p>
                    <p className="text-[10px] !text-white/30">{report.reporterId}</p>
                  </td>
                  <td className="px-5 py-4 text-sm !text-white/70">{report.reportedUsername}</td>
                  <td className="px-5 py-4 text-sm !text-white/60">{report.reportType}</td>
                  <td className="max-w-xs px-5 py-4 text-sm !text-white/50">
                    <p className="truncate">{report.description}</p>
                  </td>
                  <td className="px-5 py-4 text-xs !text-white/40">
                    {formatDate(report.submittedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={report.status}
                      onChange={(event) =>
                        updateStatus(report, event.target.value as PlayerReportStatus)
                      }
                      className={`rounded px-2.5 py-1.5 text-[10px] font-black uppercase outline-none ${statusStyles[report.status]}`}
                    >
                      {statuses.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelected(report)}
                      aria-label={`View ${report.id}`}
                      className="grid size-8 place-items-center rounded-md border border-white/10 !text-white/60 hover:border-coral hover:!text-white"
                    >
                      <Eye className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-sm !text-white/35">
                    <UserRound className="mx-auto mb-2 size-8 !text-white/20" />
                    No player reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {selected && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#151c28] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-black uppercase text-white">{selected.id}</h2>
              <button onClick={() => setSelected(null)} aria-label="Close report">
                <X className="size-5 text-white/40" />
              </button>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-black uppercase text-white/35">Reporter</dt>
                <dd className="mt-1 text-sm text-white/80">
                  {selected.reporterName} ({selected.reporterId})
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-black uppercase text-white/35">Reported player</dt>
                <dd className="mt-1 text-sm text-white/80">{selected.reportedUsername}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-black uppercase text-white/35">Report type</dt>
                <dd className="mt-1 text-sm text-white/80">{selected.reportType}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-black uppercase text-white/35">Submitted</dt>
                <dd className="mt-1 text-sm text-white/80">{formatDate(selected.submittedAt)}</dd>
              </div>
            </dl>
            <p className="mt-5 text-[10px] font-black uppercase text-white/35">Description</p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-white/70">
              {selected.description}
            </p>
            {selected.attachmentUrl ? (
              <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-3">
                {selected.attachmentType?.startsWith("image/") ||
                selected.attachmentUrl.startsWith("data:image/") ? (
                  <img
                    src={selected.attachmentUrl}
                    alt={selected.attachmentName || "Player report attachment"}
                    className="max-h-72 w-full rounded object-contain"
                  />
                ) : (
                  <iframe
                    src={selected.attachmentUrl}
                    title={selected.attachmentName || "Player report PDF"}
                    className="h-72 w-full rounded bg-white"
                  />
                )}
                <a
                  href={selected.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-md border border-coral/40 px-3 py-2 text-[10px] font-black uppercase text-coral hover:bg-coral hover:text-white"
                >
                  <FileText className="size-3.5" />
                  Open attached file
                </a>
              </div>
            ) : selected.attachmentName ? (
              <p className="mt-5 rounded border border-white/10 p-3 text-xs text-white/40">
                Attachment “{selected.attachmentName}” has no retained file content.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerReportsRouteComponent;
