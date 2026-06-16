import { useState } from "react";
import { ChevronRight, Home, Check, CheckCircle2, FileText } from "lucide-react";
import type { Page } from "../components/Sidebar";

const G = {
  bg: "#ffffff", surface: "#ffffff", border: "#d0d5dd",
  t1: "#101828", t3: "#475467", t4: "#667085", t5: "#98a2b3",
  activeLine: "#334155", btnPrimary: "#334155", accent: "#e8edf2", accentDeep: "#c8d3de",
};

const STEPS = [
  { n: "01", label: "ระบุข้อมูลเบื้องต้น" },
  { n: "02", label: "ระบุเกณฑ์การจัดหา" },
  { n: "03", label: "ตรวจสอบข้อมูลและยืนยัน" },
];

const MATCHED = [
  { reg: "กข-1234 น.ปท.", type: "รถกระบะ 4WD",             dept: "กองยานพาหนะ กฟภ.", age: "12 ปี", km: "298,450", cond: "เสื่อมสภาพ",    match: 3 },
  { reg: "บค-5678 น.ปท.", type: "รถตู้โดยสาร 12 ที่นั่ง",   dept: "กฟภ. เขต 1",      age: "11 ปี", km: "340,210", cond: "เสื่อมสภาพ",    match: 3 },
  { reg: "คง-9012 น.ปท.", type: "รถยนต์นั่งส่วนกลาง",       dept: "กฟภ. เขต 2",      age: "9 ปี",  km: "215,800", cond: "ชำรุด",          match: 2 },
  { reg: "งจ-3456 น.ปท.", type: "รถบรรทุกเล็ก 1 ตัน",       dept: "กองพัสดุ",         age: "13 ปี", km: "412,300", cond: "เสื่อมสภาพมาก", match: 3 },
];

const PLAN_SUMMARY = {
  name:    "แผนการสรรหายานพาหนะประจำปี 2570",
  yearStart: "2570", yearEnd: "2571",
  method:  "ซื้อ", subType: "ซื้อทดแทน",
  version: "1.0",
  vehicles: [
    { type: "รถกระบะ 4WD",             dept: "กองยานพาหนะ กฟภ.", qty: 2, unitPrice: 1_200_000 },
    { type: "รถตู้โดยสาร 12 ที่นั่ง",   dept: "กฟภ. เขต 1",      qty: 1, unitPrice: 1_500_000 },
  ],
  criteria: { minAge: "10 ปี", minKm: "250,000 กม.", minRepair: "50%" },
};

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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-5 rounded-full" style={{ background: G.activeLine }} />
      <span className="text-base font-semibold" style={{ color: G.t1 }}>{children}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex py-2.5" style={{ borderBottom: `1px solid ${G.border}` }}>
      <span className="text-sm w-44 shrink-0" style={{ color: G.t4 }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: G.t1 }}>{value}</span>
    </div>
  );
}

export default function PlanConfirm({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [agreed, setAgreed]       = useState(false);

  const totalBudget = PLAN_SUMMARY.vehicles.reduce((s, v) => s + v.qty * v.unitPrice, 0);
  const totalQty    = PLAN_SUMMARY.vehicles.reduce((s, v) => s + v.qty, 0);

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 px-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#f0fdf4" }}>
          <CheckCircle2 size={34} color="#16a34a" />
        </div>
        <div className="text-center max-w-md">
          <p className="text-lg font-semibold mb-2" style={{ color: G.t1 }}>ส่งแผนเพื่อตรวจสอบงบประมาณแล้ว</p>
          <p className="text-sm" style={{ color: G.t4 }}>
            แผน "{PLAN_SUMMARY.name}" ถูกบันทึกและส่งต่อให้ระบบตรวจสอบงบประมาณโดยอัตโนมัติ
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ border: `1px solid ${G.border}`, color: G.t3 }}
            onClick={() => onNavigate("vehicle-list")}>กลับหน้าหลัก</button>
          <button className="px-6 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: G.btnPrimary }}
            onClick={() => onNavigate("budget-validation")}>
            ตรวจสอบงบประมาณ →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 w-full mx-[0px] mt-[0px] mb-[90px]" style={{ background: G.bg }}>

      {/* Breadcrumb + title */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1">
          <Home size={14} strokeWidth={1.5} color={G.t3} />
          <ChevronRight size={14} strokeWidth={1.5} color={G.border} />
          <button className="text-xs px-1" style={{ color: G.t3 }} onClick={() => onNavigate("create-plan")}>สร้างแผน</button>
          <ChevronRight size={14} strokeWidth={1.5} color={G.border} />
          <button className="text-xs px-1" style={{ color: G.t3 }} onClick={() => onNavigate("plan-criteria")}>ระบุเกณฑ์</button>
          <ChevronRight size={14} strokeWidth={1.5} color={G.border} />
          <span className="text-xs px-1" style={{ color: G.t4 }}>ตรวจสอบและยืนยัน</span>
        </div>
        <h1 className="text-[28px] font-semibold leading-tight" style={{ color: G.t1 }}>ตรวจสอบข้อมูลและยืนยัน</h1>
      </div>

      {/* Stepper */}
      <Stepper active={3} />

      {/* Section 1 — ข้อมูลแผนการจัดหา */}
      <div className="flex flex-col gap-6">
        <SectionHeading>ข้อมูลแผนการจัดหา</SectionHeading>
        <div className="flex flex-col">
          <InfoRow label="ชื่อแผน"            value={PLAN_SUMMARY.name} />
          <InfoRow label="ปีงบประมาณ"         value={`${PLAN_SUMMARY.yearStart} – ${PLAN_SUMMARY.yearEnd}`} />
          <InfoRow label="ประเภทการสรรหา"     value={`${PLAN_SUMMARY.method} · ${PLAN_SUMMARY.subType}`} />
          <InfoRow label="เวอร์ชั่น"           value={PLAN_SUMMARY.version} />
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px" style={{ background: G.border }} />

      {/* Section 2 — รายการรถทดแทน */}
      <div className="flex flex-col gap-6">
        <SectionHeading>รายการรถทดแทนที่ต้องการ</SectionHeading>
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${G.border}` }}>
          <div className="grid text-xs font-semibold px-4 py-2.5"
            style={{ gridTemplateColumns: "2fr 2fr 80px 1fr 1fr", gap: "12px", background: G.accent, color: G.t3, borderBottom: `1px solid ${G.border}` }}>
            <span>ประเภทรถ</span><span>หน่วยงาน</span><span>จำนวน</span><span>ราคา/คัน</span><span>รวม</span>
          </div>
          {PLAN_SUMMARY.vehicles.map((v, i) => (
            <div key={i} className="grid items-center px-4 py-3 gap-3 text-sm"
              style={{ gridTemplateColumns: "2fr 2fr 80px 1fr 1fr", borderBottom: i < PLAN_SUMMARY.vehicles.length - 1 ? `1px solid ${G.border}` : "none" }}>
              <span className="font-medium" style={{ color: G.t1 }}>{v.type}</span>
              <span style={{ color: G.t3 }}>{v.dept}</span>
              <span className="font-semibold" style={{ color: G.t1 }}>{v.qty} คัน</span>
              <span style={{ color: G.t3 }}>{v.unitPrice.toLocaleString()}</span>
              <span className="font-semibold" style={{ color: G.t1 }}>{(v.qty * v.unitPrice).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3"
            style={{ background: G.accent, borderTop: `1px solid ${G.border}` }}>
            <span className="text-xs font-semibold" style={{ color: G.t3 }}>รวมทั้งหมด {totalQty} คัน</span>
            <span className="text-sm font-bold" style={{ color: G.t1 }}>งบประมาณรวม {totalBudget.toLocaleString()} บาท</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px" style={{ background: G.border }} />

      {/* Section 3 — เกณฑ์การคัดเลือกรถเดิม */}
      <div className="flex flex-col gap-6">
        <SectionHeading>เกณฑ์การคัดเลือกรถเดิม</SectionHeading>
        <div className="grid grid-cols-4 gap-5">
          {[
            { label: "อายุขั้นต่ำ",       value: PLAN_SUMMARY.criteria.minAge },
            { label: "ระยะทางขั้นต่ำ",    value: PLAN_SUMMARY.criteria.minKm },
            { label: "ค่าซ่อมขั้นต่ำ",    value: PLAN_SUMMARY.criteria.minRepair },
            { label: "สภาพที่รวมในแผน",   value: "เสื่อมสภาพ, ชำรุด" },
          ].map(c => (
            <div key={c.label} className="flex flex-col gap-1.5 p-4 rounded-xl" style={{ border: `1px solid ${G.border}` }}>
              <span className="text-xs" style={{ color: G.t5 }}>{c.label}</span>
              <span className="text-base font-semibold" style={{ color: G.t1 }}>{c.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px" style={{ background: G.border }} />

      {/* Section 4 — รายการรถที่ VMS ค้นพบ */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <SectionHeading>รายการรถที่ระบบ VMS ค้นพบ ({MATCHED.length} คัน)</SectionHeading>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #86efac" }}>
            ตรงเกณฑ์ทั้งหมด
          </span>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${G.border}` }}>
          <div className="grid text-xs font-semibold px-4 py-2.5"
            style={{ gridTemplateColumns: "1fr 1.5fr 1.5fr 80px 1fr 80px 80px", gap: "12px", background: G.accent, color: G.t3, borderBottom: `1px solid ${G.border}` }}>
            <span>ทะเบียน</span><span>ประเภทรถ</span><span>หน่วยงาน</span><span>อายุ</span><span>ระยะทาง</span><span>สภาพ</span><span>ตรงเกณฑ์</span>
          </div>
          {MATCHED.map((v, i) => (
            <div key={i} className="grid items-center px-4 py-3 gap-3 text-xs"
              style={{ gridTemplateColumns: "1fr 1.5fr 1.5fr 80px 1fr 80px 80px", borderBottom: i < MATCHED.length - 1 ? `1px solid ${G.border}` : "none" }}>
              <span className="font-semibold" style={{ color: G.t1 }}>{v.reg}</span>
              <span style={{ color: G.t3 }}>{v.type}</span>
              <span style={{ color: G.t3 }}>{v.dept}</span>
              <span className="px-1.5 py-0.5 rounded font-medium w-fit" style={{ background: "#fef2f2", color: "#991b1b" }}>{v.age}</span>
              <span style={{ color: G.t3 }}>{v.km} กม.</span>
              <span className="px-1.5 py-0.5 rounded w-fit" style={{ background: G.accent, color: G.t3 }}>{v.cond}</span>
              <div className="flex items-center gap-1">
                <CheckCircle2 size={13} color="#16a34a" />
                <span style={{ color: "#16a34a" }}>{v.match}/3</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px" style={{ background: G.border }} />

      {/* Section 5 — สรุปงบและการยืนยัน */}
      <div className="flex flex-col gap-6">
        <SectionHeading>สรุปงบประมาณและยืนยัน</SectionHeading>

        <div className="grid grid-cols-3 gap-5">
          {/* Budget summary */}
          <div className="col-span-1 rounded-xl p-4 flex flex-col gap-0" style={{ border: `1px solid ${G.border}` }}>
            <p className="text-xs font-semibold mb-3" style={{ color: G.t3 }}>สรุปงบประมาณ</p>
            {[
              { label: "งบที่ขอ",         value: `${totalBudget.toLocaleString()} บาท`, ok: null },
              { label: "วงเงินที่ได้รับ",  value: "120,000,000 บาท",                    ok: true },
              { label: "ผลต่างคงเหลือ",    value: `${(120_000_000 - totalBudget).toLocaleString()} บาท`, ok: true },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-2"
                style={{ borderBottom: `1px solid ${G.border}` }}>
                <span className="text-xs" style={{ color: G.t4 }}>{r.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: G.t1 }}>{r.value}</span>
                  {r.ok === true && <CheckCircle2 size={13} color="#16a34a" />}
                </div>
              </div>
            ))}
            <div className="mt-3 flex items-center gap-2 p-2 rounded-lg"
              style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
              <CheckCircle2 size={14} color="#16a34a" />
              <p className="text-xs" style={{ color: "#166534" }}>งบประมาณอยู่ในวงเงินที่ได้รับ</p>
            </div>
          </div>

          {/* Checklist */}
          <div className="col-span-1 rounded-xl p-4" style={{ border: `1px solid ${G.border}` }}>
            <p className="text-xs font-semibold mb-3" style={{ color: G.t3 }}>ตรวจสอบความครบถ้วน</p>
            {[
              "ข้อมูลแผนครบถ้วน",
              "ระบุรายการรถแล้ว",
              "กำหนดเกณฑ์การคัดเลือก",
              "ระบบ VMS ค้นพบรถที่ตรงเกณฑ์",
              "งบประมาณไม่เกินวงเงิน",
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5 py-2"
                style={{ borderBottom: `1px solid ${G.border}` }}>
                <CheckCircle2 size={14} color="#16a34a" />
                <span className="text-xs" style={{ color: G.t1 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div className="col-span-1 rounded-xl p-4" style={{ border: `1px solid ${G.border}` }}>
            <p className="text-xs font-semibold mb-3" style={{ color: G.t3 }}>เอกสารที่จะแนบ</p>
            {["แบบขอจัดหายานพาหนะ.pdf", "รายงานจาก VMS.xlsx", "แผนงบประมาณ 2570.pdf"].map(f => (
              <div key={f} className="flex items-center gap-2 py-2" style={{ borderBottom: `1px solid ${G.border}` }}>
                <FileText size={12} color={G.t4} />
                <span className="text-xs truncate" style={{ color: G.t3 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confirm checkbox */}
        <div className="rounded-xl p-4" style={{ border: `1px solid ${G.border}`, background: G.accent }}>
          <label className="flex items-start gap-3 cursor-pointer" onClick={() => setAgreed(a => !a)}>
            <div className="w-4 h-4 mt-0.5 rounded flex items-center justify-center shrink-0"
              style={{ background: agreed ? G.btnPrimary : G.surface, border: `1.5px solid ${agreed ? G.btnPrimary : G.border}` }}>
              {agreed && <Check size={9} strokeWidth={3} color="#fff" />}
            </div>
            <span className="text-sm leading-relaxed" style={{ color: G.t3 }}>
              ข้าพเจ้าขอรับรองว่าข้อมูลในแผนการจัดหายานพาหนะนี้ถูกต้องและครบถ้วน
              และยินยอมส่งแผนเพื่อตรวจสอบงบประมาณ
            </span>
          </label>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between w-full">
        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ color: G.t3 }}
          onMouseEnter={e => (e.currentTarget.style.background = G.accent)}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          onClick={() => onNavigate("plan-criteria")}
        >
          ← แก้ไขเกณฑ์
        </button>
        <button
          disabled={!agreed}
          onClick={() => setConfirmed(true)}
          className="h-11 px-8 rounded-lg text-sm font-semibold text-white transition-opacity"
          style={{
            background: agreed ? G.btnPrimary : G.accentDeep,
            minWidth: 200,
            cursor: agreed ? "pointer" : "not-allowed",
            opacity: agreed ? 1 : 0.6,
          }}
          onMouseEnter={e => { if (agreed) e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={e => { if (agreed) e.currentTarget.style.opacity = "1"; }}
        >
          ยืนยันและส่งตรวจสอบงบประมาณ →
        </button>
      </div>
    </div>
  );
}
