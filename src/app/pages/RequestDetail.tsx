import { Paperclip, MessageSquare } from "lucide-react";
import { C, Badge, Card, Btn, Divider, FieldRow, Alert } from "../components/ui";
import type { Page } from "../components/Sidebar";

const TIMELINE_STEPS = [
  { step: "สร้างคำขอ (Draft)",          date: "10 มิ.ย. 68",  actor: "นายกรมวิทยา สุขสาร",   comment: "สร้างคำขอ VR-2568-0012",             status: "done" },
  { step: "กอง. ตรวจสอบรายการรถ",      date: "11 มิ.ย. 68",  actor: "นางสาวสมศรี พรหมมา",   comment: "ตรวจสอบและยืนยันรายการรถแล้ว",      status: "done" },
  { step: "ตรวจสอบงบประมาณ",           date: "12 มิ.ย. 68",  actor: "นายประดิษฐ์ ทองดี",    comment: "งบบางรายการไม่เพียงพอ แก้ไขแล้ว",   status: "done" },
  { step: "คณะกรรมการพิจารณา",         date: "13 มิ.ย. 68",  actor: "คณะกรรมการบริหาร",     comment: "อนุมัติในหลักการ รออนุมัติผู้ว่าฯ", status: "done" },
  { step: "ผู้ว่าการพิจารณา",           date: "14 มิ.ย. 68",  actor: "รอดำเนินการ",          comment: "",                                   status: "current" },
  { step: "บอร์ด กฟภ. พิจารณา",        date: "—",            actor: "—",                    comment: "",                                   status: "pending" },
  { step: "สภาพัฒน์พิจารณา",           date: "—",            actor: "—",                    comment: "",                                   status: "pending" },
  { step: "กอง. อนุมัติหลักการ",        date: "—",            actor: "—",                    comment: "",                                   status: "pending" },
  { step: "สร้าง PR",                   date: "—",            actor: "—",                    comment: "",                                   status: "pending" },
  { step: "ดำเนินการ E-Bid",            date: "—",            actor: "—",                    comment: "",                                   status: "pending" },
];

const COMMENTS = [
  { author: "นางสาวสมศรี พรหมมา", role: "กองยานพาหนะ", date: "11 มิ.ย. 68 10:30", text: "ตรวจสอบสภาพรถแล้ว ยืนยันเข้าเกณฑ์ทดแทนทั้ง 2 คัน" },
  { author: "นายประดิษฐ์ ทองดี",  role: "กองงบประมาณ",  date: "12 มิ.ย. 68 14:15", text: "งบรถตู้เกินกำหนด แก้ไขราคาประมาณการแล้ว ส่งกลับเพื่อปรับแก้" },
  { author: "นายกรมวิทยา สุขสาร", role: "ผู้ยื่นคำขอ",   date: "12 มิ.ย. 68 16:00", text: "แก้ไขราคาประมาณการรถตู้เป็น 1,200,000 บาทแล้ว ส่งกลับให้ตรวจสอบ" },
];

export default function RequestDetail({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="p-8 flex gap-6 max-w-[1280px] mx-auto w-full">

      {/* ── Left main content (70%) ── */}
      <div className="flex flex-col gap-5" style={{ flex: "1 1 0" }}>

        {/* Header card */}
        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold" style={{ color: C.t1 }}>คำขอ VR-2568-0012</h2>
                <Badge label="รออนุมัติ (ผู้ว่าการ)" variant="pending" />
              </div>
              <p className="text-sm" style={{ color: C.t3 }}>
                ยื่นโดย นายกรมวิทยา สุขสาร • กองยานพาหนะ กฟภ.ส่วนกลาง • 10 มิ.ย. 2568
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Btn label="พิมพ์" variant="secondary" size="sm" />
              <Btn label="ส่งออก PDF" variant="secondary" size="sm" />
            </div>
          </div>
          <Divider />
          <div className="grid grid-cols-4 gap-4 mt-1">
            <FieldRow label="เลขที่คำขอ"       value="VR-2568-0012" />
            <FieldRow label="ปีงบประมาณ"       value="2569" />
            <FieldRow label="ประเภทงบ"          value="งบลงทุน" />
            <FieldRow label="หน่วยงาน"          value="กองยานพาหนะ กฟภ." />
            <FieldRow label="วันที่ยื่น"        value="10 มิ.ย. 2568" />
            <FieldRow label="จำนวนรถที่ขอ"      value="2 คัน" />
            <FieldRow label="งบประมาณรวม"       value="2,100,000 บาท" />
            <FieldRow label="ขั้นตอนปัจจุบัน"  value="ผู้ว่าการพิจารณา" />
          </div>
        </Card>

        {/* Current vehicle list */}
        <Card className="p-5">
          <p className="text-sm font-semibold mb-4" style={{ color: C.t2 }}>รายการรถเดิม (2 คัน)</p>
          <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${C.border}` }}>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ background: C.tableHead, borderBottom: `1px solid ${C.border}` }}>
                  {["เลขทะเบียน", "ประเภทรถ", "อายุ", "ระยะทาง", "สภาพ", "เหตุผล"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 font-semibold" style={{ color: C.t2 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["กข-1234 น.ปท.", "รถกระบะ 4WD",           "12 ปี", "298,450 กม.", "เสื่อมสภาพ", "อายุเกิน + ค่าซ่อมสูง"],
                  ["บค-5678 น.ปท.", "รถตู้โดยสาร 12 ที่นั่ง", "11 ปี", "340,210 กม.", "เสื่อมสภาพ", "ระยะทางเกินเกณฑ์"],
                ].map((r, i) => (
                  <tr key={i} style={{ background: i % 2 ? "#f8fafc" : "#fff", borderBottom: `1px solid ${C.border}` }}>
                    {r.map((cell, j) => <td key={j} className="px-3 py-2" style={{ color: C.t2 }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Replacement vehicle */}
        <Card className="p-5">
          <p className="text-sm font-semibold mb-4" style={{ color: C.t2 }}>รายการรถทดแทน</p>
          <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${C.border}` }}>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ background: C.tableHead, borderBottom: `1px solid ${C.border}` }}>
                  {["รายการ", "ประเภทรถ", "จำนวน", "ราคาต่อคัน (บาท)", "รวม (บาท)", "คุณลักษณะ"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 font-semibold" style={{ color: C.t2 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["1", "รถกระบะ 4WD",           "1", "900,000",   "900,000",   "เครื่อง 2000cc, ดีเซล, สีขาว"],
                  ["2", "รถตู้โดยสาร 12 ที่นั่ง", "1", "1,200,000", "1,200,000", "เครื่อง 2700cc, ดีเซล, แอร์"],
                ].map((r, i) => (
                  <tr key={i} style={{ background: i % 2 ? "#f8fafc" : "#fff", borderBottom: `1px solid ${C.border}` }}>
                    {r.map((c, j) => <td key={j} className="px-3 py-2" style={{ color: C.t2 }}>{c}</td>)}
                  </tr>
                ))}
                <tr style={{ background: "#f1f5f9" }}>
                  <td className="px-3 py-2 font-bold" colSpan={4} style={{ color: C.t1 }}>รวมทั้งสิ้น</td>
                  <td className="px-3 py-2 font-bold" style={{ color: C.t1 }}>2,100,000</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Documents */}
        <Card className="p-5">
          <p className="text-sm font-semibold mb-3" style={{ color: C.t2 }}>เอกสารแนบ (4 ไฟล์)</p>
          <div className="flex flex-col gap-2">
            {[
              "บันทึกข้อความขออนุมัติ.pdf",
              "ใบรับรองสภาพรถ_กข-1234.pdf",
              "ใบรับรองสภาพรถ_บค-5678.pdf",
              "ราคากลางประมาณการ.xlsx",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50"
                style={{ border: `1px solid ${C.border}` }}
              >
                <Paperclip size={14} color={C.t4} />
                <span className="text-sm flex-1" style={{ color: C.t2 }}>{f}</span>
                <span className="text-xs" style={{ color: C.t4 }}>ดาวน์โหลด</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Comments */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={16} color={C.t3} />
            <p className="text-sm font-semibold" style={{ color: C.t2 }}>ประวัติความคิดเห็น ({COMMENTS.length})</p>
          </div>
          <div className="flex flex-col gap-4">
            {COMMENTS.map((c, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: "#e2e8f0", color: C.t2 }}
                >
                  {c.author.charAt(1)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold" style={{ color: C.t1 }}>{c.author}</span>
                    <span className="text-xs" style={{ color: C.t4 }}>{c.role}</span>
                    <span className="text-xs ml-auto" style={{ color: C.t4 }}>{c.date}</span>
                  </div>
                  <div
                    className="px-3 py-2 rounded-lg text-sm"
                    style={{ background: "#f8fafc", border: `1px solid ${C.border}`, color: C.t2 }}
                  >
                    {c.text}
                  </div>
                </div>
              </div>
            ))}
            {/* Comment input */}
            <div
              className="h-10 rounded-lg px-3 flex items-center text-sm mt-1"
              style={{ border: `1px solid ${C.borderMd}`, background: "#fff", color: C.t4 }}
            >
              เพิ่มความคิดเห็น...
            </div>
          </div>
        </Card>

        {/* Action bar */}
        <Card className="px-5 py-4">
          <Alert
            type="info"
            title="รอผู้ว่าการพิจารณา"
            message="คำขอนี้อยู่ในขั้นตอนผู้ว่าการพิจารณา กรุณารอการอนุมัติ"
          />
          <div className="flex gap-3 mt-4 justify-end">
            <Btn label="ส่งกลับแก้ไข" variant="danger" />
            <Btn label="ปฏิเสธ" variant="danger" />
            <Btn label="อนุมัติ ✓" variant="primary" onClick={() => onNavigate("procurement-handoff")} />
          </div>
        </Card>
      </div>

      {/* ── Right approval timeline (30%) ── */}
      <div className="flex flex-col gap-5 shrink-0" style={{ width: 300 }}>
        <Card className="p-5">
          <p className="text-sm font-semibold mb-4" style={{ color: C.t2 }}>เส้นทางการอนุมัติ</p>
          <div className="flex flex-col">
            {TIMELINE_STEPS.map((s, i) => (
              <div key={s.step} className="flex gap-3">
                {/* Dot + line */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      background: s.status === "done"    ? "#1e293b"
                        : s.status === "current" ? "#334155"
                        : "#f1f5f9",
                      color:
                        s.status === "done" || s.status === "current" ? "#f1f5f9" : C.t4,
                      border: s.status === "current" ? `2px solid #1e293b` : "none",
                    }}
                  >
                    {s.status === "done" ? "✓" : i + 1}
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div
                      className="w-px flex-1 my-1"
                      style={{ background: s.status === "done" ? "#1e293b" : C.border, minHeight: 24 }}
                    />
                  )}
                </div>
                {/* Content */}
                <div className="pb-4 flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold leading-tight"
                    style={{
                      color: s.status === "pending" ? C.t4 : C.t1,
                    }}
                  >
                    {s.step}
                  </p>
                  {s.status !== "pending" && (
                    <>
                      <p className="text-[10px] mt-0.5" style={{ color: C.t4 }}>{s.actor}</p>
                      {s.date !== "—" && (
                        <p className="text-[10px]" style={{ color: C.t4 }}>{s.date}</p>
                      )}
                      {s.comment && (
                        <p
                          className="text-[10px] mt-1 px-2 py-1 rounded"
                          style={{ background: "#f1f5f9", color: C.t3 }}
                        >
                          {s.comment}
                        </p>
                      )}
                      {s.status === "current" && (
                        <span
                          className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "#e2e8f0", color: "#334155" }}
                        >
                          ● กำลังดำเนินการ
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick info */}
        <Card className="p-5">
          <p className="text-sm font-semibold mb-3" style={{ color: C.t2 }}>สรุปข้อมูลคำขอ</p>
          <div className="flex flex-col gap-2.5">
            {[
              ["สถานะปัจจุบัน",    "รออนุมัติ"],
              ["ขั้นตอนที่",        "5/10"],
              ["รอดำเนินการ",      "1 ขั้นตอน"],
              ["ผ่านมาแล้ว",       "4 วัน"],
              ["งบประมาณรวม",      "2,100,000 บาท"],
              ["จำนวนรถที่ขอ",     "2 คัน"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center">
                <span className="text-xs" style={{ color: C.t4 }}>{k}</span>
                <span className="text-xs font-semibold" style={{ color: C.t1 }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
