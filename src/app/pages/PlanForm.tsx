import { useState } from "react";
import { ChevronRight, ChevronLeft, Check, Plus, Trash2, Upload, FileText, Info } from "lucide-react";
import type { Page } from "../components/Sidebar";
import type { RequestType } from "../App";

const G = {
  primary: "#334155", border: "#e2e8f0", bg: "#f8fafc", surface: "#ffffff",
  text: "#0f172a", sub: "#475569", muted: "#94a3b8", accent: "#3b82f6",
};

const STEPS = [
  { id: 1, label: "ข้อมูลคำขอ" },
  { id: 2, label: "รายละเอียดความต้องการ" },
  { id: 3, label: "รายการรถ" },
  { id: 4, label: "งบประมาณ" },
  { id: 5, label: "เอกสารแนบ" },
  { id: 6, label: "ตรวจสอบ" },
];

interface VehicleItem {
  id: string;
  type: string;
  count: number;
  unit: string;
  spec: string;
  estimatedPrice: number;
}

const DEFAULT_ITEMS: VehicleItem[] = [
  { id: "1", type: "รถปิกอัพ 4 ประตู", count: 5, unit: "คัน", spec: "เครื่องยนต์ดีเซล 2.4L", estimatedPrice: 900000 },
  { id: "2", type: "รถตู้", count: 2, unit: "คัน", spec: "เครื่องยนต์เบนซิน 2.7L", estimatedPrice: 1200000 },
];

const VEHICLE_TYPES = ["รถปิกอัพ 4 ประตู", "รถปิกอัพ 2 ประตู", "รถตู้", "รถเก๋ง", "รถบรรทุก 6 ล้อ", "รถจักรยานยนต์"];
const UNITS = ["คัน", "คู่"];
const PROCUREMENT_METHODS = ["E-Bidding", "ตกลงราคา", "วิธีคัดเลือก", "วิธีเฉพาะเจาะจง"];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((s, i) => {
        const done = step > s.id;
        const active = step === s.id;
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: done ? G.primary : active ? G.accent : G.bg,
                  color: done || active ? "#fff" : G.muted,
                  border: `2px solid ${done ? G.primary : active ? G.accent : G.border}`,
                }}
              >
                {done ? <Check size={14} /> : s.id}
              </div>
              <span className="text-[10px] whitespace-nowrap" style={{ color: active ? G.accent : done ? G.primary : G.muted }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-12 h-px mb-4" style={{ background: done ? G.primary : G.border }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1({ requestType }: { requestType: RequestType }) {
  const typeLabel = requestType === "replacement" ? "จัดซื้อทดแทนรถเดิม"
    : requestType === "quota" ? "จัดซื้อเพิ่มเติมตามโควต้าพื้นฐาน"
    : "จัดซื้อเพิ่มเติมกรณีพิเศษ";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-5">
        <Field label="ชื่อแผน / คำขอ *" hint="ตั้งชื่อที่สื่อถึงขอบเขตและปีงบประมาณ">
          <input className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: G.border, color: G.text }}
            defaultValue="แผนจัดหารถยนต์ทดแทน ปีงบประมาณ 2569" />
        </Field>
        <Field label="ประเภทคำขอ">
          <div className="px-3 py-2 rounded-lg text-sm" style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.sub }}>
            {typeLabel}
          </div>
        </Field>
        <Field label="ปีงบประมาณ *">
          <select className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: G.border, color: G.text }}>
            <option>2569</option><option>2570</option>
          </select>
        </Field>
        <Field label="หน่วยงานผู้ขอ *">
          <select className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: G.border, color: G.text }}>
            <option>กองบริหารยานพาหนะ</option>
            <option>กฟภ. เขต 1 (ภาคเหนือ)</option>
            <option>กฟภ. เขต 2 (ภาคกลาง)</option>
          </select>
        </Field>
        <Field label="วิธีการจัดซื้อ *">
          <select className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: G.border, color: G.text }}>
            {PROCUREMENT_METHODS.map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="ผู้รับผิดชอบ *">
          <input className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: G.border, color: G.text }}
            defaultValue="นายสมชาย ใจดี" />
        </Field>
      </div>
      <Field label="หมายเหตุ / เหตุผลโดยย่อ">
        <textarea rows={3} className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none"
          style={{ borderColor: G.border, color: G.text }}
          defaultValue="จัดหารถทดแทนตามรอบปกติ ประจำปีงบประมาณ 2569 รถเดิมอายุเกิน 10 ปีและระยะทางเกิน 250,000 กม." />
      </Field>
    </div>
  );
}

function Step2({ requestType }: { requestType: RequestType }) {
  if (requestType === "replacement") {
    return (
      <div className="flex flex-col gap-5">
        <InfoBanner text="ข้อมูลความต้องการจากหน้า Source Data ถูกโหลดแล้ว — ตรวจสอบและยืนยันก่อนดำเนินการต่อ" />
        <div className="grid grid-cols-3 gap-4">
          {[["รถที่เลือกทดแทน", "18 คัน"], ["อายุเฉลี่ย", "13.2 ปี"], ["ระยะทางเฉลี่ย", "318,500 กม."]].map(([l, v]) => (
            <div key={l} className="p-4 rounded-xl" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
              <p className="text-xs mb-1" style={{ color: G.muted }}>{l}</p>
              <p className="text-xl font-bold" style={{ color: G.text }}>{v}</p>
            </div>
          ))}
        </div>
        <Field label="เหตุผลความจำเป็นในการทดแทน *">
          <textarea rows={4} className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none"
            style={{ borderColor: G.border, color: G.text }}
            defaultValue="รถในรายการมีอายุการใช้งานเกินเกณฑ์ที่กำหนด และมีค่าซ่อมสะสมสูงเกิน 50% ของมูลค่ารถ ทำให้ไม่คุ้มค่าการซ่อมแซม จำเป็นต้องจัดหาทดแทนเพื่อรองรับภาระงานของหน่วยงาน" />
        </Field>
      </div>
    );
  }
  if (requestType === "quota") {
    return (
      <div className="flex flex-col gap-5">
        <InfoBanner text="ผลการวิเคราะห์ Gap Analysis ถูกโหลดแล้ว — ช่องว่างรวม 14 คัน" />
        <div className="grid grid-cols-3 gap-4">
          {[["โควต้าตามเกณฑ์", "142 คัน"], ["รถที่มีอยู่จริง", "128 คัน"], ["ช่องว่าง (Gap)", "14 คัน"]].map(([l, v]) => (
            <div key={l} className="p-4 rounded-xl" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
              <p className="text-xs mb-1" style={{ color: G.muted }}>{l}</p>
              <p className="text-xl font-bold" style={{ color: G.text }}>{v}</p>
            </div>
          ))}
        </div>
        <Field label="เหตุผลความจำเป็น *">
          <textarea rows={4} className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none"
            style={{ borderColor: G.border, color: G.text }}
            defaultValue="หน่วยงานมีจำนวนรถต่ำกว่าโควต้ามาตรฐานที่กำหนด ส่งผลต่อประสิทธิภาพการให้บริการและความปลอดภัยในการปฏิบัติงาน" />
        </Field>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      <InfoBanner text="รายการคำขอกรณีพิเศษ 6 รายการถูกโหลดแล้ว — ผ่านเกณฑ์ทั้งหมด" />
      <div className="grid grid-cols-3 gap-4">
        {[["คำขอพิเศษทั้งหมด", "6 รายการ"], ["ผ่านเกณฑ์", "6 รายการ"], ["รถที่ต้องจัดหา", "9 คัน"]].map(([l, v]) => (
          <div key={l} className="p-4 rounded-xl" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="text-xs mb-1" style={{ color: G.muted }}>{l}</p>
            <p className="text-xl font-bold" style={{ color: G.text }}>{v}</p>
          </div>
        ))}
      </div>
      <Field label="ภารกิจหรือโครงการที่เกี่ยวข้อง *">
        <input className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
          style={{ borderColor: G.border, color: G.text }}
          defaultValue="โครงการพัฒนาระบบจำหน่ายไฟฟ้าพื้นที่ห่างไกล 2568–2572" />
      </Field>
      <Field label="เหตุผลความจำเป็น *">
        <textarea rows={3} className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none"
          style={{ borderColor: G.border, color: G.text }}
          defaultValue="ภารกิจใหม่ในพื้นที่ห่างไกลซึ่งยังไม่มีรถรองรับ และเงื่อนไขสัญญากำหนดให้ผู้รับเหมาต้องมีพาหนะของตนเอง" />
      </Field>
    </div>
  );
}

function Step3() {
  const [items, setItems] = useState<VehicleItem[]>(DEFAULT_ITEMS);

  function addItem() {
    setItems(prev => [...prev, {
      id: String(Date.now()), type: VEHICLE_TYPES[0], count: 1, unit: "คัน", spec: "", estimatedPrice: 800000,
    }]);
  }
  function removeItem(id: string) { setItems(prev => prev.filter(i => i.id !== id)); }

  const total = items.reduce((s, i) => s + i.count * i.estimatedPrice, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: G.sub }}>ระบุรายการรถที่ต้องการจัดหา</p>
        <button onClick={addItem}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: G.primary, color: "#fff" }}>
          <Plus size={13} /> เพิ่มรายการ
        </button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${G.border}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: G.bg }}>
              {["ประเภทรถ", "จำนวน", "หน่วย", "สเปกเฉพาะ", "ราคาประมาณ/คัน", "รวม", ""].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold" style={{ color: G.sub }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} style={{ borderTop: idx > 0 ? `1px solid ${G.border}` : "none" }}>
                <td className="px-3 py-2">
                  <select className="w-full text-xs border rounded px-2 py-1 outline-none"
                    style={{ borderColor: G.border, color: G.text }}
                    value={item.type}
                    onChange={e => setItems(p => p.map(i => i.id === item.id ? { ...i, type: e.target.value } : i))}>
                    {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2 w-16">
                  <input type="number" min={1}
                    className="w-full text-xs border rounded px-2 py-1 outline-none text-right"
                    style={{ borderColor: G.border, color: G.text }}
                    value={item.count}
                    onChange={e => setItems(p => p.map(i => i.id === item.id ? { ...i, count: Number(e.target.value) } : i))} />
                </td>
                <td className="px-3 py-2 w-16">
                  <select className="w-full text-xs border rounded px-2 py-1 outline-none"
                    style={{ borderColor: G.border, color: G.text }}
                    value={item.unit}
                    onChange={e => setItems(p => p.map(i => i.id === item.id ? { ...i, unit: e.target.value } : i))}>
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input className="w-full text-xs border rounded px-2 py-1 outline-none"
                    style={{ borderColor: G.border, color: G.text }}
                    value={item.spec}
                    placeholder="เช่น ดีเซล 2.4L 4WD"
                    onChange={e => setItems(p => p.map(i => i.id === item.id ? { ...i, spec: e.target.value } : i))} />
                </td>
                <td className="px-3 py-2 w-32">
                  <input type="number"
                    className="w-full text-xs border rounded px-2 py-1 outline-none text-right"
                    style={{ borderColor: G.border, color: G.text }}
                    value={item.estimatedPrice}
                    onChange={e => setItems(p => p.map(i => i.id === item.id ? { ...i, estimatedPrice: Number(e.target.value) } : i))} />
                </td>
                <td className="px-3 py-2 text-right text-xs font-medium" style={{ color: G.text }}>
                  {(item.count * item.estimatedPrice).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  <button onClick={() => removeItem(item.id)}><Trash2 size={13} color={G.muted} /></button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: `2px solid ${G.border}`, background: G.bg }}>
              <td colSpan={5} className="px-3 py-2.5 text-right text-sm font-semibold" style={{ color: G.sub }}>
                รวมทั้งสิ้น
              </td>
              <td className="px-3 py-2.5 text-right text-sm font-bold" style={{ color: G.text }}>
                {total.toLocaleString()} บาท
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function Step4() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-5">
        <Field label="วงเงินงบประมาณที่ขอ (บาท) *">
          <input type="number" className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: G.border, color: G.text }} defaultValue={18600000} />
        </Field>
        <Field label="งบประมาณที่ได้รับจัดสรร (บาท)">
          <div className="px-3 py-2 rounded-lg text-sm" style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.sub }}>
            20,000,000
          </div>
        </Field>
        <Field label="แหล่งงบประมาณ *">
          <select className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: G.border, color: G.text }}>
            <option>งบลงทุน (เงินอุดหนุน)</option>
            <option>งบดำเนินการ</option>
            <option>เงินรายได้</option>
          </select>
        </Field>
        <Field label="รหัสงบประมาณ">
          <input className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: G.border, color: G.text }} defaultValue="2569-CAP-VEH-001" />
        </Field>
        <Field label="ราคากลางอ้างอิง (บาท)">
          <input type="number" className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: G.border, color: G.text }} defaultValue={17800000} />
        </Field>
        <Field label="แหล่งราคากลาง">
          <select className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: G.border, color: G.text }}>
            <option>กรมบัญชีกลาง</option>
            <option>สืบราคาตลาด</option>
            <option>ราคาซื้อครั้งล่าสุด</option>
          </select>
        </Field>
      </div>
      <div className="p-4 rounded-xl flex items-start gap-3"
        style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
        <Check size={14} color="#15803d" className="mt-0.5 shrink-0" />
        <p className="text-xs" style={{ color: "#14532d" }}>
          วงเงินที่ขอ (18,600,000 บาท) อยู่ภายในกรอบงบประมาณที่ได้รับจัดสรร (20,000,000 บาท) — ผ่านการตรวจสอบเบื้องต้น
        </p>
      </div>
    </div>
  );
}

function Step5() {
  const docs = [
    { id: "d1", label: "บันทึกข้อความขออนุมัติ *", uploaded: true, filename: "memo_approval_2569.pdf" },
    { id: "d2", label: "รายงานผลการตรวจสอบจาก VMS *", uploaded: true, filename: "vms_report_2569.xlsx" },
    { id: "d3", label: "ราคากลางอ้างอิง *", uploaded: false, filename: "" },
    { id: "d4", label: "หลักฐานเหตุผลความจำเป็น", uploaded: true, filename: "justification_2569.pdf" },
    { id: "d5", label: "เอกสารอื่น ๆ (ถ้ามี)", uploaded: false, filename: "" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: G.sub }}>แนบเอกสารประกอบการพิจารณา</p>
      {docs.map(doc => (
        <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl"
          style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <FileText size={18} color={doc.uploaded ? G.primary : G.muted} />
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: G.text }}>{doc.label}</p>
            {doc.uploaded
              ? <p className="text-xs mt-0.5" style={{ color: G.muted }}>{doc.filename}</p>
              : <p className="text-xs mt-0.5" style={{ color: G.muted }}>ยังไม่ได้แนบเอกสาร</p>
            }
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
            style={{
              background: doc.uploaded ? G.bg : G.primary,
              color: doc.uploaded ? G.sub : "#fff",
              border: `1px solid ${G.border}`,
            }}>
            <Upload size={12} />
            {doc.uploaded ? "เปลี่ยนไฟล์" : "อัปโหลด"}
          </button>
          {doc.uploaded && <Check size={16} color="#15803d" />}
        </div>
      ))}
    </div>
  );
}

function Step6({ requestType }: { requestType: RequestType }) {
  const typeLabel = requestType === "replacement" ? "จัดซื้อทดแทนรถเดิม (Scenario 1.1)"
    : requestType === "quota" ? "จัดซื้อเพิ่มเติมตามโควต้าพื้นฐาน (Scenario 1.2)"
    : "จัดซื้อเพิ่มเติมกรณีพิเศษ (Scenario 1.3)";

  const sections = [
    { title: "ข้อมูลคำขอ", rows: [["ชื่อแผน", "แผนจัดหารถยนต์ทดแทน ปีงบประมาณ 2569"], ["ประเภทคำขอ", typeLabel], ["ปีงบประมาณ", "2569"], ["หน่วยงานผู้ขอ", "กองบริหารยานพาหนะ"], ["วิธีการจัดซื้อ", "E-Bidding"]] },
    { title: "รายการรถ", rows: [["รถปิกอัพ 4 ประตู", "5 คัน × 900,000 = 4,500,000 บาท"], ["รถตู้", "2 คัน × 1,200,000 = 2,400,000 บาท"], ["รวมทั้งสิ้น", "6,900,000 บาท"]] },
    { title: "งบประมาณ", rows: [["วงเงินที่ขอ", "18,600,000 บาท"], ["งบประมาณที่จัดสรร", "20,000,000 บาท"], ["ราคากลางอ้างอิง", "17,800,000 บาท (กรมบัญชีกลาง)"]] },
    { title: "เอกสารแนบ", rows: [["บันทึกข้อความขออนุมัติ", "✓ แนบแล้ว"], ["รายงาน VMS", "✓ แนบแล้ว"], ["ราคากลางอ้างอิง", "⚠ ยังไม่ได้แนบ"], ["หลักฐานเหตุผล", "✓ แนบแล้ว"]] },
  ];

  return (
    <div className="flex flex-col gap-5">
      <InfoBanner text="ตรวจสอบข้อมูลทั้งหมดก่อนส่ง — กดปุ่ม 'ถัดไป' เพื่อไปยังหน้าส่งอนุมัติ" />
      {sections.map(sec => (
        <div key={sec.title} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${G.border}` }}>
          <div className="px-4 py-2.5" style={{ background: G.bg, borderBottom: `1px solid ${G.border}` }}>
            <p className="text-xs font-semibold" style={{ color: G.sub }}>{sec.title}</p>
          </div>
          <div className="divide-y" style={{ borderColor: G.border }}>
            {sec.rows.map(([k, v]) => (
              <div key={k} className="flex px-4 py-2.5 gap-4">
                <span className="text-xs w-40 shrink-0" style={{ color: G.muted }}>{k}</span>
                <span className="text-xs" style={{ color: G.text }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: G.sub }}>{label}</label>
      {hint && <p className="text-[11px]" style={{ color: G.muted }}>{hint}</p>}
      {children}
    </div>
  );
}

function InfoBanner({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
      style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
      <Info size={13} color="#3b82f6" className="mt-0.5 shrink-0" />
      <p className="text-xs" style={{ color: "#1d4ed8" }}>{text}</p>
    </div>
  );
}

export default function PlanForm({
  onNavigate, requestType,
}: { onNavigate: (p: Page) => void; requestType: RequestType }) {
  const [step, setStep] = useState(1);

  function renderStep() {
    switch (step) {
      case 1: return <Step1 requestType={requestType} />;
      case 2: return <Step2 requestType={requestType} />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      case 5: return <Step5 />;
      case 6: return <Step6 requestType={requestType} />;
      default: return null;
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-4xl">
      {/* Step indicator */}
      <div className="flex justify-center">
        <StepIndicator step={step} />
      </div>

      {/* Content */}
      <div className="rounded-2xl p-6" style={{ border: `1px solid ${G.border}` }}>
        <p className="text-xs font-semibold mb-5" style={{ color: G.sub }}>
          ขั้นตอนที่ {step} — {STEPS[step - 1].label}
        </p>
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button onClick={() => step > 1 ? setStep(s => s - 1) : onNavigate("requirement-analysis")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm"
          style={{ border: `1px solid ${G.border}`, color: G.sub, background: G.surface }}>
          <ChevronLeft size={16} /> ย้อนกลับ
        </button>
        <div className="flex-1 flex justify-center gap-1.5">
          {STEPS.map(s => (
            <div key={s.id} className="w-2 h-2 rounded-full"
              style={{ background: s.id === step ? G.primary : s.id < step ? G.sub : G.border }} />
          ))}
        </div>
        {step < 6 ? (
          <button onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: G.primary, color: "#fff" }}>
            ถัดไป <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={() => onNavigate("review-submit")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: G.primary, color: "#fff" }}>
            ไปยังหน้าส่งอนุมัติ <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
