import { useState } from "react";
import { Search, Filter, ChevronRight, FileText, Clock, CheckCircle2, XCircle, AlertTriangle, RotateCcw, ArrowUpRight } from "lucide-react";
import type { Page } from "../components/Sidebar";

const C = {
  primary: "#334155", border: "#e2e8f0", bg: "#f8fafc", surface: "#ffffff",
  text: "#0f172a", sub: "#475569", muted: "#94a3b8",
  success: "#16a34a", warning: "#d97706", danger: "#dc2626",
};

type RequestType = "replacement" | "quota" | "special";
type ReqStatus = "draft" | "collecting" | "analysis" | "planning" | "budget-check" | "pending-approval" | "approved" | "returned" | "procurement";

interface ProcRequest {
  id: string;
  type: RequestType;
  unit: string;
  fiscalYear: string;
  vehicles: number;
  budget: number;
  currentStep: string;
  owner: string;
  status: ReqStatus;
  createdAt: string;
}

const REQUESTS: ProcRequest[] = [
  { id: "VPR-2568-001", type: "replacement", unit: "กฟภ. เขต 1 (ภาคเหนือ 1)", fiscalYear: "2568", vehicles: 12, budget: 7200000, currentStep: "กล่องอนุมัติ — ผู้ว่าการ", owner: "นายสมชาย ใจดี", status: "pending-approval", createdAt: "12 พ.ค. 2568" },
  { id: "VPR-2568-002", type: "quota",       unit: "กฟภ. เขต 3 (ภาคใต้)",      fiscalYear: "2568", vehicles: 8,  budget: 4800000, currentStep: "ตรวจสอบงบประมาณ",          owner: "นางสาวมาลี รักชาติ", status: "budget-check", createdAt: "5 พ.ค. 2568" },
  { id: "VPR-2568-003", type: "special",     unit: "สำนักงานใหญ่ (กฟภ.)",      fiscalYear: "2568", vehicles: 4,  budget: 6400000, currentStep: "วิเคราะห์ความต้องการ",       owner: "นายประสิทธิ์ งามดี", status: "analysis", createdAt: "1 พ.ค. 2568" },
  { id: "VPR-2568-004", type: "replacement", unit: "กฟภ. เขต 2 (ภาคกลาง)",     fiscalYear: "2568", vehicles: 15, budget: 9000000, currentStep: "กล่องอนุมัติ — บอร์ด กฟภ.", owner: "นายวิชัย สงวนศักดิ์", status: "pending-approval", createdAt: "28 เม.ย. 2568" },
  { id: "VPR-2568-005", type: "quota",       unit: "กฟภ. เขต 4 (ภาคตะวันออก)", fiscalYear: "2568", vehicles: 6,  budget: 3600000, currentStep: "อนุมัติแล้ว — รอส่งต่อ PR", owner: "นางสาวจิราภรณ์ สุข", status: "approved", createdAt: "20 เม.ย. 2568" },
  { id: "VPR-2568-006", type: "special",     unit: "กฟภ. เขต 5 (ภาคเหนือ 2)",  fiscalYear: "2568", vehicles: 3,  budget: 4800000, currentStep: "ส่งกลับแก้ไข — ปรับเกณฑ์",  owner: "นายอดิศร พรหมชาติ", status: "returned", createdAt: "15 เม.ย. 2568" },
  { id: "VPR-2568-007", type: "replacement", unit: "กฟภ. เขต 6 (ภาคอีสาน 1)",  fiscalYear: "2568", vehicles: 20, budget: 12000000, currentStep: "อยู่ระหว่าง E-Bid",        owner: "นายธีระ มีสุข", status: "procurement", createdAt: "10 เม.ย. 2568" },
  { id: "VPR-2567-008", type: "quota",       unit: "กฟภ. เขต 7 (ภาคอีสาน 2)",  fiscalYear: "2567", vehicles: 10, budget: 6000000, currentStep: "จัดทำแผน",                   owner: "นายพิชิต รุ่งเรือง", status: "planning", createdAt: "1 มี.ค. 2567" },
];

const TYPE_CFG: Record<RequestType, { label: string; bg: string; text: string; border: string }> = {
  replacement: { label: "ทดแทนรถเดิม",      bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  quota:       { label: "โควต้าพื้นฐาน",     bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
  special:     { label: "กรณีพิเศษ",          bg: "#faf5ff", text: "#6d28d9", border: "#c4b5fd" },
};

const STATUS_CFG: Record<ReqStatus, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
  draft:            { label: "ร่าง",                  icon: <FileText size={11} />,      bg: "#f8fafc", text: "#475569" },
  collecting:       { label: "รวบรวมข้อมูล",           icon: <Clock size={11} />,         bg: "#fffbeb", text: "#b45309" },
  analysis:         { label: "วิเคราะห์",              icon: <Clock size={11} />,         bg: "#eff6ff", text: "#1d4ed8" },
  planning:         { label: "จัดทำแผน",               icon: <Clock size={11} />,         bg: "#f0fdfa", text: "#0f766e" },
  "budget-check":   { label: "ตรวจสอบงบประมาณ",        icon: <AlertTriangle size={11} />, bg: "#fffbeb", text: "#b45309" },
  "pending-approval":{ label: "รออนุมัติ",             icon: <Clock size={11} />,         bg: "#fef9c3", text: "#854d0e" },
  approved:         { label: "อนุมัติแล้ว",             icon: <CheckCircle2 size={11} />,  bg: "#f0fdf4", text: "#15803d" },
  returned:         { label: "ส่งกลับแก้ไข",            icon: <RotateCcw size={11} />,     bg: "#fef2f2", text: "#b91c1c" },
  procurement:      { label: "อยู่ระหว่างจัดซื้อ",      icon: <ArrowUpRight size={11} />,  bg: "#f0fdf4", text: "#15803d" },
};

function StatCard({ label, value, color, border }: { label: string; value: number; color: string; border: string }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${border}` }}>
      <p className="text-xs" style={{ color: C.muted }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

export default function AllRequests({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [search, setSearch]         = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");

  const filtered = REQUESTS.filter(r => {
    if (search && !r.id.includes(search) && !r.unit.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "all" && r.type !== filterType) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterYear !== "all" && r.fiscalYear !== filterYear) return false;
    return true;
  });

  const counts = {
    total:     REQUESTS.length,
    pending:   REQUESTS.filter(r => r.status === "pending-approval").length,
    returned:  REQUESTS.filter(r => r.status === "returned").length,
    approved:  REQUESTS.filter(r => r.status === "approved" || r.status === "procurement").length,
  };

  return (
    <div className="flex flex-col gap-6 p-8">

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard label="คำขอทั้งหมด"    value={counts.total}   color={C.text}    border={C.border} />
        <StatCard label="ทดแทนรถเดิม"    value={REQUESTS.filter(r => r.type === "replacement").length} color="#1d4ed8" border="#bfdbfe" />
        <StatCard label="โควต้าพื้นฐาน"  value={REQUESTS.filter(r => r.type === "quota").length}       color="#15803d" border="#86efac" />
        <StatCard label="กรณีพิเศษ"       value={REQUESTS.filter(r => r.type === "special").length}     color="#6d28d9" border="#c4b5fd" />
        <StatCard label="รออนุมัติ"       value={counts.pending} color={C.warning} border="#fcd34d" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2 rounded-lg"
          style={{ border: `1px solid ${C.border}`, background: C.surface }}>
          <Search size={14} color={C.muted} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาเลขที่คำขอ หรือหน่วยงาน…"
            className="flex-1 text-xs outline-none bg-transparent"
            style={{ color: C.text }} />
        </div>

        {[
          { value: filterYear,   onChange: setFilterYear,   options: [["all","ทุกปีงบประมาณ"],["2568","2568"],["2567","2567"]] },
          { value: filterType,   onChange: setFilterType,   options: [["all","ทุกประเภท"],["replacement","ทดแทนรถเดิม"],["quota","โควต้าพื้นฐาน"],["special","กรณีพิเศษ"]] },
          { value: filterStatus, onChange: setFilterStatus, options: [["all","ทุกสถานะ"],["draft","ร่าง"],["pending-approval","รออนุมัติ"],["approved","อนุมัติแล้ว"],["returned","ส่งกลับแก้ไข"],["procurement","อยู่ระหว่างจัดซื้อ"]] },
        ].map((sel, i) => (
          <select key={i} value={sel.value} onChange={e => sel.onChange(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg outline-none shrink-0"
            style={{ border: `1px solid ${C.border}`, background: C.surface, color: C.text }}>
            {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}

        <div className="flex items-center gap-1 text-xs ml-auto" style={{ color: C.muted }}>
          <Filter size={12} /> แสดง {filtered.length} / {REQUESTS.length} รายการ
        </div>

        <button onClick={() => onNavigate("create-request")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold"
          style={{ background: C.primary, color: "#fff" }}>
          + สร้างคำขอใหม่
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr style={{ background: C.bg }}>
              {["เลขที่คำขอ","ประเภทคำขอ","หน่วยงาน","ปีงบ","จำนวนรถ","งบประมาณรวม","ขั้นตอนปัจจุบัน","ผู้รับผิดชอบ","สถานะ","วันที่สร้าง",""].map(h => (
                <th key={h} className="px-3 py-3 text-left font-semibold"
                  style={{ color: C.sub, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const tc = TYPE_CFG[r.type];
              const sc = STATUS_CFG[r.status];
              return (
                <tr key={r.id} style={{ background: i % 2 === 0 ? C.surface : C.bg, borderBottom: `1px solid ${C.border}` }}>
                  <td className="px-3 py-3 font-mono font-semibold" style={{ color: C.primary }}>{r.id}</td>
                  <td className="px-3 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
                      {tc.label}
                    </span>
                  </td>
                  <td className="px-3 py-3" style={{ color: C.text, maxWidth: 160 }}><span className="leading-snug block">{r.unit}</span></td>
                  <td className="px-3 py-3 text-center" style={{ color: C.sub }}>{r.fiscalYear}</td>
                  <td className="px-3 py-3 text-center font-semibold" style={{ color: C.text }}>{r.vehicles}</td>
                  <td className="px-3 py-3 text-right font-semibold" style={{ color: C.text }}>
                    {r.budget.toLocaleString()} ฿
                  </td>
                  <td className="px-3 py-3" style={{ color: C.sub, maxWidth: 160 }}><span className="leading-snug block">{r.currentStep}</span></td>
                  <td className="px-3 py-3" style={{ color: C.sub }}>{r.owner}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={{ background: sc.bg, color: sc.text }}>
                      {sc.icon} {sc.label}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap" style={{ color: C.muted }}>{r.createdAt}</td>
                  <td className="px-3 py-3">
                    <button onClick={() => onNavigate("request-detail")}
                      className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                      style={{ background: C.bg, color: C.primary, border: `1px solid ${C.border}` }}>
                      ดู <ChevronRight size={11} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12">
            <FileText size={32} color={C.muted} />
            <p className="text-sm" style={{ color: C.muted }}>ไม่พบรายการที่ตรงกับเงื่อนไข</p>
          </div>
        )}
      </div>

      {/* Summary footer */}
      <div className="flex items-center gap-8 px-5 py-3.5 rounded-xl"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="flex gap-6 text-xs flex-1">
          <span style={{ color: C.muted }}>รวมรถที่จัดหา: <strong style={{ color: C.text }}>{REQUESTS.reduce((s, r) => s + r.vehicles, 0)} คัน</strong></span>
          <span style={{ color: C.muted }}>งบประมาณรวม: <strong style={{ color: C.text }}>{REQUESTS.reduce((s, r) => s + r.budget, 0).toLocaleString()} ฿</strong></span>
          <span style={{ color: C.muted }}>ส่งกลับแก้ไข: <strong style={{ color: C.danger }}>{counts.returned} รายการ</strong></span>
        </div>
        <button onClick={() => onNavigate("create-request")}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold"
          style={{ background: C.primary, color: "#fff" }}>
          + สร้างคำขอใหม่
        </button>
      </div>
    </div>
  );
}
