import { C, Card, PageWrap, StatCard, Alert, Btn, Divider } from "../components/ui";
import type { Page } from "../components/Sidebar";

const COMPARISON = [
  { label: "รถกระบะ 4WD",           count: 1, unitPrice: "900,000",   total: "900,000",   approved: "1,000,000", ok: true  },
  { label: "รถตู้โดยสาร 12 ที่นั่ง", count: 1, unitPrice: "1,500,000", total: "1,500,000", approved: "1,200,000", ok: false },
];

export default function BudgetValidation({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const insufficient = COMPARISON.some((r) => !r.ok);

  return (
    <PageWrap>
      {/* Budget summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="งบประมาณที่ได้รับจัดสรร"  value="120,000,000"  sub="บาท (ปี 2568)" accent={C.t1} />
        <StatCard label="งบที่ใช้ไปแล้ว"           value="29,900,000"   sub="บาท"           accent={C.t2} />
        <StatCard label="งบประมาณที่ขอ (คำขอนี้)"  value="2,400,000"    sub="บาท"           accent="#1d4ed8" />
        <StatCard
          label="ส่วนต่างงบประมาณ"
          value="−300,000"
          sub="บาท (งบไม่เพียงพอบางรายการ)"
          accent="#dc2626"
        />
      </div>

      {/* Status alert */}
      {insufficient ? (
        <Alert
          type="warning"
          title="งบประมาณไม่เพียงพอสำหรับบางรายการ"
          message="รายการ 'รถตู้โดยสาร 12 ที่นั่ง' มีราคาประมาณการสูงกว่างบที่ได้รับ 300,000 บาท กรุณาปรับแก้ไขก่อนส่งอนุมัติ"
        />
      ) : (
        <Alert
          type="success"
          title="งบประมาณเพียงพอ"
          message="งบประมาณทุกรายการอยู่ในเกณฑ์ที่ได้รับจัดสรร สามารถส่งคำขออนุมัติได้"
        />
      )}

      {/* Comparison table */}
      <Card className="p-5">
        <p className="text-sm font-semibold mb-4" style={{ color: C.t2 }}>เปรียบเทียบงบประมาณแต่ละรายการ</p>
        <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${C.border}` }}>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: C.tableHead, borderBottom: `1px solid ${C.border}` }}>
                {["รายการรถทดแทน", "จำนวน", "ราคาประมาณการ/คัน (บาท)", "รวม (บาท)", "งบที่ได้รับ/คัน (บาท)", "ส่วนต่าง (บาท)", "สถานะ"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: C.t2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((r, i) => {
                const diff = parseInt(r.approved.replace(/,/g, "")) - parseInt(r.total.replace(/,/g, ""));
                return (
                  <tr key={r.label} style={{ background: i % 2 ? "#f8fafc" : "#fff", borderBottom: `1px solid ${C.border}` }}>
                    <td className="px-4 py-3 font-medium" style={{ color: C.t1 }}>{r.label}</td>
                    <td className="px-4 py-3" style={{ color: C.t2 }}>{r.count} คัน</td>
                    <td className="px-4 py-3" style={{ color: C.t2 }}>{r.unitPrice}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: C.t1 }}>{r.total}</td>
                    <td className="px-4 py-3" style={{ color: C.t2 }}>{r.approved}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: diff >= 0 ? "#166534" : "#dc2626" }}>
                      {diff >= 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: r.ok ? "#f0fdf4" : "#fef2f2",
                          color:      r.ok ? "#166534" : "#991b1b",
                          border:     `1px solid ${r.ok ? "#86efac" : "#fca5a5"}`,
                        }}
                      >
                        {r.ok ? "✓ เพียงพอ" : "✕ ไม่เพียงพอ"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* Summary row */}
              <tr style={{ background: "#f1f5f9", borderTop: `2px solid ${C.border}` }}>
                <td className="px-4 py-3 font-bold" colSpan={3} style={{ color: C.t1 }}>รวมทั้งสิ้น</td>
                <td className="px-4 py-3 font-bold" style={{ color: C.t1 }}>2,400,000</td>
                <td className="px-4 py-3 font-bold" style={{ color: C.t1 }}>2,200,000</td>
                <td className="px-4 py-3 font-bold" style={{ color: "#dc2626" }}>−200,000</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-bold" style={{ color: "#991b1b" }}>มีรายการที่เกิน</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Budget allocation overview */}
      <Card className="p-5">
        <p className="text-sm font-semibold mb-4" style={{ color: C.t2 }}>ภาพรวมงบประมาณปี 2568</p>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "งบที่ได้รับ",       val: "120,000,000", pct: 100 },
            { label: "ใช้ไปแล้ว",         val: "29,900,000",  pct: 25  },
            { label: "คำขอที่อยู่ระหว่าง", val: "2,400,000",   pct: 2   },
          ].map((r) => (
            <div key={r.label} className="flex flex-col gap-2">
              <div className="flex justify-between text-xs" style={{ color: C.t3 }}>
                <span>{r.label}</span>
                <span className="font-semibold" style={{ color: C.t1 }}>{r.val} บาท</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: C.border }}>
                <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: "#334155" }} />
              </div>
              <span className="text-xs" style={{ color: C.t4 }}>{r.pct}% ของงบที่ได้รับ</span>
            </div>
          ))}
        </div>
      </Card>

      <Divider />

      {/* Action bar */}
      <div className="flex items-center justify-between">
        <Btn label="← ย้อนกลับแก้ไข" variant="secondary" onClick={() => onNavigate("create-plan")} />
        <div className="flex gap-3">
          <Btn label="ส่งกลับแก้ไข" variant="danger" />
          <Btn
            label="ส่งอนุมัติ →"
            variant="primary"
            disabled={insufficient}
            onClick={() => onNavigate("approval-inbox")}
          />
        </div>
      </div>
    </PageWrap>
  );
}
