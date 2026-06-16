import { useState } from "react";
import { Download, Plus, CheckCircle2, Clock, XCircle, AlertCircle, ChevronRight, FileText, Users } from "lucide-react";
import { C, Badge, Card, PageWrap, FilterBar, FilterSelect, SearchInput, Btn, Alert } from "../components/ui";
import type { Page } from "../components/Sidebar";

type DemandStatus = "pending-review" | "approved" | "rejected" | "need-info" | "collecting";

const DEMANDS: {
  id: string; dept: string; zone: string; type: string;
  requested: number; current: number; quota: number;
  reason: string; mission: string; status: DemandStatus; statusLabel: string;
}[] = [
  { id: "DM-2568-001", dept: "กองยานพาหนะ กฟภ.",     zone: "ส่วนกลาง",  type: "รถกระบะ 4WD",             requested: 5, current: 12, quota: 16, reason: "ภารกิจตรวจสายส่งเพิ่มขึ้น",          mission: "บำรุงรักษาสายส่งแรงสูง",    status: "approved",      statusLabel: "ผ่านเกณฑ์" },
  { id: "DM-2568-002", dept: "กฟภ. เขต 1 (กรุงเทพฯ)", zone: "เขต 1",    type: "รถตู้โดยสาร 12 ที่นั่ง",   requested: 3, current:  4, quota:  6, reason: "รองรับทีมงานใหม่ 2 ทีม",            mission: "ตรวจสอบมิเตอร์และรับเรื่อง",  status: "approved",      statusLabel: "ผ่านเกณฑ์" },
  { id: "DM-2568-003", dept: "กฟภ. เขต 2 (ภาคกลาง)",  zone: "เขต 2",    type: "รถยนต์นั่งส่วนกลาง",       requested: 4, current:  8, quota:  9, reason: "ขยายพื้นที่รับผิดชอบ 2 อำเภอ",     mission: "บริหารงานทั่วไปและประสานงาน", status: "need-info",     statusLabel: "ต้องการข้อมูลเพิ่ม" },
  { id: "DM-2568-004", dept: "กฟภ. เขต 3 (ภาคเหนือ)",  zone: "เขต 3",    type: "รถกระบะ 4WD",             requested: 6, current:  5, quota:  8, reason: "พื้นที่ภูเขาต้องการรถ 4WD",         mission: "สายส่งพื้นที่สูงและห่างไกล",  status: "pending-review",statusLabel: "รอตรวจสอบ" },
  { id: "DM-2568-005", dept: "กฟภ. เขต 4 (ภาคใต้)",   zone: "เขต 4",    type: "รถบรรทุกเล็ก 1 ตัน",       requested: 2, current:  3, quota:  3, reason: "ขอเกินโควต้าเพื่อสำรอง",           mission: "ขนวัสดุอุปกรณ์",             status: "rejected",      statusLabel: "ไม่ผ่านเกณฑ์" },
  { id: "DM-2568-006", dept: "กองพัสดุ",               zone: "ส่วนกลาง",  type: "รถยนต์นั่งส่วนกลาง",       requested: 2, current:  2, quota:  4, reason: "รองรับผู้บริหารระดับสูง 2 ท่าน",   mission: "สนับสนุนการบริหาร",          status: "approved",      statusLabel: "ผ่านเกณฑ์" },
  { id: "DM-2568-007", dept: "ฝ่ายก่อสร้าง",           zone: "ส่วนกลาง",  type: "รถกระบะ 2WD",             requested: 8, current:  6, quota: 10, reason: "โครงการขยายระบบจำหน่ายระยะ 3",     mission: "ก่อสร้างและขยายสายจำหน่าย",  status: "collecting",    statusLabel: "รวบรวมข้อมูล" },
];

const STATUS_STYLE: Record<DemandStatus, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  "approved":       { bg: "#f0fdf4", text: "#166534", border: "#86efac", icon: <CheckCircle2 size={13} color="#16a34a" /> },
  "rejected":       { bg: "#fef2f2", text: "#991b1b", border: "#fca5a5", icon: <XCircle size={13} color="#dc2626" /> },
  "pending-review": { bg: "#f1f5f9", text: "#334155", border: "#cbd5e1", icon: <Clock size={13} color="#64748b" /> },
  "need-info":      { bg: "#fffbeb", text: "#92400e", border: "#fcd34d", icon: <AlertCircle size={13} color="#d97706" /> },
  "collecting":     { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0", icon: <Clock size={13} color="#94a3b8" /> },
};

function StatCard({ label, value, sub, highlight }: { label: string; value: string | number; sub?: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5 p-4 rounded-xl" style={{ border: `1px solid ${C.border}`, background: highlight ? "#f8fafc" : "#fff" }}>
      <span className="text-xs" style={{ color: C.t3 }}>{label}</span>
      <span className="text-2xl font-bold" style={{ color: C.t1 }}>{value}</span>
      {sub && <span className="text-xs" style={{ color: C.t4 }}>{sub}</span>}
    </div>
  );
}

export default function DemandCollection({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [search, setSearch] = useState("");

  const totalRequested = DEMANDS.reduce((s, d) => s + d.requested, 0);
  const totalApproved  = DEMANDS.filter(d => d.status === "approved").reduce((s, d) => s + d.requested, 0);
  const totalRejected  = DEMANDS.filter(d => d.status === "rejected").length;
  const pendingCount   = DEMANDS.filter(d => d.status === "pending-review" || d.status === "collecting").length;

  const filtered = DEMANDS.filter(d =>
    !search || d.dept.includes(search) || d.type.includes(search) || d.id.includes(search)
  );

  return (
    <PageWrap>
      <Alert
        type="info"
        title={`รวบรวมความต้องการรถจาก ${DEMANDS.length} หน่วยงาน — ปีงบประมาณ 2568`}
        message="ตรวจสอบและยืนยันความต้องการรถจากแต่ละหน่วยงานก่อนดำเนินการคำนวณส่วนต่าง (Gap Analysis)"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="หน่วยงานที่ส่งคำขอ" value={DEMANDS.length} sub="จาก 12 หน่วยงานทั้งหมด" />
        <StatCard label="จำนวนรถที่ขอรวม" value={totalRequested} sub="คัน ทุกหน่วยงาน" />
        <StatCard label="ผ่านเกณฑ์เบื้องต้น" value={totalApproved} sub={`จาก ${totalRequested} คันที่ขอ`} highlight />
        <StatCard label="รอตรวจสอบ / รวบรวม" value={pendingCount} sub={`${totalRejected} รายการไม่ผ่านเกณฑ์`} />
      </div>

      {/* Phase progress */}
      <Card className="px-5 py-4">
        <div className="flex items-center gap-0">
          {[
            { label: "รวบรวมความต้องการ", sub: `${DEMANDS.length} หน่วยงาน`, done: true },
            { label: "ตรวจสอบเงื่อนไข",   sub: `${DEMANDS.filter(d => d.status !== "collecting").length} รายการ`, done: true },
            { label: "คำนวณ Gap",          sub: "รอดำเนินการ", done: false },
            { label: "จัดทำแผนจัดซื้อ",   sub: "รอดำเนินการ", done: false },
          ].map((ph, i, arr) => (
            <div key={ph.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: ph.done ? C.primary : C.border, border: `2px solid ${ph.done ? C.primary : C.border}` }}>
                  {ph.done
                    ? <CheckCircle2 size={14} color="#fff" />
                    : <span className="text-xs text-white font-bold">{i + 1}</span>}
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold" style={{ color: ph.done ? C.t1 : C.t4 }}>{ph.label}</p>
                  <p className="text-[10px]" style={{ color: C.t4 }}>{ph.sub}</p>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="h-px flex-1 mx-2 mb-6" style={{ background: ph.done ? C.primary : C.border }} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Filter + actions */}
      <Card className="px-4 py-3">
        <FilterBar>
          <SearchInput placeholder="ค้นหาหน่วยงาน, ประเภทรถ..." />
          <FilterSelect label="เขต/พื้นที่"  placeholder="ทั้งหมด" />
          <FilterSelect label="ประเภทรถ"    placeholder="ทั้งหมด" />
          <FilterSelect label="สถานะ"       placeholder="ทั้งหมด" />
          <div className="flex-1" />
          <Btn label="ส่งออก" icon={<Download size={14} />} variant="secondary" size="sm" />
          <Btn label="เพิ่มคำขอ" icon={<Plus size={14} />} variant="secondary" size="sm" />
          <Btn
            label="คำนวณ Gap Analysis →"
            variant="primary"
            size="sm"
            onClick={() => onNavigate("gap-analysis")}
          />
        </FilterBar>
      </Card>

      {/* Table */}
      <Card>
        <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${C.border}` }}>
          <Users size={15} color={C.t3} />
          <span className="text-xs font-semibold" style={{ color: C.t2 }}>รายการความต้องการรถจากหน่วยงาน</span>
          <span className="ml-auto text-xs" style={{ color: C.t3 }}>แสดง {filtered.length} รายการ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: 1200 }}>
            <thead>
              <tr style={{ background: C.tableHead, borderBottom: `1px solid ${C.border}` }}>
                {["เลขที่คำขอ", "หน่วยงาน", "เขต/พื้นที่", "ประเภทรถ", "ขอ (คัน)", "มีอยู่ (คัน)", "โควต้า (คัน)", "ส่วนต่าง", "เหตุผล", "สถานะ", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: C.t2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => {
                const gap = d.quota - d.current;
                const st  = STATUS_STYLE[d.status];
                return (
                  <tr key={d.id} style={{ background: i % 2 === 1 ? "#f8fafc" : "#fff", borderBottom: `1px solid ${C.border}` }}>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-semibold" style={{ color: C.t2 }}>{d.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold" style={{ color: C.t1 }}>{d.dept}</span>
                        <span className="text-[10px]" style={{ color: C.t4 }}>{d.mission}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: C.tableHead, color: C.t3 }}>{d.zone}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: C.t2 }}>{d.type}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold" style={{ color: C.t1 }}>{d.requested}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm" style={{ color: C.t3 }}>{d.current}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold" style={{ color: C.t2 }}>{d.quota}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold"
                        style={{ color: gap > 0 ? "#dc2626" : gap < 0 ? "#16a34a" : C.t3 }}>
                        {gap > 0 ? `−${gap}` : gap < 0 ? `+${Math.abs(gap)}` : "0"}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <span className="text-xs leading-snug" style={{ color: C.t3 }}>{d.reason}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full w-fit"
                        style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                        {st.icon}
                        {d.statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Btn label="ดูรายละเอียด" variant="secondary" size="sm" onClick={() => {}} />
                        {d.status === "pending-review" && (
                          <Btn label="ตรวจสอบ" variant="primary" size="sm" onClick={() => {}} />
                        )}
                        {d.status === "need-info" && (
                          <Btn label="ขอข้อมูลเพิ่ม" variant="secondary" size="sm" onClick={() => {}} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary footer */}
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: `1px solid ${C.border}`, background: C.tableHead }}>
          <div className="flex items-center gap-6">
            <span className="text-xs" style={{ color: C.t3 }}>
              รวมทั้งหมด <strong>{DEMANDS.reduce((s,d) => s+d.requested,0)}</strong> คันที่ขอ
            </span>
            <span className="text-xs" style={{ color: C.t3 }}>
              โควต้ารวม <strong>{DEMANDS.reduce((s,d) => s+d.quota,0)}</strong> คัน
            </span>
            <span className="text-xs" style={{ color: C.t3 }}>
              มีอยู่จริง <strong>{DEMANDS.reduce((s,d) => s+d.current,0)}</strong> คัน
            </span>
          </div>
          <button
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity"
            style={{ background: C.primary, color: "#fff" }}
            onClick={() => onNavigate("gap-analysis")}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            คำนวณ Gap Analysis <ChevronRight size={15} />
          </button>
        </div>
      </Card>

      {/* Document section */}
      <Card className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: C.t1 }}>เอกสารประกอบการรวบรวมความต้องการ</p>
          <Btn label="อัปโหลดเอกสาร" icon={<Plus size={14} />} variant="secondary" size="sm" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "แบบสำรวจความต้องการรถ 2568.xlsx",    date: "12 ม.ค. 2568", size: "245 KB" },
            { name: "รายงานความต้องการ กฟภ. เขต 1-4.pdf", date: "15 ม.ค. 2568", size: "1.2 MB" },
            { name: "ข้อมูลจำนวนรถปัจจุบันจาก VMS.xlsx",  date: "16 ม.ค. 2568", size: "380 KB" },
          ].map(f => (
            <div key={f.name} className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ border: `1px solid ${C.border}` }}>
              <FileText size={18} color={C.t4} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: C.t1 }}>{f.name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: C.t4 }}>{f.date} · {f.size}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageWrap>
  );
}
