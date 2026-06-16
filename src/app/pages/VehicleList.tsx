import { useState } from "react";
import { Plus, Download, Check, FileText } from "lucide-react";
import {
  C, Badge, Card, PageWrap, FilterBar, FilterSelect,
  SearchInput, Btn, Alert,
} from "../components/ui";
import type { Page } from "../components/Sidebar";

const VEHICLES = [
  { reg: "กข-1234 น.ปท.", type: "รถกระบะ 4WD",             dept: "กองยานพาหนะ กฟภ.", age: "12 ปี", km: "298,450",  cond: "เสื่อมสภาพ",       reason: "อายุเกิน 10 ปี + ค่าซ่อมสูง",     status: "review"   as const, statusLabel: "รอสร้างแผน" },
  { reg: "บค-5678 น.ปท.", type: "รถตู้โดยสาร 12 ที่นั่ง",   dept: "กฟภ. เขต 1",      age: "11 ปี", km: "340,210",  cond: "เสื่อมสภาพ",       reason: "ระยะทางเกิน 300,000 กม.",         status: "review"   as const, statusLabel: "รอสร้างแผน" },
  { reg: "คง-9012 น.ปท.", type: "รถยนต์นั่งส่วนกลาง",       dept: "กฟภ. เขต 2",      age: "9 ปี",  km: "215,800",  cond: "ชำรุด",             reason: "ค่าซ่อมสูงกว่า 50% ของราคารถ",   status: "budget"   as const, statusLabel: "อยู่ระหว่างขอ" },
  { reg: "งจ-3456 น.ปท.", type: "รถบรรทุกเล็ก 1 ตัน",       dept: "กองพัสดุ",         age: "13 ปี", km: "412,300",  cond: "เสื่อมสภาพมาก",    reason: "อายุเกิน 10 ปี, สภาพไม่ปลอดภัย", status: "draft"    as const, statusLabel: "ยังไม่ดำเนินการ" },
  { reg: "จฉ-7890 น.ปท.", type: "รถกระบะ 2WD",               dept: "กฟภ. เขต 3",      age: "10 ปี", km: "189,500",  cond: "ปานกลาง",           reason: "อายุถึงเกณฑ์ 10 ปี",              status: "draft"    as const, statusLabel: "ยังไม่ดำเนินการ" },
  { reg: "ชซ-1122 น.ปท.", type: "รถยนต์นั่งส่วนกลาง",       dept: "กฟภ. เขต 4",      age: "11 ปี", km: "256,700",  cond: "เสื่อมสภาพ",       reason: "อายุเกิน 10 ปี + ระยะทางสูง",    status: "approved" as const, statusLabel: "อนุมัติแล้ว" },
  { reg: "ซฌ-3344 น.ปท.", type: "รถกระบะ 4WD",               dept: "กฟภ. เขต 1",      age: "12 ปี", km: "310,120",  cond: "เสื่อมสภาพ",       reason: "อายุเกิน 10 ปี + ค่าซ่อมสูง",     status: "pending"  as const, statusLabel: "รออนุมัติ" },
];

/* Checkbox that can be indeterminate */
function Checkbox({ checked, indeterminate, onChange }: {
  checked: boolean; indeterminate?: boolean; onChange: () => void;
}) {
  return (
    <div
      onClick={e => { e.stopPropagation(); onChange(); }}
      className="w-4 h-4 rounded flex items-center justify-center shrink-0 cursor-pointer transition-all"
      style={{
        background: checked ? C.primary : "#fff",
        border: `2px solid ${checked || indeterminate ? C.primary : C.borderMd}`,
      }}
    >
      {checked && <Check size={9} strokeWidth={3.5} color="#fff" />}
      {!checked && indeterminate && <div className="w-2 h-0.5 rounded-full" style={{ background: C.primary }} />}
    </div>
  );
}

export default function VehicleList({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const eligible = VEHICLES.filter(v => v.status === "review" || v.status === "draft");
  const allEligibleSelected = eligible.length > 0 && eligible.every(v => selected.has(v.reg));
  const someSelected = selected.size > 0;
  const someEligibleSelected = eligible.some(v => selected.has(v.reg));

  function toggleAll() {
    if (allEligibleSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(eligible.map(v => v.reg)));
    }
  }

  function toggleRow(reg: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(reg) ? next.delete(reg) : next.add(reg);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  const selectedVehicles = VEHICLES.filter(v => selected.has(v.reg));

  return (
    <PageWrap>
      {/* Info alert */}
      <Alert
        type="info"
        title="ระบบ VMS ตรวจพบรถที่เข้าเกณฑ์ทดแทน 7 รายการ"
        message="เลือกรถหลายรายการพร้อมกันเพื่อสร้างแผนทดแทนในครั้งเดียว"
      />

      {/* Filter + actions */}
      <Card className="px-4 py-3">
        <FilterBar>
          <SearchInput placeholder="ค้นหาทะเบียน, หน่วยงาน..." />
          <FilterSelect label="หน่วยงาน"   placeholder="ทั้งหมด" />
          <FilterSelect label="ประเภทรถ"   placeholder="ทั้งหมด" />
          <FilterSelect label="สถานะ"      placeholder="ทั้งหมด" />
          <div className="flex-1" />
          <Btn label="ส่งออก Excel" icon={<Download size={14} />} variant="secondary" size="sm" />
          <Btn
            label="สร้างแผนทดแทน"
            icon={<Plus size={14} />}
            variant="primary"
            size="sm"
            onClick={() => onNavigate("create-plan")}
          />
        </FilterBar>
      </Card>

      {/* Selection action bar — appears when rows are selected */}
      {someSelected && (
        <div className="rounded-xl px-5 py-3 flex items-center gap-4"
          style={{ background: C.primary, border: `1px solid ${C.primary}` }}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <FileText size={15} color="#fff" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">เลือกแล้ว {selected.size} คัน</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                {selectedVehicles.map(v => v.reg).join(" · ")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
              onClick={clearSelection}
            >
              ยกเลิกการเลือก
            </button>
            <button
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: "#fff", color: C.primary }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              onClick={() => onNavigate("create-plan")}
            >
              สร้างแผนทดแทน {selected.size} คัน →
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card>
        {/* Selection hint */}
        <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${C.border}` }}>
          <Checkbox
            checked={allEligibleSelected}
            indeterminate={someEligibleSelected && !allEligibleSelected}
            onChange={toggleAll}
          />
          <span className="text-xs" style={{ color: C.t3 }}>
            {someSelected
              ? `เลือกแล้ว ${selected.size} จาก ${eligible.length} รายการที่สามารถสร้างแผนได้`
              : `เลือกทั้งหมด (${eligible.length} รายการที่สร้างแผนได้)`}
          </span>
          <div className="ml-auto">
            <span className="text-xs font-medium" style={{ color: C.t3 }}>แสดง 1-7 จาก 7 รายการ</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: 1100 }}>
            <thead>
              <tr style={{ background: C.tableHead, borderBottom: `1px solid ${C.border}` }}>
                <th className="px-4 py-3 w-10" />
                {["เลขทะเบียน", "ประเภทรถ", "หน่วยงาน", "อายุรถ", "ระยะทางสะสม", "สภาพรถ", "เหตุผลที่เข้าเกณฑ์", "สถานะ", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: C.t2 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VEHICLES.map((v, i) => {
                const isSelected = selected.has(v.reg);
                const isSelectable = v.status === "review" || v.status === "draft";
                return (
                  <tr
                    key={v.reg}
                    onClick={() => isSelectable && toggleRow(v.reg)}
                    style={{
                      background: isSelected ? "#f0f4ff" : i % 2 === 1 ? "#f8fafc" : "#fff",
                      borderBottom: `1px solid ${C.border}`,
                      borderLeft: `3px solid ${isSelected ? C.primary : "transparent"}`,
                      cursor: isSelectable ? "pointer" : "default",
                      transition: "background 0.1s",
                    }}
                  >
                    <td className="px-4 py-3">
                      {isSelectable ? (
                        <Checkbox checked={isSelected} onChange={() => toggleRow(v.reg)} />
                      ) : (
                        <div className="w-4 h-4 rounded" style={{ border: `2px solid ${C.border}`, background: C.tableHead }} />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-xs" style={{ color: C.t1 }}>{v.reg}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: C.t2 }}>{v.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: C.t3 }}>{v.dept}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fca5a5" }}>
                        {v.age}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: C.t2 }}>{v.km} กม.</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "#f1f5f9", color: C.t3 }}>
                        {v.cond}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <span className="text-xs" style={{ color: C.t3 }}>{v.reason}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={v.statusLabel} variant={v.status} />
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1 flex-wrap">
                        <Btn label="ดูรายละเอียด" variant="secondary" size="sm"
                          onClick={() => onNavigate("vehicle-review")} />
                        {v.status === "draft" && (
                          <Btn label="ส่งตรวจสอบ" variant="primary" size="sm"
                            onClick={() => onNavigate("vehicle-review")} />
                        )}
                        {v.status === "review" && (
                          <Btn label="เพิ่มเข้าแผน" variant="primary" size="sm"
                            onClick={() => onNavigate("create-plan")} />
                        )}
                        {v.status === "pending" && (
                          <Btn label="ติดตามอนุมัติ" variant="secondary" size="sm"
                            onClick={() => onNavigate("approval-timeline")} />
                        )}
                        {v.status === "approved" && (
                          <Btn label="ส่งต่อจัดซื้อ" variant="primary" size="sm"
                            onClick={() => onNavigate("procurement-handoff")} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: `1px solid ${C.border}` }}>
          <span className="text-xs" style={{ color: C.t3 }}>แสดง 1 ถึง 7 จาก 7 รายการ</span>
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
    </PageWrap>
  );
}
