import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox, MailWarning, Newspaper, Users, FileUser, ArrowRight, ExternalLink, PlusCircle, Edit3, UserPlus } from "lucide-react";
import { listDocs, countDocs, orderBy, where, limit } from "../lib/firestoreHelpers";
import { COLLECTIONS } from "../lib/collections";
import { useAuth } from "../context/useAuth";

type Lead = {
  $id: string;
  name: string;
  email: string;
  service_interest?: string;
  status?: string;
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function StatCard({ label, value, icon: Icon, accent, loading }: {
  label: string; value: number; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; accent: string; loading: boolean;
}) {
  return (
    <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: accent + "20" }}>
          <Icon size={20} style={{ color: accent }} />
        </div>
      </div>
      <p className="text-3xl font-extrabold mb-1" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>
        {loading ? "—" : value}
      </p>
      <p className="text-sm" style={{ color: "var(--gray)" }}>{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ leads: 0, unread: 0, blogs: 0, team: 0, newApplications: 0 });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [leadsCount, unreadCount, blogsCount, teamCount, newApplicationsCount, recent] = await Promise.all([
          countDocs(COLLECTIONS.leads),
          countDocs(COLLECTIONS.leads, [where("status", "==", "new")]),
          countDocs(COLLECTIONS.blogs, [where("status", "==", "published")]),
          countDocs(COLLECTIONS.team),
          countDocs(COLLECTIONS.careerApplications, [where("status", "==", "new")]),
          listDocs<Lead>(COLLECTIONS.leads, [orderBy("created_at", "desc"), limit(5)]),
        ]);
        setCounts({
          leads: leadsCount,
          unread: unreadCount,
          blogs: blogsCount,
          team: teamCount,
          newApplications: newApplicationsCount,
        });
        setRecentLeads(recent);
      } catch {
        setErrored(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const name = (user?.name || user?.email || "there").split(" ")[0].split("@")[0];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>
          {greeting()}, {name}!
        </h2>
        <p className="text-sm" style={{ color: "var(--gray)" }}>Here&apos;s what&apos;s happening across Yubhian today.</p>
      </div>

      {errored && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(245,158,11,0.08)", color: "var(--gold)", border: "1px solid rgba(245,158,11,0.25)" }}>
          Couldn&apos;t reach Firestore — showing empty data. Once your database is provisioned and env vars are set, this will populate automatically.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard label="Total Leads" value={counts.leads} icon={Inbox} accent="#2563EB" loading={loading} />
        <StatCard label="Unread Leads" value={counts.unread} icon={MailWarning} accent="#dc2626" loading={loading} />
        <StatCard label="Published Blogs" value={counts.blogs} icon={Newspaper} accent="#1D9E75" loading={loading} />
        <StatCard label="Team Members" value={counts.team} icon={Users} accent="#7F77DD" loading={loading} />
        <StatCard label="New Applications" value={counts.newApplications} icon={FileUser} accent="#D85A30" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent leads */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Recent Leads</h3>
            <Link to="/leads" className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--cyan)" }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: "var(--gray)" }}>No leads yet.</p>
          ) : (
            <div className="flex flex-col gap-1">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.$id}
                  to="/leads"
                  className="flex items-center justify-between gap-3 py-3 px-3 -mx-3 rounded-lg hover:bg-black/[0.03] transition-colors"
                  style={{ borderBottom: "1px solid rgba(15,23,42,0.06)" }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--white)" }}>{lead.name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--gray)" }}>{lead.email}</p>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: "rgba(37,99,235,0.15)", color: "var(--blue2)" }}
                  >
                    {lead.status ?? "new"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h3 className="font-bold mb-2" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Quick Actions</h3>
          <Link to="/blogs/new" className="flex items-center gap-2.5 text-sm px-3 py-2.5 rounded-lg hover:bg-black/[0.03] transition-colors" style={{ color: "var(--gray2)" }}>
            <PlusCircle size={16} style={{ color: "var(--cyan)" }} /> New Blog Post
          </Link>
          <Link to="/content" className="flex items-center gap-2.5 text-sm px-3 py-2.5 rounded-lg hover:bg-black/[0.03] transition-colors" style={{ color: "var(--gray2)" }}>
            <Edit3 size={16} style={{ color: "var(--cyan)" }} /> Edit Homepage Content
          </Link>
          <Link to="/team" className="flex items-center gap-2.5 text-sm px-3 py-2.5 rounded-lg hover:bg-black/[0.03] transition-colors" style={{ color: "var(--gray2)" }}>
            <UserPlus size={16} style={{ color: "var(--cyan)" }} /> Add Team Member
          </Link>
          <a href="https://yubhiantechnologies.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm px-3 py-2.5 rounded-lg hover:bg-black/[0.03] transition-colors" style={{ color: "var(--gray2)" }}>
            <ExternalLink size={16} style={{ color: "var(--cyan)" }} /> View Live Site
          </a>
          <Link to="/leads" className="flex items-center gap-2.5 text-sm px-3 py-2.5 rounded-lg hover:bg-black/[0.03] transition-colors" style={{ color: "var(--gray2)" }}>
            <Inbox size={16} style={{ color: "var(--cyan)" }} /> View Leads Inbox
          </Link>
          <Link to="/career-applications" className="flex items-center gap-2.5 text-sm px-3 py-2.5 rounded-lg hover:bg-black/[0.03] transition-colors" style={{ color: "var(--gray2)" }}>
            <FileUser size={16} style={{ color: "var(--cyan)" }} /> View Career Applications
          </Link>
        </div>
      </div>
    </div>
  );
}
