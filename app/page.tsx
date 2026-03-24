"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Bell,
  Users,
  Clock3,
  CheckCircle2,
  Globe2,
  RefreshCw,
  Mail,
  Phone,
  GraduationCap,
  Filter,
  ExternalLink,
  LayoutDashboard,
  FileText,
  Settings,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CalendarClock,
  CircleDot,
  ChevronRight,
} from "lucide-react";

const API_ENDPOINT = "/api/inquiry";

type Inquiry = {
  id?: number | string;
  name: string;
  phone: string;
  email: string;
  country: string;
  plan?: string;
  study_plan?: string;
  status?: string;
  submittedAt?: string;
  submitted_at?: string;
  created_at?: string;
};

const statusStyles: Record<string, string> = {
  pending: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  approved: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  contacted: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  rejected: "border-rose-400/20 bg-rose-400/10 text-rose-200",
};

function formatDate(value?: string) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleString();
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
      <div className={`absolute inset-x-0 top-0 h-px ${accent}`} />
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/5 blur-3xl transition duration-500 group-hover:scale-125" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-4 text-4xl font-semibold tracking-tight text-white">{value}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-100 shadow-inner shadow-white/5">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function SparkAdminDashboard() {
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/login";
        return;
      }

      setCheckedAuth(true);
    };

    checkAuth();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_ENDPOINT, { cache: "no-store" });
      const result = await response.json();

      const rows: Inquiry[] = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.inquiries)
            ? result.inquiries
            : [];

      setInquiries(rows);
    } catch (err) {
      console.error(err);
      setError("Could not load inquiries from your API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkedAuth) {
      loadInquiries();
    }
  }, [checkedAuth]);

  const filtered = useMemo(() => {
    return inquiries.filter((item) => {
      const haystack = `${item.name} ${item.email} ${item.phone} ${item.country}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesCountry = countryFilter === "all" || item.country?.toLowerCase() === countryFilter.toLowerCase();
      return matchesSearch && matchesCountry;
    });
  }, [inquiries, search, countryFilter]);

  const stats = useMemo(() => {
    const total = inquiries.length;
    const pending = inquiries.filter((i) => (i.status || "pending").toLowerCase() === "pending").length;
    const approved = inquiries.filter((i) => (i.status || "").toLowerCase() === "approved").length;
    const countries = new Set(inquiries.map((i) => i.country).filter(Boolean)).size;
    const recent = inquiries.filter((i) => {
      const value = i.submittedAt || i.submitted_at || i.created_at;
      if (!value) return false;
      const date = new Date(value);
      return Date.now() - date.getTime() < 1000 * 60 * 60 * 24 * 7;
    }).length;
    return { total, pending, approved, countries, recent };
  }, [inquiries]);

  const countries = useMemo(() => {
    return ["all", ...Array.from(new Set(inquiries.map((i) => i.country).filter(Boolean)))];
  }, [inquiries]);

  const countryStats = useMemo(() => {
    const counts = inquiries.reduce<Record<string, number>>((acc, item) => {
      if (!item.country) return acc;
      acc[item.country] = (acc[item.country] || 0) + 1;
      return acc;
    }, {});

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = entries[0]?.[1] || 1;

    return entries.map(([country, count]) => ({
      country,
      count,
      width: Math.max(18, Math.round((count / max) * 100)),
    }));
  }, [inquiries]);

  const latestStudent = filtered[0] || inquiries[0];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!checkedAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040816] text-white">
        Checking login...
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#040816] text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-5%] h-[420px] w-[420px] rounded-full bg-fuchsia-500/12 blur-3xl" />
        <div className="absolute right-[-8%] top-[8%] h-[340px] w-[340px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[18%] h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-slate-950/55 backdrop-blur-2xl lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 py-7">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-fuchsia-500 via-rose-500 to-cyan-400 shadow-[0_20px_40px_rgba(56,189,248,0.18)]">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-[26px] font-semibold tracking-tight text-white">Spark Education</p>
                <p className="text-sm text-slate-400">Premium Admin Console</p>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 py-6">
            <div className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Workspace</div>
            <nav className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white shadow-lg shadow-black/20">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 transition hover:bg-white/[0.05] hover:text-white">
                <Users className="h-4 w-4" /> Inquiries
              </div>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 transition hover:bg-white/[0.05] hover:text-white">
                <FileText className="h-4 w-4" /> Notices
              </div>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 transition hover:bg-white/[0.05] hover:text-white">
                <Settings className="h-4 w-4" /> Settings
              </div>
            </nav>
          </div>

          <div className="m-4 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.26)]">
            <div className="mb-3 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
              <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Live integration
            </div>
            <p className="text-sm leading-6 text-slate-300">
              Connected to your inquiry API and ready for real-time admin workflow.
            </p>
          </div>
        </aside>

        <main className="flex-1">
          <div className="border-b border-white/10 bg-slate-950/35 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
                  <TrendingUp className="mr-2 h-3.5 w-3.5" /> Executive dashboard
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">Spark Education Admin Panel</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                  Monitor student inquiries, destination trends, and follow-up pipeline from a clean premium workspace.
                </p>
              </div>

              <div className="flex items-center gap-3 self-start xl:self-auto">
                <button className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white transition duration-300 hover:border-white/20 hover:bg-white/[0.09] hover:-translate-y-0.5">
                  <Bell className="mr-2 h-4 w-4" /> Alerts
                </button>
                <button className="inline-flex items-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-rose-500 to-pink-500 px-5 py-3 text-sm font-medium text-white shadow-[0_15px_35px_rgba(236,72,153,0.32)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95">
                  <ExternalLink className="mr-2 h-4 w-4" /> Open Site
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white transition duration-300 hover:border-white/20 hover:bg-white/[0.09] hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Total Inquiries" value={String(stats.total)} subtitle="All student submissions" icon={<Users className="h-5 w-5" />} accent="bg-gradient-to-r from-cyan-400/0 via-cyan-400/70 to-cyan-400/0" />
              <StatCard title="Pending" value={String(stats.pending)} subtitle="Needs follow-up" icon={<Clock3 className="h-5 w-5" />} accent="bg-gradient-to-r from-amber-400/0 via-amber-400/70 to-amber-400/0" />
              <StatCard title="Approved" value={String(stats.approved)} subtitle="Converted or approved" icon={<CheckCircle2 className="h-5 w-5" />} accent="bg-gradient-to-r from-emerald-400/0 via-emerald-400/70 to-emerald-400/0" />
              <StatCard title="Countries" value={String(stats.countries)} subtitle="Student destination interest" icon={<Globe2 className="h-5 w-5" />} accent="bg-gradient-to-r from-fuchsia-400/0 via-fuchsia-400/70 to-fuchsia-400/0" />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr,0.95fr]">
              <div className="rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <div className="flex flex-col gap-5 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Recent Inquiries</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Premium lead view with fast filtering, clean hierarchy, and ready-to-manage records.</p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative min-w-[250px]">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, phone"
                        className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/50 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/30 focus:bg-slate-950/70"
                      />
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/50 px-4 transition focus-within:border-cyan-400/30">
                      <Filter className="h-4 w-4 text-slate-500" />
                      <select
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                        className="h-12 bg-transparent pr-2 text-sm text-white outline-none"
                      >
                        {countries.map((country) => (
                          <option key={country} value={country} className="bg-slate-950 text-white">
                            {country === "all" ? "All countries" : country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="grid gap-4">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="h-24 animate-pulse rounded-3xl border border-white/5 bg-white/[0.04]" />
                      ))}
                    </div>
                  ) : error ? (
                    <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
                      {error}
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/30 px-6 py-16 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                        <Users className="h-7 w-7 text-slate-500" />
                      </div>
                      <p className="text-lg font-medium text-white">No inquiries found</p>
                      <p className="mt-2 text-sm text-slate-500">Once your API returns student data, it will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filtered.map((item, index) => {
                        const submitted = item.submittedAt || item.submitted_at || item.created_at;
                        const status = (item.status || "pending").toLowerCase();
                        const plan = item.plan || item.study_plan || "No study plan provided.";

                        return (
                          <div
                            key={`${item.email}-${index}`}
                            className="group rounded-[28px] border border-white/10 bg-slate-950/35 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-950/55"
                          >
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                              <div className="flex gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 text-sm font-semibold text-white ring-1 ring-white/10">
                                  {getInitials(item.name)}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusStyles[status] || statusStyles.pending}`}>
                                      <CircleDot className="mr-1.5 h-3.5 w-3.5" />
                                      {status}
                                    </span>
                                  </div>
                                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{plan}</p>
                                  <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                                    <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-slate-500" /> {item.email}</span>
                                    <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-slate-500" /> {item.phone}</span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-200"><GraduationCap className="h-3.5 w-3.5" /> {item.country}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-3 text-sm text-slate-400 lg:items-end">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                                  <CalendarClock className="h-4 w-4 text-slate-500" /> {formatDate(submitted)}
                                </div>
                                <button className="inline-flex items-center text-sm font-medium text-cyan-300 transition group-hover:text-cyan-200">
                                  View details <ArrowUpRight className="ml-1.5 h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-6">
                <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
                      <p className="mt-2 text-sm text-slate-400">Fast admin controls for your daily workflow.</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <button
                      onClick={loadInquiries}
                      className="inline-flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 px-4 py-4 text-left text-sm font-medium text-white shadow-[0_18px_40px_rgba(14,165,233,0.22)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95"
                    >
                      <span className="inline-flex items-center"><RefreshCw className="mr-2 h-4 w-4" /> Refresh Inquiry Data</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <button className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left text-sm text-white transition duration-300 hover:border-white/20 hover:bg-white/[0.07]">
                      <span className="inline-flex items-center"><Mail className="mr-2 h-4 w-4" /> Contact Latest Student</span>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </button>
                    <button className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left text-sm text-white transition duration-300 hover:border-white/20 hover:bg-white/[0.07]">
                      <span className="inline-flex items-center"><FileText className="mr-2 h-4 w-4" /> Export Reports</span>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Pipeline Snapshot</h3>
                      <p className="mt-2 text-sm text-slate-400">A quick summary of activity and destination demand.</p>
                    </div>
                    <div className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-medium text-fuchsia-200">
                      {stats.recent} this week
                    </div>
                  </div>

                  <div className="space-y-4">
                    {countryStats.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/25 px-4 py-10 text-center text-sm text-slate-500">
                        Country demand will appear here after inquiries arrive.
                      </div>
                    ) : (
                      countryStats.map((item) => (
                        <div key={item.country}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-slate-300">{item.country}</span>
                            <span className="text-slate-500">{item.count}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.05]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 transition-all duration-700"
                              style={{ width: `${item.width}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-white/[0.02] to-cyan-500/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                  <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                    API connection
                  </div>
                  <p className="text-sm leading-7 text-slate-300">
                    This dashboard is using your existing inquiry API route and Supabase connection.
                  </p>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/45 p-4 font-mono text-xs text-slate-300">
                    GET {API_ENDPOINT}
                  </div>
                  {latestStudent && (
                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Latest lead</p>
                      <p className="mt-2 text-lg font-semibold text-white">{latestStudent.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{latestStudent.email}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}