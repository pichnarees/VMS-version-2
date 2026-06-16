import { useState } from "react";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import type { Page } from "./Sidebar";

/* ── Flows ─────────────────────────────────────────────── */

type FlowStep = { label: string; sub: string; page: Page; phase: number };

/* ── Scenario 1.1 flows ── */
const S11_VEHICLE_FIRST: FlowStep[] = [
  { phase: 1, page: "vehicle-list",        label: "รายการรถที่เข้าเกณฑ์",  sub: "Step 1–2 · ตรวจสอบจาก VMS" },
  { phase: 1, page: "vehicle-review",      label: "ทบทวนรายละเอียดรถ",     sub: "Step 3 · กอง. ตรวจสอบ" },
  { phase: 2, page: "create-plan",         label: "สร้างแผนทดแทน",         sub: "Step 4–5 · กำหนดแผนและรายการ" },
  { phase: 3, page: "budget-validation",   label: "ตรวจสอบงบประมาณ",       sub: "Phase 3 · ยืนยันวงเงิน" },
  { phase: 4, page: "approval-inbox",      label: "กล่องอนุมัติ",           sub: "Phase 4 · เสนอตามลำดับชั้น" },
  { phase: 4, page: "approval-timeline",   label: "ติดตามการอนุมัติ",       sub: "Phase 4 · สถานะขั้นตอน" },
  { phase: 5, page: "procurement-handoff", label: "ส่งต่อจัดซื้อ",         sub: "Phase 5 · PR / E-Bid" },
];

const S11_PLAN_FIRST: FlowStep[] = [
  { phase: 1, page: "create-plan",         label: "สร้างแผนการจัดหา",      sub: "Step 1 · ระบุข้อมูลเบื้องต้น" },
  { phase: 1, page: "plan-criteria",       label: "ระบุเกณฑ์การจัดหา",    sub: "Step 2 · ค้นหารถตามเกณฑ์" },
  { phase: 1, page: "plan-confirm",        label: "ตรวจสอบและยืนยัน",      sub: "Step 3 · ทบทวนก่อนส่งอนุมัติ" },
  { phase: 2, page: "budget-validation",   label: "ตรวจสอบงบประมาณ",       sub: "Phase 2 · ยืนยันวงเงิน" },
  { phase: 3, page: "approval-inbox",      label: "กล่องอนุมัติ",           sub: "Phase 3 · เสนอตามลำดับชั้น" },
  { phase: 3, page: "approval-timeline",   label: "ติดตามการอนุมัติ",       sub: "Phase 3 · สถานะขั้นตอน" },
  { phase: 4, page: "procurement-handoff", label: "ส่งต่อจัดซื้อ",         sub: "Phase 4 · PR / E-Bid" },
];

/* ── Scenario 1.3 flow ── */
const S13_FLOW: FlowStep[] = [
  { phase: 1, page: "special-request-list", label: "รายการคำขอกรณีพิเศษ", sub: "Step 1–2 · รวบรวมจาก VMS" },
  { phase: 2, page: "special-criteria",     label: "กำหนดเกณฑ์และคำนวณ",  sub: "Step 3–4 · เกณฑ์พิเศษ + จำนวนรถ" },
  { phase: 3, page: "create-plan",          label: "สร้างแผนจัดซื้อ",      sub: "Step 5 · ประเภท จำนวน ราคากลาง" },
  { phase: 3, page: "budget-validation",    label: "ตรวจสอบงบประมาณ",      sub: "Step 6–7 · ยืนยันและเสนอ" },
  { phase: 4, page: "approval-inbox",       label: "กล่องอนุมัติ",          sub: "Phase 4 · ผู้ว่า → บอร์ด → ครม." },
  { phase: 4, page: "approval-timeline",    label: "ติดตามการอนุมัติ",      sub: "Phase 4 · สภาพัฒน์ / ครม." },
  { phase: 5, page: "procurement-handoff",  label: "ส่งต่อจัดซื้อ",        sub: "Phase 5 · PR / E-Bid" },
];

/* ── Scenario 1.2 flow ── */
const S12_FLOW: FlowStep[] = [
  { phase: 1, page: "demand-collection",   label: "รวบรวมความต้องการรถ",   sub: "Step 1–3 · สำรวจจากหน่วยงาน" },
  { phase: 2, page: "gap-analysis",        label: "วิเคราะห์ Gap",          sub: "Step 4 · โควต้า vs. ปัจจุบัน" },
  { phase: 3, page: "create-plan",         label: "สร้างแผนจัดซื้อ",        sub: "Step 5 · ประเภท จำนวน ราคากลาง" },
  { phase: 3, page: "budget-validation",   label: "ตรวจสอบงบประมาณ",       sub: "Step 6 · ยืนยันวงเงิน" },
  { phase: 4, page: "approval-inbox",      label: "กล่องอนุมัติ",           sub: "Phase 4 · คณะกรรมการ → บอร์ด" },
  { phase: 4, page: "approval-timeline",   label: "ติดตามการอนุมัติ",       sub: "Phase 4 · สภาพัฒน์ / ครม." },
  { phase: 5, page: "procurement-handoff", label: "ส่งต่อจัดซื้อ",         sub: "Phase 5 · PR / E-Bid" },
];

/* ── Phase labels ── */
const S11_VEHICLE_PHASES: Record<number, string> = {
  1: "ตรวจสอบรถเข้าเงื่อนไข",
  2: "กำหนดแผนรถทดแทน",
  3: "ตรวจสอบงบประมาณ",
  4: "เสนออนุมัติตามลำดับชั้น",
  5: "ส่งต่อจัดซื้อจัดจ้าง",
};

const S11_PLAN_PHASES: Record<number, string> = {
  1: "สร้างแผนและระบุเกณฑ์",
  2: "ตรวจสอบงบประมาณ",
  3: "เสนออนุมัติตามลำดับชั้น",
  4: "ส่งต่อจัดซื้อจัดจ้าง",
};

const S12_PHASES: Record<number, string> = {
  1: "รวบรวมความต้องการรถ",
  2: "วิเคราะห์ส่วนต่าง (Gap)",
  3: "จัดทำแผนจัดซื้อ",
  4: "เสนออนุมัติหลายระดับ",
  5: "ส่งต่อจัดซื้อจัดจ้าง",
};

const S13_PHASES: Record<number, string> = {
  1: "รวบรวมความต้องการพิเศษ",
  2: "กำหนดเกณฑ์และคำนวณรถ",
  3: "จัดทำแผนจัดซื้อ",
  4: "เสนออนุมัติ 3 ชั้น",
  5: "ส่งต่อจัดซื้อจัดจ้าง",
};

/* ── Unified flow (Scenario 0) ── */
const UNIFIED_FLOW: FlowStep[] = [
  { phase: 1, page: "create-request",       label: "เลือกประเภทคำขอ",        sub: "Step 1 · Scenario 1.1 / 1.2 / 1.3" },
  { phase: 1, page: "source-data",          label: "รวบรวมข้อมูลตั้งต้น",    sub: "Step 2 · ข้อมูลจาก VMS" },
  { phase: 2, page: "requirement-analysis", label: "วิเคราะห์ความต้องการ",   sub: "Step 3 · คำนวณจำนวนรถ" },
  { phase: 3, page: "plan-form",            label: "จัดทำแผนจัดหา",          sub: "Step 4 · กรอกแผน 6 ขั้นตอน" },
  { phase: 4, page: "review-submit",        label: "ทบทวนและส่งอนุมัติ",     sub: "Step 5 · ตรวจสอบก่อนส่ง" },
  { phase: 5, page: "approval-inbox",       label: "กล่องอนุมัติ",           sub: "Phase 4 · เสนอตามลำดับชั้น" },
  { phase: 5, page: "approval-timeline",    label: "ติดตามการอนุมัติ",       sub: "Phase 4 · สถานะขั้นตอน" },
  { phase: 6, page: "procurement-handoff",  label: "ส่งต่อจัดซื้อ",          sub: "Phase 5 · PR / E-Bid" },
];

const UNIFIED_PHASES: Record<number, string> = {
  1: "เตรียมข้อมูลและวิเคราะห์",
  2: "วิเคราะห์ความต้องการ",
  3: "จัดทำแผนจัดหา",
  4: "ส่งและทบทวน",
  5: "เสนออนุมัติตามลำดับชั้น",
  6: "ส่งต่อจัดซื้อจัดจ้าง",
};

const UNIFIED_PAGES = new Set<Page>([
  "create-request", "source-data", "requirement-analysis", "plan-form", "review-submit",
]);

/* ── All pages that belong to any scenario ── */
const ALL_SCENARIO_PAGES = new Set<Page>([
  "vehicle-list", "vehicle-review", "create-plan", "plan-criteria", "plan-confirm",
  "budget-validation", "approval-inbox", "approval-timeline", "procurement-handoff",
  "demand-collection", "gap-analysis",
  "special-request-list", "special-criteria",
  "create-request", "source-data", "requirement-analysis", "plan-form", "review-submit",
]);

type ScenarioId = "1.1" | "1.2" | "1.3";
type FlowId11   = "vehicle" | "plan";

const SCENARIOS: Record<ScenarioId, { label: string; sub: string }> = {
  "1.1": { label: "จัดซื้อรถทดแทน",          sub: "ทดแทนรถเดิมที่เสื่อมสภาพ" },
  "1.2": { label: "จัดซื้อตามโควต้าพื้นฐาน",  sub: "เพิ่มเติมตามความต้องการ" },
  "1.3": { label: "จัดซื้อกรณีพิเศษ",         sub: "นอกเหนือโควต้าพื้นฐาน" },
};

function detectScenario(page: Page): ScenarioId {
  if (["demand-collection", "gap-analysis"].includes(page)) return "1.2";
  if (["special-request-list", "special-criteria"].includes(page)) return "1.3";
  return "1.1";
}

function detectFlow11(page: Page): FlowId11 {
  if (["vehicle-list", "vehicle-review"].includes(page)) return "vehicle";
  if (["plan-criteria", "plan-confirm"].includes(page))  return "plan";
  return "vehicle";
}

function getDone(steps: FlowStep[], active: Page): Set<Page> {
  const order = steps.map(s => s.page);
  const idx   = order.indexOf(active);
  return new Set(order.slice(0, Math.max(idx, 0)));
}

const T = {
  bg: "#ffffff", border: "#e2e8f0", phaseBg: "#f8fafc",
  activeText: "#0f172a", activeBg: "#f1f5f9", activeBorder: "#334155",
  doneText: "#64748b", mutedText: "#94a3b8", primary: "#334155",
};

export default function ScenarioNav({ activePage, onNavigate }: { activePage: Page; onNavigate: (p: Page) => void }) {
  if (!ALL_SCENARIO_PAGES.has(activePage)) return null;

  const isUnified = UNIFIED_PAGES.has(activePage);

  const [scenarioId, setScenarioId] = useState<ScenarioId>(() => detectScenario(activePage));
  const [flow11,     setFlow11]     = useState<FlowId11>(() => detectFlow11(activePage));

  if (isUnified) {
    const done  = getDone(UNIFIED_FLOW, activePage);
    const phases = [...new Set(UNIFIED_FLOW.map(s => s.phase))];
    const total = UNIFIED_FLOW.length;
    const doneN = done.size;
    const pct   = Math.round((doneN / total) * 100);

    return (
      <nav className="flex flex-col shrink-0 overflow-y-auto"
        style={{ width: 240, background: T.bg, borderRight: `1px solid ${T.border}`, height: "100%" }}>
        <div className="px-4 pt-4 pb-3" style={{ borderBottom: `1px solid ${T.border}` }}>
          <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: T.mutedText }}>ระบบรวม</p>
          <p className="text-xs font-semibold" style={{ color: T.activeText }}>กระบวนการจัดหารถยนต์</p>
          <p className="text-[10px] mt-0.5" style={{ color: T.mutedText }}>Scenario 1.1 / 1.2 / 1.3 รวมกัน</p>
        </div>

        <div className="flex flex-col py-2 flex-1">
          {phases.map((ph, phIdx) => {
            const phaseSteps  = UNIFIED_FLOW.filter(s => s.phase === ph);
            const phaseActive = phaseSteps.some(s => s.page === activePage);
            const phaseDone   = phaseSteps.every(s => done.has(s.page));

            return (
              <div key={ph} className="flex flex-col">
                <div className="flex items-center gap-2 px-3 pt-3 pb-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      background: phaseDone ? T.primary : phaseActive ? T.primary : T.phaseBg,
                      color:      phaseDone || phaseActive ? "#fff" : T.mutedText,
                      border:     `1.5px solid ${phaseDone || phaseActive ? T.primary : T.border}`,
                    }}>
                    {phaseDone ? "✓" : ph}
                  </div>
                  <span className="text-[11px] font-semibold leading-tight"
                    style={{ color: phaseActive || phaseDone ? T.activeText : T.mutedText }}>
                    {UNIFIED_PHASES[ph]}
                  </span>
                </div>

                <div className="flex flex-col ml-3 pl-3"
                  style={{ borderLeft: `1.5px solid ${phaseDone ? T.primary : T.border}` }}>
                  {phaseSteps.map(step => {
                    const isAct = step.page === activePage;
                    const isDone = done.has(step.page);
                    return (
                      <button key={step.page} onClick={() => onNavigate(step.page)}
                        className="flex items-start gap-2 px-2 py-2 rounded-lg text-left mx-1 transition-colors"
                        style={{
                          background:  isAct ? T.activeBg : "transparent",
                          borderLeft: `2px solid ${isAct ? T.primary : "transparent"}`,
                        }}>
                        <span className="mt-0.5 shrink-0">
                          {isDone
                            ? <CheckCircle2 size={13} color={T.primary} />
                            : isAct
                            ? <Circle size={13} color={T.primary} strokeWidth={2.5} />
                            : <Circle size={13} color={T.mutedText} strokeWidth={1.5} />}
                        </span>
                        <span className="flex flex-col min-w-0">
                          <span className="text-[12px] font-medium leading-tight"
                            style={{ color: isAct ? T.activeText : isDone ? T.doneText : T.mutedText }}>
                            {step.label}
                          </span>
                          <span className="text-[10px] mt-0.5 leading-tight" style={{ color: T.mutedText }}>
                            {step.sub}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {phIdx < phases.length - 1 && (
                  <div className="flex items-center gap-2 px-3 py-0.5">
                    <div className="w-5 flex justify-center">
                      <div className="w-px h-3" style={{ background: T.border }} />
                    </div>
                    <ChevronRight size={10} color={T.mutedText} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-3 py-3" style={{ borderTop: `1px solid ${T.border}` }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px]" style={{ color: T.doneText }}>ความคืบหน้า</span>
            <span className="text-[11px] font-semibold" style={{ color: T.activeText }}>{pct}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: T.phaseBg }}>
            <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: T.primary }} />
          </div>
          <p className="text-[10px] mt-1.5" style={{ color: T.mutedText }}>{doneN} / {total} ขั้นตอนเสร็จสิ้น</p>
        </div>
      </nav>
    );
  }

  /* Resolve current steps + phase labels */
  let steps: FlowStep[];
  let phaseLabels: Record<number, string>;
  let flowSub = "";

  if (scenarioId === "1.3") {
    steps       = S13_FLOW;
    phaseLabels = S13_PHASES;
    flowSub     = "คำขอพิเศษ → เกณฑ์ → คำนวณ → อนุมัติ";
  } else if (scenarioId === "1.2") {
    steps       = S12_FLOW;
    phaseLabels = S12_PHASES;
    flowSub     = "รวบรวมความต้องการ → Gap → อนุมัติ";
  } else if (flow11 === "plan") {
    steps       = S11_PLAN_FIRST;
    phaseLabels = S11_PLAN_PHASES;
    flowSub     = "วางแผน → ระบุเกณฑ์ → อนุมัติ";
  } else {
    steps       = S11_VEHICLE_FIRST;
    phaseLabels = S11_VEHICLE_PHASES;
    flowSub     = "VMS ตรวจพบ → วางแผน → อนุมัติ";
  }

  const done   = getDone(steps, activePage);
  const phases = [...new Set(steps.map(s => s.phase))];
  const total  = steps.length;
  const doneN  = done.size;
  const pct    = Math.round((doneN / total) * 100);

  return (
    <nav className="flex flex-col shrink-0 overflow-y-auto"
      style={{ width: 240, background: T.bg, borderRight: `1px solid ${T.border}`, height: "100%" }}>

      {/* ── Scenario selector ── */}
      <div className="px-3 pt-3 pb-2.5" style={{ borderBottom: `1px solid ${T.border}` }}>
        <p className="text-[9px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: T.mutedText }}>Scenario</p>
        <div className="flex flex-col gap-1">
          {(["1.1", "1.2", "1.3"] as ScenarioId[]).map(id => {
            const active = scenarioId === id;
            return (
              <button key={id}
                onClick={() => {
                  setScenarioId(id);
                  if (id === "1.3") onNavigate("special-request-list");
                  else if (id === "1.2") onNavigate("demand-collection");
                  else if (flow11 === "plan") onNavigate("create-plan");
                  else onNavigate("vehicle-list");
                }}
                className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors"
                style={{
                  background: active ? T.activeBg : "transparent",
                  border: `1.5px solid ${active ? T.activeBorder : "transparent"}`,
                }}>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0 leading-tight"
                  style={{ background: active ? T.primary : T.phaseBg, color: active ? "#fff" : T.mutedText }}>
                  {id}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-tight" style={{ color: active ? T.activeText : T.doneText }}>
                    {SCENARIOS[id].label}
                  </p>
                  <p className="text-[10px] mt-0.5 leading-tight" style={{ color: T.mutedText }}>
                    {SCENARIOS[id].sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Flow toggle (1.1 only) ── */}
      {scenarioId === "1.1" && (
        <div className="px-3 py-2.5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5 px-0.5" style={{ color: T.mutedText }}>Flow</p>
          <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
            {(["vehicle", "plan"] as FlowId11[]).map(id => (
              <button key={id} onClick={() => setFlow11(id)}
                className="flex-1 py-1.5 text-[10px] font-semibold transition-colors"
                style={{ background: flow11 === id ? T.primary : T.bg, color: flow11 === id ? "#fff" : T.mutedText }}>
                {id === "vehicle" ? "รถ-first" : "แผน-first"}
              </button>
            ))}
          </div>
          <p className="text-[10px] mt-1.5 px-0.5" style={{ color: T.mutedText }}>{flowSub}</p>
        </div>
      )}

      {(scenarioId === "1.2" || scenarioId === "1.3") && (
        <div className="px-4 py-2" style={{ borderBottom: `1px solid ${T.border}` }}>
          <p className="text-[10px]" style={{ color: T.mutedText }}>{flowSub}</p>
        </div>
      )}

      {/* ── Phase + Step tree ── */}
      <div className="flex flex-col py-2 flex-1">
        {phases.map((ph, phIdx) => {
          const phaseSteps  = steps.filter(s => s.phase === ph);
          const phaseActive = phaseSteps.some(s => s.page === activePage);
          const phaseDone   = phaseSteps.every(s => done.has(s.page));

          return (
            <div key={`${scenarioId}-${flow11}-${ph}`} className="flex flex-col">
              {/* Phase label */}
              <div className="flex items-center gap-2 px-3 pt-3 pb-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{
                    background: phaseDone ? T.primary : phaseActive ? T.primary : T.phaseBg,
                    color:      phaseDone || phaseActive ? "#fff" : T.mutedText,
                    border:     `1.5px solid ${phaseDone || phaseActive ? T.primary : T.border}`,
                  }}>
                  {phaseDone ? "✓" : ph}
                </div>
                <span className="text-[11px] font-semibold leading-tight"
                  style={{ color: phaseActive || phaseDone ? T.activeText : T.mutedText }}>
                  {phaseLabels[ph]}
                </span>
              </div>

              {/* Steps */}
              <div className="flex flex-col ml-3 pl-3"
                style={{ borderLeft: `1.5px solid ${phaseDone ? T.primary : T.border}` }}>
                {phaseSteps.map(step => {
                  const isActive = step.page === activePage;
                  const isDone   = done.has(step.page);
                  return (
                    <button key={step.page} onClick={() => onNavigate(step.page)}
                      className="flex items-start gap-2 px-2 py-2 rounded-lg text-left mx-1 transition-colors"
                      style={{
                        background:  isActive ? T.activeBg : "transparent",
                        borderLeft: `2px solid ${isActive ? T.primary : "transparent"}`,
                      }}>
                      <span className="mt-0.5 shrink-0">
                        {isDone
                          ? <CheckCircle2 size={13} color={T.primary} />
                          : isActive
                          ? <Circle size={13} color={T.primary} strokeWidth={2.5} />
                          : <Circle size={13} color={T.mutedText} strokeWidth={1.5} />}
                      </span>
                      <span className="flex flex-col min-w-0">
                        <span className="text-[12px] font-medium leading-tight"
                          style={{ color: isActive ? T.activeText : isDone ? T.doneText : T.mutedText }}>
                          {step.label}
                        </span>
                        <span className="text-[10px] mt-0.5 leading-tight" style={{ color: T.mutedText }}>
                          {step.sub}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {phIdx < phases.length - 1 && (
                <div className="flex items-center gap-2 px-3 py-0.5">
                  <div className="w-5 flex justify-center">
                    <div className="w-px h-3" style={{ background: T.border }} />
                  </div>
                  <ChevronRight size={10} color={T.mutedText} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Progress footer ── */}
      <div className="px-3 py-3" style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px]" style={{ color: T.doneText }}>ความคืบหน้า</span>
          <span className="text-[11px] font-semibold" style={{ color: T.activeText }}>{pct}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: T.phaseBg }}>
          <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: T.primary }} />
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: T.mutedText }}>{doneN} / {total} ขั้นตอนเสร็จสิ้น</p>
      </div>
    </nav>
  );
}
