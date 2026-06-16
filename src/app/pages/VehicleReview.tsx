import { useState } from "react";
import {
  AlertTriangle, CheckCircle2, XCircle, RotateCcw,
  Car, Gauge, Calendar, Wrench, FileText, ChevronRight, Home,
} from "lucide-react";
import { C, Badge } from "../components/ui";
import type { Page } from "../components/Sidebar";

const V = {
  reg:    "กข-1234 น.ปท.",
  type:   "รถกระบะ 4WD",
  brand:  "Toyota Hilux Revo",
  color:  "ขาว",
  dept:   "กองยานพาหนะ กฟภ.",
  owner:  "สำนักงานใหญ่ กฟภ.",
  year:   "2555 (12 ปี)",
  km:     "298,450",
  cond:   "เสื่อมสภาพ",
  engine: "2,400 cc ดีเซล",
  lastService: "มี.ค. 2567",
  repairCost:  "284,500",
  bookValue:   "320,000",
  reasons: [
    { icon: Calendar,       label: "อายุการใช้งาน",   value: "12 ปี",          threshold: "เกณฑ์ ≥ 10 ปี",       pass: true },
    { icon: Gauge,          label: "ระยะทางสะสม",     value: "298,450 กม.",    threshold: "เกณฑ์ ≥ 250,000 กม.", pass: true },
    { icon: Wrench,         label: "ค่าซ่อมสะสม",     value: "284,500 บาท",   threshold: "> 50% ของมูลค่าตลาด", pass: true },
    { icon: AlertTriangle,  label: "สภาพความปลอดภัย", value: "ต้องซ่อมแซม",   threshold: "สภาพดี / ผ่าน",        pass: false },
  ],
  repairs: [
    { date: "ม.ค. 2567", desc: "เปลี่ยนเกียร์อัตโนมัติ",          cost: "120,000" },
    { date: "มิ.ย. 2566", desc: "เปลี่ยนเครื่องยนต์บางส่วน",       cost: "95,000" },
    { date: "ก.พ. 2566", desc: "ซ่อมระบบเบรก + โช้คอัพทั้งชุด",  cost: "45,500" },
    { date: "ส.ค. 2565", desc: "เปลี่ยนแบตเตอรี่ + ไดชาร์จ",      cost: "24,000" },
  ],
};

type ReviewAction = "approve" | "reject" | "return" | null;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-5 rounded-full" style={{ background: C.primary }} />
      <span className="text-sm font-semibold" style={{ color: C.t1 }}>{children}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
      <span className="text-xs w-36 shrink-0" style={{ color: C.t3 }}>{label}</span>
      <span className="text-xs font-medium" style={{ color: C.t1 }}>{value}</span>
    </div>
  );
}

export default function VehicleReview({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [action, setAction] = useState<ReviewAction>(null);
  const [note, setNote]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!action) return;
    setSubmitted(true);
  }

  if (submitted) {
    const isApproved = action === "approve";
    const isRejected = action === "reject";
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 px-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: isApproved ? "#f0fdf4" : isRejected ? "#fef2f2" : "#f1f5f9" }}>
          {isApproved && <CheckCircle2 size={32} color="#16a34a" />}
          {isRejected && <XCircle size={32} color="#dc2626" />}
          {action === "return" && <RotateCcw size={32} color="#64748b" />}
        </div>
        <div className="text-center">
          <p className="text-base font-semibold mb-1" style={{ color: C.t1 }}>
            {isApproved ? "ผ่านการทบทวนแล้ว" : isRejected ? "ปฏิเสธรายการแล้ว" : "ส่งกลับแก้ไขแล้ว"}
          </p>
          <p className="text-sm" style={{ color: C.t3 }}>
            {isApproved
              ? "รถทะเบียน " + V.reg + " พร้อมเข้าสู่ขั้นตอนสร้างแผนทดแทน"
              : isRejected
              ? "รายการถูกปฏิเสธและแจ้งผลไปยังหน่วยงานแล้ว"
              : "ส่งกลับให้หน่วยงานแก้ไขข้อมูลเพิ่มเติม"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ border: `1px solid ${C.border}`, color: C.t2 }}
            onClick={() => onNavigate("vehicle-list")}
          >
            กลับรายการรถ
          </button>
          {isApproved && (
            <button
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: C.primary }}
              onClick={() => onNavigate("create-plan")}
            >
              สร้างแผนทดแทน →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0" style={{ background: "#f8fafc", minHeight: "100%" }}>
      {/* Breadcrumb + header */}
      <div className="px-8 pt-6 pb-5" style={{ background: "#fff", borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-1 mb-3">
          <Home size={13} color={C.t3} />
          <ChevronRight size={13} color={C.border} />
          <button className="text-xs px-1" style={{ color: C.t3 }} onClick={() => onNavigate("vehicle-list")}>
            รายการรถที่เข้าเกณฑ์ทดแทน
          </button>
          <ChevronRight size={13} color={C.border} />
          <span className="text-xs px-1" style={{ color: C.t4 }}>ทบทวนรายละเอียดรถ</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold" style={{ color: C.t1 }}>{V.reg}</h1>
              <Badge label="รอสร้างแผน" variant="review" />
            </div>
            <p className="text-sm" style={{ color: C.t3 }}>{V.type} · {V.dept}</p>
          </div>
          {/* Phase indicator */}
          <div className="flex items-center gap-2 text-xs shrink-0"
            style={{ background: "#f1f5f9", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px" }}>
            <span style={{ color: C.t3 }}>Phase 1</span>
            <ChevronRight size={12} color={C.t4} />
            <span className="font-semibold" style={{ color: C.t1 }}>Step 3 · กอง. ทบทวน</span>
          </div>
        </div>
      </div>

      <div className="flex gap-5 p-6 max-w-6xl mx-auto w-full">

        {/* ── LEFT column ── */}
        <div className="flex flex-col gap-5 flex-1 min-w-0">

          {/* Vehicle info */}
          <div className="rounded-xl p-5 bg-white" style={{ border: `1px solid ${C.border}` }}>
            <SectionTitle>ข้อมูลรถยนต์</SectionTitle>
            <div className="grid grid-cols-2 gap-x-8">
              <div>
                <InfoRow label="ทะเบียนรถ"         value={V.reg} />
                <InfoRow label="ประเภทรถ"           value={V.type} />
                <InfoRow label="ยี่ห้อ / รุ่น"      value={V.brand} />
                <InfoRow label="สี"                  value={V.color} />
                <InfoRow label="เครื่องยนต์"         value={V.engine} />
              </div>
              <div>
                <InfoRow label="หน่วยงานเจ้าของ"    value={V.dept} />
                <InfoRow label="สังกัด"             value={V.owner} />
                <InfoRow label="ปีที่จดทะเบียน"     value={V.year} />
                <InfoRow label="ระยะทางสะสม"       value={V.km + " กม."} />
                <InfoRow label="ซ่อมบำรุงล่าสุด"   value={V.lastService} />
              </div>
            </div>
          </div>

          {/* Replacement criteria */}
          <div className="rounded-xl p-5 bg-white" style={{ border: `1px solid ${C.border}` }}>
            <SectionTitle>เกณฑ์การทดแทนที่ผ่าน</SectionTitle>
            <div className="flex flex-col gap-3">
              {V.reasons.map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: r.pass ? "#f0fdf4" : "#fef2f2", border: `1px solid ${r.pass ? "#86efac" : "#fca5a5"}` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: r.pass ? "#dcfce7" : "#fee2e2" }}>
                      <Icon size={16} color={r.pass ? "#16a34a" : "#dc2626"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: C.t1 }}>{r.label}</p>
                      <p className="text-xs" style={{ color: C.t3 }}>{r.threshold}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold" style={{ color: r.pass ? "#16a34a" : "#dc2626" }}>{r.value}</p>
                      <p className="text-xs" style={{ color: C.t4 }}>{r.pass ? "✓ ผ่านเกณฑ์" : "✗ ไม่ผ่านเกณฑ์"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Repair history */}
          <div className="rounded-xl p-5 bg-white" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>ประวัติการซ่อมบำรุง (4 รายการล่าสุด)</SectionTitle>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fca5a5" }}>
                รวม {V.repairCost} บาท
              </span>
            </div>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["วันที่", "รายการซ่อม", "ค่าใช้จ่าย (บาท)"].map(h => (
                    <th key={h} className="text-left py-2 font-semibold" style={{ color: C.t2 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {V.repairs.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td className="py-2.5 pr-4 whitespace-nowrap" style={{ color: C.t3 }}>{r.date}</td>
                    <td className="py-2.5 pr-4" style={{ color: C.t1 }}>{r.desc}</td>
                    <td className="py-2.5 text-right font-medium" style={{ color: C.t1 }}>{r.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── RIGHT column — review panel ── */}
        <div className="w-80 shrink-0 flex flex-col gap-4">

          {/* Summary card */}
          <div className="rounded-xl p-4 bg-white" style={{ border: `1px solid ${C.border}` }}>
            <p className="text-xs font-semibold mb-3" style={{ color: C.t2 }}>สรุปผลการตรวจสอบเบื้องต้น</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "อายุรถ",        value: V.year,              ok: true },
                { label: "ระยะทาง",       value: V.km + " กม.",       ok: true },
                { label: "ค่าซ่อมสะสม",  value: V.repairCost + " ฿", ok: true },
                { label: "มูลค่าตลาด",   value: V.bookValue + " ฿",  ok: null },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-1.5"
                  style={{ borderBottom: `1px solid ${C.border}` }}>
                  <span className="text-xs" style={{ color: C.t3 }}>{r.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium" style={{ color: C.t1 }}>{r.value}</span>
                    {r.ok === true  && <CheckCircle2  size={13} color="#16a34a" />}
                    {r.ok === false && <XCircle       size={13} color="#dc2626" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 p-2 rounded-lg"
              style={{ background: "#fef9c3", border: "1px solid #fde68a" }}>
              <AlertTriangle size={14} color="#b45309" />
              <p className="text-xs" style={{ color: "#92400e" }}>ผ่านเกณฑ์ 3 จาก 4 ข้อ — แนะนำให้อนุมัติ</p>
            </div>
          </div>

          {/* Review action card */}
          <div className="rounded-xl p-4 bg-white" style={{ border: `1px solid ${C.border}` }}>
            <p className="text-xs font-semibold mb-3" style={{ color: C.t2 }}>ผลการทบทวน</p>

            <div className="flex flex-col gap-2 mb-4">
              {([
                { key: "approve", label: "✓ อนุมัติ — ผ่านการทบทวน",   color: "#16a34a", bg: "#f0fdf4", border: "#86efac" },
                { key: "reject",  label: "✗ ปฏิเสธ — ไม่จำเป็นต้องทดแทน", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
                { key: "return",  label: "↩ ส่งกลับ — ขอข้อมูลเพิ่มเติม", color: "#64748b", bg: "#f1f5f9", border: "#cbd5e1" },
              ] as const).map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setAction(opt.key)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-all w-full"
                  style={{
                    background: action === opt.key ? opt.bg : "#fafafa",
                    border: `1.5px solid ${action === opt.key ? opt.border : C.border}`,
                    color: action === opt.key ? opt.color : C.t3,
                  }}
                >
                  <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: action === opt.key ? opt.color : C.borderMd }}>
                    {action === opt.key && (
                      <span className="w-2 h-2 rounded-full" style={{ background: opt.color }} />
                    )}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-medium" style={{ color: C.t2 }}>
                หมายเหตุ / เหตุผลประกอบ
              </label>
              <textarea
                className="w-full rounded-lg px-3 py-2 text-xs outline-none resize-none"
                style={{ height: 88, border: `1.5px solid ${C.border}`, color: C.t1 }}
                placeholder="ระบุเหตุผลหรือข้อสังเกตเพิ่มเติม..."
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            <button
              disabled={!action}
              onClick={handleSubmit}
              className="w-full h-10 rounded-lg text-sm font-semibold transition-opacity"
              style={{
                background: action ? C.primary : C.border,
                color: action ? "#fff" : C.t4,
                cursor: action ? "pointer" : "not-allowed",
              }}
            >
              {action === "approve" ? "ยืนยันการอนุมัติ" : action === "reject" ? "ยืนยันการปฏิเสธ" : action === "return" ? "ส่งกลับแก้ไข" : "เลือกผลการทบทวน"}
            </button>
          </div>

          {/* Attachment stub */}
          <div className="rounded-xl p-4 bg-white" style={{ border: `1px solid ${C.border}` }}>
            <p className="text-xs font-semibold mb-3" style={{ color: C.t2 }}>เอกสารประกอบ</p>
            {[
              "ประวัติการซ่อมบำรุง (VMS Export).pdf",
              "ใบประเมินสภาพรถ.pdf",
              "รายงานค่าใช้จ่ายซ่อม 3 ปี.xlsx",
            ].map(f => (
              <div key={f} className="flex items-center gap-2 py-2" style={{ borderBottom: `1px solid ${C.border}` }}>
                <FileText size={13} color={C.t3} />
                <span className="text-xs flex-1 truncate" style={{ color: C.t2 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
