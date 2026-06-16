import { FileText, ExternalLink, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { C, Badge, Card, PageWrap, Btn, Divider, SectionHead, StatCard, FilterBar, FilterSelect, SearchInput } from "../components/ui";
import type { Page } from "../components/Sidebar";

const APPROVED = [
  { id: "VR-2568-0009", dept: "กองพัสดุ กฟภ.",              count: 4, budget: "5,600,000",  approvedDate: "05 มิ.ย. 68", prStatus: "pr"       as const, prNo: "PR-2568-0031", ebidStatus: "pending" as const },
  { id: "VR-2568-0007", dept: "กฟภ. เขต 4 (ภาคใต้)",        count: 6, budget: "8,400,000",  approvedDate: "28 พ.ค. 68",  prStatus: "ebid"     as const, prNo: "PR-2568-0028", ebidStatus: "ebid"    as const },
  { id: "VR-2568-0005", dept: "กฟภ. เขต 5 (ภาคเหนือตอนล่าง)", count: 4, budget: "5,200,000", approvedDate: "20 พ.ค. 68", prStatus: "approved" as const, prNo: "PR-2568-0025", ebidStatus: "approved" as const },
];

const EBID_STEPS: { label: string; date: string; status: "done" | "current" | "pending" }[] = [
  { label: "จัดทำ TOR (ขอบเขตงาน)",           date: "10 มิ.ย. 68",  status: "done"    },
  { label: "ประกาศจัดซื้อในระบบ e-GP",         date: "15 มิ.ย. 68",  status: "done"    },
  { label: "รับข้อเสนอราคา",                    date: "30 มิ.ย. 68",  status: "current" },
  { label: "คณะกรรมการพิจารณาผล",              date: "05 ก.ค. 68",   status: "pending" },
  { label: "ประกาศผู้ชนะ",                     date: "10 ก.ค. 68",   status: "pending" },
  { label: "ทำสัญญาจัดซื้อ",                   date: "20 ก.ค. 68",   status: "pending" },
];

const STATS = [
  { label: "อนุมัติแล้ว รอจัดซื้อ",  value: "3",  sub: "รายการ",  accent: "#166534" },
  { label: "อยู่ระหว่าง PR",           value: "1",  sub: "รายการ",  accent: "#1d4ed8" },
  { label: "อยู่ระหว่าง E-Bid",        value: "1",  sub: "รายการ",  accent: "#6b21a8" },
  { label: "มูลค่ารวมทั้งหมด",         value: "19.2M", sub: "บาท",   accent: C.t1 },
];

function EbidStepRow({ s }: { s: typeof EBID_STEPS[0] }) {
  const isDone = s.status === "done";
  const isCurrent = s.status === "current";
  return (
    <div className="flex items-center gap-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0`}
        style={{
          background: isDone ? "#f0fdf4" : isCurrent ? "#eff6ff" : C.bg,
          border: `1.5px solid ${isDone ? "#86efac" : isCurrent ? "#93c5fd" : C.border}`,
        }}>
        {isDone
          ? <CheckCircle size={14} style={{ color: "#166534" }} />
          : isCurrent
            ? <AlertCircle size={14} style={{ color: "#1d4ed8" }} />
            : <Clock size={14} style={{ color: C.t4 }} />
        }
      </div>
      <div className="flex-1">
        <div className="text-xs font-medium" style={{ color: isDone ? C.t1 : isCurrent ? "#1d4ed8" : C.t4 }}>{s.label}</div>
        <div className="text-[10px]" style={{ color: C.t4 }}>{s.date}</div>
      </div>
      {isCurrent && (
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
          style={{ background: "#dbeafe", color: "#1d4ed8" }}>กำลังดำเนินการ</span>
      )}
    </div>
  );
}

export default function ProcurementHandoff({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <PageWrap>
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} accent={s.accent} />
        ))}
      </div>

      {/* Approved requests ready for procurement */}
      <Card>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div>
            <SectionHead title="รายการที่อนุมัติแล้ว — พร้อมดำเนินการจัดซื้อ" />
            <p className="text-xs mt-0.5" style={{ color: C.t3 }}>คลิก "สร้าง PR" เพื่อส่งคำขอจัดซื้อไปยังระบบ e-GP</p>
          </div>
          <FilterBar>
            <SearchInput placeholder="ค้นหา..." />
            <FilterSelect label="สถานะ" placeholder="ทั้งหมด" />
          </FilterBar>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: 1000 }}>
            <thead>
              <tr style={{ background: C.tableHead, borderBottom: `1px solid ${C.border}` }}>
                {["เลขที่คำขอ", "หน่วยงาน", "จำนวนรถ", "งบประมาณรวม (บาท)", "วันที่อนุมัติ", "เลข PR", "สถานะ PR", "สถานะ E-Bid", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: C.t2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APPROVED.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 === 1 ? "#f8fafc" : "#fff", borderBottom: `1px solid ${C.border}` }}>
                  <td className="px-4 py-3">
                    <button className="text-xs font-semibold hover:underline" style={{ color: C.t1 }}
                      onClick={() => onNavigate("request-detail")}>{r.id}</button>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.t2 }}>{r.dept}</td>
                  <td className="px-4 py-3 text-xs font-medium">{r.count} คัน</td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: C.t1 }}>{r.budget}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.t4 }}>{r.approvedDate}</td>
                  <td className="px-4 py-3">
                    {r.prNo
                      ? <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#1d4ed8" }}>
                          <FileText size={12} />{r.prNo}
                        </span>
                      : <span className="text-xs" style={{ color: C.t4 }}>—</span>
                    }
                  </td>
                  <td className="px-4 py-3"><Badge label={r.prStatus === "pr" ? "ระหว่าง PR" : r.prStatus === "ebid" ? "ระหว่าง E-Bid" : "เสร็จสิ้น"} variant={r.prStatus} /></td>
                  <td className="px-4 py-3"><Badge label={r.ebidStatus === "pending" ? "รอดำเนินการ" : r.ebidStatus === "ebid" ? "ระหว่าง E-Bid" : "เสร็จสิ้น"} variant={r.ebidStatus} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Btn label="ดูรายละเอียด" variant="ghost" size="sm" onClick={() => onNavigate("request-detail")} />
                      {r.prStatus === "approved" && (
                        <Btn label="สร้าง PR" variant="primary" size="sm" />
                      )}
                      {(r.prStatus === "pr" || r.prStatus === "ebid") && (
                        <button className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                          style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #93c5fd" }}>
                          <ExternalLink size={11} /> e-GP
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* E-Bid tracking for VR-2568-0007 */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 340px" }}>
        <Card className="p-5">
          <SectionHead title="ติดตาม E-Bid — VR-2568-0007 (กฟภ. เขต 4)" />
          <p className="text-xs mt-1 mb-5" style={{ color: C.t3 }}>
            PR-2568-0028 · งบประมาณ 8,400,000 บาท · รถ 6 คัน
          </p>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2" style={{ color: C.t3 }}>
              <span>ความคืบหน้า E-Bid</span>
              <span className="font-semibold" style={{ color: C.t1 }}>2 / 6 ขั้นตอน</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: C.border }}>
              <div className="h-full rounded-full" style={{ width: "33%", background: "#6b21a8" }} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {EBID_STEPS.map((s, i) => (
              <div key={s.label}>
                <EbidStepRow s={s} />
                {i < EBID_STEPS.length - 1 && (
                  <div className="ml-3.5 mt-1 w-px h-3" style={{ background: C.border }} />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Vendor info & documents */}
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <SectionHead title="เอกสารจัดซื้อ" />
            <div className="flex flex-col gap-2 mt-3">
              {[
                { name: "TOR_VR2568_0007.pdf",        size: "245 KB", status: "done"    as const },
                { name: "ประกาศ_eBid_VR0007.pdf",     size: "128 KB", status: "done"    as const },
                { name: "ใบเสนอราคา_ผู้ขาย_A.pdf",   size: "—",      status: "pending" as const },
                { name: "ใบเสนอราคา_ผู้ขาย_B.pdf",   size: "—",      status: "pending" as const },
              ].map((d) => (
                <div key={d.name} className="flex items-center gap-3 p-2 rounded-lg"
                  style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <FileText size={14} style={{ color: d.status === "done" ? "#1d4ed8" : C.t4, flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: d.status === "done" ? C.t1 : C.t4 }}>{d.name}</div>
                    <div className="text-[10px]" style={{ color: C.t4 }}>{d.size}</div>
                  </div>
                  {d.status === "done" && (
                    <CheckCircle size={13} style={{ color: "#166534", flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Btn label="อัปโหลดเอกสาร" variant="secondary" />
            </div>
          </Card>

          <Card className="p-5">
            <SectionHead title="ผู้เสนอราคา (รอรับข้อเสนอ)" />
            <div className="mt-3 flex flex-col gap-2">
              {[
                { name: "บริษัท ยนตรกิจ จำกัด",       status: "ลงทะเบียนแล้ว" },
                { name: "บริษัท โตโยต้า สยาม จำกัด",   status: "ลงทะเบียนแล้ว" },
                { name: "บริษัท อิซูซุ มอเตอร์ จำกัด", status: "รอยืนยัน" },
              ].map((v) => (
                <div key={v.name} className="flex items-center justify-between p-2 rounded-lg"
                  style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <span className="text-xs" style={{ color: C.t2 }}>{v.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: v.status === "ลงทะเบียนแล้ว" ? "#f0fdf4" : "#f1f5f9",
                      color: v.status === "ลงทะเบียนแล้ว" ? "#166534" : C.t4,
                      border: `1px solid ${v.status === "ลงทะเบียนแล้ว" ? "#86efac" : C.border}`,
                    }}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageWrap>
  );
}
