import { useState } from "react";
import { ChevronRight, Download, TrendingDown, AlertTriangle, CheckCircle2, Minus, BarChart3 } from "lucide-react";
import { C, Card, PageWrap, FilterBar, FilterSelect, Btn, Alert } from "../components/ui";
import type { Page } from "../components/Sidebar";

type GapStatus = "shortage" | "sufficient" | "excess";

const GAP_DATA: {
  dept: string; zone: string; type: string;
  quota: number; current: number; requested: number; proposed: number;
  status: GapStatus;
}[] = [
  { dept: "กองยานพาหนะ กฟภ.",     zone: "ส่วนกลาง", type: "รถกระบะ 4WD",           quota: 16, current: 12, requested: 5, proposed: 4, status: "shortage" },
  { dept: "กฟภ. เขต 1 (กรุงเทพฯ)", zone: "เขต 1",   type: "รถตู้โดยสาร 12 ที่นั่ง", quota:  6, current:  4, requested: 3, proposed: 2, status: "shortage" },
  { dept: "กฟภ. เขต 2 (ภาคกลาง)",  zone: "เขต 2",   type: "รถยนต์นั่งส่วนกลาง",     quota:  9, current:  8, requested: 4, proposed: 1, status: "shortage" },
  { dept: "กฟภ. เขต 3 (ภาคเหนือ)", zone: "เขต 3",   type: "รถกระบะ 4WD",           quota:  8, current:  5, requested: 6, proposed: 3, status: "shortage" },
  { dept: "กฟภ. เขต 4 (ภาคใต้)",   zone: "เขต 4",   type: "รถบรรทุกเล็ก 1 ตัน",     quota:  3, current:  3, requested: 2, proposed: 0, status: "sufficient" },
  { dept: "กองพัสดุ",               zone: "ส่วนกลาง", type: "รถยนต์นั่งส่วนกลาง",     quota:  4, current:  2, requested: 2, proposed: 2, status: "shortage" },
  { dept: "ฝ่ายก่อสร้าง",           zone: "ส่วนกลาง", type: "รถกระบะ 2WD",           quota: 10, current:  6, requested: 8, proposed: 4, status: "shortage" },
  { dept: "สำนักงานใหญ่",           zone: "ส่วนกลาง", type: "รถยนต์นั่งส่วนกลาง",     quota:  5, current:  6, requested: 0, proposed: 0, status: "excess" },
];

const STATUS_CFG: Record<GapStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  shortage:   { label: "ขาดรถ",    bg: "#fef2f2", text: "#991b1b", border: "#fca5a5", icon: <TrendingDown size={12} color="#dc2626" /> },
  sufficient: { label: "เพียงพอ",  bg: "#f0fdf4", text: "#166534", border: "#86efac", icon: <CheckCircle2 size={12} color="#16a34a" /> },
  excess:     { label: "เกินโควต้า", bg: "#fffbeb", text: "#92400e", border: "#fcd34d", icon: <AlertTriangle size={12} color="#d97706" /> },
};

function SummaryCard({ label, value, unit, sub, accent }: {
  label: string; value: number; unit: string; sub?: string; accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 p-5 rounded-xl" style={{ border: `1px solid ${C.border}`, background: accent ? "#f8fafc" : "#fff" }}>
      <span className="text-xs" style={{ color: C.t3 }}>{label}</span>
      <div className="flex items-end gap-1.5">
        <span className="text-3xl font-bold" style={{ color: C.t1 }}>{value}</span>
        <span className="text-sm pb-0.5" style={{ color: C.t4 }}>{unit}</span>
      </div>
      {sub && <span className="text-xs" style={{ color: C.t4 }}>{sub}</span>}
    </div>
  );
}

function GapBar({ quota, current }: { quota: number; current: number }) {
  const pct = Math.min((current / quota) * 100, 100);
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "#e2e8f0" }}>
        <div className="h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%`, background: pct >= 100 ? "#16a34a" : pct >= 70 ? "#64748b" : "#dc2626" }} />
      </div>
      <span className="text-[10px] w-8 text-right tabular-nums" style={{ color: C.t4 }}>
        {Math.round(pct)}%
      </span>
    </div>
  );
}

export default function GapAnalysis({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [editProposed, setEditProposed] = useState<Record<string, number>>(
    Object.fromEntries(GAP_DATA.map((d, i) => [i, d.proposed]))
  );

  const totalQuota    = GAP_DATA.reduce((s, d) => s + d.quota, 0);
  const totalCurrent  = GAP_DATA.reduce((s, d) => s + d.current, 0);
  const totalGap      = totalQuota - totalCurrent;
  const totalProposed = (Object.values(editProposed) as number[]).reduce((s, v) => s + v, 0);
  const shortageRows  = GAP_DATA.filter(d => d.status === "shortage").length;

  return (
    <PageWrap>
      <Alert
        type="info"
        title="Gap Analysis — เปรียบเทียบจำนวนรถที่ควรมีกับจำนวนรถที่มีอยู่จริง ปีงบประมาณ 2568"
        message="ตรวจสอบและปรับจำนวนรถที่เสนอจัดซื้อในแต่ละหน่วยงาน แล้วกด 'สร้างแผนจัดซื้อ' เพื่อดำเนินการต่อ"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="โควต้ารถรวมทุกหน่วยงาน" value={totalQuota}   unit="คัน" sub="ตามเกณฑ์พื้นฐาน กฟภ." />
        <SummaryCard label="จำนวนรถที่มีอยู่จริง"     value={totalCurrent} unit="คัน" sub="ข้อมูลจากระบบ VMS" />
        <SummaryCard label="รถที่ขาดตามโควต้ารวม"    value={totalGap}     unit="คัน" sub={`${shortageRows} หน่วยงานที่ขาดรถ`} accent />
        <SummaryCard label="จำนวนที่เสนอจัดซื้อ"     value={totalProposed} unit="คัน" sub="ปรับได้ในตารางด้านล่าง" accent />
      </div>

      {/* Visual summary bar */}
      <Card className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} color={C.t3} />
            <span className="text-sm font-semibold" style={{ color: C.t1 }}>สัดส่วนรถที่มีอยู่เทียบโควต้าโดยรวม</span>
          </div>
          <span className="text-xs" style={{ color: C.t4 }}>
            มีอยู่ {totalCurrent} / {totalQuota} คัน ({Math.round((totalCurrent / totalQuota) * 100)}%)
          </span>
        </div>
        <div className="flex gap-3">
          {GAP_DATA.map((d, i) => {
            const st = STATUS_CFG[d.status];
            const pct = Math.min((d.current / d.quota) * 100, 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full h-20 rounded-lg relative overflow-hidden" style={{ background: "#f1f5f9" }}>
                  <div className="absolute bottom-0 w-full rounded-b-lg transition-all"
                    style={{ height: `${pct}%`, background: d.status === "excess" ? "#d97706" : d.status === "sufficient" ? "#16a34a" : "#334155" }} />
                </div>
                <span className="text-[9px] text-center leading-tight" style={{ color: C.t4 }}>
                  {d.dept.replace("กฟภ. เขต ", "เขต ").replace(" (กรุงเทพฯ)","").replace(" (ภาคกลาง)","").replace(" (ภาคเหนือ)","").replace(" (ภาคใต้)","")}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3">
          {(["shortage","sufficient","excess"] as GapStatus[]).map(s => {
            const cfg = STATUS_CFG[s];
            return (
              <div key={s} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s === "excess" ? "#d97706" : s === "sufficient" ? "#16a34a" : "#334155" }} />
                <span className="text-xs" style={{ color: C.t3 }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filter */}
      <Card className="px-4 py-3">
        <FilterBar>
          <FilterSelect label="เขต/พื้นที่"  placeholder="ทั้งหมด" />
          <FilterSelect label="ประเภทรถ"    placeholder="ทั้งหมด" />
          <FilterSelect label="สถานะ"       placeholder="ทั้งหมด" />
          <div className="flex-1" />
          <Btn label="ส่งออก" icon={<Download size={14} />} variant="secondary" size="sm" />
          <Btn
            label={`สร้างแผนจัดซื้อ (${totalProposed} คัน) →`}
            variant="primary"
            size="sm"
            onClick={() => onNavigate("create-plan")}
          />
        </FilterBar>
      </Card>

      {/* Gap table */}
      <Card>
        <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${C.border}` }}>
          <span className="text-xs font-semibold" style={{ color: C.t2 }}>ตารางวิเคราะห์ส่วนต่างรายหน่วยงาน</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fca5a5" }}>
              ขาด {GAP_DATA.filter(d=>d.status==="shortage").length} หน่วยงาน
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #86efac" }}>
              เพียงพอ {GAP_DATA.filter(d=>d.status==="sufficient").length} หน่วยงาน
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: 1100 }}>
            <thead>
              <tr style={{ background: C.tableHead, borderBottom: `1px solid ${C.border}` }}>
                {[
                  "หน่วยงาน", "เขต", "ประเภทรถ",
                  "โควต้า (คัน)", "มีอยู่ (คัน)", "ส่วนต่าง",
                  "ขอเพิ่ม (คัน)", "เสนอจัดซื้อ (คัน)", "ความครบ",
                  "สถานะ"
                ].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: C.t2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GAP_DATA.map((d, i) => {
                const gap = d.quota - d.current;
                const st  = STATUS_CFG[d.status];
                const proposed = editProposed[i] ?? d.proposed;
                return (
                  <tr key={i} style={{ background: i % 2 === 1 ? "#f8fafc" : "#fff", borderBottom: `1px solid ${C.border}` }}>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold" style={{ color: C.t1 }}>{d.dept}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: C.tableHead, color: C.t3 }}>{d.zone}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: C.t2 }}>{d.type}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold" style={{ color: C.t1 }}>{d.quota}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm" style={{ color: C.t3 }}>{d.current}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {gap > 0 ? (
                        <span className="flex items-center justify-center gap-1 text-sm font-bold" style={{ color: "#dc2626" }}>
                          <TrendingDown size={13} /> {gap}
                        </span>
                      ) : gap < 0 ? (
                        <span className="flex items-center justify-center gap-1 text-sm font-semibold" style={{ color: "#d97706" }}>
                          +{Math.abs(gap)}
                        </span>
                      ) : (
                        <Minus size={14} color={C.t4} style={{ margin: "0 auto" }} />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm" style={{ color: C.t3 }}>{d.requested}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold transition-colors"
                          style={{ border: `1px solid ${C.border}`, color: C.t3, background: "#fff" }}
                          onClick={() => setEditProposed(prev => ({ ...prev, [i]: Math.max(0, (prev[i] ?? d.proposed) - 1) }))}
                        >−</button>
                        <span className="w-8 text-center text-sm font-bold" style={{ color: C.t1 }}>{proposed}</span>
                        <button
                          className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold transition-colors"
                          style={{ border: `1px solid ${C.border}`, color: C.t3, background: "#fff" }}
                          onClick={() => setEditProposed(prev => ({ ...prev, [i]: Math.min(gap, (prev[i] ?? d.proposed) + 1) }))}
                          disabled={proposed >= gap}
                        >+</button>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ minWidth: 120 }}>
                      <GapBar quota={d.quota} current={d.current + proposed} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full w-fit whitespace-nowrap"
                        style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                        {st.icon}{st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderTop: `1px solid ${C.border}`, background: C.tableHead }}>
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px]" style={{ color: C.t4 }}>โควต้ารวม</span>
              <span className="text-base font-bold" style={{ color: C.t1 }}>{totalQuota} คัน</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px]" style={{ color: C.t4 }}>มีอยู่จริง</span>
              <span className="text-base font-bold" style={{ color: C.t1 }}>{totalCurrent} คัน</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px]" style={{ color: C.t4 }}>ขาดรวม</span>
              <span className="text-base font-bold" style={{ color: "#dc2626" }}>{totalGap} คัน</span>
            </div>
            <div className="w-px h-8" style={{ background: C.border }} />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px]" style={{ color: C.t4 }}>เสนอจัดซื้อรวม</span>
              <span className="text-base font-bold" style={{ color: C.primary }}>{totalProposed} คัน</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ color: C.t3, border: `1px solid ${C.border}` }}
              onMouseEnter={e => (e.currentTarget.style.background = C.tableHead)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              onClick={() => onNavigate("demand-collection")}
            >
              ← กลับรวบรวมความต้องการ
            </button>
            <button
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity"
              style={{ background: C.primary }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              onClick={() => onNavigate("create-plan")}
            >
              สร้างแผนจัดซื้อ {totalProposed} คัน <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </Card>
    </PageWrap>
  );
}
