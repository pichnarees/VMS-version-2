import { useState } from "react";
import { CheckCircle2, AlertTriangle, FileText, ChevronRight, RefreshCw, TrendingUp, Star, Check, X } from "lucide-react";
import type { Page } from "../components/Sidebar";
import type { RequestType } from "../App";

const C = {
  primary: "#334155", border: "#e2e8f0", bg: "#f8fafc", surface: "#ffffff",
  text: "#0f172a", sub: "#475569", muted: "#94a3b8",
  success: "#16a34a", warning: "#d97706", danger: "#dc2626",
};

/* ── Replacement data ── */
const REPLACEMENT_VEHICLES = [
  { reg: "กข-1234 น.ปท.", type: "รถกระบะ 4WD",           dept: "กองยานพาหนะ กฟภ.", age: 12, km: 298450, repair: 62, cond: "เสื่อมสภาพ",    reasons: ["อายุ ≥ 10 ปี", "ค่าซ่อม ≥ 50%"] },
  { reg: "บค-5678 น.ปท.", type: "รถตู้โดยสาร 12 ที่นั่ง", dept: "กฟภ. เขต 1",       age: 11, km: 340210, repair: 58, cond: "เสื่อมสภาพ",    reasons: ["อายุ ≥ 10 ปี", "ระยะทาง ≥ 250,000 กม."] },
  { reg: "คง-9012 น.ปท.", type: "รถยนต์นั่งส่วนกลาง",     dept: "กฟภ. เขต 2",       age:  9, km: 215800, repair: 53, cond: "ชำรุด",         reasons: ["ค่าซ่อม ≥ 50%", "สภาพชำรุด"] },
  { reg: "งจ-3456 น.ปท.", type: "รถบรรทุกเล็ก 1 ตัน",     dept: "กองพัสดุ",          age: 13, km: 412300, repair: 71, cond: "เสื่อมสภาพมาก", reasons: ["อายุ ≥ 10 ปี", "ระยะทาง ≥ 250,000 กม.", "ค่าซ่อม ≥ 50%"] },
  { reg: "จฉ-7890 น.ปท.", type: "รถกระบะ 2WD",             dept: "กฟภ. เขต 3",       age: 10, km: 189500, repair: 41, cond: "ปานกลาง",       reasons: ["อายุ ≥ 10 ปี"] },
];

/* ── Quota data ── */
const QUOTA_DATA = [
  { dept: "กฟภ. เขต 1 (ภาคเหนือ 1)",   quota: 45, actual: 38, shortage: 7,  mission: "บริการ + ซ่อมบำรุงสายส่ง",   source: "ฝ่ายสัญญา + AA" },
  { dept: "กฟภ. เขต 2 (ภาคกลาง)",       quota: 52, actual: 49, shortage: 3,  mission: "บริการ + งานโครงการ",          source: "ฝ่ายสัญญา" },
  { dept: "กฟภ. เขต 3 (ภาคใต้)",        quota: 38, actual: 31, shortage: 7,  mission: "บริการ + พื้นที่เกาะ",         source: "ฝ่ายสัญญา + AA" },
  { dept: "กฟภ. เขต 4 (ภาคตะวันออก)",  quota: 41, actual: 40, shortage: 1,  mission: "บริการ + EV Charging",          source: "สัญญา" },
  { dept: "กฟภ. เขต 5 (ภาคเหนือ 2)",   quota: 35, actual: 28, shortage: 7,  mission: "บริการ + พื้นที่ภูเขา",        source: "AA" },
  { dept: "กฟภ. เขต 6 (ภาคอีสาน 1)",   quota: 48, actual: 45, shortage: 3,  mission: "บริการ",                        source: "ฝ่ายสัญญา" },
  { dept: "กฟภ. เขต 7 (ภาคอีสาน 2)",   quota: 42, actual: 36, shortage: 6,  mission: "บริการ + งานโครงการ",          source: "ฝ่ายสัญญา + AA" },
];

/* ── Special requests data ── */
const SPECIAL_REQS = [
  { id: "SR-001", dept: "กฟภ. เขต 1", specialType: "ภารกิจใหม่",  type: "รถกระบะ 4WD",    qty: 8, reason: "ขยายพื้นที่รับผิดชอบ จ.เชียงราย", source: "คำขอ + AA", docs: 3 },
  { id: "SR-002", dept: "กฟภ. เขต 3", specialType: "งานโครงการ",  type: "รถกระบะ 4 ประตู",qty: 5, reason: "โครงการ Smart Grid ภาคใต้ Phase 2",source: "หนังสือโครงการ + สัญญา", docs: 5 },
  { id: "SR-003", dept: "กฟภ. เขต 2", specialType: "พื้นที่พิเศษ",type: "รถตู้ 12 ที่นั่ง", qty: 3, reason: "ปฏิบัติงานพื้นที่เกาะและชายฝั่ง",  source: "แผนปฏิบัติงาน + AA", docs: 4 },
  { id: "SR-004", dept: "สนญ. กฟภ.", specialType: "รถเฉพาะ",      type: "รถบรรทุกเครน",   qty: 2, reason: "งานซ่อมบำรุงระบบไฟฟ้าแรงสูง",     source: "คำสั่ง + สัญญา", docs: 6 },
  { id: "SR-005", dept: "กฟภ. เขต 4", specialType: "สัญญา",       type: "รถยนต์นั่ง EV",  qty: 6, reason: "สัญญา EV Charging Station ภาคตะวันออก", source: "สัญญาเลขที่ กจ.2568/045", docs: 2 },
];

/* ── Type label helpers ── */
function TypeBadge({ type }: { type: RequestType }) {
  const cfg = type === "replacement"
    ? { label: "ทดแทนรถเดิม", bg: "#eff6ff", text: "#1d4ed8", icon: <RefreshCw size={11} /> }
    : type === "quota"
    ? { label: "โควต้าพื้นฐาน", bg: "#f0fdf4", text: "#15803d", icon: <TrendingUp size={11} /> }
    : { label: "กรณีพิเศษ", bg: "#faf5ff", text: "#6d28d9", icon: <Star size={11} /> };
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.text}33` }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

/* ── Replacement view ── */
function ReplacementView({ onConfirm }: { onConfirm: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(reg: string) {
    setSelected(prev => { const n = new Set(prev); n.has(reg) ? n.delete(reg) : n.add(reg); return n; });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg self-start"
        style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <RefreshCw size={13} color="#1d4ed8" />
        <span className="text-xs font-semibold" style={{ color: "#1d4ed8" }}>
          ระบบ VMS ตรวจพบรถที่เข้าเกณฑ์ทดแทน {REPLACEMENT_VEHICLES.length} คัน
        </span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr style={{ background: C.bg }}>
              {["","ทะเบียน","ประเภทรถ","หน่วยงาน","อายุ","ระยะทาง","ค่าซ่อม%","สภาพ","เหตุผลที่เข้าเกณฑ์"].map(h => (
                <th key={h} className="px-3 py-3 text-left font-semibold"
                  style={{ color: C.sub, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REPLACEMENT_VEHICLES.map((v, i) => {
              const sel = selected.has(v.reg);
              return (
                <tr key={v.reg} onClick={() => toggle(v.reg)} style={{
                  background: sel ? "#f0f4ff" : i % 2 === 0 ? C.surface : C.bg,
                  borderBottom: `1px solid ${C.border}`,
                  cursor: "pointer",
                  borderLeft: `3px solid ${sel ? C.primary : "transparent"}`,
                }}>
                  <td className="px-3 py-3">
                    <div className="w-4 h-4 rounded flex items-center justify-center"
                      style={{ background: sel ? C.primary : "#fff", border: `2px solid ${sel ? C.primary : C.border}` }}>
                      {sel && <Check size={9} strokeWidth={3.5} color="#fff" />}
                    </div>
                  </td>
                  <td className="px-3 py-3 font-semibold" style={{ color: C.primary }}>{v.reg}</td>
                  <td className="px-3 py-3" style={{ color: C.text }}>{v.type}</td>
                  <td className="px-3 py-3" style={{ color: C.sub }}>{v.dept}</td>
                  <td className="px-3 py-3"><span className="px-1.5 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ background: "#fef2f2", color: "#991b1b" }}>{v.age} ปี</span></td>
                  <td className="px-3 py-3" style={{ color: C.sub }}>{v.km.toLocaleString()} กม.</td>
                  <td className="px-3 py-3 font-semibold" style={{ color: v.repair >= 60 ? C.danger : C.sub }}>{v.repair}%</td>
                  <td className="px-3 py-3" style={{ color: C.sub }}>{v.cond}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">{v.reasons.map(r => (
                      <span key={r} className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: "#f0fdf4", color: "#15803d" }}>{r}</span>
                    ))}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <span className="text-xs" style={{ color: C.muted }}>เลือกแล้ว {selected.size} / {REPLACEMENT_VEHICLES.length} คัน</span>
        <div className="flex-1" />
        <button disabled={selected.size === 0} onClick={onConfirm}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold"
          style={{ background: selected.size > 0 ? C.primary : C.bg, color: selected.size > 0 ? "#fff" : C.muted,
            cursor: selected.size > 0 ? "pointer" : "not-allowed" }}>
          ดำเนินการต่อ → วิเคราะห์ความต้องการ <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ── Quota view ── */
function QuotaView({ onConfirm }: { onConfirm: () => void }) {
  const totalShortage = QUOTA_DATA.reduce((s, r) => s + r.shortage, 0);
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "โควต้ารวม", value: QUOTA_DATA.reduce((s,r) => s+r.quota,0), color: C.text },
          { label: "มีอยู่จริง", value: QUOTA_DATA.reduce((s,r) => s+r.actual,0), color: C.success },
          { label: "ขาดอยู่", value: totalShortage, color: C.danger },
        ].map(c => (
          <div key={c.label} className="flex flex-col gap-1 px-4 py-3.5 rounded-xl"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <p className="text-xs" style={{ color: C.muted }}>{c.label}</p>
            <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs" style={{ color: C.muted }}>คัน</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr style={{ background: C.bg }}>
              {["หน่วยงาน","โควต้า (คัน)","มีอยู่ (คัน)","ขาด (คัน)","ภารกิจ","แหล่งข้อมูล"].map(h => (
                <th key={h} className="px-3 py-3 text-left font-semibold"
                  style={{ color: C.sub, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {QUOTA_DATA.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? C.surface : C.bg, borderBottom: `1px solid ${C.border}` }}>
                <td className="px-3 py-3 font-medium" style={{ color: C.text }}>{r.dept}</td>
                <td className="px-3 py-3 text-center" style={{ color: C.text }}>{r.quota}</td>
                <td className="px-3 py-3 text-center" style={{ color: C.success }}>{r.actual}</td>
                <td className="px-3 py-3 text-center font-bold"
                  style={{ color: r.shortage > 0 ? C.danger : C.success }}>{r.shortage > 0 ? `-${r.shortage}` : "✓"}</td>
                <td className="px-3 py-3" style={{ color: C.sub }}>{r.mission}</td>
                <td className="px-3 py-3" style={{ color: C.muted }}>{r.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button onClick={onConfirm} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ background: C.primary, color: "#fff" }}>
          ดำเนินการต่อ → วิเคราะห์ Gap <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ── Special view ── */
function SpecialView({ onConfirm }: { onConfirm: () => void }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  function toggle(id: string) { setChecked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg self-start"
        style={{ background: "#faf5ff", border: "1px solid #c4b5fd" }}>
        <AlertTriangle size={13} color="#7c3aed" />
        <span className="text-xs font-semibold" style={{ color: "#6d28d9" }}>
          รายการคำขอพิเศษที่รวบรวมจาก VMS — ต้องตรวจสอบหลักฐานก่อนดำเนินการต่อ
        </span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr style={{ background: C.bg }}>
              {["","เลขที่","หน่วยงาน","ประเภทกรณีพิเศษ","ประเภทรถ","จำนวน","เหตุผล","แหล่งข้อมูล","เอกสาร"].map(h => (
                <th key={h} className="px-3 py-3 text-left font-semibold"
                  style={{ color: C.sub, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPECIAL_REQS.map((r, i) => {
              const sel = checked.has(r.id);
              return (
                <tr key={r.id} onClick={() => toggle(r.id)} style={{
                  background: sel ? "#faf5ff" : i % 2 === 0 ? C.surface : C.bg,
                  borderBottom: `1px solid ${C.border}`, cursor: "pointer",
                  borderLeft: `3px solid ${sel ? "#7c3aed" : "transparent"}`,
                }}>
                  <td className="px-3 py-3">
                    <div className="w-4 h-4 rounded flex items-center justify-center"
                      style={{ background: sel ? "#7c3aed" : "#fff", border: `2px solid ${sel ? "#7c3aed" : C.border}` }}>
                      {sel && <Check size={9} strokeWidth={3.5} color="#fff" />}
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono font-semibold" style={{ color: "#6d28d9" }}>{r.id}</td>
                  <td className="px-3 py-3" style={{ color: C.text }}>{r.dept}</td>
                  <td className="px-3 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: "#faf5ff", color: "#6d28d9", border: "1px solid #c4b5fd" }}>{r.specialType}</span>
                  </td>
                  <td className="px-3 py-3" style={{ color: C.text }}>{r.type}</td>
                  <td className="px-3 py-3 text-center font-bold" style={{ color: C.text }}>{r.qty}</td>
                  <td className="px-3 py-3" style={{ color: C.sub, maxWidth: 160 }}><span className="block leading-snug">{r.reason}</span></td>
                  <td className="px-3 py-3" style={{ color: C.muted }}>{r.source}</td>
                  <td className="px-3 py-3">
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#f0fdf4", color: "#15803d" }}>
                      {r.docs} ไฟล์
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <span className="text-xs" style={{ color: C.muted }}>เลือกแล้ว {checked.size} / {SPECIAL_REQS.length} รายการ</span>
        <div className="flex-1" />
        <button disabled={checked.size === 0} onClick={onConfirm}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold"
          style={{ background: checked.size > 0 ? C.primary : C.bg, color: checked.size > 0 ? "#fff" : C.muted,
            cursor: checked.size > 0 ? "pointer" : "not-allowed" }}>
          ดำเนินการต่อ → กำหนดเกณฑ์และวิเคราะห์ <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function SourceData({
  onNavigate, requestType,
}: { onNavigate: (p: Page) => void; requestType: RequestType }) {

  if (!requestType) {
    return (
      <div className="flex flex-col items-center gap-3 p-16">
        <FileText size={40} color="#94a3b8" />
        <p className="text-sm font-medium" style={{ color: "#475569" }}>กรุณาเลือกประเภทคำขอก่อน</p>
        <button onClick={() => onNavigate("create-request")}
          className="px-5 py-2 rounded-lg text-sm font-semibold"
          style={{ background: C.primary, color: "#fff" }}>
          เลือกประเภทคำขอ
        </button>
      </div>
    );
  }

  const titles: Record<NonNullable<RequestType>, { title: string; desc: string }> = {
    replacement: { title: "รายการรถที่เข้าเกณฑ์ทดแทน", desc: "ระบบ VMS ตรวจพบรถที่เข้าเกณฑ์ทดแทนตามอายุ ระยะทาง และสภาพรถ" },
    quota:       { title: "ข้อมูลความต้องการตามโควต้า",  desc: "รวบรวมข้อมูลโควต้ามาตรฐาน เปรียบเทียบกับจำนวนรถที่มีอยู่จริงในแต่ละหน่วยงาน" },
    special:     { title: "รายการคำขอรถกรณีพิเศษ",       desc: "คำขอที่รวบรวมจากหน่วยงานต่าง ๆ ผ่านระบบ VMS พร้อมหลักฐานประกอบ" },
  };

  const { title, desc } = titles[requestType];

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Type + title */}
      <div className="flex items-center gap-3">
        <TypeBadge type={requestType} />
        <div className="flex flex-col">
          <p className="text-sm font-bold" style={{ color: C.text }}>{title}</p>
          <p className="text-xs" style={{ color: C.muted }}>{desc}</p>
        </div>
      </div>

      {/* Dynamic content */}
      {requestType === "replacement" && <ReplacementView onConfirm={() => onNavigate("requirement-analysis")} />}
      {requestType === "quota"       && <QuotaView       onConfirm={() => onNavigate("requirement-analysis")} />}
      {requestType === "special"     && <SpecialView     onConfirm={() => onNavigate("requirement-analysis")} />}
    </div>
  );
}
