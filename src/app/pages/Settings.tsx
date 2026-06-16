import { useState } from "react";
import { Car, RotateCcw, TrendingUp, Star, Wallet, GitBranch, FileStack, Save, Plus, Trash2 } from "lucide-react";
import type { Page } from "../components/Sidebar";

const C = {
  primary: "#334155", border: "#e2e8f0", bg: "#f8fafc", surface: "#ffffff",
  text: "#0f172a", sub: "#475569", muted: "#94a3b8",
};

type SubPage = "vehicle-types" | "replacement-criteria" | "quota-criteria" | "special-criteria" | "budget-rules" | "approval-route" | "doc-templates";

const MENUS: { id: SubPage; icon: React.ReactNode; label: string; desc: string }[] = [
  { id: "vehicle-types",        icon: <Car size={16} />,       label: "ประเภทรถยนต์",           desc: "จัดการประเภทและคุณสมบัติรถที่ระบบรองรับ" },
  { id: "replacement-criteria", icon: <RotateCcw size={16} />, label: "เกณฑ์การทดแทน",          desc: "กำหนดเกณฑ์อายุ ระยะทาง และค่าซ่อมสำหรับ Scenario 1.1" },
  { id: "quota-criteria",       icon: <TrendingUp size={16} />,label: "เกณฑ์โควต้าพื้นฐาน",    desc: "กำหนดสูตรคำนวณโควต้ารถตามประเภทหน่วยงาน" },
  { id: "special-criteria",     icon: <Star size={16} />,      label: "เกณฑ์กรณีพิเศษ",        desc: "กำหนดเงื่อนไขที่ต้องผ่านสำหรับคำขอกรณีพิเศษ" },
  { id: "budget-rules",         icon: <Wallet size={16} />,    label: "กฎงบประมาณ",             desc: "วงเงิน แหล่งงบ และข้อกำหนดราคากลาง" },
  { id: "approval-route",       icon: <GitBranch size={16} />, label: "เส้นทางการอนุมัติ",      desc: "กำหนดลำดับผู้อนุมัติในแต่ละ Scenario" },
  { id: "doc-templates",        icon: <FileStack size={16} />, label: "เทมเพลตเอกสาร",          desc: "จัดการเทมเพลตเอกสารและฟอร์มต่าง ๆ" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: C.sub }}>{label}</label>
      {children}
    </div>
  );
}

function SaveBar({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex justify-end pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
      <button onClick={onSave}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
        style={{ background: C.primary, color: "#fff" }}>
        <Save size={14} /> บันทึกการตั้งค่า
      </button>
    </div>
  );
}

function VehicleTypes() {
  const [types, setTypes] = useState([
    { id: "1", name: "รถปิกอัพ 4 ประตู", code: "PU4D", category: "รถบรรทุก" },
    { id: "2", name: "รถปิกอัพ 2 ประตู", code: "PU2D", category: "รถบรรทุก" },
    { id: "3", name: "รถตู้", code: "VAN", category: "รถโดยสาร" },
    { id: "4", name: "รถเก๋ง", code: "SDN", category: "รถนั่ง" },
    { id: "5", name: "รถบรรทุก 6 ล้อ", code: "TRK6", category: "รถบรรทุกหนัก" },
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button onClick={() => setTypes(p => [...p, { id: String(Date.now()), name: "", code: "", category: "" }])}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: C.primary, color: "#fff" }}>
          <Plus size={12} /> เพิ่มประเภท
        </button>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: C.bg }}>
              {["ชื่อประเภทรถ", "รหัส", "หมวดหมู่", ""].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold" style={{ color: C.sub }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.map((t, i) => (
              <tr key={t.id} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                <td className="px-4 py-2">
                  <input className="w-full text-xs border rounded px-2 py-1 outline-none"
                    style={{ borderColor: C.border }} value={t.name}
                    onChange={e => setTypes(p => p.map(x => x.id === t.id ? { ...x, name: e.target.value } : x))} />
                </td>
                <td className="px-4 py-2 w-24">
                  <input className="w-full text-xs border rounded px-2 py-1 outline-none"
                    style={{ borderColor: C.border }} value={t.code}
                    onChange={e => setTypes(p => p.map(x => x.id === t.id ? { ...x, code: e.target.value } : x))} />
                </td>
                <td className="px-4 py-2">
                  <select className="w-full text-xs border rounded px-2 py-1 outline-none"
                    style={{ borderColor: C.border }} value={t.category}
                    onChange={e => setTypes(p => p.map(x => x.id === t.id ? { ...x, category: e.target.value } : x))}>
                    {["รถบรรทุก", "รถโดยสาร", "รถนั่ง", "รถบรรทุกหนัก"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button onClick={() => setTypes(p => p.filter(x => x.id !== t.id))}>
                    <Trash2 size={13} color={C.muted} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

function ReplacementCriteria() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <Field label="อายุรถขั้นต่ำ (ปี)">
          <input type="number" defaultValue={10} className="px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: C.border, color: C.text }} />
        </Field>
        <Field label="ระยะทางขั้นต่ำ (กม.)">
          <input type="number" defaultValue={250000} className="px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: C.border, color: C.text }} />
        </Field>
        <Field label="ค่าซ่อมสะสมขั้นต่ำ (% ของมูลค่ารถ)">
          <input type="number" defaultValue={50} className="px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: C.border, color: C.text }} />
        </Field>
        <Field label="สภาพรถที่ผ่านเกณฑ์ (เลือกได้หลายข้อ)">
          <div className="flex flex-col gap-1.5 px-3 py-2 rounded-lg" style={{ border: `1px solid ${C.border}` }}>
            {["เสื่อมสภาพ", "ชำรุด", "ซ่อมแซมไม่ได้", "ไม่คุ้มค่าซ่อม"].map(c => (
              <label key={c} className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: C.sub }}>
                <input type="checkbox" defaultChecked={c !== "ซ่อมแซมไม่ได้"} className="accent-slate-700" /> {c}
              </label>
            ))}
          </div>
        </Field>
      </div>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

function QuotaCriteria() {
  const rows = [
    { type: "กองส่วนกลาง", formula: "จำนวนพนักงาน / 10", quota: 15 },
    { type: "กฟภ. เขต", formula: "จำนวน กฟฟ. ในสังกัด × 2", quota: 28 },
    { type: "กฟฟ. ชั้น 1", formula: "Fixed = 4", quota: 4 },
    { type: "กฟฟ. ชั้น 2", formula: "Fixed = 3", quota: 3 },
    { type: "กฟฟ. ชั้น 3", formula: "Fixed = 2", quota: 2 },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: C.bg }}>
              {["ประเภทหน่วยงาน", "สูตรคำนวณโควต้า", "โควต้าปัจจุบัน"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold" style={{ color: C.sub }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.type} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                <td className="px-4 py-2.5 text-xs font-medium" style={{ color: C.text }}>{r.type}</td>
                <td className="px-4 py-2">
                  <input className="w-full text-xs border rounded px-2 py-1 outline-none"
                    style={{ borderColor: C.border }} defaultValue={r.formula} />
                </td>
                <td className="px-4 py-2 w-28">
                  <input type="number" className="w-full text-xs border rounded px-2 py-1 outline-none text-right"
                    style={{ borderColor: C.border }} defaultValue={r.quota} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

function SpecialCriteriaSettings() {
  const criteria = [
    { id: "sc1", label: "เป็นภารกิจใหม่ที่ยังไม่มีรถรองรับ", required: true },
    { id: "sc2", label: "เป็นงานโครงการเฉพาะหรือพื้นที่พิเศษ", required: true },
    { id: "sc3", label: "มีหลักฐานและเหตุผลสนับสนุนชัดเจน", required: true },
    { id: "sc4", label: "ได้รับการเห็นชอบจากผู้บังคับบัญชาสูงสุดของหน่วยงาน", required: false },
    { id: "sc5", label: "ไม่ซ้ำซ้อนกับคำขออื่นในระบบ", required: true },
  ];
  return (
    <div className="flex flex-col gap-4">
      {criteria.map(c => (
        <div key={c.id} className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: C.bg, border: `1px solid ${C.border}` }}>
          <input type="checkbox" defaultChecked={c.required} className="w-4 h-4 accent-slate-700" />
          <span className="text-sm flex-1" style={{ color: C.text }}>{c.label}</span>
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: c.required ? "#fef2f2" : C.surface, color: c.required ? "#dc2626" : C.muted, border: `1px solid ${c.required ? "#fecaca" : C.border}` }}>
            {c.required ? "บังคับ" : "เสริม"}
          </span>
        </div>
      ))}
      <SaveBar onSave={() => {}} />
    </div>
  );
}

function BudgetRules() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <Field label="วงเงินสูงสุดต่อคำขอ (บาท)">
          <input type="number" defaultValue={50000000} className="px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: C.border, color: C.text }} />
        </Field>
        <Field label="วงเงินที่ต้องผ่านบอร์ด (บาท)">
          <input type="number" defaultValue={10000000} className="px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: C.border, color: C.text }} />
        </Field>
        <Field label="แหล่งราคากลางที่ยอมรับ">
          <div className="flex flex-col gap-1.5 px-3 py-2 rounded-lg" style={{ border: `1px solid ${C.border}` }}>
            {["กรมบัญชีกลาง", "สืบราคาตลาด (≥ 3 ราย)", "ราคาซื้อครั้งล่าสุด"].map(s => (
              <label key={s} className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: C.sub }}>
                <input type="checkbox" defaultChecked className="accent-slate-700" /> {s}
              </label>
            ))}
          </div>
        </Field>
        <Field label="สกุลเงิน">
          <select className="px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: C.border, color: C.text }}>
            <option>บาท (THB)</option>
          </select>
        </Field>
      </div>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

function ApprovalRoute() {
  const scenarios = [
    { id: "s11", label: "Scenario 1.1 — ทดแทน", path: ["กอง.", "ผู้ว่าการ", "บอร์ด กฟภ."] },
    { id: "s12", label: "Scenario 1.2 — โควต้า", path: ["กอง.", "คณะกรรมการ", "ผู้ว่าการ", "บอร์ด กฟภ."] },
    { id: "s13", label: "Scenario 1.3 — พิเศษ", path: ["กอง.", "ผู้ว่าการ", "บอร์ด กฟภ.", "สภาพัฒน์", "ครม."] },
  ];
  return (
    <div className="flex flex-col gap-4">
      {scenarios.map(s => (
        <div key={s.id} className="rounded-xl p-4" style={{ border: `1px solid ${C.border}` }}>
          <p className="text-xs font-semibold mb-3" style={{ color: C.sub }}>{s.label}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {s.path.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                  style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.sub }}>
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: C.primary, color: "#fff" }}>{i + 1}</span>
                  {step}
                </div>
                {i < s.path.length - 1 && <span style={{ color: C.muted }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
      <SaveBar onSave={() => {}} />
    </div>
  );
}

function DocTemplates() {
  const templates = [
    { id: "t1", name: "บันทึกข้อความขออนุมัติ", scenario: "ทุก Scenario", version: "v3.2", updated: "15 ม.ค. 2568" },
    { id: "t2", name: "แบบฟอร์มสรุปรายการรถ", scenario: "ทุก Scenario", version: "v2.1", updated: "10 ม.ค. 2568" },
    { id: "t3", name: "รายงานผล VMS", scenario: "1.1 / 1.2", version: "v1.5", updated: "5 ม.ค. 2568" },
    { id: "t4", name: "หลักฐานกรณีพิเศษ", scenario: "1.3", version: "v2.0", updated: "20 ธ.ค. 2567" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: C.bg }}>
              {["ชื่อเทมเพลต", "ใช้กับ", "เวอร์ชัน", "อัปเดตล่าสุด", ""].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold" style={{ color: C.sub }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {templates.map((t, i) => (
              <tr key={t.id} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                <td className="px-4 py-2.5 text-xs font-medium" style={{ color: C.text }}>{t.name}</td>
                <td className="px-4 py-2.5 text-xs" style={{ color: C.sub }}>{t.scenario}</td>
                <td className="px-4 py-2.5 text-xs" style={{ color: C.sub }}>{t.version}</td>
                <td className="px-4 py-2.5 text-xs" style={{ color: C.muted }}>{t.updated}</td>
                <td className="px-4 py-2.5">
                  <button className="text-xs px-2.5 py-1 rounded-lg"
                    style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.sub }}>
                    แก้ไข
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

export default function Settings({ onNavigate: _onNavigate }: { onNavigate: (p: Page) => void }) {
  const [active, setActive] = useState<SubPage>("vehicle-types");

  const activeMenu = MENUS.find(m => m.id === active)!;

  function renderContent() {
    switch (active) {
      case "vehicle-types":        return <VehicleTypes />;
      case "replacement-criteria": return <ReplacementCriteria />;
      case "quota-criteria":       return <QuotaCriteria />;
      case "special-criteria":     return <SpecialCriteriaSettings />;
      case "budget-rules":         return <BudgetRules />;
      case "approval-route":       return <ApprovalRoute />;
      case "doc-templates":        return <DocTemplates />;
    }
  }

  return (
    <div className="flex h-full">
      {/* Sub-sidebar */}
      <div className="w-56 shrink-0 flex flex-col py-4" style={{ borderRight: `1px solid ${C.border}`, background: C.bg }}>
        {MENUS.map(m => (
          <button key={m.id} onClick={() => setActive(m.id)}
            className="flex items-center gap-3 px-4 py-3 text-left transition-colors"
            style={{
              background: active === m.id ? C.surface : "transparent",
              borderRight: active === m.id ? `2px solid ${C.primary}` : "2px solid transparent",
              color: active === m.id ? C.text : C.sub,
            }}>
            <span style={{ color: active === m.id ? C.primary : C.muted }}>{m.icon}</span>
            <span className="text-xs font-medium">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl flex flex-col gap-6">
          <div>
            <p className="text-base font-bold" style={{ color: C.text }}>{activeMenu.label}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>{activeMenu.desc}</p>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
