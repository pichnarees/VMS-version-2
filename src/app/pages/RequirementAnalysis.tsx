import { useState } from "react";
import { RefreshCw, TrendingUp, Star, ChevronRight, CheckCircle2, Calculator, Info, RotateCcw, Check, ChevronDown, ChevronUp, FileText } from "lucide-react";
import type { Page } from "../components/Sidebar";
import type { RequestType } from "../App";

const C = {
  primary: "#334155", border: "#e2e8f0", bg: "#f8fafc", surface: "#ffffff",
  text: "#0f172a", sub: "#475569", muted: "#94a3b8",
  success: "#16a34a", warning: "#d97706", danger: "#dc2626", special: "#7c3aed",
};

/* ── Replacement analysis ── */
function ReplacementAnalysis({ onConfirm }: { onConfirm: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const data = [
    { reg: "กข-1234 น.ปท.", type: "รถกระบะ 4WD",           dept: "กองยานพาหนะ", age: 12, km: 298450, repair: 62, propose: "ทดแทนด้วยรถกระบะ 4WD รุ่นใหม่" },
    { reg: "บค-5678 น.ปท.", type: "รถตู้โดยสาร 12 ที่นั่ง", dept: "กฟภ. เขต 1",   age: 11, km: 340210, repair: 58, propose: "ทดแทนด้วยรถตู้ 12 ที่นั่ง" },
    { reg: "คง-9012 น.ปท.", type: "รถยนต์นั่งส่วนกลาง",     dept: "กฟภ. เขต 2",   age: 9,  km: 215800, repair: 53, propose: "ทดแทนด้วยรถยนต์นั่งทั่วไป" },
    { reg: "งจ-3456 น.ปท.", type: "รถบรรทุกเล็ก 1 ตัน",     dept: "กองพัสดุ",     age: 13, km: 412300, repair: 71, propose: "ทดแทนด้วยรถบรรทุก 1 ตัน" },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "รถที่เข้าเกณฑ์ทดแทน", val: data.length,  color: C.text },
          { label: "เสนอจัดซื้อทดแทน",    val: data.length,  color: "#1d4ed8" },
          { label: "ประมาณการงบประมาณ",    val: "14.4 ล้านบาท", color: C.warning, isStr: true },
        ].map(c => (
          <div key={c.label} className="flex flex-col gap-1 px-4 py-3.5 rounded-xl"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <p className="text-xs" style={{ color: C.muted }}>{c.label}</p>
            <p className="text-2xl font-bold" style={{ color: c.color }}>{c.val}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr style={{ background: C.bg }}>
              {["ทะเบียน","ประเภทรถ","หน่วยงาน","อายุ","ระยะทาง","ค่าซ่อม%","ข้อเสนอการทดแทน"].map(h => (
                <th key={h} className="px-3 py-3 text-left font-semibold"
                  style={{ color: C.sub, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={r.reg} style={{ background: i % 2 === 0 ? C.surface : C.bg, borderBottom: `1px solid ${C.border}` }}>
                <td className="px-3 py-3 font-semibold" style={{ color: C.primary }}>{r.reg}</td>
                <td className="px-3 py-3" style={{ color: C.text }}>{r.type}</td>
                <td className="px-3 py-3" style={{ color: C.sub }}>{r.dept}</td>
                <td className="px-3 py-3"><span className="px-1.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{ background: "#fef2f2", color: "#991b1b" }}>{r.age} ปี</span></td>
                <td className="px-3 py-3" style={{ color: C.sub }}>{r.km.toLocaleString()} กม.</td>
                <td className="px-3 py-3 font-semibold" style={{ color: r.repair >= 60 ? C.danger : C.sub }}>{r.repair}%</td>
                <td className="px-3 py-3" style={{ color: C.text }}>{r.propose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="w-4 h-4 rounded" />
          <span className="text-xs font-medium" style={{ color: C.text }}>
            ยืนยันผลการวิเคราะห์รถทดแทน {data.length} คัน และดำเนินการจัดทำแผนต่อ
          </span>
        </label>
      </div>

      <div className="flex justify-end">
        <button disabled={!confirmed} onClick={onConfirm}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold"
          style={{ background: confirmed ? C.primary : C.bg, color: confirmed ? "#fff" : C.muted,
            cursor: confirmed ? "pointer" : "not-allowed" }}>
          จัดทำแผนจัดหา <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ── Gap analysis ── */
function GapAnalysis({ onConfirm }: { onConfirm: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const data = [
    { dept: "กฟภ. เขต 1", quota: 45, actual: 38, gap: 7, propose: 7 },
    { dept: "กฟภ. เขต 3", quota: 38, actual: 31, gap: 7, propose: 7 },
    { dept: "กฟภ. เขต 5", quota: 35, actual: 28, gap: 7, propose: 7 },
    { dept: "กฟภ. เขต 7", quota: 42, actual: 36, gap: 6, propose: 6 },
    { dept: "กฟภ. เขต 2", quota: 52, actual: 49, gap: 3, propose: 3 },
    { dept: "กฟภ. เขต 6", quota: 48, actual: 45, gap: 3, propose: 3 },
    { dept: "กฟภ. เขต 4", quota: 41, actual: 40, gap: 1, propose: 1 },
  ];
  const totalPropose = data.reduce((s, r) => s + r.propose, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "โควต้ารวม",    val: data.reduce((s,r)=>s+r.quota,0),  color: C.text },
          { label: "มีอยู่จริง",   val: data.reduce((s,r)=>s+r.actual,0), color: C.success },
          { label: "ส่วนต่าง (Gap)", val: data.reduce((s,r)=>s+r.gap,0), color: C.danger },
          { label: "เสนอจัดซื้อ",  val: totalPropose,                     color: "#1d4ed8" },
        ].map(c => (
          <div key={c.label} className="flex flex-col gap-1 px-4 py-3.5 rounded-xl"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <p className="text-xs" style={{ color: C.muted }}>{c.label}</p>
            <p className="text-2xl font-bold" style={{ color: c.color }}>{c.val}</p>
            <p className="text-xs" style={{ color: C.muted }}>คัน</p>
          </div>
        ))}
      </div>

      {/* Visual bar */}
      <div className="flex flex-col gap-2">
        {data.map(r => {
          const pct = Math.round((r.actual / r.quota) * 100);
          return (
            <div key={r.dept} className="flex items-center gap-3">
              <span className="text-xs w-44 shrink-0" style={{ color: C.sub }}>{r.dept}</span>
              <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: C.bg }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 90 ? C.success : pct >= 70 ? C.warning : C.danger }} />
              </div>
              <span className="text-xs w-10 text-right font-semibold shrink-0" style={{ color: C.sub }}>{pct}%</span>
              <span className="text-xs w-16 shrink-0 font-semibold" style={{ color: C.danger }}>
                {r.gap > 0 ? `-${r.gap} คัน` : "✓"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="w-4 h-4 rounded" />
          <span className="text-xs font-medium" style={{ color: C.text }}>
            ยืนยันผล Gap Analysis — เสนอจัดซื้อ {totalPropose} คัน จาก {data.filter(r=>r.gap>0).length} หน่วยงาน
          </span>
        </label>
      </div>

      <div className="flex justify-end">
        <button disabled={!confirmed} onClick={onConfirm}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold"
          style={{ background: confirmed ? C.primary : C.bg, color: confirmed ? "#fff" : C.muted,
            cursor: confirmed ? "pointer" : "not-allowed" }}>
          จัดทำแผนจัดหา <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ── Special criteria analysis ── */
const VMS_FIELDS = [
  { id: "acc_years", label: "ระยะเวลาสะสมปี" }, { id: "current_mileage", label: "เลขไมล์ปัจจุบัน" },
  { id: "repair_cost_acc", label: "ค่าใช้จ่ายซ่อมสะสม" }, { id: "vehicle_status", label: "สถานะยานพาหนะ" },
  { id: "vehicle_type", label: "ประเภทรถ" }, { id: "unit_name", label: "ชื่อหน่วยงาน" },
  { id: "contract_type", label: "ประเภทสัญญา" }, { id: "province", label: "จังหวัดที่ตั้งหน่วยงาน" },
];

const PREV_TEMPLATES = [
  { year: "2567", name: "เกณฑ์กรณีพิเศษ — ภารกิจใหม่/โครงการ", fieldIds: ["vehicle_type","vehicle_status","unit_name","contract_type"] },
  { year: "2566", name: "เกณฑ์กรณีพิเศษ — พื้นที่พิเศษ", fieldIds: ["vehicle_type","vehicle_status","province","unit_name"] },
];

function SpecialAnalysis({ onConfirm }: { onConfirm: () => void }) {
  const [selectedFields, setFields] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const calcData = [
    { dept: "กฟภ. เขต 1", type: "ภารกิจใหม่",   requested: 8, passed: 8, existing: 2, toBuy: 6 },
    { dept: "กฟภ. เขต 3", type: "งานโครงการ",   requested: 5, passed: 5, existing: 0, toBuy: 5 },
    { dept: "สนญ. กฟภ.", type: "รถเฉพาะ",        requested: 2, passed: 2, existing: 0, toBuy: 2 },
    { dept: "กฟภ. เขต 4", type: "สัญญา",         requested: 6, passed: 6, existing: 3, toBuy: 3 },
  ];
  const totalBuy = calcData.reduce((s, r) => s + r.toBuy, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Field selector */}
      <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold" style={{ color: C.text }}>เลือก VMS Fields เป็นเกณฑ์</p>
          <button onClick={() => setOpen(p => !p)} className="flex items-center gap-1 text-xs" style={{ color: C.muted }}>
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />} {open ? "ซ่อน" : "แสดง"}
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {PREV_TEMPLATES.map(t => (
            <button key={t.year+t.name} onClick={() => { setFields(new Set(t.fieldIds)); setCalculated(false); setConfirmed(false); }}
              className="text-xs px-2.5 py-1 rounded-lg" style={{ background: C.bg, color: C.sub, border: `1px solid ${C.border}` }}>
              โหลดจากปี {t.year} — {t.name}
            </button>
          ))}
          <button onClick={() => { setFields(new Set()); setCalculated(false); }} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg" style={{ color: C.muted }}>
            <RotateCcw size={10} /> ล้าง
          </button>
        </div>

        {open && (
          <div className="grid grid-cols-4 gap-2 pt-2" style={{ borderTop: `1px solid ${C.border}` }}>
            {VMS_FIELDS.map(f => {
              const sel = selectedFields.has(f.id);
              return (
                <label key={f.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer"
                  style={{ background: sel ? C.bg : "transparent", border: `1px solid ${sel ? C.border : "transparent"}` }}>
                  <input type="checkbox" checked={sel} onChange={() => {
                    setFields(prev => { const n = new Set(prev); n.has(f.id) ? n.delete(f.id) : n.add(f.id); return n; });
                    setCalculated(false);
                  }} className="hidden" />
                  {sel ? <CheckCircle2 size={13} color={C.primary} /> : <div className="w-3.5 h-3.5 rounded border" style={{ borderColor: C.border }} />}
                  <span className="text-xs" style={{ color: C.text }}>{f.label}</span>
                </label>
              );
            })}
          </div>
        )}

        {selectedFields.size > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {[...selectedFields].map(id => {
              const f = VMS_FIELDS.find(x => x.id === id);
              return f ? (
                <span key={id} className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{ background: C.bg, color: C.primary, border: `1px solid ${C.border}` }}>{f.label}</span>
              ) : null;
            })}
          </div>
        )}

        <button disabled={selectedFields.size < 2} onClick={() => { setCalculated(true); setConfirmed(false); }}
          className="flex items-center gap-2 self-end px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: selectedFields.size >= 2 ? C.special : C.bg,
            color: selectedFields.size >= 2 ? "#fff" : C.muted,
            cursor: selectedFields.size >= 2 ? "pointer" : "not-allowed" }}>
          <Calculator size={14} /> คำนวณจำนวนรถ
        </button>
      </div>

      {/* Calc result */}
      {calculated && (
        <>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "คำขอทั้งหมด",   val: calcData.reduce((s,r)=>s+r.requested,0), color: C.text },
              { label: "ผ่านเกณฑ์",     val: calcData.reduce((s,r)=>s+r.passed,0),    color: C.success },
              { label: "มีรถรองรับแล้ว", val: calcData.reduce((s,r)=>s+r.existing,0), color: C.sub },
              { label: "ต้องซื้อเพิ่ม",  val: totalBuy,                               color: C.danger },
            ].map(c => (
              <div key={c.label} className="flex flex-col gap-1 px-4 py-3.5 rounded-xl"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <p className="text-xs" style={{ color: C.muted }}>{c.label}</p>
                <p className="text-2xl font-bold" style={{ color: c.color }}>{c.val}</p>
                <p className="text-xs" style={{ color: C.muted }}>คัน</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ background: C.bg }}>
                  {["หน่วยงาน","ประเภท","ขอ","ผ่านเกณฑ์","มีอยู่","ต้องซื้อ"].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-semibold"
                      style={{ color: C.sub, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calcData.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? C.surface : C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td className="px-3 py-3 font-medium" style={{ color: C.text }}>{r.dept}</td>
                    <td className="px-3 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: "#faf5ff", color: "#6d28d9" }}>{r.type}</span></td>
                    <td className="px-3 py-3 text-center" style={{ color: C.text }}>{r.requested}</td>
                    <td className="px-3 py-3 text-center font-semibold" style={{ color: C.success }}>{r.passed}</td>
                    <td className="px-3 py-3 text-center" style={{ color: C.sub }}>{r.existing}</td>
                    <td className="px-3 py-3 text-center font-bold" style={{ color: r.toBuy > 0 ? C.danger : C.success }}>{r.toBuy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 px-5 py-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-xs font-medium" style={{ color: C.text }}>
                ยืนยันผลการคำนวณ ({selectedFields.size} fields) — ต้องจัดซื้อเพิ่ม {totalBuy} คัน
              </span>
            </label>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button disabled={!confirmed} onClick={onConfirm}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold"
          style={{ background: confirmed ? C.primary : C.bg, color: confirmed ? "#fff" : C.muted,
            cursor: confirmed ? "pointer" : "not-allowed" }}>
          จัดทำแผนจัดหา <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function RequirementAnalysis({
  onNavigate, requestType,
}: { onNavigate: (p: Page) => void; requestType: RequestType }) {

  if (!requestType) {
    return (
      <div className="flex flex-col items-center gap-3 p-16">
        <FileText size={40} color="#94a3b8" />
        <p className="text-sm font-medium" style={{ color: "#475569" }}>กรุณาเลือกประเภทคำขอก่อน</p>
        <button onClick={() => onNavigate("create-request")} className="px-5 py-2 rounded-lg text-sm font-semibold"
          style={{ background: C.primary, color: "#fff" }}>เลือกประเภทคำขอ</button>
      </div>
    );
  }

  const labels: Record<NonNullable<RequestType>, { title: string; desc: string }> = {
    replacement: { title: "วิเคราะห์รถทดแทน (Replacement Analysis)", desc: "ตรวจสอบรายการรถที่เสนอทดแทน และข้อเสนอการจัดหาใหม่" },
    quota:       { title: "วิเคราะห์ Gap ตามโควต้า (Gap Analysis)",    desc: "เปรียบเทียบโควต้ากับรถที่มีอยู่ และคำนวณจำนวนที่ต้องจัดหาเพิ่ม" },
    special:     { title: "กำหนดเกณฑ์และคำนวณรถกรณีพิเศษ",              desc: "เลือก VMS fields เป็นเกณฑ์พิเศษ แล้วคำนวณจำนวนรถที่ต้องจัดซื้อ" },
  };

  const { title, desc } = labels[requestType];

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold" style={{ color: C.text }}>{title}</p>
        <p className="text-xs" style={{ color: C.muted }}>{desc}</p>
      </div>

      {requestType === "replacement" && <ReplacementAnalysis onConfirm={() => onNavigate("plan-form")} />}
      {requestType === "quota"       && <GapAnalysis         onConfirm={() => onNavigate("plan-form")} />}
      {requestType === "special"     && <SpecialAnalysis     onConfirm={() => onNavigate("plan-form")} />}
    </div>
  );
}
