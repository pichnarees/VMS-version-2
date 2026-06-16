import { Plus, RefreshCw } from "lucide-react";
import {
  C, Badge, Card, StatCard, PageWrap, FilterBar,
  FilterSelect, SearchInput, Btn, Table, TR, TD, SectionHead,
} from "../components/ui";
import type { Page } from "../components/Sidebar";

const STATS = [
  { label: "คำขอทั้งหมด",           value: "24",  sub: "ปีงบประมาณ 2568",     accent: C.t1 },
  { label: "รอตรวจสอบรายการรถ",     value: "5",   sub: "รายการ",               accent: "#475569" },
  { label: "รอตรวจสอบงบประมาณ",     value: "3",   sub: "รายการ",               accent: "#475569" },
  { label: "รออนุมัติ (ทุกระดับ)",   value: "8",   sub: "รอดำเนินการ",          accent: "#334155" },
  { label: "ส่งกลับแก้ไข",          value: "2",   sub: "รายการ",               accent: "#991b1b" },
  { label: "อนุมัติแล้ว",           value: "4",   sub: "รายการ",               accent: "#166534" },
  { label: "อยู่ระหว่าง PR",         value: "1",   sub: "รายการ",               accent: "#1d4ed8" },
  { label: "อยู่ระหว่าง E-Bid",      value: "1",   sub: "รายการ",               accent: "#6b21a8" },
];

const STATUS_OVERVIEW = [
  { label: "รอตรวจสอบรายการรถ",   count: 5,  pct: 21, variant: "review"   as const },
  { label: "รอตรวจสอบงบประมาณ",   count: 3,  pct: 13, variant: "budget"   as const },
  { label: "รออนุมัติ",            count: 8,  pct: 33, variant: "pending"  as const },
  { label: "ส่งกลับแก้ไข",         count: 2,  pct: 8,  variant: "returned" as const },
  { label: "อนุมัติแล้ว",          count: 4,  pct: 17, variant: "approved" as const },
  { label: "อยู่ระหว่าง PR/E-Bid", count: 2,  pct: 8,  variant: "ebid"     as const },
];

const RECENT = [
  { id: "VR-2568-0012", dept: "กองยานพาหนะ กฟภ.ส่วนกลาง", count: 3, budget: "4,200,000", step: "ผู้ว่าการพิจารณา",   date: "14 มิ.ย. 68", status: "pending"  as const, statusLabel: "รออนุมัติ" },
  { id: "VR-2568-0011", dept: "กฟภ. เขต 1 (ภาคเหนือ)",     count: 5, budget: "7,500,000", step: "กอง. ตรวจสอบ",       date: "12 มิ.ย. 68", status: "review"   as const, statusLabel: "รอตรวจสอบ" },
  { id: "VR-2568-0010", dept: "กฟภ. เขต 2 (ภาคกลาง)",      count: 2, budget: "2,800,000", step: "ตรวจสอบงบประมาณ",    date: "10 มิ.ย. 68", status: "budget"   as const, statusLabel: "รอตรวจงบ" },
  { id: "VR-2568-0009", dept: "กองพัสดุ กฟภ.",              count: 4, budget: "5,600,000", step: "อนุมัติหลักการ",     date: "05 มิ.ย. 68", status: "approved" as const, statusLabel: "อนุมัติแล้ว" },
  { id: "VR-2568-0008", dept: "กฟภ. เขต 3 (ภาคตะวันออก)",  count: 1, budget: "1,400,000", step: "ส่งกลับแก้ไข",       date: "02 มิ.ย. 68", status: "returned" as const, statusLabel: "ส่งกลับ" },
  { id: "VR-2568-0007", dept: "กฟภ. เขต 4 (ภาคใต้)",        count: 6, budget: "8,400,000", step: "สร้าง PR",           date: "28 พ.ค. 68", status: "pr"       as const, statusLabel: "ระหว่าง PR" },
];

export default function Dashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <PageWrap>
      {/* Filter bar */}
      <Card className="px-4 py-3">
        <FilterBar>
          <FilterSelect label="ปีงบประมาณ" placeholder="2568" />
          <FilterSelect label="หน่วยงาน"   placeholder="ทั้งหมด" />
          <FilterSelect label="สถานะ"      placeholder="ทั้งหมด" />
          <FilterSelect label="ประเภทรถ"   placeholder="ทั้งหมด" />
          <SearchInput placeholder="ค้นหาเลขที่คำขอ, หน่วยงาน..." />
          <div className="flex-1" />
          <Btn label="รีเฟรช" icon={<RefreshCw size={14} />} variant="secondary" size="sm" />
          <Btn label="สร้างคำขอใหม่" icon={<Plus size={14} />} variant="primary" size="sm"
            onClick={() => onNavigate("create-plan")} />
        </FilterBar>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} accent={s.accent} />
        ))}
      </div>

      {/* Overview + Recent */}
      <div className="grid grid-cols-[320px_1fr] gap-6">

        {/* Status overview */}
        <Card className="p-5 flex flex-col gap-4">
          <SectionHead title="สรุปตามสถานะ (24 รายการ)" />
          <div className="flex flex-col gap-3">
            {STATUS_OVERVIEW.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Badge label={s.label} variant={s.variant} />
                  <span className="text-xs font-bold" style={{ color: C.t2 }}>{s.count}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.border }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.pct}%`,
                      background: s.variant === "approved" ? "#16a34a"
                        : (s.variant as string) === "returned" || (s.variant as string) === "rejected" ? "#dc2626"
                        : s.variant === "ebid" ? "#7c3aed"
                        : "#64748b",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Budget summary */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 4 }}>
            <p className="text-xs font-semibold mb-3" style={{ color: C.t3 }}>งบประมาณรวมที่ขอ (ปี 2568)</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "งบประมาณที่ได้รับ",   value: "120,000,000 บาท" },
                { label: "ยื่นขอแล้ว",           value: "29,900,000 บาท" },
                { label: "คงเหลือโดยประมาณ",    value: "90,100,000 บาท" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: C.t3 }}>{r.label}</span>
                  <span className="text-xs font-semibold" style={{ color: C.t1 }}>{r.value}</span>
                </div>
              ))}
              <div className="h-2 rounded-full mt-1 overflow-hidden" style={{ background: C.border }}>
                <div className="h-full rounded-full" style={{ width: "25%", background: "#334155" }} />
              </div>
              <span className="text-[10px]" style={{ color: C.t4 }}>ใช้ไปแล้ว 25% ของงบที่ได้รับ</span>
            </div>
          </div>
        </Card>

        {/* Recent requests */}
        <Card className="p-5 flex flex-col gap-4">
          <SectionHead
            title="คำขอล่าสุด"
            action={
              <Btn label="ดูทั้งหมด" variant="ghost" size="sm"
                onClick={() => onNavigate("approval-inbox")} />
            }
          />
          <Table
            headers={["เลขที่คำขอ", "หน่วยงาน", "จำนวนรถ", "งบประมาณ (บาท)", "ขั้นตอนปัจจุบัน", "วันที่ส่ง", "สถานะ", ""]}
          >
            {RECENT.map((r, i) => (
              <TR key={r.id} alt={i % 2 === 1}>
                <TD>
                  <button
                    className="font-semibold hover:underline text-left"
                    style={{ color: C.t1 }}
                    onClick={() => onNavigate("request-detail")}
                  >
                    {r.id}
                  </button>
                </TD>
                <TD><span style={{ color: C.t2 }}>{r.dept}</span></TD>
                <TD><span className="font-medium">{r.count} คัน</span></TD>
                <TD><span style={{ color: C.t2 }}>{r.budget}</span></TD>
                <TD><span style={{ color: C.t3 }}>{r.step}</span></TD>
                <TD><span style={{ color: C.t4 }}>{r.date}</span></TD>
                <TD><Badge label={r.statusLabel} variant={r.status} /></TD>
                <TD>
                  <Btn label="ดูรายละเอียด" variant="ghost" size="sm"
                    onClick={() => onNavigate("request-detail")} />
                </TD>
              </TR>
            ))}
          </Table>
        </Card>
      </div>
    </PageWrap>
  );
}
