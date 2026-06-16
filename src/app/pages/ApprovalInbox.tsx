import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw, X } from "lucide-react";
import {
  C, Badge, Card, PageWrap, FilterBar, FilterSelect,
  SearchInput, Btn, Table, TR, TD, SectionHead, Divider,
} from "../components/ui";
import type { Page } from "../components/Sidebar";

const TABS = [
  { id: "division", label: "กอง. ตรวจสอบ",    count: 5 },
  { id: "governor", label: "ผู้ว่าการพิจารณา",  count: 3 },
  { id: "board",    label: "บอร์ด กฟภ.",        count: 2 },
  { id: "nesdb",    label: "สภาพัฒน์",           count: 1 },
];

const REQUESTS = [
  { id: "VR-2568-0012", dept: "กองยานพาหนะ กฟภ.ส่วนกลาง", count: 3, budget: "4,200,000", step: "กอง. ตรวจสอบ",   date: "14 มิ.ย. 68", status: "pending"  as const, statusLabel: "รออนุมัติ",  tab: "division" },
  { id: "VR-2568-0011", dept: "กฟภ. เขต 1 (ภาคเหนือ)",     count: 5, budget: "7,500,000", step: "กอง. ตรวจสอบ",   date: "12 มิ.ย. 68", status: "pending"  as const, statusLabel: "รออนุมัติ",  tab: "division" },
  { id: "VR-2568-0010", dept: "กฟภ. เขต 2 (ภาคกลาง)",      count: 2, budget: "2,800,000", step: "กอง. ตรวจสอบ",   date: "10 มิ.ย. 68", status: "review"   as const, statusLabel: "รอตรวจสอบ", tab: "division" },
  { id: "VR-2568-0009", dept: "กองพัสดุ กฟภ.",              count: 4, budget: "5,600,000", step: "กอง. ตรวจสอบ",   date: "05 มิ.ย. 68", status: "pending"  as const, statusLabel: "รออนุมัติ",  tab: "division" },
  { id: "VR-2568-0008", dept: "กฟภ. เขต 3 (ภาคตะวันออก)",  count: 1, budget: "1,400,000", step: "กอง. ตรวจสอบ",   date: "02 มิ.ย. 68", status: "review"   as const, statusLabel: "รอตรวจสอบ", tab: "division" },
  { id: "VR-2568-0007", dept: "กฟภ. เขต 4 (ภาคใต้)",        count: 6, budget: "8,400,000", step: "ผู้ว่าการพิจารณา", date: "28 พ.ค. 68",  status: "pending"  as const, statusLabel: "รออนุมัติ",  tab: "governor" },
  { id: "VR-2568-0006", dept: "กฟภ. เขต 5 (ภาคเหนือตอนล่าง)", count: 4, budget: "5,200,000", step: "ผู้ว่าการพิจารณา", date: "25 พ.ค. 68", status: "pending" as const, statusLabel: "รออนุมัติ",  tab: "governor" },
  { id: "VR-2568-0005", dept: "กองโรงงาน กฟภ.",             count: 2, budget: "3,100,000", step: "ผู้ว่าการพิจารณา", date: "20 พ.ค. 68",  status: "pending"  as const, statusLabel: "รออนุมัติ",  tab: "governor" },
  { id: "VR-2568-0004", dept: "กฟภ. เขต 1 (ภาคเหนือ)",     count: 8, budget: "11,200,000", step: "บอร์ด กฟภ.",      date: "15 พ.ค. 68", status: "pending"  as const, statusLabel: "รออนุมัติ",  tab: "board" },
  { id: "VR-2568-0003", dept: "กองยานพาหนะ กฟภ.ส่วนกลาง", count: 10, budget: "14,000,000", step: "บอร์ด กฟภ.",      date: "10 พ.ค. 68", status: "pending"  as const, statusLabel: "รออนุมัติ",  tab: "board" },
  { id: "VR-2568-0002", dept: "กฟภ. เขต 2 (ภาคกลาง)",      count: 15, budget: "21,000,000", step: "สภาพัฒน์",        date: "01 พ.ค. 68", status: "pending"  as const, statusLabel: "รออนุมัติ",  tab: "nesdb" },
];

type ActionModal = { id: string; action: "approve" | "reject" | "return" } | null;

export default function ApprovalInbox({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [activeTab, setActiveTab] = useState("division");
  const [modal, setModal] = useState<ActionModal>(null);
  const [comment, setComment] = useState("");

  const filtered = REQUESTS.filter((r) => r.tab === activeTab);

  function handleSubmit() {
    setModal(null);
    setComment("");
  }

  const actionConfig = {
    approve: { label: "อนุมัติคำขอ",         color: "#166534", bg: "#f0fdf4", border: "#86efac", btnVariant: "primary"   as const },
    reject:  { label: "ปฏิเสธคำขอ",          color: "#991b1b", bg: "#fef2f2", border: "#fca5a5", btnVariant: "danger"    as const },
    return:  { label: "ส่งกลับแก้ไข",         color: "#92400e", bg: "#fffbeb", border: "#fcd34d", btnVariant: "secondary" as const },
  };

  return (
    <PageWrap>
      {/* Tab bar */}
      <div className="flex gap-0" style={{ borderBottom: `1px solid ${C.border}` }}>
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-3 text-sm transition-colors"
              style={{
                color:       active ? C.t1 : C.t3,
                borderBottom: active ? `2px solid ${C.t1}` : "2px solid transparent",
                fontWeight:  active ? 600 : 400,
                background:  "transparent",
                marginBottom: -1,
              }}
            >
              {tab.label}
              <span
                className="inline-flex items-center justify-center rounded-full text-xs px-1.5 py-0.5 min-w-[20px]"
                style={{
                  background: active ? C.t1 : C.border,
                  color:      active ? "#fff" : C.t3,
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <Card className="px-4 py-3">
        <FilterBar>
          <SearchInput placeholder="ค้นหาเลขที่คำขอ, หน่วยงาน..." />
          <FilterSelect label="หน่วยงาน"   placeholder="ทั้งหมด" />
          <FilterSelect label="ประเภทรถ"   placeholder="ทั้งหมด" />
          <FilterSelect label="ปีงบประมาณ" placeholder="2568" />
        </FilterBar>
      </Card>

      {/* Requests table */}
      <Card>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
          <SectionHead title={`รายการรออนุมัติ — ${TABS.find((t) => t.id === activeTab)?.label}`} />
          <span className="text-xs" style={{ color: C.t3 }}>แสดง {filtered.length} รายการ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: 1000 }}>
            <thead>
              <tr style={{ background: C.tableHead, borderBottom: `1px solid ${C.border}` }}>
                {["เลขที่คำขอ", "หน่วยงาน", "จำนวนรถ", "งบประมาณรวม (บาท)", "ขั้นตอนปัจจุบัน", "วันที่ส่ง", "สถานะ", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: C.t2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 === 1 ? "#f8fafc" : "#fff", borderBottom: `1px solid ${C.border}` }}>
                  <td className="px-4 py-3">
                    <button
                      className="font-semibold hover:underline text-left text-xs"
                      style={{ color: C.t1 }}
                      onClick={() => onNavigate("request-detail")}
                    >
                      {r.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.t2 }}>{r.dept}</td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: C.t1 }}>{r.count} คัน</td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: C.t1 }}>{r.budget}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.t3 }}>{r.step}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.t4 }}>{r.date}</td>
                  <td className="px-4 py-3">
                    <Badge label={r.statusLabel} variant={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <Btn label="ดูรายละเอียด" variant="ghost" size="sm" onClick={() => onNavigate("request-detail")} />
                      <button
                        onClick={() => setModal({ id: r.id, action: "approve" })}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                        style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #86efac" }}
                        title="อนุมัติ"
                      >
                        <CheckCircle size={12} /> อนุมัติ
                      </button>
                      <button
                        onClick={() => setModal({ id: r.id, action: "return" })}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                        style={{ background: "#fffbeb", color: "#92400e", border: "1px solid #fcd34d" }}
                        title="ส่งกลับแก้ไข"
                      >
                        <RotateCcw size={12} /> ส่งกลับ
                      </button>
                      <button
                        onClick={() => setModal({ id: r.id, action: "reject" })}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                        style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fca5a5" }}
                        title="ปฏิเสธ"
                      >
                        <XCircle size={12} /> ปฏิเสธ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: `1px solid ${C.border}` }}>
          <span className="text-xs" style={{ color: C.t3 }}>แสดง 1 ถึง {filtered.length} จาก {filtered.length} รายการ</span>
          <div className="flex items-center gap-1">
            {["<", "1", ">"].map((p) => (
              <div key={p} className="w-8 h-8 rounded flex items-center justify-center text-xs cursor-pointer"
                style={{ border: `1px solid ${C.border}`, background: p === "1" ? C.tableHead : "#fff", color: C.t3 }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Action Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-xl shadow-xl w-[480px] p-6 flex flex-col gap-5">
            {/* Modal header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold" style={{ color: C.t1 }}>
                  {actionConfig[modal.action].label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: C.t3 }}>เลขที่คำขอ: {modal.id}</p>
              </div>
              <button onClick={() => setModal(null)} style={{ color: C.t4 }}><X size={18} /></button>
            </div>

            <Divider />

            {/* Status badge preview */}
            <div
              className="rounded-lg p-3 text-xs"
              style={{
                background: actionConfig[modal.action].bg,
                color:      actionConfig[modal.action].color,
                border:     `1px solid ${actionConfig[modal.action].border}`,
              }}
            >
              {modal.action === "approve" && "การอนุมัติจะส่งคำขอไปยังขั้นตอนถัดไปโดยอัตโนมัติ"}
              {modal.action === "reject"  && "การปฏิเสธจะยกเลิกคำขอนี้และแจ้งผู้ขอ ดำเนินการนี้ไม่สามารถย้อนกลับได้"}
              {modal.action === "return"  && "คำขอจะถูกส่งกลับให้ผู้ขอดำเนินการแก้ไขและยื่นใหม่"}
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: C.t2 }}>
                ความเห็น / เหตุผล {modal.action !== "approve" && <span style={{ color: "#dc2626" }}>*</span>}
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none"
                style={{ border: `1px solid ${C.borderMd}`, color: C.t1, background: "#f8fafc" }}
                placeholder={
                  modal.action === "approve" ? "ระบุความเห็นเพิ่มเติม (ถ้ามี)..."
                  : modal.action === "reject"  ? "ระบุเหตุผลที่ปฏิเสธ..."
                  : "ระบุประเด็นที่ต้องแก้ไข..."
                }
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Btn label="ยกเลิก" variant="secondary" onClick={() => setModal(null)} />
              <Btn label={actionConfig[modal.action].label} variant={actionConfig[modal.action].btnVariant} onClick={handleSubmit} />
            </div>
          </div>
        </div>
      )}
    </PageWrap>
  );
}
