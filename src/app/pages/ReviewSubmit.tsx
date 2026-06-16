import { useState } from "react";
import { CheckCircle2, AlertTriangle, ChevronLeft, Send, FileText, User, Building2, Calendar } from "lucide-react";
import type { Page } from "../components/Sidebar";
import type { RequestType } from "../App";

const C = {
  primary: "#334155", border: "#e2e8f0", bg: "#f8fafc", surface: "#ffffff",
  text: "#0f172a", sub: "#475569", muted: "#94a3b8",
};

const TYPE_LABELS: Record<NonNullable<RequestType>, { label: string; badge: string; color: string }> = {
  replacement: { label: "จัดซื้อทดแทนรถเดิม", badge: "Scenario 1.1", color: "#1d4ed8" },
  quota:       { label: "จัดซื้อเพิ่มเติมตามโควต้าพื้นฐาน", badge: "Scenario 1.2", color: "#15803d" },
  special:     { label: "จัดซื้อเพิ่มเติมกรณีพิเศษ", badge: "Scenario 1.3", color: "#6d28d9" },
};

const APPROVAL_PATHS: Record<NonNullable<RequestType>, string[]> = {
  replacement: ["กองบริหารยานพาหนะ", "ผู้ว่าการ กฟภ.", "บอร์ด กฟภ."],
  quota:       ["กองบริหารยานพาหนะ", "คณะกรรมการ", "ผู้ว่าการ กฟภ.", "บอร์ด กฟภ."],
  special:     ["กองบริหารยานพาหนะ", "ผู้ว่าการ กฟภ.", "บอร์ด กฟภ.", "สภาพัฒน์", "ครม."],
};

const CHECKS = [
  { id: "c1", label: "ข้อมูลคำขอครบถ้วน", passed: true },
  { id: "c2", label: "รายการรถระบุครบ (ประเภท จำนวน สเปก)", passed: true },
  { id: "c3", label: "วงเงินไม่เกินงบประมาณที่ได้รับจัดสรร", passed: true },
  { id: "c4", label: "เอกสารบันทึกข้อความแนบแล้ว", passed: true },
  { id: "c5", label: "รายงาน VMS แนบแล้ว", passed: true },
  { id: "c6", label: "ราคากลางอ้างอิงแนบแล้ว", passed: false },
  { id: "c7", label: "ผู้รับผิดชอบระบุชื่อแล้ว", passed: true },
];

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
      <div className="p-2 rounded-lg" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        {icon}
      </div>
      <div>
        <p className="text-[11px]" style={{ color: C.muted }}>{label}</p>
        <p className="text-sm font-semibold" style={{ color: C.text }}>{value}</p>
      </div>
    </div>
  );
}

function ApprovalPath({ path }: { path: string[] }) {
  return (
    <div className="flex items-center gap-0 flex-wrap">
      {path.map((step, i) => (
        <div key={step} className="flex items-center gap-0">
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: i === 0 ? C.primary : C.bg, color: i === 0 ? "#fff" : C.muted, border: `1.5px solid ${i === 0 ? C.primary : C.border}` }}>
              {i + 1}
            </div>
            <span className="text-[10px] text-center max-w-20" style={{ color: i === 0 ? C.primary : C.muted }}>{step}</span>
          </div>
          {i < path.length - 1 && <div className="w-8 h-px mb-4" style={{ background: C.border }} />}
        </div>
      ))}
    </div>
  );
}

export default function ReviewSubmit({
  onNavigate, requestType,
}: { onNavigate: (p: Page) => void; requestType: RequestType }) {
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const typeInfo = requestType ? TYPE_LABELS[requestType] : null;
  const approvalPath = requestType ? APPROVAL_PATHS[requestType] : [];
  const failedChecks = CHECKS.filter(c => !c.passed);
  const canSubmit = failedChecks.length === 0 && agreed;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-16">
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "#f0fdf4", border: "2px solid #86efac" }}>
          <CheckCircle2 size={32} color="#15803d" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xl font-bold" style={{ color: C.text }}>ส่งคำขอสำเร็จ</p>
          <p className="text-sm" style={{ color: C.sub }}>
            คำขอเลขที่ <strong>VR-2569-0025</strong> ถูกส่งเข้าสู่กระบวนการอนุมัติแล้ว
          </p>
          <p className="text-xs mt-1" style={{ color: C.muted }}>
            ระบบจะแจ้งเตือนทาง Email และ Line Notify เมื่อมีการอัปเดตสถานะ
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <button onClick={() => onNavigate("all-requests")}
            className="px-5 py-2.5 rounded-lg text-sm"
            style={{ border: `1px solid ${C.border}`, color: C.sub, background: C.surface }}>
            กลับไปรายการคำขอ
          </button>
          <button onClick={() => onNavigate("approval-timeline")}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: C.primary, color: "#fff" }}>
            ติดตามสถานะการอนุมัติ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-4xl">
      {/* Type badge */}
      {typeInfo && (
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "#f8fafc", border: `1px solid ${C.border}`, color: typeInfo.color }}>
            {typeInfo.badge}
          </span>
          <span className="text-sm" style={{ color: C.sub }}>{typeInfo.label}</span>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <SummaryCard icon={<FileText size={16} color={C.sub} />} label="ชื่อแผน" value="แผนจัดหารถยนต์ทดแทน ปีงบประมาณ 2569" />
        <SummaryCard icon={<Building2 size={16} color={C.sub} />} label="หน่วยงานผู้ขอ" value="กองบริหารยานพาหนะ" />
        <SummaryCard icon={<Calendar size={16} color={C.sub} />} label="ปีงบประมาณ" value="2569" />
        <SummaryCard icon={<User size={16} color={C.sub} />} label="ผู้รับผิดชอบ" value="นายสมชาย ใจดี" />
      </div>

      {/* Budget summary */}
      <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
        <p className="text-xs font-semibold" style={{ color: C.sub }}>สรุปงบประมาณและรายการรถ</p>
        <div className="grid grid-cols-3 gap-4">
          {[["จำนวนรถทั้งหมด", "7 คัน"], ["วงเงินที่ขอ", "18,600,000 บาท"], ["วงเงินที่จัดสรร", "20,000,000 บาท"]].map(([l, v]) => (
            <div key={l}>
              <p className="text-[11px]" style={{ color: C.muted }}>{l}</p>
              <p className="text-base font-bold" style={{ color: C.text }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <div className="px-4 py-3" style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          <p className="text-xs font-semibold" style={{ color: C.sub }}>รายการตรวจสอบก่อนส่ง</p>
        </div>
        <div className="divide-y" style={{ borderColor: C.border }}>
          {CHECKS.map(check => (
            <div key={check.id} className="flex items-center gap-3 px-4 py-2.5">
              {check.passed
                ? <CheckCircle2 size={15} color="#15803d" />
                : <AlertTriangle size={15} color="#d97706" />
              }
              <span className="text-sm flex-1" style={{ color: check.passed ? C.text : "#92400e" }}>{check.label}</span>
              <span className="text-xs" style={{ color: check.passed ? "#15803d" : "#d97706" }}>
                {check.passed ? "ผ่าน" : "ยังไม่ครบ"}
              </span>
            </div>
          ))}
        </div>
        {failedChecks.length > 0 && (
          <div className="px-4 py-3" style={{ background: "#fffbeb", borderTop: `1px solid #fcd34d` }}>
            <p className="text-xs" style={{ color: "#92400e" }}>
              ⚠ มี {failedChecks.length} รายการที่ยังไม่ครบถ้วน — กรุณากลับไปแก้ไขก่อนส่ง
            </p>
          </div>
        )}
      </div>

      {/* Approval path */}
      <div className="rounded-xl p-5" style={{ border: `1px solid ${C.border}` }}>
        <p className="text-xs font-semibold mb-4" style={{ color: C.sub }}>เส้นทางการอนุมัติ</p>
        <ApprovalPath path={approvalPath} />
      </div>

      {/* Agreement checkbox */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-slate-700" />
        <span className="text-xs" style={{ color: C.sub }}>
          ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในคำขอนี้ถูกต้องและครบถ้วน และยินยอมให้ส่งเข้าสู่กระบวนการอนุมัติตามเส้นทางข้างต้น
        </span>
      </label>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate("plan-form")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm"
          style={{ border: `1px solid ${C.border}`, color: C.sub, background: C.surface }}>
          <ChevronLeft size={16} /> แก้ไขแผน
        </button>
        <div className="flex-1" />
        <button
          disabled={!canSubmit}
          onClick={() => setSubmitted(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold"
          style={{
            background: canSubmit ? C.primary : C.bg,
            color: canSubmit ? "#fff" : C.muted,
            border: `1px solid ${canSubmit ? C.primary : C.border}`,
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}>
          <Send size={15} /> ส่งคำขออนุมัติ
        </button>
      </div>
    </div>
  );
}
