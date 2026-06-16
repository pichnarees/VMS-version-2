import { useState } from "react";
import { ChevronRight, Home, ChevronDown, Check, Search, CheckCircle2, SlidersHorizontal } from "lucide-react";
import type { Page } from "../components/Sidebar";

const G = {
  bg: "#ffffff", surface: "#ffffff", border: "#d0d5dd", borderFocus: "#334155",
  t1: "#101828", t3: "#475467", t4: "#667085", t5: "#98a2b3",
  activeLine: "#334155", btnPrimary: "#334155", accent: "#e8edf2", accentDeep: "#c8d3de",
};

const STEPS = [
  { n: "01", label: "ระบุข้อมูลเบื้องต้น" },
  { n: "02", label: "ระบุเกณฑ์การจัดหา" },
  { n: "03", label: "ตรวจสอบข้อมูลและยืนยัน" },
];

/* Mock VMS data – filtered client-side to simulate backend search */
const ALL_VEHICLES = [
  { reg: "กข-1234 น.ปท.", type: "รถกระบะ 4WD",             dept: "กองยานพาหนะ กฟภ.", age: 12, km: 298450, repair: 62, cond: "เสื่อมสภาพ" },
  { reg: "บค-5678 น.ปท.", type: "รถตู้โดยสาร 12 ที่นั่ง",   dept: "กฟภ. เขต 1",      age: 11, km: 340210, repair: 58, cond: "เสื่อมสภาพ" },
  { reg: "คง-9012 น.ปท.", type: "รถยนต์นั่งส่วนกลาง",       dept: "กฟภ. เขต 2",      age:  9, km: 215800, repair: 53, cond: "ชำรุด" },
  { reg: "งจ-3456 น.ปท.", type: "รถบรรทุกเล็ก 1 ตัน",       dept: "กองพัสดุ",         age: 13, km: 412300, repair: 71, cond: "เสื่อมสภาพมาก" },
  { reg: "จฉ-7890 น.ปท.", type: "รถกระบะ 2WD",               dept: "กฟภ. เขต 3",      age: 10, km: 189500, repair: 41, cond: "ปานกลาง" },
  { reg: "ซฌ-3344 น.ปท.", type: "รถกระบะ 4WD",               dept: "กฟภ. เขต 1",      age: 12, km: 310120, repair: 65, cond: "เสื่อมสภาพ" },
  { reg: "ฌญ-5566 น.ปท.", type: "รถยนต์นั่งส่วนกลาง",       dept: "กฟภ. เขต 4",      age:  8, km: 198000, repair: 38, cond: "ปานกลาง" },
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
                      style={{ background: isDone ? G.btnPrimary : G.surface, border: `2px solid ${isActive || isDone ? G.btnPrimary : G.border}` }}>
                      {isDone
                        ? <Check size={16} strokeWidth={2.5} color="#fff" />
                        : <span className="text-sm font-semibold" style={{ color: isActive ? G.btnPrimary : G.t5 }}>{s.n}</span>}
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

function NumberInput({ value, onChange, placeholder, suffix }: {
  value: string; onChange: (v: string) => void; placeholder?: string; suffix?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <input className="h-10 rounded-lg px-3 text-sm bg-white outline-none"
        style={{ width: 100, border: `1.5px solid ${focused ? G.borderFocus : G.border}`, color: G.t1, boxShadow: focused ? `0 0 0 3px ${G.accent}` : "none" }}
        value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value.replace(/\D/g, ""))}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      {suffix && <span className="text-sm shrink-0" style={{ color: G.t4 }}>{suffix}</span>}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-5 rounded-full" style={{ background: G.activeLine }} />
      <span className="text-base font-semibold" style={{ color: G.t1 }}>{children}</span>
    </div>
  );
}

function RowCheckbox({ checked, indeterminate, onChange }: {
  checked: boolean; indeterminate?: boolean; onChange: () => void;
}) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange(); }}
      className="w-4 h-4 rounded flex items-center justify-center shrink-0 cursor-pointer transition-all"
      style={{ background: checked ? G.btnPrimary : "#fff", border: `2px solid ${checked || indeterminate ? G.btnPrimary : G.border}` }}>
      {checked && <Check size={9} strokeWidth={3.5} color="#fff" />}
      {!checked && indeterminate && <div className="w-2 h-0.5 rounded-full" style={{ background: G.btnPrimary }} />}
    </div>
  );
}

export default function PlanCriteria({ onNavigate }: { onNavigate: (p: Page) => void }) {
  /* Criteria state */
  const [minAge,    setMinAge]    = useState("10");
  const [minKm,     setMinKm]     = useState("250000");
  const [minRepair, setMinRepair] = useState("50");
  const [condConds, setCondConds] = useState<string[]>(["เสื่อมสภาพ", "ชำรุด"]);
  const CONDITIONS = ["เสื่อมสภาพ", "ชำรุด", "เสื่อมสภาพมาก", "ปานกลาง"];

  /* Search state */
  const [searching,   setSearching]   = useState(false);
  const [results,     setResults]     = useState<typeof ALL_VEHICLES>([]);
  const [hasSearched, setHasSearched] = useState(false);

  /* Selection state */
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleCond(c: string) {
    setCondConds(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
    /* Reset results when criteria change */
    setHasSearched(false);
    setResults([]);
    setSelected(new Set());
  }

  function handleSearch() {
    setSearching(true);
    setSelected(new Set());
    setTimeout(() => {
      const age    = parseInt(minAge)    || 0;
      const km     = parseInt(minKm)     || 0;
      const repair = parseInt(minRepair) || 0;
      const filtered = ALL_VEHICLES.filter(v =>
        v.age    >= age    &&
        v.km     >= km     &&
        v.repair >= repair &&
        (condConds.length === 0 || condConds.includes(v.cond))
      );
      setResults(filtered);
      setHasSearched(true);
      setSearching(false);
    }, 800);
  }

  function toggleAll() {
    if (selected.size === results.length) setSelected(new Set());
    else setSelected(new Set(results.map(v => v.reg)));
  }

  function toggleVehicle(reg: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(reg) ? next.delete(reg) : next.add(reg);
      return next;
    });
  }

  const allSelected  = results.length > 0 && selected.size === results.length;
  const someSelected = selected.size > 0 && !allSelected;

  /* Reset results whenever a numeric criterion changes */
  function withReset(setter: (v: string) => void) {
    return (v: string) => {
      setter(v);
      setHasSearched(false);
      setResults([]);
      setSelected(new Set());
    };
  }

  return (
    <div className="flex flex-col gap-8 p-8 w-full mx-[0px] mt-[0px] mb-[90px]" style={{ background: G.bg }}>

      {/* Breadcrumb + title */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1">
          <Home size={14} strokeWidth={1.5} color={G.t3} />
          <ChevronRight size={14} strokeWidth={1.5} color={G.border} />
          <button className="text-xs px-1" style={{ color: G.t3 }} onClick={() => onNavigate("vehicle-list")}>แผนการจัดหายานพาหนะ</button>
          <ChevronRight size={14} strokeWidth={1.5} color={G.border} />
          <button className="text-xs px-1" style={{ color: G.t3 }} onClick={() => onNavigate("create-plan")}>สร้างแผน</button>
          <ChevronRight size={14} strokeWidth={1.5} color={G.border} />
          <span className="text-xs px-1" style={{ color: G.t4 }}>ระบุเกณฑ์การจัดหา</span>
        </div>
        <h1 className="text-[28px] font-semibold leading-tight" style={{ color: G.t1 }}>ระบุเกณฑ์การจัดหา</h1>
      </div>

      {/* Stepper */}
      <Stepper active={2} />

      {/* ── Criteria section ── */}
      <div className="flex flex-col gap-6">
        <div>
          <SectionHeading>เกณฑ์การค้นหารถในระบบ VMS</SectionHeading>
          <p className="text-xs mt-2 ml-4" style={{ color: G.t5 }}>
            กำหนดเงื่อนไขด้านล่าง แล้วกด "ค้นหา" เพื่อดูรายการรถที่ตรงเกณฑ์ในระบบ
          </p>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${G.border}` }}>

          {/* Age */}
          <div className="flex items-center gap-4 px-5 py-3.5" style={{ borderBottom: `1px solid ${G.border}` }}>
            <div className="flex items-center gap-2 w-6 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.accentDeep }} />
            </div>
            <span className="text-sm font-medium w-52 shrink-0" style={{ color: G.t3 }}>อายุการใช้งานขั้นต่ำ</span>
            <NumberInput value={minAge} onChange={withReset(setMinAge)} placeholder="10" suffix="ปีขึ้นไป" />
            <span className="text-xs ml-auto" style={{ color: G.t5 }}>เกณฑ์มาตรฐาน กฟภ. ≥ 10 ปี</span>
          </div>

          {/* KM */}
          <div className="flex items-center gap-4 px-5 py-3.5" style={{ borderBottom: `1px solid ${G.border}` }}>
            <div className="flex items-center gap-2 w-6 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.accentDeep }} />
            </div>
            <span className="text-sm font-medium w-52 shrink-0" style={{ color: G.t3 }}>ระยะทางสะสมขั้นต่ำ</span>
            <NumberInput value={minKm} onChange={withReset(setMinKm)} placeholder="250000" suffix="กม. ขึ้นไป" />
            <span className="text-xs ml-auto" style={{ color: G.t5 }}>เกณฑ์มาตรฐาน ≥ 250,000 กม.</span>
          </div>

          {/* Repair */}
          <div className="flex items-center gap-4 px-5 py-3.5" style={{ borderBottom: `1px solid ${G.border}` }}>
            <div className="flex items-center gap-2 w-6 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.accentDeep }} />
            </div>
            <span className="text-sm font-medium w-52 shrink-0" style={{ color: G.t3 }}>ค่าซ่อมสะสม (% ของมูลค่ารถ)</span>
            <NumberInput value={minRepair} onChange={withReset(setMinRepair)} placeholder="50" suffix="% ขึ้นไป" />
            <span className="text-xs ml-auto" style={{ color: G.t5 }}>เกณฑ์มาตรฐาน ≥ 50%</span>
          </div>

          {/* Condition chips */}
          <div className="flex items-start gap-4 px-5 py-3.5">
            <div className="flex items-center gap-2 w-6 shrink-0 mt-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.accentDeep }} />
            </div>
            <span className="text-sm font-medium w-52 shrink-0 mt-1" style={{ color: G.t3 }}>สภาพรถที่รวมในแผน</span>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(c => {
                const on = condConds.includes(c);
                return (
                  <button key={c} type="button" onClick={() => toggleCond(c)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: on ? G.btnPrimary : G.surface, color: on ? "#fff" : G.t3, border: `1.5px solid ${on ? G.btnPrimary : G.border}` }}>
                    {on && <Check size={11} strokeWidth={3} color="#fff" />}
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search button row */}
        <div className="flex items-center justify-between">
          {hasSearched ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} color={results.length > 0 ? "#16a34a" : G.t5} />
              <span className="text-sm" style={{ color: results.length > 0 ? "#16a34a" : G.t5 }}>
                {results.length > 0
                  ? `พบรถที่ตรงเกณฑ์ ${results.length} คัน — เลือกรถที่ต้องการนำเข้าแผน`
                  : "ไม่พบรถที่ตรงเกณฑ์ที่กำหนด — ลองปรับเกณฑ์ใหม่"}
              </span>
            </div>
          ) : (
            <p className="text-xs" style={{ color: G.t5 }}>
              <SlidersHorizontal size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
              กดค้นหาเพื่อกรองรายการรถจากระบบ VMS ตามเกณฑ์ที่กำหนด
            </p>
          )}

          <button
            onClick={handleSearch}
            disabled={searching}
            className="flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-semibold transition-all shrink-0"
            style={{ background: G.btnPrimary, color: "#fff", opacity: searching ? 0.7 : 1 }}
            onMouseEnter={e => { if (!searching) e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => { if (!searching) e.currentTarget.style.opacity = "1"; }}
          >
            {searching ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                กำลังค้นหา…
              </>
            ) : (
              <>
                <Search size={15} />
                {hasSearched ? "ค้นหาใหม่" : "ค้นหารถตามเกณฑ์"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Results section — shown only after search ── */}
      {hasSearched && results.length > 0 && (
        <>
          <div className="w-full h-px" style={{ background: G.border }} />

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <SectionHeading>รถที่ตรงเกณฑ์ ({results.length} คัน)</SectionHeading>
                <p className="text-xs mt-1.5 ml-4" style={{ color: G.t5 }}>
                  เลือกรถที่ต้องการนำเข้าแผนทดแทน — คลิกแถวหรือ checkbox เพื่อเลือก
                </p>
              </div>
              {selected.size > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: G.accent, border: `1px solid ${G.accentDeep}` }}>
                  <CheckCircle2 size={14} color={G.btnPrimary} />
                  <span className="text-sm font-semibold" style={{ color: G.btnPrimary }}>
                    เลือกแล้ว {selected.size} คัน
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${G.border}` }}>
              {/* Header */}
              <div className="grid items-center px-4 py-2.5 text-xs font-semibold"
                style={{ gridTemplateColumns: "44px 1fr 1.5fr 1.5fr 72px 110px 80px 90px", gap: "12px", background: G.accent, color: G.t3, borderBottom: `1px solid ${G.border}` }}>
                <div className="flex justify-center">
                  <RowCheckbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
                </div>
                <span>ทะเบียน</span>
                <span>ประเภทรถ</span>
                <span>หน่วยงาน</span>
                <span>อายุ</span>
                <span>ระยะทาง</span>
                <span>ค่าซ่อม%</span>
                <span>สภาพ</span>
              </div>

              {results.map((v, i) => {
                const isSel = selected.has(v.reg);
                return (
                  <div key={v.reg}
                    onClick={() => toggleVehicle(v.reg)}
                    className="grid items-center px-4 py-3 gap-3 cursor-pointer transition-colors"
                    style={{
                      gridTemplateColumns: "44px 1fr 1.5fr 1.5fr 72px 110px 80px 90px",
                      borderBottom: i < results.length - 1 ? `1px solid ${G.border}` : "none",
                      background: isSel ? "#f0f4ff" : "#fff",
                      borderLeft: `3px solid ${isSel ? G.btnPrimary : "transparent"}`,
                    }}>
                    <div className="flex justify-center">
                      <RowCheckbox checked={isSel} onChange={() => toggleVehicle(v.reg)} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: G.t1 }}>{v.reg}</span>
                    <span className="text-xs" style={{ color: G.t3 }}>{v.type}</span>
                    <span className="text-xs" style={{ color: G.t4 }}>{v.dept}</span>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full w-fit"
                      style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fca5a5" }}>
                      {v.age} ปี
                    </span>
                    <span className="text-xs" style={{ color: G.t3 }}>{v.km.toLocaleString()} กม.</span>
                    <span className="text-xs font-semibold" style={{ color: v.repair >= 60 ? "#dc2626" : G.t3 }}>
                      {v.repair}%
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded w-fit" style={{ background: G.accent, color: G.t3 }}>
                      {v.cond}
                    </span>
                  </div>
                );
              })}

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3"
                style={{ background: G.accent, borderTop: `1px solid ${G.border}` }}>
                <button onClick={toggleAll} className="text-xs font-medium" style={{ color: G.btnPrimary }}>
                  {allSelected ? "ยกเลิกเลือกทั้งหมด" : `เลือกทั้งหมด ${results.length} คัน`}
                </button>
                <span className="text-xs" style={{ color: G.t4 }}>
                  เลือกแล้ว {selected.size} / {results.length} คัน
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* No results state */}
      {hasSearched && results.length === 0 && (
        <>
          <div className="w-full h-px" style={{ background: G.border }} />
          <div className="flex flex-col items-center gap-3 py-10 rounded-xl"
            style={{ border: `1px dashed ${G.border}` }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: G.accent }}>
              <Search size={18} color={G.t5} />
            </div>
            <p className="text-sm font-medium" style={{ color: G.t3 }}>ไม่พบรถที่ตรงเกณฑ์ที่กำหนด</p>
            <p className="text-xs" style={{ color: G.t5 }}>ลองปรับเกณฑ์ให้กว้างขึ้น แล้วค้นหาใหม่อีกครั้ง</p>
          </div>
        </>
      )}

      {/* Action bar */}
      <div className="flex items-center justify-between w-full">
        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ color: G.t3 }}
          onMouseEnter={e => (e.currentTarget.style.background = G.accent)}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          onClick={() => onNavigate("create-plan")}
        >
          ← ย้อนกลับ
        </button>
        <div className="flex items-center gap-3">
          {hasSearched && selected.size === 0 && results.length > 0 && (
            <p className="text-xs" style={{ color: G.t5 }}>กรุณาเลือกรถอย่างน้อย 1 คัน</p>
          )}
          <button
            disabled={!hasSearched || selected.size === 0}
            className="h-11 px-8 rounded-lg text-sm font-semibold text-white transition-opacity"
            style={{
              background: G.btnPrimary,
              minWidth: 180,
              opacity: (!hasSearched || selected.size === 0) ? 0.35 : 1,
              cursor: (!hasSearched || selected.size === 0) ? "not-allowed" : "pointer",
            }}
            onMouseEnter={e => { if (hasSearched && selected.size > 0) e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => { if (hasSearched && selected.size > 0) e.currentTarget.style.opacity = "1"; }}
            onClick={() => { if (hasSearched && selected.size > 0) onNavigate("plan-confirm"); }}
          >
            {selected.size > 0 ? `ถัดไป · รถ ${selected.size} คัน →` : "ถัดไป → ตรวจสอบข้อมูล"}
          </button>
        </div>
      </div>
    </div>
  );
}
