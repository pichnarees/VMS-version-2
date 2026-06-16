import { CheckCircle, Circle, XCircle, RotateCcw, Clock } from "lucide-react";
import { C, Badge, Card, PageWrap, Btn, Divider, SectionHead } from "../components/ui";
import type { Page } from "../components/Sidebar";

type StepStatus = "done" | "current" | "pending" | "rejected" | "returned";

const STEPS: { step: number; title: string; actor: string; date: string; comment: string; status: StepStatus }[] = [
  { step: 1,  title: "สร้างคำขอ (Draft)",          actor: "กองยานพาหนะ กฟภ.ส่วนกลาง",  date: "01 มิ.ย. 68",  comment: "สร้างแผนทดแทนรถ 3 คัน ตามเกณฑ์อายุและระยะทาง",                             status: "done"    },
  { step: 2,  title: "ตรวจสอบรายการรถ",            actor: "กอง. แผนงานและงบประมาณ",     date: "03 มิ.ย. 68",  comment: "ตรวจสอบรายการรถครบถ้วน เอกสารถูกต้อง",                                     status: "done"    },
  { step: 3,  title: "ตรวจสอบงบประมาณ",            actor: "กอง. การเงินและบัญชี",        date: "05 มิ.ย. 68",  comment: "งบประมาณเพียงพอ มีงบคงเหลือ 90.1 ล้านบาท",                                  status: "done"    },
  { step: 4,  title: "คณะกรรมการพิจารณา",          actor: "คณะกรรมการพัสดุ",            date: "08 มิ.ย. 68",  comment: "คณะกรรมการมีมติเห็นชอบ ราคาประมาณการสมเหตุสมผล",                            status: "done"    },
  { step: 5,  title: "ผู้ว่าการพิจารณา",            actor: "ผู้ว่าการ กฟภ.",             date: "10 มิ.ย. 68",  comment: "อนุมัติในหลักการ รอการพิจารณาจากบอร์ด",                                     status: "done"    },
  { step: 6,  title: "บอร์ด กฟภ. พิจารณา",         actor: "คณะกรรมการ กฟภ.",            date: "14 มิ.ย. 68",  comment: "กำลังอยู่ระหว่างการพิจารณาในการประชุมบอร์ด ครั้งที่ 6/2568",                   status: "current" },
  { step: 7,  title: "สภาพัฒน์พิจารณา",            actor: "สำนักงานสภาพัฒนาการเศรษฐกิจฯ", date: "—",         comment: "",                                                                           status: "pending" },
  { step: 8,  title: "อนุมัติหลักการ",              actor: "กระทรวงการคลัง",             date: "—",            comment: "",                                                                           status: "pending" },
  { step: 9,  title: "จัดทำเอกสาร PR",             actor: "กอง. พัสดุ",                 date: "—",            comment: "",                                                                           status: "pending" },
  { step: 10, title: "E-Bid / จัดซื้อ",             actor: "คณะกรรมการพิจารณาผล",       date: "—",            comment: "",                                                                           status: "pending" },
];

const REQUEST_INFO = [
  { label: "เลขที่คำขอ",       value: "VR-2568-0012" },
  { label: "หน่วยงาน",         value: "กองยานพาหนะ กฟภ.ส่วนกลาง" },
  { label: "จำนวนรถทดแทน",   value: "3 คัน" },
  { label: "งบประมาณรวม",     value: "4,200,000 บาท" },
  { label: "วันที่ยื่นขอ",     value: "01 มิ.ย. 2568" },
  { label: "ผู้ยื่นขอ",        value: "นายสมชาย ใจดี" },
  { label: "ขั้นตอนปัจจุบัน",  value: "บอร์ด กฟภ. พิจารณา" },
  { label: "คาดการณ์แล้วเสร็จ", value: "ก.ย. 2568" },
];

function StatusIcon({ s }: { s: StepStatus }) {
  if (s === "done")     return <CheckCircle size={20} style={{ color: "#166534" }} />;
  if (s === "current")  return <Circle size={20} style={{ color: "#1d4ed8", fill: "#dbeafe" }} />;
  if (s === "rejected") return <XCircle size={20} style={{ color: "#991b1b" }} />;
  if (s === "returned") return <RotateCcw size={20} style={{ color: "#92400e" }} />;
  return <Clock size={20} style={{ color: C.t4 }} />;
}

const statusStyle: Record<StepStatus, { bg: string; border: string; text: string }> = {
  done:     { bg: "#f0fdf4", border: "#86efac", text: "#166534" },
  current:  { bg: "#eff6ff", border: "#93c5fd", text: "#1d4ed8" },
  pending:  { bg: C.bg,      border: C.border,  text: C.t4 },
  rejected: { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b" },
  returned: { bg: "#fffbeb", border: "#fcd34d", text: "#92400e" },
};

export default function ApprovalTimeline({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <PageWrap>
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 300px" }}>

        {/* Timeline */}
        <Card className="p-6">
          <SectionHead title="ขั้นตอนการอนุมัติ — VR-2568-0012" />
          <p className="text-xs mb-6" style={{ color: C.t3 }}>ติดตามสถานะคำขอในแต่ละขั้นตอนตั้งแต่ต้นจนสิ้นสุดกระบวนการ</p>

          <div className="relative">
            {/* Vertical connector line */}
            <div
              className="absolute left-[23px] top-5 bottom-5 w-px"
              style={{ background: C.border }}
            />

            <div className="flex flex-col gap-0">
              {STEPS.map((s, idx) => {
                const st = statusStyle[s.status];
                const isLast = idx === STEPS.length - 1;
                return (
                  <div key={s.step} className={`relative flex gap-4 ${isLast ? "" : "pb-6"}`}>
                    {/* Icon */}
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: st.bg, border: `2px solid ${st.border}` }}>
                      <StatusIcon s={s.status} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold" style={{ color: s.status === "pending" ? C.t4 : C.t1 }}>
                          {s.step}. {s.title}
                        </span>
                        {s.status === "current" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                            ขั้นตอนปัจจุบัน
                          </span>
                        )}
                        {s.date !== "—" && (
                          <span className="text-[10px] ml-auto" style={{ color: C.t4 }}>{s.date}</span>
                        )}
                      </div>
                      <div className="text-xs mb-1.5" style={{ color: C.t3 }}>ผู้รับผิดชอบ: {s.actor}</div>
                      {s.comment && (
                        <div
                          className="text-xs rounded-lg px-3 py-2"
                          style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}
                        >
                          {s.comment}
                        </div>
                      )}
                      {s.status === "pending" && (
                        <div className="text-xs" style={{ color: C.t4 }}>รอดำเนินการ</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Sidebar info */}
        <div className="flex flex-col gap-4">
          {/* Request info */}
          <Card className="p-5">
            <SectionHead title="ข้อมูลคำขอ" />
            <div className="flex flex-col gap-3 mt-3">
              {REQUEST_INFO.map((r) => (
                <div key={r.label}>
                  <div className="text-[10px] mb-0.5" style={{ color: C.t4 }}>{r.label}</div>
                  <div className="text-xs font-semibold" style={{ color: C.t1 }}>{r.value}</div>
                </div>
              ))}
            </div>
            <Divider />
            <Btn label="ดูรายละเอียดเต็ม →" variant="secondary" onClick={() => onNavigate("request-detail")} />
          </Card>

          {/* Progress summary */}
          <Card className="p-5">
            <SectionHead title="ความคืบหน้า" />
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex justify-between text-xs" style={{ color: C.t3 }}>
                <span>เสร็จสิ้น</span>
                <span className="font-semibold" style={{ color: C.t1 }}>5 / 10 ขั้นตอน</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: C.border }}>
                <div className="h-full rounded-full" style={{ width: "50%", background: "#166534" }} />
              </div>
              <span className="text-[10px]" style={{ color: C.t4 }}>50% ของกระบวนการทั้งหมด</span>

              <Divider />

              {[
                { label: "เสร็จสิ้น",         count: 5, color: "#166534", bg: "#f0fdf4", border: "#86efac" },
                { label: "กำลังดำเนินการ",   count: 1, color: "#1d4ed8", bg: "#eff6ff", border: "#93c5fd" },
                { label: "รอดำเนินการ",       count: 4, color: C.t4,      bg: C.bg,      border: C.border },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: r.bg, border: `1.5px solid ${r.border}` }} />
                    <span className="text-xs" style={{ color: C.t3 }}>{r.label}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: r.color }}>{r.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Action */}
          <Card className="p-5">
            <SectionHead title="การดำเนินการ" />
            <div className="flex flex-col gap-2 mt-3">
              <Btn label="อนุมัติคำขอ" variant="primary" />
              <Btn label="ส่งกลับแก้ไข" variant="secondary" />
              <Btn label="ปฏิเสธคำขอ" variant="danger" />
            </div>
          </Card>
        </div>
      </div>
    </PageWrap>
  );
}
