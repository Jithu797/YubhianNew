import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BarChart3, FileEdit, Briefcase, Package, Users, Newspaper,
  MessageSquareQuote, Building2, GraduationCap, FileUser, Inbox, Mail, Settings as SettingsIcon, LogOut, Menu, X,
  Search, Bell,
} from "lucide-react";
import { useAuth } from "../context/useAuth";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/analytics", label: "Analytics", icon: BarChart3, comingSoon: true },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/content", label: "Content Editor", icon: FileEdit },
      { to: "/services", label: "Services", icon: Briefcase },
      { to: "/product", label: "Product", icon: Package },
      { to: "/team", label: "Team", icon: Users },
      { to: "/blogs", label: "Blogs", icon: Newspaper },
      { to: "/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { to: "/clients", label: "Clients", icon: Building2 },
      { to: "/careers", label: "Careers", icon: GraduationCap },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/leads", label: "Leads Inbox", icon: Inbox },
      { to: "/career-applications", label: "Career Applications", icon: FileUser },
      { to: "/newsletter", label: "Newsletter Subs", icon: Mail, comingSoon: true },
    ],
  },
  {
    label: "System",
    items: [{ to: "/settings", label: "Settings", icon: SettingsIcon }],
  },
];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "A";
}

function pageTitle(pathname: string) {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (pathname.startsWith(item.to)) return item.label;
    }
  }
  return "Admin Portal";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const name = (user?.name || user?.email || "Admin").trim();

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2.5 px-6 h-16 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
          <img src="/logo.jpg" alt="Yubhian Technologies" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-sm leading-tight" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Yubhian</p>
          <p className="text-[10px] leading-tight" style={{ color: "var(--gray)" }}>Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--gray)" }}>
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) =>
                item.comingSoon ? (
                  <div
                    key={item.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm opacity-40 cursor-not-allowed"
                    style={{ color: "var(--gray)" }}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </div>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                        isActive ? "" : "hover:text-[var(--white)]"
                      }`
                    }
                    style={({ isActive }) => ({
                      color: isActive ? "var(--white)" : "var(--gray)",
                      background: isActive ? "rgba(37,99,235,0.15)" : "transparent",
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full" style={{ background: "var(--grad)" }} />
                        )}
                        <item.icon size={16} />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                )
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "var(--grad)" }}>
            {initials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate" style={{ color: "var(--white)" }}>{name}</p>
            <p className="text-xs truncate" style={{ color: "var(--gray)" }}>Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-[var(--white)]"
          style={{ color: "var(--gray)", background: "var(--surface)" }}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "var(--navy)" }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] shrink-0 fixed inset-y-0 left-0" style={{ background: "var(--navy2)", borderRight: "1px solid var(--border)" }}>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[260px] flex flex-col" style={{ background: "var(--navy2)" }}>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col md:ml-[260px] min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30" style={{ background: "var(--navy)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-4">
            <button className="md:hidden" style={{ color: "var(--white)" }} onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>{pageTitle(location.pathname)}</h1>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl w-72" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <Search size={15} style={{ color: "var(--gray)" }} />
            <input
              placeholder="Search leads, blogs, team..."
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-[var(--gray)]"
              style={{ color: "var(--white)" }}
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-[var(--gray)] hover:text-[var(--white)] transition-colors" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "var(--grad)" }}
              >
                {initials(name)}
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div
                    className="absolute right-0 top-11 w-44 rounded-xl overflow-hidden z-20"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(15,23,42,0.15)" }}
                  >
                    <NavLink to="/settings" className="block px-4 py-2.5 text-sm hover:bg-black/[0.03]" style={{ color: "var(--gray2)" }} onClick={() => setUserMenuOpen(false)}>
                      Profile
                    </NavLink>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/[0.03] flex items-center gap-2" style={{ color: "#dc2626" }}>
                      <LogOut size={13} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {mobileOpen && (
        <button
          className="fixed top-4 right-4 z-50 md:hidden text-white bg-black/40 rounded-full p-2"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
