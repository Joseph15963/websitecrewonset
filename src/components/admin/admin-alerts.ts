import type { ActiveAd, PartnershipApplication } from "@/lib/demo/store";

export type AdminAlert = {
  id: string;
  title: string;
  body: string;
  kind: "application" | "ad" | "system";
  /** In-app destination this alert links to when clicked. */
  href: string;
};

export function buildAlerts(
  applications: PartnershipApplication[],
  ads: ActiveAd[],
): AdminAlert[] {
  const alerts: AdminAlert[] = [];

  applications
    .filter((application) => application.status === "Pending")
    .slice(0, 5)
    .forEach((application) => {
      alerts.push({
        id: `app-${application.id}`,
        title: "New partnership application",
        body: `${application.brand} submitted a proposal awaiting review.`,
        kind: "application",
        href: "/admin/partnerships",
      });
    });

  ads
    .filter((ad) => ad.status === "Expiring" || ad.status === "Expired")
    .forEach((ad) => {
      alerts.push({
        id: `ad-${ad.id}`,
        title: ad.status === "Expired" ? "Advertisement expired" : "Advertisement expiring soon",
        body: `${ad.brand} — ${ad.exactModel} (${ad.status}).`,
        kind: "ad",
        href: `/admin/ads/${ad.id}`,
      });
    });

  alerts.push({
    id: "sys-1",
    title: "Server status: Operational",
    body: "All studio servers reporting healthy uptime — 99.98% (30d).",
    kind: "system",
    href: "/admin",
  });

  return alerts;
}
