import { useState, useRef, useEffect } from "react";
import { ChevronRight, Home, Calendar, Check, Plus, X } from "lucide-react";
import type { Page } from "../components/Sidebar";

/* ── tokens ─────────────────────────────────────── */
const G = {
  bg:          "#ffffff",
  surface:     "#ffffff",
  border:      "#d0d5dd",
  borderFocus: "#334155",
  t1:          "#101828",
  t3:          "#475467",
  t4:          "#667085",
  t5:          "#98a2b3",
  activeLine:  "#334155",
  btnPrimary:  "#334155",
  accent:      "#e8edf2",
  accentDeep:  "#c8d3de",
  buyBg:       "#f0f4ff",
  buyBorder:   "#bfcbf7",
  buyText:     "#3451b2",
  rentBg:      "#f0fdf4",
  rentBorder:  "#86efac",
  rentText:    "#166534",
};

const BUY_SUBTYPES  = ["ซื้อทดแทน", "ซื้อเพิ่มเติม", "ซื้อเพิ่มเติมโควตาพิเศษ"];
const RENT_SUBTYPES = ["เช่าระยะสั้น", "เช่าระยะยาว", "เช่าแบบมีสิทธิ์ซื้อ"];

/* ── Stepper ─────────────────────────────────────── */
const STEPS = [
  { n: "01", label: "ระบุข้อมูลเบื้องต้น" },
  { n: "02", label: "ระบุเกณฑ์การจัดหา" },
  { n: "03", label: "ตรวจสอบข้อมูลและยืนยัน" },
];

function StepConnector({ last }: { last?: boolean }) {
  if (last) return <div className="shrink-0 w-[20.5px] h-[72px]" />;
  return (
    <div className="shrink-0 w-[20.5px] h-[72px] relative">
      <div className="absolute inset-[-0.34%_0_-0.34%_-2.13%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.9371 72.4856">
          <path d="M0.437079 0.242821L20.4371 36.2428L0.437079 72.2428" stroke="#D0D5DD" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function Stepper({ active }: { active: number }) {
  return (
    <div className="relative rounded-xl w-full overflow-hidden" style={{ border: `1px solid ${G.border}` }}>
      <div className="flex items-center w-full">
        {STEPS.map((s, i) => {
          const isActive = i === active - 1;
          const isDone   = i < active - 1;
          const isLast   = i === STEPS.length - 1;
          return (
            <div key={s.n} className="flex-1 min-w-0 relative" style={{ height: 72, background: isActive ? G.accent : G.surface }}>
              <div className="flex flex-row items-center size-full">
                <div className="flex gap-2 items-center pl-6 py-4 size-full">
                  <div className="flex flex-1 gap-4 items-center min-w-0">
                    <div className="flex flex-col items-center justify-center rounded-full shrink-0 size-10 transition-all"
                      style={{
                        background: isDone ? G.btnPrimary : G.surface,
                        border: `2px solid ${isActive || isDone ? G.btnPrimary : G.border}`,
                      }}>
                      {isDone
                        ? <Check size={16} strokeWidth={2.5} color="#fff" />
                        : <span className="text-sm font-semibold" style={{ color: isActive ? G.btnPrimary : G.t5 }}>{s.n}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs" style={{ color: G.t5 }}>ขั้นตอนที่ {i + 1}</p>
                      <p className="text-sm font-semibold" style={{ color: isActive ? G.t1 : G.t3 }}>{s.label}</p>
                    </div>
                  </div>
                  <StepConnector last={isLast} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Field helpers ───────────────────────────────── */
function FieldLabel({ label, sub, required }: { label: string; sub?: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-1 h-6 shrink-0">
      <span className="text-sm font-semibold" style={{ color: G.t3 }}>{label}</span>
      {required && <span className="text-sm" style={{ color: "#e53e3e" }}>*</span>}
      {sub && <span className="text-sm" style={{ color: G.t5 }}>{sub}</span>}
    </div>
  );
}

function TextInputField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      className="h-10 rounded-lg w-full px-3 text-sm bg-white outline-none transition-all"
      style={{
        border: `1.5px solid ${focused ? G.borderFocus : G.border}`,
        color: G.t1,
        boxShadow: focused ? `0 0 0 3px ${G.accent}` : "none",
      }}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function YearInputField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="h-10 rounded-lg w-full flex items-center px-3 gap-2 bg-white transition-all"
      style={{
        border: `1.5px solid ${focused ? G.borderFocus : G.border}`,
        boxShadow: focused ? `0 0 0 3px ${G.accent}` : "none",
      }}>
      <Calendar size={16} strokeWidth={1.5} color={G.t4} />
      <input
        className="flex-1 text-sm bg-transparent outline-none"
        style={{ color: G.t1 }}
        value={value}
        maxLength={4}
        placeholder="พ.ศ."
        onChange={e => onChange(e.target.value.replace(/\D/g, ""))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function TextAreaField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      className="rounded-lg w-full px-3 py-2.5 text-sm bg-white outline-none resize-none transition-all"
      style={{
        height: 100,
        border: `1.5px solid ${focused ? G.borderFocus : G.border}`,
        color: G.t1,
        boxShadow: focused ? `0 0 0 3px ${G.accent}` : "none",
      }}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

/* ── SubTypeChip — pill toggle ───────────────────── */
function SubTypeChip({
  label, checked, onChange, color,
}: { label: string; checked: boolean; onChange: () => void; color: { bg: string; border: string; text: string; activeBg: string; activeText: string }; key?: any }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all select-none"
      style={{
        background: checked ? color.activeBg : G.surface,
        color: checked ? color.activeText : G.t4,
        border: `1.5px solid ${checked ? color.border : G.border}`,
        boxShadow: checked ? `0 1px 4px 0 ${color.border}55` : "none",
      }}
    >
      <span
        className="w-3.5 h-3.5 rounded-sm flex items-center justify-center shrink-0 transition-all"
        style={{
          background: checked ? color.activeText : "transparent",
          border: `1.5px solid ${checked ? color.activeText : G.border}`,
        }}
      >
        {checked && <Check size={8} strokeWidth={3.5} color="#fff" />}
      </span>
      {label}
    </button>
  );
}

/* ── Procurement Type Selector ───────────────────── */
function ProcurementTypeSelector({
  buyEnabled, setBuyEnabled,
  rentEnabled, setRentEnabled,
  buySubTypes, setBuySubTypes,
  rentSubTypes, setRentSubTypes,
}: {
  buyEnabled: boolean; setBuyEnabled: (v: boolean) => void;
  rentEnabled: boolean; setRentEnabled: (v: boolean) => void;
  buySubTypes: string[]; setBuySubTypes: (v: string[]) => void;
  rentSubTypes: string[]; setRentSubTypes: (v: string[]) => void;
}) {
  function toggleSub(list: string[], item: string, setList: (v: string[]) => void) {
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  }

  const buyColor  = { bg: G.buyBg,  border: G.buyBorder,  text: G.buyText,  activeBg: G.buyBg,  activeText: G.buyText };
  const rentColor = { bg: G.rentBg, border: G.rentBorder, text: G.rentText, activeBg: G.rentBg, activeText: G.rentText };
  const noneSelected = !buyEnabled && !rentEnabled;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${G.border}` }}>

      {/* ── ซื้อ section ── */}
      <div style={{ borderBottom: `1px solid ${G.border}` }}>
        {/* Method header row */}
        <div
          className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none transition-colors"
          style={{ background: buyEnabled ? G.buyBg : G.surface }}
          onClick={() => { setBuyEnabled(!buyEnabled); if (buyEnabled) setBuySubTypes([]); }}
        >
          {/* Checkbox */}
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
            style={{
              background: buyEnabled ? G.buyText : G.surface,
              border: `2px solid ${buyEnabled ? G.buyText : G.border}`,
            }}
          >
            {buyEnabled && <Check size={11} strokeWidth={3} color="#fff" />}
          </span>

          {/* Label + icon */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-semibold" style={{ color: buyEnabled ? G.buyText : G.t3 }}>ซื้อ</span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: buyEnabled ? `${G.buyText}18` : G.accent, color: buyEnabled ? G.buyText : G.t5 }}>
              Purchase
            </span>
          </div>

          {buyEnabled && buySubTypes.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: G.buyText, color: "#fff" }}>
              {buySubTypes.length} ประเภท
            </span>
          )}
        </div>

        {/* Sub-type chips */}
        {buyEnabled && (
          <div className="px-4 py-3 flex flex-wrap gap-2" style={{ background: "#f9fbff", borderTop: `1px dashed ${G.buyBorder}` }}>
            <p className="w-full text-xs mb-0.5" style={{ color: G.t5 }}>เลือกประเภทย่อย (ได้หลายรายการ)</p>
            {BUY_SUBTYPES.map(opt => (
              <SubTypeChip
                key={opt}
                label={opt}
                checked={buySubTypes.includes(opt)}
                onChange={() => toggleSub(buySubTypes, opt, setBuySubTypes)}
                color={buyColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── เช่า section ── */}
      <div>
        {/* Method header row */}
        <div
          className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none transition-colors"
          style={{ background: rentEnabled ? G.rentBg : G.surface }}
          onClick={() => { setRentEnabled(!rentEnabled); if (rentEnabled) setRentSubTypes([]); }}
        >
          {/* Checkbox */}
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
            style={{
              background: rentEnabled ? G.rentText : G.surface,
              border: `2px solid ${rentEnabled ? G.rentText : G.border}`,
            }}
          >
            {rentEnabled && <Check size={11} strokeWidth={3} color="#fff" />}
          </span>

          {/* Label + icon */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-semibold" style={{ color: rentEnabled ? G.rentText : G.t3 }}>เช่า</span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: rentEnabled ? `${G.rentText}18` : G.accent, color: rentEnabled ? G.rentText : G.t5 }}>
              Rental
            </span>
          </div>

          {rentEnabled && rentSubTypes.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: G.rentText, color: "#fff" }}>
              {rentSubTypes.length} ประเภท
            </span>
          )}
        </div>

        {/* Sub-type chips */}
        {rentEnabled && (
          <div className="px-4 py-3 flex flex-wrap gap-2" style={{ background: "#f6fef9", borderTop: `1px dashed ${G.rentBorder}` }}>
            <p className="w-full text-xs mb-0.5" style={{ color: G.t5 }}>เลือกประเภทย่อย (ได้หลายรายการ)</p>
            {RENT_SUBTYPES.map(opt => (
              <SubTypeChip
                key={opt}
                label={opt}
                checked={rentSubTypes.includes(opt)}
                onChange={() => toggleSub(rentSubTypes, opt, setRentSubTypes)}
                color={rentColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Empty state hint */}
      {noneSelected && (
        <div className="px-4 py-2" style={{ borderTop: `1px solid ${G.border}`, background: "#fffbf0" }}>
          <p className="text-xs" style={{ color: "#92400e" }}>⚠ กรุณาเลือกอย่างน้อย 1 ประเภทการสรรหา</p>
        </div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────── */
export default function CreatePlan({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [planName, setPlanName]       = useState("แผนการสรรหายานพาหนะประจำปี 2570");
  const [yearStart, setYearStart]     = useState("2570");
  const [yearEnd, setYearEnd]         = useState("2571");
  const [version, setVersion]         = useState("1.0");
  const [note, setNote]               = useState("");
  const [buyEnabled, setBuyEnabled]   = useState(true);
  const [rentEnabled, setRentEnabled] = useState(false);
  const [buySubTypes, setBuySubTypes] = useState<string[]>(["ซื้อทดแทน"]);
  const [rentSubTypes, setRentSubTypes] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-8 p-8 w-full mx-[0px] mt-[0px] mb-[90px]" style={{ background: G.bg }}>

      {/* Page header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1">
          <Home size={14} strokeWidth={1.5} color={G.t3} />
          <ChevronRight size={14} strokeWidth={1.5} color={G.border} />
          <span className="text-xs px-1" style={{ color: G.t3 }}>แผนการจัดหายานพาหนะ</span>
          <ChevronRight size={14} strokeWidth={1.5} color={G.border} />
          <span className="text-xs px-1" style={{ color: G.t4 }}>สร้างแผนการจัดหายานพาหนะ</span>
        </div>
        <h1 className="text-[28px] font-semibold leading-tight" style={{ color: G.t1 }}>
          สร้างแผนการจัดหายานพาหนะ
        </h1>
      </div>

      {/* Stepper */}
      <Stepper active={1} />

      {/* Form card */}
      <div className="flex flex-col gap-6">
        {/* Section heading */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full" style={{ background: G.activeLine }} />
          <span className="text-base font-semibold" style={{ color: G.t1 }}>ข้อมูลเบื้องต้น</span>
        </div>

        {/* 4-column grid form */}
        <div className="flex flex-col gap-0">

          {/* ── Group 1: ข้อมูลพื้นฐาน ── */}
          <div className="grid grid-cols-4 gap-x-5 gap-y-4 pb-5">
            <div className="col-span-2 flex flex-col gap-1.5">
              <FieldLabel label="ชื่อแผนการสรรหายานพาหนะ" required />
              <TextInputField value={planName} onChange={setPlanName} placeholder="กรอกชื่อแผน" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel label="ปีเริ่มต้นงบประมาณ" required />
              <YearInputField value={yearStart} onChange={setYearStart} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel label="ปีสิ้นสุดงบประมาณ" required />
              <YearInputField value={yearEnd} onChange={setYearEnd} />
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px mb-5" style={{ background: G.border }} />

          {/* ── Group 2: ประเภทการสรรหา ── */}
          <div className="grid grid-cols-4 gap-x-5 pb-5">
            <div className="col-span-3 flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <FieldLabel label="ประเภทการสรรหา" required />
                <span className="text-xs" style={{ color: G.t5 }}>เลือกได้หลายประเภทพร้อมกัน</span>
              </div>
              <ProcurementTypeSelector
                buyEnabled={buyEnabled} setBuyEnabled={setBuyEnabled}
                rentEnabled={rentEnabled} setRentEnabled={setRentEnabled}
                buySubTypes={buySubTypes} setBuySubTypes={setBuySubTypes}
                rentSubTypes={rentSubTypes} setRentSubTypes={setRentSubTypes}
              />
            </div>
            <div className="flex flex-col gap-1.5 pl-1">
              <FieldLabel label="เวอร์ชั่น" />
              <TextInputField value={version} onChange={setVersion} placeholder="เช่น 1.0" />
              <p className="text-xs leading-relaxed" style={{ color: G.t5 }}>
                เวอร์ชั่นของแผนการจัดหา ระบบจะเพิ่มให้อัตโนมัติเมื่อมีการแก้ไข
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px mb-5" style={{ background: G.border }} />

          {/* ── Group 3: หมายเหตุ ── */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel label="หมายเหตุ" sub=" (ถ้ามี)" />
            <TextAreaField value={note} onChange={setNote} placeholder="กรอกรายละเอียดหรือข้อมูลเพิ่มเติมของแผนการจัดหานี้" />
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between w-full">
        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ color: G.t3 }}
          onMouseEnter={e => (e.currentTarget.style.background = G.accent)}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          onClick={() => onNavigate("vehicle-list")}
        >
          ยกเลิก
        </button>
        <button
          className="h-11 px-8 rounded-lg text-sm font-semibold text-white transition-opacity"
          style={{ background: G.btnPrimary, minWidth: 140 }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          onClick={() => onNavigate("plan-criteria")}
        >
          ต่อไป →
        </button>
      </div>
    </div>
  );
}
