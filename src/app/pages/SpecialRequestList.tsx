import { useState } from "react";
import { AlertTriangle, FileText, CheckCircle2, Clock, XCircle, HelpCircle, ChevronRight, Filter } from "lucide-react";
import type { Page } from "../components/Sidebar";

/* ── Design tokens ── */
const C = {
  primary: "#334155", primaryHov: "#1e293b", accent: "#0ea5e9",
  border: "#e2e8f0", bg: "#f8fafc", surface: "#ffffff",
  text: "#0f172a", sub: "#475569", muted: "#94a3b8",
  success: "#16a34a", warning: "#d97706", danger: "#dc2626",
  special: "#7c3aed",
};

/* ── Types ── */
type SpecialType = "ภารกิจใหม่" | "งานโครงการ" | "พื้นที่พิเศษ" | "รถเฉพาะ" | "สัญญา";
type ReqStatus   = "รอตรวจสอบ" | "ผ่านเกณฑ์" | "ไม่ผ่านเกณฑ์" | "รอข้อมูลเพิ่ม" | "บันทึกร่าง";

interface SpecialRequest {
  id: string;
  unit: string;
  specialType: SpecialType;
  vehicleType: string;
  qty: number;
  reason: string;
  source: string;
  status: ReqStatus;
  owner: string;
  fiscalYear: string;
}

/* ── Mock data ── */
const REQUESTS: SpecialRequest[] = [
  { id: "SR-2568-001", unit: "กฟภ. เขต 1 (ภาคเหนือ 1)",   specialType: "ภารกิจใหม่",  vehicleType: "รถยนต์นั่ง 4WD",    qty: 8,  reason: "ขยายพื้นที่รับผิดชอบพื้นที่ห่างไกล จ.เชียงราย",    source: "คำขอจากหน่วยงาน + ระบบ AA", status: "ผ่านเกณฑ์",       owner: "นายสมชาย ใจดี",     fiscalYear: "2568" },
  { id: "SR-2568-002", unit: "กฟภ. เขต 3 (ภาคใต้)",       specialType: "งานโครงการ",  vehicleType: "รถกระบะ 4 ประตู",  qty: 5,  reason: "โครงการ Smart Grid ภาคใต้ ระยะที่ 2",              source: "หนังสือโครงการ + ฝ่ายสัญญา",status: "รอตรวจสอบ",      owner: "นางสาวมาลี รักชาติ",fiscalYear: "2568" },
  { id: "SR-2568-003", unit: "กฟภ. เขต 2 (ภาคกลาง)",      specialType: "พื้นที่พิเศษ",vehicleType: "รถตู้ 12 ที่นั่ง", qty: 3,  reason: "ปฏิบัติงานพื้นที่เกาะ และชายฝั่งทะเล",              source: "แผนปฏิบัติงาน + ระบบ AA",   status: "รอข้อมูลเพิ่ม",  owner: "นายประสิทธิ์ งามดี", fiscalYear: "2568" },
  { id: "SR-2568-004", unit: "สำนักงานใหญ่ (กฟภ.)",       specialType: "รถเฉพาะ",     vehicleType: "รถบรรทุกเครน",    qty: 2,  reason: "งานซ่อมบำรุงระบบไฟฟ้าแรงสูงกรณีฉุกเฉิน",         source: "คำสั่ง กฟภ. + ฝ่ายสัญญา",   status: "ผ่านเกณฑ์",       owner: "นายวิชัย สงวนศักดิ์",fiscalYear: "2568" },
  { id: "SR-2568-005", unit: "กฟภ. เขต 4 (ภาคตะวันออก)", specialType: "สัญญา",       vehicleType: "รถยนต์นั่งทั่วไป",qty: 6,  reason: "สัญญาบริการ EV Charging Station ภาคตะวันออก",      source: "สัญญาเลขที่ กจ.2568/045",   status: "ผ่านเกณฑ์",       owner: "นางสาวจิราภรณ์ สุข",fiscalYear: "2568" },
  { id: "SR-2568-006", unit: "กฟภ. เขต 5 (ภาคเหนือ 2)",  specialType: "ภารกิจใหม่",  vehicleType: "รถกระบะ 4WD",     qty: 4,  reason: "ขยายงานตรวจสอบสายส่งพื้นที่ภูเขาสูง",              source: "คำขอจากหน่วยงาน",            status: "ไม่ผ่านเกณฑ์",   owner: "นายอดิศร พรหมชาติ",  fiscalYear: "2568" },
  { id: "SR-2568-007", unit: "กฟภ. เขต 6 (ภาคตะวันออกฉียงเหนือ 1)", specialType: "งานโครงการ", vehicleType: "รถยนต์นั่งไฟฟ้า", qty: 10, reason: "โครงการนำร่อง EV Fleet ภาคอีสาน",           source: "MOU กับ กฟภ. + แผนยุทธศาสตร์",status: "บันทึกร่าง",     owner: "นายธีระ มีสุข",     fiscalYear: "2568" },
  { id: "SR-2568-008", unit: "กฟภ. เขต 7 (ภาคตะวันออกฉียงเหนือ 2)", specialType: "พื้นที่พิเศษ",vehicleType: "รถกระบะ 4 ประตู", qty: 7, reason: "ปฏิบัติงานพื้นที่ชายแดน จ.มุกดาหาร นครพนม",    source: "หนังสือราชการ + ระบบ AA",    status: "รอตรวจสอบ",      owner: "นายพิชิต รุ่งเรือง", fiscalYear: "2568" },
];

/* ── Status config ── */
const STATUS_CFG: Record<ReqStatus, { icon: React.ReactNode; bg: string; text: string; border: string }> = {
  "ผ่านเกณฑ์":       { icon: <CheckCircle2 size={12} />, bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
  "รอตรวจสอบ":       { icon: <Clock size={12} />,        bg: "#fffbeb", text: "#b45309", border: "#fcd34d" },
  "ไม่ผ่านเกณฑ์":    { icon: <XCircle size={12} />,      bg: "#fef2f2", text: "#b91c1c", border: "#fca5a5" },
  "รอข้อมูลเพิ่ม":   { icon: <HelpCircle size={12} />,   bg: "#f0f9ff", text: "#0369a1", border: "#7dd3fc" },
  "บันทึกร่าง":      { icon: <FileText size={12} />,     bg: "#f8fafc", text: "#475569", border: "#cbd5e1" },
};

const SPECIAL_TYPE_CFG: Record<SpecialType, { bg: string; text: string }> = {
  "ภารกิจใหม่":  { bg: "#faf5ff", text: "#6d28d9" },
  "งานโครงการ":  { bg: "#fff7ed", text: "#c2410c" },
  "พื้นที่พิเศษ":{ bg: "#f0fdfa", text: "#0f766e" },
  "รถเฉพาะ":    { bg: "#fef2f2", text: "#b91c1c" },
  "สัญญา":      { bg: "#eff6ff", text: "#1d4ed8" },
};

/* ── Sub-components ── */
function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="flex flex-col gap-1.5 p-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <p className="text-xs" style={{ color: C.sub }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs" style={{ color: C.muted }}>{sub}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: ReqStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
      {cfg.icon} {status}
    </span>
  );
}

function SpecialTypeBadge({ type }: { type: SpecialType }) {
  const cfg = SPECIAL_TYPE_CFG[type];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.text}22` }}>
      {type}
    </span>
  );
}

/* ── Main component ── */
export default function SpecialRequestList({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [filterStatus, setFilterStatus]   = useState<string>("all");
  const [filterType, setFilterType]       = useState<string>("all");
  const [filterYear, setFilterYear]       = useState<string>("2568");

  const filtered = REQUESTS.filter(r => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterType !== "all" && r.specialType !== filterType) return false;
    if (filterYear !== "all" && r.fiscalYear !== filterYear) return false;
    return true;
  });

  const counts = {
    total:     REQUESTS.length,
    passed:    REQUESTS.filter(r => r.status === "ผ่านเกณฑ์").length,
    pending:   REQUESTS.filter(r => r.status === "รอตรวจสอบ" || r.status === "รอข้อมูลเพิ่ม").length,
    failed:    REQUESTS.filter(r => r.status === "ไม่ผ่านเกณฑ์").length,
    totalQty:  REQUESTS.reduce((s, r) => s + r.qty, 0),
  };

  const passedQty = REQUESTS.filter(r => r.status === "ผ่านเกณฑ์").reduce((s, r) => s + r.qty, 0);

  return (
    <div className="flex flex-col gap-6 p-8">

      {/* ── Special badge ── */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg self-start"
        style={{ background: "#faf5ff", border: "1px solid #c4b5fd" }}>
        <AlertTriangle size={14} color="#7c3aed" />
        <span className="text-xs font-semibold" style={{ color: "#6d28d9" }}>
          Scenario 1.3 · จัดซื้อรถเพิ่มเติมกรณีพิเศษ — นอกเหนือโควต้าพื้นฐาน
        </span>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="คำขอทั้งหมด"    value={counts.total}   sub={`รวม ${counts.totalQty} คัน`}       color={C.text} />
        <StatCard label="ผ่านเกณฑ์"      value={counts.passed}  sub={`รวม ${passedQty} คัน`}            color={C.success} />
        <StatCard label="รอดำเนินการ"    value={counts.pending} sub="รอตรวจสอบ / รอข้อมูลเพิ่ม"         color={C.warning} />
        <StatCard label="ไม่ผ่านเกณฑ์"   value={counts.failed}  sub="ต้องส่งกลับทบทวน"                  color={C.danger} />
      </div>

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: C.sub }}>
          <Filter size={13} /> กรองตาม
        </div>

        <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg outline-none"
          style={{ border: `1px solid ${C.border}`, background: C.surface, color: C.text }}>
          <option value="all">ทุกปีงบประมาณ</option>
          <option value="2568">2568</option>
          <option value="2567">2567</option>
        </select>

        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg outline-none"
          style={{ border: `1px solid ${C.border}`, background: C.surface, color: C.text }}>
          <option value="all">ทุกประเภทกรณีพิเศษ</option>
          {(["ภารกิจใหม่", "งานโครงการ", "พื้นที่พิเศษ", "รถเฉพาะ", "สัญญา"] as SpecialType[]).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg outline-none"
          style={{ border: `1px solid ${C.border}`, background: C.surface, color: C.text }}>
          <option value="all">ทุกสถานะ</option>
          {(["ผ่านเกณฑ์", "รอตรวจสอบ", "ไม่ผ่านเกณฑ์", "รอข้อมูลเพิ่ม", "บันทึกร่าง"] as ReqStatus[]).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <span className="ml-auto text-xs" style={{ color: C.muted }}>
          แสดง {filtered.length} / {REQUESTS.length} รายการ
        </span>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr style={{ background: C.bg }}>
              {["เลขที่คำขอ", "หน่วยงาน", "ประเภทกรณีพิเศษ", "ประเภทรถ", "จำนวน", "เหตุผลความจำเป็น", "แหล่งข้อมูล", "สถานะ", "ผู้รับผิดชอบ", ""].map(h => (
                <th key={h} className="px-3 py-3 text-left font-semibold"
                  style={{ color: C.sub, borderBottom: `1px solid ${C.border}` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}
                style={{ background: i % 2 === 0 ? C.surface : C.bg, borderBottom: `1px solid ${C.border}` }}>
                <td className="px-3 py-3 font-mono font-medium" style={{ color: C.primary }}>{r.id}</td>
                <td className="px-3 py-3" style={{ color: C.text, maxWidth: 180 }}>
                  <span className="leading-snug block">{r.unit}</span>
                </td>
                <td className="px-3 py-3">
                  <SpecialTypeBadge type={r.specialType} />
                </td>
                <td className="px-3 py-3" style={{ color: C.text }}>{r.vehicleType}</td>
                <td className="px-3 py-3 text-center font-semibold" style={{ color: C.text }}>{r.qty}</td>
                <td className="px-3 py-3" style={{ color: C.sub, maxWidth: 200 }}>
                  <span className="leading-snug block line-clamp-2">{r.reason}</span>
                </td>
                <td className="px-3 py-3" style={{ color: C.muted, maxWidth: 160 }}>
                  <span className="leading-snug block">{r.source}</span>
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-3 py-3" style={{ color: C.sub }}>{r.owner}</td>
                <td className="px-3 py-3">
                  <button className="text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors"
                    style={{ background: C.bg, color: C.primary, border: `1px solid ${C.border}` }}>
                    ดูรายละเอียด
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12">
            <FileText size={32} color={C.muted} />
            <p className="text-sm" style={{ color: C.muted }}>ไม่พบรายการที่ตรงกับเงื่อนไข</p>
          </div>
        )}
      </div>

      {/* ── Summary footer ── */}
      <div className="flex items-center gap-6 px-5 py-4 rounded-xl"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="flex-1 grid grid-cols-3 gap-4 text-xs">
          <div>
            <span style={{ color: C.muted }}>รวมคำขอที่ผ่านเกณฑ์</span>
            <p className="font-bold text-lg mt-0.5" style={{ color: C.success }}>{passedQty} คัน</p>
          </div>
          <div>
            <span style={{ color: C.muted }}>รอดำเนินการ</span>
            <p className="font-bold text-lg mt-0.5" style={{ color: C.warning }}>
              {REQUESTS.filter(r => r.status === "รอตรวจสอบ" || r.status === "รอข้อมูลเพิ่ม").reduce((s, r) => s + r.qty, 0)} คัน
            </p>
          </div>
          <div>
            <span style={{ color: C.muted }}>ไม่ผ่านเกณฑ์</span>
            <p className="font-bold text-lg mt-0.5" style={{ color: C.danger }}>
              {REQUESTS.filter(r => r.status === "ไม่ผ่านเกณฑ์").reduce((s, r) => s + r.qty, 0)} คัน
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("special-criteria")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: C.primary, color: "#fff" }}>
          กำหนดเกณฑ์กรณีพิเศษ <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
