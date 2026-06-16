/** Shared design tokens & primitive components – VMS+ Budget Planning System */
import { ReactNode } from "react";

/* ── colour tokens ─────────────────────────────────────── */
export const C = {
  bg:             "#f8fafc",
  card:           "#ffffff",
  cardBorder:     "#e2e8f0",
  border:         "#e2e8f0",
  borderMd:       "#cbd5e1",
  sidebar:        "#1e293b",
  sidebarBorder:  "#293548",
  sidebarText:    "#94a3b8",
  sidebarActText: "#f1f5f9",
  sidebarActBg:   "#334155",
  sidebarHover:   "#263347",
  sidebarSection: "#64748b",
  header:         "#ffffff",
  headerBorder:   "#e2e8f0",
  t1:             "#0f172a",
  t2:             "#334155",
  t3:             "#64748b",
  t4:             "#94a3b8",
  tableHead:      "#f8fafc",
  primary:        "#1e293b",
  primaryText:    "#ffffff",
  danger:         "#334155",
};

/* ── badge variants ───────────────────────────────────── */
type BV =
  | "draft" | "review" | "budget" | "pending"
  | "returned" | "approved" | "pr" | "ebid" | "rejected";

const BS: Record<BV, { bg: string; text: string; border: string; dot: string }> = {
  draft:    { bg: "#f1f5f9", text: "#64748b", border: "#cbd5e1", dot: "#94a3b8" },
  review:   { bg: "#e2e8f0", text: "#475569", border: "#94a3b8", dot: "#64748b" },
  budget:   { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1", dot: "#64748b" },
  pending:  { bg: "#e2e8f0", text: "#334155", border: "#94a3b8", dot: "#475569" },
  returned: { bg: "#fef2f2", text: "#991b1b", border: "#fca5a5", dot: "#ef4444" },
  approved: { bg: "#f0fdf4", text: "#166534", border: "#86efac", dot: "#22c55e" },
  pr:       { bg: "#eff6ff", text: "#1d4ed8", border: "#93c5fd", dot: "#3b82f6" },
  ebid:     { bg: "#faf5ff", text: "#6b21a8", border: "#c4b5fd", dot: "#8b5cf6" },
  rejected: { bg: "#fef2f2", text: "#991b1b", border: "#fca5a5", dot: "#ef4444" },
};

export function Badge({ label, variant = "draft" }: { label: string; variant?: BV }) {
  const s = BS[variant];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.dot }} />
      {label}
    </span>
  );
}

/* ── card ─────────────────────────────────────────────── */
export function Card({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── stat card ────────────────────────────────────────── */
export function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  key?: any;
}) {
  return (
    <Card className="p-5 flex flex-col gap-1">
      <span className="text-xs font-medium" style={{ color: C.t3 }}>
        {label}
      </span>
      <span
        className="text-3xl font-bold leading-tight"
        style={{ color: accent ?? C.t1 }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-xs" style={{ color: C.t4 }}>
          {sub}
        </span>
      )}
    </Card>
  );
}

/* ── button ───────────────────────────────────────────── */
type BtnVariant = "primary" | "secondary" | "danger" | "ghost";
export function Btn({
  label,
  variant = "secondary",
  onClick,
  icon,
  disabled,
  size = "md",
}: {
  label: string;
  variant?: BtnVariant;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const styles: Record<BtnVariant, React.CSSProperties> = {
    primary:   { background: C.primary, color: "#fff", border: `1px solid ${C.primary}` },
    secondary: { background: "#fff",    color: C.t2,   border: `1px solid ${C.borderMd}` },
    danger:    { background: "#fff",    color: "#b91c1c", border: "1px solid #fca5a5" },
    ghost:     { background: "transparent", color: C.t3, border: "1px solid transparent" },
  };
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg font-semibold transition-opacity ${pad} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`}
      style={styles[variant]}
    >
      {icon}
      {label}
    </button>
  );
}

/* ── section header ───────────────────────────────────── */
export function SectionHead({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold" style={{ color: C.t2 }}>
        {title}
      </h3>
      {action}
    </div>
  );
}

/* ── page wrapper ─────────────────────────────────────── */
export function PageWrap({ children }: { children: ReactNode }) {
  return (
    <div className="p-8 flex flex-col gap-6 w-full">
      {children}
    </div>
  );
}

/* ── divider ──────────────────────────────────────────── */
export function Divider() {
  return <div style={{ height: 1, background: C.border }} />;
}

/* ── field row (label + value read-only) ─────────────── */
export function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs" style={{ color: C.t4 }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: C.t1 }}>{value}</span>
    </div>
  );
}

/* ── text input (wireframe) ───────────────────────────── */
export function Input({
  label,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: C.t2 }}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div
        className="h-10 rounded-lg px-3 flex items-center text-sm"
        style={{
          border: `1px solid ${C.borderMd}`,
          background: "#fff",
          color: C.t4,
        }}
      >
        {placeholder ?? "—"}
      </div>
    </div>
  );
}

/* ── select (wireframe) ───────────────────────────────── */
export function Select({
  label,
  placeholder,
  required,
}: {
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: C.t2 }}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div
        className="h-10 rounded-lg px-3 flex items-center justify-between text-sm"
        style={{
          border: `1px solid ${C.borderMd}`,
          background: "#fff",
          color: C.t4,
        }}
      >
        <span>{placeholder ?? "เลือก..."}</span>
        <span style={{ color: C.t4 }}>▾</span>
      </div>
    </div>
  );
}

/* ── textarea (wireframe) ─────────────────────────────── */
export function Textarea({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: C.t2 }}>{label}</label>
      <div
        className="h-24 rounded-lg px-3 py-2 text-sm"
        style={{
          border: `1px solid ${C.borderMd}`,
          background: "#fff",
          color: C.t4,
        }}
      >
        {placeholder ?? ""}
      </div>
    </div>
  );
}

/* ── table wrapper ────────────────────────────────────── */
export function Table({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${C.cardBorder}` }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: C.tableHead, borderBottom: `1px solid ${C.border}` }}>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 font-semibold whitespace-nowrap"
                style={{ color: C.t2 }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/* ── table row ────────────────────────────────────────── */
export function TR({
  children,
  alt,
}: {
  children: ReactNode;
  alt?: boolean;
  key?: any;
}) {
  return (
    <tr
      style={{
        background: alt ? "#f8fafc" : "#ffffff",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      {children}
    </tr>
  );
}

/* ── table cell ───────────────────────────────────────── */
export function TD({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 ${className}`} style={{ color: C.t2 }}>
      {children}
    </td>
  );
}

/* ── filter bar container ─────────────────────────────── */
export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {children}
    </div>
  );
}

/* ── filter select chip ───────────────────────────────── */
export function FilterSelect({ label, placeholder }: { label?: string; placeholder: string }) {
  return (
    <div
      className="h-9 flex items-center gap-2 px-3 rounded-lg text-sm cursor-pointer"
      style={{ border: `1px solid ${C.borderMd}`, background: "#fff", color: C.t3 }}
    >
      {label && <span className="text-xs font-medium" style={{ color: C.t4 }}>{label}:</span>}
      <span>{placeholder}</span>
      <span style={{ color: C.t4 }}>▾</span>
    </div>
  );
}

/* ── search input ─────────────────────────────────────── */
export function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div
      className="h-9 flex items-center gap-2 px-3 rounded-lg text-sm min-w-52"
      style={{ border: `1px solid ${C.borderMd}`, background: "#fff", color: C.t4 }}
    >
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="6" stroke={C.t4} strokeWidth="2" />
        <path d="M14 14l3 3" stroke={C.t4} strokeWidth="2" strokeLinecap="round" />
      </svg>
      {placeholder}
    </div>
  );
}

/* ── alert box ────────────────────────────────────────── */
export function Alert({
  type,
  title,
  message,
}: {
  type: "warning" | "success" | "error" | "info";
  title: string;
  message: string;
}) {
  const s = {
    warning: { bg: "#fffbeb", border: "#fcd34d", icon: "⚠", color: "#92400e" },
    success: { bg: "#f0fdf4", border: "#86efac", icon: "✓", color: "#166534" },
    error:   { bg: "#fef2f2", border: "#fca5a5", icon: "✕", color: "#991b1b" },
    info:    { bg: "#eff6ff", border: "#93c5fd", icon: "ℹ", color: "#1e40af" },
  }[type];
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <span className="text-lg leading-none mt-0.5" style={{ color: s.color }}>{s.icon}</span>
      <div>
        <p className="text-sm font-semibold" style={{ color: s.color }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: s.color + "cc" }}>{message}</p>
      </div>
    </div>
  );
}
