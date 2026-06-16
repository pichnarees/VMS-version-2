import { useState } from "react";
import { RefreshCw, TrendingUp, Star, ChevronRight, CheckCircle2, Info } from "lucide-react";
import type { Page } from "../components/Sidebar";
import type { RequestType } from "../App";

const C = {
  primary: "#334155", border: "#e2e8f0", bg: "#f8fafc", surface: "#ffffff",
  text: "#0f172a", sub: "#475569", muted: "#94a3b8",
};

interface TypeOption {
  type: RequestType;
  icon: React.ReactNode;
  label: string;
  badge: string;
  description: string;
  details: string[];
  who: string;
  approvalPath: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}

const OPTIONS: TypeOption[] = [
  {
    type: "replacement",
    icon: <RefreshCw size={28} />,
    label: "จัดซื้อทดแทนรถเดิม",
    badge: "Scenario 1.1",
    description: "จัดหารถยนต์ใหม่เพื่อทดแทนรถเดิมที่เสื่อมสภาพ อายุมาก หรือไม่คุ้มค่าการซ่อมแซม",
    details: [
      "รถอายุ ≥ 10 ปี หรือระยะทาง ≥ 250,000 กม.",
      "ค่าซ่อมสะสม ≥ 50% ของมูลค่ารถ",
      "ระบบ VMS ตรวจสอบและแนะนำอัตโนมัติ",
      "ต้องผ่านการทบทวนจากกอง. ก่อนจัดทำแผน",
    ],
    who: "กอง. / กฟภ. เขต",
    approvalPath: "กอง. → ผู้ว่าการ → บอร์ด กฟภ.",
    accentBg: "#eff6ff", accentBorder: "#bfdbfe", accentText: "#1d4ed8",
  },
  {
    type: "quota",
    icon: <TrendingUp size={28} />,
    label: "จัดซื้อเพิ่มเติมตามโควต้าพื้นฐาน",
    badge: "Scenario 1.2",
    description: "จัดหารถเพิ่มเติมตามโควต้าที่กำหนดตามเกณฑ์มาตรฐาน กรณีมีรถไม่เพียงพอต่อภาระงาน",
    details: [
      "เปรียบเทียบโควต้าตามเกณฑ์ vs. รถที่มีอยู่จริง",
      "Gap Analysis แยกตามหน่วยงานและพื้นที่",
      "รวบรวมความต้องการจากหน่วยงานต่าง ๆ",
      "ต้องผ่านการอนุมัติจากคณะกรรมการ",
    ],
    who: "กอง. / หน่วยงานผู้ขอ",
    approvalPath: "กอง. → คณะกรรมการ → ผู้ว่าการ → บอร์ด กฟภ.",
    accentBg: "#f0fdf4", accentBorder: "#86efac", accentText: "#15803d",
  },
  {
    type: "special",
    icon: <Star size={28} />,
    label: "จัดซื้อเพิ่มเติมกรณีพิเศษ",
    badge: "Scenario 1.3",
    description: "จัดหารถนอกเหนือโควต้าพื้นฐาน สำหรับภารกิจใหม่ งานโครงการ พื้นที่พิเศษ หรือเงื่อนไขสัญญา",
    details: [
      "ภารกิจใหม่ที่ยังไม่มีรถรองรับ",
      "งานโครงการเฉพาะหรือพื้นที่ปฏิบัติงานพิเศษ",
      "ต้องมีหลักฐานและเหตุผลสนับสนุนชัดเจน",
      "เส้นทางอนุมัติยาวกว่า — ผ่าน สภาพัฒน์ / ครม.",
    ],
    who: "กอง. / หน่วยงานเจ้าของภารกิจ",
    approvalPath: "กอง. → ผู้ว่าการ → บอร์ด → สภาพัฒน์ → ครม.",
    accentBg: "#faf5ff", accentBorder: "#c4b5fd", accentText: "#6d28d9",
  },
];

export default function CreateRequest({
  onNavigate, onSetType,
}: { onNavigate: (p: Page) => void; onSetType: (t: RequestType) => void }) {
  const [selected, setSelected] = useState<RequestType>(null);

  function handleStart() {
    if (!selected) return;
    onSetType(selected);
    onNavigate("source-data");
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-5xl">

      {/* Intro */}
      <div className="flex flex-col gap-2">
        <p className="text-sm" style={{ color: C.sub }}>
          เลือกประเภทคำขอที่ตรงกับสถานการณ์ของหน่วยงาน ระบบจะปรับขั้นตอน ฟอร์ม และเส้นทางอนุมัติให้เหมาะสม
        </p>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg self-start"
          style={{ background: "#fffbeb", border: "1px solid #fcd34d" }}>
          <Info size={13} color="#b45309" />
          <span className="text-xs" style={{ color: "#92400e" }}>
            ทุก 3 ประเภทใช้หน้าจอร่วมกัน — ต่างกันที่ข้อมูลที่ต้องกรอก เกณฑ์การพิจารณา และผู้อนุมัติ
          </span>
        </div>
      </div>

      {/* Type cards */}
      <div className="grid grid-cols-3 gap-5">
        {OPTIONS.map(opt => {
          const isSelected = selected === opt.type;
          return (
            <button key={opt.type} onClick={() => setSelected(opt.type)}
              className="flex flex-col gap-4 p-5 rounded-2xl text-left transition-all"
              style={{
                background: isSelected ? opt.accentBg : C.surface,
                border: `2px solid ${isSelected ? opt.accentBorder : C.border}`,
                boxShadow: isSelected ? `0 0 0 3px ${opt.accentBorder}55` : "none",
              }}>

              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl" style={{ background: opt.accentBg, color: opt.accentText }}>
                  {opt.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: opt.accentBg, color: opt.accentText, border: `1px solid ${opt.accentBorder}` }}>
                    {opt.badge}
                  </span>
                  {isSelected && <CheckCircle2 size={16} color={opt.accentText} />}
                </div>
              </div>

              {/* Title + desc */}
              <div className="flex flex-col gap-1.5">
                <p className="text-base font-bold" style={{ color: C.text }}>{opt.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: C.sub }}>{opt.description}</p>
              </div>

              {/* Details list */}
              <ul className="flex flex-col gap-1.5">
                {opt.details.map(d => (
                  <li key={d} className="flex items-start gap-2 text-xs" style={{ color: C.sub }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: opt.accentText }} />
                    {d}
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="w-full h-px" style={{ background: C.border }} />

              {/* Meta */}
              <div className="flex flex-col gap-1 text-[11px]" style={{ color: C.muted }}>
                <span><strong style={{ color: C.sub }}>ผู้ดำเนินการ:</strong> {opt.who}</span>
                <span><strong style={{ color: C.sub }}>เส้นทางอนุมัติ:</strong> {opt.approvalPath}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action */}
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate("all-requests")}
          className="px-5 py-2.5 rounded-lg text-sm"
          style={{ border: `1px solid ${C.border}`, color: C.sub, background: C.surface }}>
          ยกเลิก
        </button>
        <div className="flex-1" />
        {selected && (
          <div className="flex items-center gap-2 text-sm" style={{ color: C.sub }}>
            เลือก: <strong style={{ color: C.text }}>{OPTIONS.find(o => o.type === selected)?.label}</strong>
          </div>
        )}
        <button disabled={!selected} onClick={handleStart}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: selected ? C.primary : C.bg,
            color: selected ? "#fff" : C.muted,
            border: `1px solid ${selected ? C.primary : C.border}`,
            cursor: selected ? "pointer" : "not-allowed",
          }}>
          เริ่มสร้างคำขอ <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
