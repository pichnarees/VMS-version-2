import { useState } from "react";
import { CheckSquare, Square, ChevronRight, RotateCcw, AlertTriangle, CheckCircle2, Calculator, Info } from "lucide-react";
import type { Page } from "../components/Sidebar";

/* ── Design tokens ── */
const C = {
  primary: "#334155", primaryHov: "#1e293b",
  border: "#e2e8f0", bg: "#f8fafc", surface: "#ffffff",
  text: "#0f172a", sub: "#475569", muted: "#94a3b8",
  success: "#16a34a", warning: "#d97706", danger: "#dc2626",
  special: "#7c3aed",
};

/* ── Criteria definition ── */
interface Criterion {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

const CRITERIA: Criterion[] = [
  { id: "new-mission",   label: "เป็นภารกิจใหม่ที่ยังไม่มีรถรองรับ",        description: "หน่วยงานได้รับมอบหมายภารกิจใหม่ที่ต้องการยานพาหนะเฉพาะ",            required: true },
  { id: "project-work",  label: "เป็นงานโครงการเฉพาะ",                      description: "มีโครงการที่ได้รับอนุมัติและต้องการรถตลอดระยะเวลาโครงการ",          required: true },
  { id: "special-area",  label: "เป็นพื้นที่ปฏิบัติงานพิเศษ",               description: "พื้นที่ห่างไกล เกาะ ชายแดน หรือพื้นที่ที่ต้องใช้รถพิเศษ",         required: false },
  { id: "specific-type", label: "ต้องใช้รถเฉพาะประเภท",                     description: "ลักษณะงานกำหนดให้ต้องใช้รถที่มีสมรรถนะหรืออุปกรณ์พิเศษ",          required: false },
  { id: "contract",      label: "มีเงื่อนไขในสัญญาหรือแผนงานรองรับ",        description: "สัญญาหรือแผนงานระบุให้ต้องมียานพาหนะจำนวนที่ระบุ",               required: true },
  { id: "aa-system",     label: "มีข้อมูลจากระบบ AA หรือเอกสารอ้างอิงสนับสนุน", description: "มีข้อมูลประกอบจากระบบ AA หรือหนังสือราชการสนับสนุนความจำเป็น", required: false },
  { id: "no-alt",        label: "ไม่สามารถใช้รถส่วนกลางหรือรถโควต้าปกติได้", description: "ตรวจสอบแล้วว่าไม่มีรถส่วนกลางหรือรถโควต้าปกติที่สามารถรองรับได้", required: true },
];

/* ── Calc data ── */
interface CalcRow {
  unit: string;
  specialType: string;
  requested: number;
  passed: number;
  existing: number;
  shared: number;
  toBuy: number;
  reason: string;
}

const INITIAL_CALC: CalcRow[] = [
  { unit: "กฟภ. เขต 1 (ภาคเหนือ 1)",    specialType: "ภารกิจใหม่",  requested: 8,  passed: 8,  existing: 2, shared: 0, toBuy: 6,  reason: "รถปัจจุบัน 2 คันไม่เพียงพอรองรับพื้นที่ใหม่" },
  { unit: "กฟภ. เขต 3 (ภาคใต้)",        specialType: "งานโครงการ",  requested: 5,  passed: 5,  existing: 0, shared: 1, toBuy: 4,  reason: "โครงการ Smart Grid ต้องการรถประจำโครงการ" },
  { unit: "กฟภ. เขต 2 (ภาคกลาง)",       specialType: "พื้นที่พิเศษ",requested: 3,  passed: 2,  existing: 1, shared: 0, toBuy: 1,  reason: "1 คำขอไม่ผ่านเกณฑ์ — ใช้รถส่วนกลางได้" },
  { unit: "สำนักงานใหญ่ (กฟภ.)",        specialType: "รถเฉพาะ",     requested: 2,  passed: 2,  existing: 0, shared: 0, toBuy: 2,  reason: "รถเครนต้องการเฉพาะทาง ไม่มีในคลัง" },
  { unit: "กฟภ. เขต 4 (ภาคตะวันออก)",  specialType: "สัญญา",       requested: 6,  passed: 6,  existing: 3, shared: 1, toBuy: 2,  reason: "สัญญากำหนดให้ต้องมีรถ 6 คัน มีอยู่แล้ว 4 คัน" },
  { unit: "กฟภ. เขต 8 (ภาคตะวันออกฉียงเหนือ 2)", specialType: "พื้นที่พิเศษ",requested: 7,  passed: 5,  existing: 2, shared: 0, toBuy: 3,  reason: "พื้นที่ชายแดน ผ่านเกณฑ์ 5 คัน มีรถรองรับ 2 คัน" },
];

/* ── Sub-components ── */
function CriterionRow({ c, checked, onChange }: { c: Criterion; checked: boolean; onChange: (v: boolean) => void; key?: any }) {
  return (
    <label className="flex items-start gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-colors"
      style={{
        background: checked ? "#faf5ff" : C.surface,
        border: `1.5px solid ${checked ? "#c4b5fd" : C.border}`,
      }}>
      <span className="mt-0.5 shrink-0" onClick={e => { e.preventDefault(); onChange(!checked); }}>
        {checked
          ? <CheckSquare size={18} color={C.special} />
          : <Square size={18} color={C.muted} />}
      </span>
      <div className="flex flex-col gap-0.5 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: checked ? "#4c1d95" : C.text }}>{c.label}</span>
          {c.required && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
              style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fca5a5" }}>
              จำเป็น
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: C.muted }}>{c.description}</p>
      </div>
    </label>
  );
}

function CalcTable({ data }: { data: CalcRow[] }) {
  const totals = data.reduce((acc, r) => ({
    requested: acc.requested + r.requested,
    passed:    acc.passed    + r.passed,
    existing:  acc.existing  + r.existing,
    shared:    acc.shared    + r.shared,
    toBuy:     acc.toBuy     + r.toBuy,
  }), { requested: 0, passed: 0, existing: 0, shared: 0, toBuy: 0 });

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr style={{ background: C.bg }}>
            {["หน่วยงาน", "ประเภทกรณีพิเศษ", "ขอ (คัน)", "ผ่านเกณฑ์ (คัน)", "มีอยู่ (คัน)", "จัดสรรได้ (คัน)", "ต้องซื้อเพิ่ม (คัน)", "เหตุผลประกอบ"].map(h => (
              <th key={h} className="px-3 py-3 text-left font-semibold"
                style={{ color: C.sub, borderBottom: `1px solid ${C.border}` }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? C.surface : C.bg, borderBottom: `1px solid ${C.border}` }}>
              <td className="px-3 py-3 font-medium" style={{ color: C.text }}>{r.unit}</td>
              <td className="px-3 py-3">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                  style={{ background: "#faf5ff", color: "#6d28d9", border: "1px solid #c4b5fd" }}>
                  {r.specialType}
                </span>
              </td>
              <td className="px-3 py-3 text-center" style={{ color: C.text }}>{r.requested}</td>
              <td className="px-3 py-3 text-center font-semibold" style={{ color: r.passed < r.requested ? C.warning : C.success }}>{r.passed}</td>
              <td className="px-3 py-3 text-center" style={{ color: C.text }}>{r.existing}</td>
              <td className="px-3 py-3 text-center" style={{ color: C.text }}>{r.shared}</td>
              <td className="px-3 py-3 text-center font-bold text-sm" style={{ color: r.toBuy > 0 ? C.danger : C.success }}>{r.toBuy}</td>
              <td className="px-3 py-3 text-[11px]" style={{ color: C.sub, maxWidth: 180 }}>{r.reason}</td>
            </tr>
          ))}
          {/* Totals row */}
          <tr style={{ background: "#f1f5f9", borderTop: `2px solid ${C.border}` }}>
            <td className="px-3 py-3 font-bold text-xs" style={{ color: C.text }} colSpan={2}>รวมทั้งหมด</td>
            <td className="px-3 py-3 text-center font-bold" style={{ color: C.text }}>{totals.requested}</td>
            <td className="px-3 py-3 text-center font-bold" style={{ color: C.success }}>{totals.passed}</td>
            <td className="px-3 py-3 text-center font-bold" style={{ color: C.text }}>{totals.existing}</td>
            <td className="px-3 py-3 text-center font-bold" style={{ color: C.text }}>{totals.shared}</td>
            <td className="px-3 py-3 text-center font-bold text-base" style={{ color: C.danger }}>{totals.toBuy}</td>
            <td className="px-3 py-3" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ── Main component ── */
export default function SpecialCriteria({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [checked, setChecked]       = useState<Record<string, boolean>>({});
  const [calculated, setCalculated] = useState(false);
  const [confirmed, setConfirmed]   = useState(false);

  function toggle(id: string, v: boolean) {
    setChecked(prev => ({ ...prev, [id]: v }));
    setCalculated(false);
    setConfirmed(false);
  }

  const requiredIds    = CRITERIA.filter(c => c.required).map(c => c.id);
  const allRequired    = requiredIds.every(id => checked[id]);
  const checkedCount   = Object.values(checked).filter(Boolean).length;

  const calcData = calculated ? INITIAL_CALC : [];
  const totalToBuy = INITIAL_CALC.reduce((s, r) => s + r.toBuy, 0);

  return (
    <div className="flex flex-col gap-8 p-8 w-full mx-[0px] mt-[0px] mb-[90px]">

      {/* ── Special badge ── */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg self-start"
        style={{ background: "#faf5ff", border: "1px solid #c4b5fd" }}>
        <AlertTriangle size={14} color="#7c3aed" />
        <span className="text-xs font-semibold" style={{ color: "#6d28d9" }}>
          Phase 2 · กำหนดเกณฑ์กรณีพิเศษและคำนวณจำนวนรถ
        </span>
      </div>

      {/* ── Section A: Criteria ── */}
      <div className="flex flex-col gap-4" style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "2rem" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold" style={{ color: C.text }}>A. กำหนดเกณฑ์กรณีพิเศษ</h2>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>
              เลือกเกณฑ์ที่คำขอต้องผ่าน · เกณฑ์ที่มี "จำเป็น" ต้องเลือกทั้งหมดก่อนคำนวณ
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: allRequired ? "#f0fdf4" : "#fef2f2", color: allRequired ? C.success : C.danger, border: `1px solid ${allRequired ? "#86efac" : "#fca5a5"}` }}>
              {allRequired ? "เกณฑ์จำเป็นครบแล้ว" : `เกณฑ์จำเป็นยังไม่ครบ (${requiredIds.filter(id => checked[id]).length}/${requiredIds.length})`}
            </span>
            <button onClick={() => setChecked({})}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg"
              style={{ color: C.muted, border: `1px solid ${C.border}` }}>
              <RotateCcw size={11} /> รีเซ็ต
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {CRITERIA.map(c => (
            <CriterionRow key={c.id} c={c} checked={!!checked[c.id]} onChange={v => toggle(c.id, v)} />
          ))}
        </div>

        {/* Criteria summary */}
        {checkedCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
            style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
            <CheckCircle2 size={14} color={C.success} />
            <p className="text-xs" style={{ color: "#15803d" }}>
              เลือกเกณฑ์แล้ว {checkedCount} / {CRITERIA.length} ข้อ
              {allRequired ? " — ครบเกณฑ์จำเป็นแล้ว พร้อมคำนวณ" : " — ยังขาดเกณฑ์จำเป็น"}
            </p>
          </div>
        )}
      </div>

      {/* ── Section B: Calculate ── */}
      <div className="flex flex-col gap-4" style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "2rem" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold" style={{ color: C.text }}>B. คำนวณจำนวนรถที่ต้องจัดซื้อ</h2>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>
              ระบบคำนวณจาก: คำขอที่ผ่านเกณฑ์ − รถที่มีอยู่ − รถที่จัดสรรได้ = รถที่ต้องซื้อเพิ่ม
            </p>
          </div>
          <button
            disabled={!allRequired}
            onClick={() => { setCalculated(true); setConfirmed(false); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: allRequired ? C.special : C.bg,
              color: allRequired ? "#fff" : C.muted,
              border: `1px solid ${allRequired ? C.special : C.border}`,
              cursor: allRequired ? "pointer" : "not-allowed",
            }}>
            <Calculator size={15} />
            คำนวณจำนวนรถ
          </button>
        </div>

        {!calculated && (
          <div className="flex flex-col items-center gap-2 py-10 rounded-xl"
            style={{ background: C.bg, border: `1px dashed ${C.border}` }}>
            <Calculator size={32} color={C.muted} />
            <p className="text-sm font-medium" style={{ color: C.muted }}>
              {allRequired ? "กดปุ่ม 'คำนวณจำนวนรถ' เพื่อดูผลการคำนวณ" : "กรุณาเลือกเกณฑ์จำเป็นให้ครบก่อนคำนวณ"}
            </p>
          </div>
        )}

        {calculated && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col gap-1 px-4 py-3.5 rounded-xl"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <p className="text-xs" style={{ color: C.muted }}>รวมคำขอทั้งหมด</p>
                <p className="text-2xl font-bold" style={{ color: C.text }}>
                  {INITIAL_CALC.reduce((s, r) => s + r.requested, 0)}
                </p>
                <p className="text-xs" style={{ color: C.muted }}>คัน จาก {INITIAL_CALC.length} หน่วยงาน</p>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3.5 rounded-xl"
                style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
                <p className="text-xs" style={{ color: C.muted }}>ผ่านเกณฑ์พิเศษ</p>
                <p className="text-2xl font-bold" style={{ color: C.success }}>
                  {INITIAL_CALC.reduce((s, r) => s + r.passed, 0)}
                </p>
                <p className="text-xs" style={{ color: C.muted }}>คัน</p>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3.5 rounded-xl"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <p className="text-xs" style={{ color: C.muted }}>มีรถรองรับอยู่แล้ว</p>
                <p className="text-2xl font-bold" style={{ color: C.sub }}>
                  {INITIAL_CALC.reduce((s, r) => s + r.existing + r.shared, 0)}
                </p>
                <p className="text-xs" style={{ color: C.muted }}>คัน (รวมจัดสรร)</p>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3.5 rounded-xl"
                style={{ background: "#fef2f2", border: "1px solid #fca5a5" }}>
                <p className="text-xs" style={{ color: C.muted }}>ต้องจัดซื้อเพิ่ม</p>
                <p className="text-2xl font-bold" style={{ color: C.danger }}>{totalToBuy}</p>
                <p className="text-xs" style={{ color: C.muted }}>คัน</p>
              </div>
            </div>

            <CalcTable data={INITIAL_CALC} />

            {/* Info note */}
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
              style={{ background: "#fffbeb", border: "1px solid #fcd34d" }}>
              <Info size={14} color={C.warning} className="mt-0.5 shrink-0" />
              <p className="text-xs leading-relaxed" style={{ color: "#92400e" }}>
                ผลการคำนวณนี้ขึ้นอยู่กับเกณฑ์ที่เลือก หากต้องการปรับเกณฑ์กรุณากลับไปแก้ไขในส่วน A แล้วคำนวณใหม่อีกครั้ง
                ข้อมูลรถที่มีอยู่และรถที่จัดสรรได้ดึงมาจากระบบ VMS ณ วันที่ 8 มิถุนายน 2568
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Section C: Confirm ── */}
      {calculated && (
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold" style={{ color: C.text }}>C. ยืนยันผลการคำนวณ</h2>

          <div className="flex flex-col gap-3 px-5 py-4 rounded-xl"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <p className="text-xs font-semibold" style={{ color: C.sub }}>สรุปผลการคำนวณกรณีพิเศษ</p>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div><span style={{ color: C.muted }}>จำนวนหน่วยงาน</span><p className="font-bold text-base mt-0.5" style={{ color: C.text }}>{INITIAL_CALC.length} หน่วยงาน</p></div>
              <div><span style={{ color: C.muted }}>คำขอผ่านเกณฑ์</span><p className="font-bold text-base mt-0.5" style={{ color: C.success }}>{INITIAL_CALC.reduce((s, r) => s + r.passed, 0)} คัน</p></div>
              <div><span style={{ color: C.muted }}>ต้องจัดซื้อเพิ่ม</span><p className="font-bold text-base mt-0.5" style={{ color: C.danger }}>{totalToBuy} คัน</p></div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer mt-1">
              <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                className="w-4 h-4 rounded" />
              <span className="text-xs font-medium" style={{ color: C.text }}>
                ข้าพเจ้าได้ตรวจสอบและยืนยันผลการคำนวณรถที่ต้องจัดซื้อเพิ่มกรณีพิเศษแล้ว
              </span>
            </label>
          </div>
        </div>
      )}

      {/* ── Action bar ── */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => onNavigate("special-request-list")}
          className="text-sm px-4 py-2 rounded-lg"
          style={{ border: `1px solid ${C.border}`, color: C.sub, background: C.surface }}>
          ย้อนกลับ
        </button>
        <div className="flex-1" />
        <button
          disabled={!confirmed}
          onClick={() => onNavigate("create-plan")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: confirmed ? C.primary : C.bg,
            color: confirmed ? "#fff" : C.muted,
            border: `1px solid ${confirmed ? C.primary : C.border}`,
            cursor: confirmed ? "pointer" : "not-allowed",
          }}>
          สร้างแผนจัดหา <ChevronRight size={15} />
        </button>
      </div>

    </div>
  );
}
