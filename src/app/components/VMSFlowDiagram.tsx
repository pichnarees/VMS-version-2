// Wireframe – Scenario 1.1 Flow Diagram (Swim-lane)
// Grey-only wireframe matching image-1 structure

import { ReactNode } from "react";

/* ─── Primitive wireframe shapes ─── */

function StepBox({
  step,
  title,
  bullets,
}: {
  step: number;
  title: string;
  bullets?: string[];
}) {
  return (
    <div className="border border-gray-400 rounded bg-white p-2 text-xs text-gray-700 w-full">
      <div className="font-semibold text-gray-800 mb-0.5">
        {step}. {title}
      </div>
      {bullets && (
        <ul className="space-y-0.5 mt-1">
          {bullets.map((b, i) => (
            <li key={i} className="text-gray-500 leading-snug">
              • {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Diamond({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center my-2">
      <div
        className="w-16 h-16 border border-gray-400 bg-white flex items-center justify-center"
        style={{ transform: "rotate(45deg)" }}
      >
        <span
          className="text-[9px] text-gray-600 font-medium leading-tight text-center"
          style={{ transform: "rotate(-45deg)", maxWidth: 48 }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function ArrowDown({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center my-0.5">
      <div className="w-px h-5 bg-gray-400" />
      <div className="text-gray-400 text-xs leading-none">▼</div>
      {label && <span className="text-[9px] text-gray-400 mt-0.5">{label}</span>}
    </div>
  );
}

function ArrowRight({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-0.5 my-1">
      <div className="flex-1 h-px bg-gray-400 min-w-4" />
      <div className="text-gray-400 text-xs">►</div>
      {label && <span className="text-[9px] text-gray-400">{label}</span>}
    </div>
  );
}

function ArrowLeft({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-0.5 my-1">
      <div className="text-gray-400 text-xs">◄</div>
      <div className="flex-1 h-px bg-gray-400 min-w-4" />
      {label && <span className="text-[9px] text-gray-400">{label}</span>}
    </div>
  );
}

/* Column widths (px) */
const COL_PHASE = 110;
const COL_VMS = 200;
const COL_KOR = 190;
const COL_MGR = 150;
const COL_SEC = 150;
const COL_CHIEF = 150;
const COL_BOARD = 140;
const COL_DIR = 120;

const actors = [
  { id: "vms", label: "ระบบ VMS", width: COL_VMS },
  { id: "kor", label: "กอข.", width: COL_KOR },
  { id: "mgr", label: "ผู้จัดการ", width: COL_MGR },
  { id: "sec", label: "เลขา กอข.", width: COL_SEC },
  { id: "chief", label: "ผู้บังคับบัญชาฝ่าย", width: COL_CHIEF },
  { id: "board", label: "กรรมการฝ่าย", width: COL_BOARD },
  { id: "dir", label: "ผต.กรม", width: COL_DIR },
];

/* ─── Phase row layout helper ─── */
interface CellContent {
  actor: string;   // one of actor ids
  content: ReactNode;
}

function PhaseRow({
  label,
  cells,
  minHeight,
}: {
  label: string;
  cells: CellContent[];
  minHeight?: number;
}) {
  const cellMap: Record<string, ReactNode> = {};
  cells.forEach((c) => {
    cellMap[c.actor] = c.content;
  });

  return (
    <div className="flex border-b border-gray-300" style={{ minHeight }}>
      {/* Phase label */}
      <div
        className="shrink-0 border-r border-gray-300 bg-gray-100 flex items-center justify-center p-2"
        style={{ width: COL_PHASE }}
      >
        <span
          className="text-[10px] font-semibold text-gray-600 text-center leading-tight"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          {label}
        </span>
      </div>

      {/* Actor columns */}
      {actors.map((actor) => (
        <div
          key={actor.id}
          className="border-r border-gray-200 p-3 flex flex-col items-center shrink-0"
          style={{ width: actor.width }}
        >
          {cellMap[actor.id] ?? null}
        </div>
      ))}
    </div>
  );
}

/* ─── Main diagram ─── */

export default function VMSFlowDiagram() {
  const totalWidth =
    COL_PHASE +
    actors.reduce((s, a) => s + a.width, 0);

  return (
    <div className="h-full overflow-auto bg-gray-50 p-6" style={{ fontFamily: "'IBM Plex Sans Thai', sans-serif" }}>
      <div style={{ minWidth: totalWidth + 48, width: "max-content" }}>
        {/* Scenario title */}
        <div className="mb-4 px-1">
          <p className="text-xs font-bold text-gray-700 leading-snug max-w-5xl">
            Scenario 1.1 จัดซื้อรถทดแทน — กระบวนการตั้งแต่ระบบตรวจพบรถที่ควรทดแทน
            จนถึงแผนได้รับอนุมัติและส่งต่อจัดซื้อ
          </p>
        </div>

        {/* Swim-lane grid */}
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">

          {/* Column headers */}
          <div className="flex bg-gray-200 border-b border-gray-400">
            {/* Phase label header */}
            <div
              className="shrink-0 border-r border-gray-400 px-2 py-2 flex items-center justify-center"
              style={{ width: COL_PHASE }}
            >
              <span className="text-[10px] font-bold text-gray-600">กิจกรรม / ผู้ดำเนินการ</span>
            </div>
            {actors.map((a) => (
              <div
                key={a.id}
                className="shrink-0 border-r border-gray-400 px-2 py-2 flex items-center justify-center"
                style={{ width: a.width }}
              >
                <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">{a.label}</span>
              </div>
            ))}
          </div>

          {/* ── Phase 1: กรุงเทพ/เขตพื้นที่ ── */}
          <PhaseRow
            label="กรุงเทพ / เขตพื้นที่"
            minHeight={200}
            cells={[
              {
                actor: "vms",
                content: (
                  <>
                    <StepBox
                      step={1}
                      title="ระบวนการตรวจพบรถทดแทน"
                      bullets={[
                        "ตรวจสอบรายการรถที่ถึงกำหนด",
                        "ส่งข้อมูลรายงานรถทดแทน",
                      ]}
                    />
                    <ArrowDown />
                    <StepBox
                      step={3}
                      title="กระบวนการประเมินเบื้องต้น"
                      bullets={["ประมวลผลข้อมูลรถ", "ส่งผลการประเมิน"]}
                    />
                  </>
                ),
              },
              {
                actor: "kor",
                content: (
                  <>
                    <div className="h-16" />
                    <ArrowLeft />
                    <StepBox step={2} title="แจ้งผลการพิจารณารายการรถที่ควรทดแทน" />
                  </>
                ),
              },
            ]}
          />

          {/* ── Phase 2: กิจกรรมสร้างตัวชี้วัดเกณฑ์การสรรหา ── */}
          <PhaseRow
            label="กิจกรรมสร้างตัวชี้วัด เกณฑ์การสรรหา"
            minHeight={240}
            cells={[
              {
                actor: "vms",
                content: (
                  <StepBox
                    step={4}
                    title="ตรวจสอบข้อมูลสภาพรถ"
                    bullets={[
                      "อายุรถ",
                      "สภาพทั่วไป",
                      "ต้นทุน 30% และ 60% คะแนน",
                      "ความสำคัญ",
                    ]}
                  />
                ),
              },
              {
                actor: "kor",
                content: (
                  <>
                    <ArrowLeft label="รับข้อมูล" />
                    <StepBox
                      step={5}
                      title="รับเรื่องตรวจสอบข้อมูล"
                      bullets={["ตรวจสอบสภาพรถ", "ยืนยันความถูกต้อง"]}
                    />
                    <ArrowDown />
                    <Diamond label={"เพียงพอ?"} />
                    <div className="flex gap-2 text-[9px] text-gray-500 mt-1">
                      <span>ใช่ ↓</span>
                      <span>ไม่ใช่ ← ย้อนกลับ</span>
                    </div>
                  </>
                ),
              },
            ]}
          />

          {/* ── Phase 3: กิจกรรมจัดทำแผนจัดซื้อจัดจ้าง ── */}
          <PhaseRow
            label="กิจกรรมจัดทำแผน จัดซื้อจัดจ้าง"
            minHeight={260}
            cells={[
              {
                actor: "vms",
                content: (
                  <StepBox
                    step={6}
                    title="จัดทำแผนจัดซื้อรถทดแทน"
                    bullets={[
                      "รถทดแทน",
                      "ต้นทุนรถ",
                      "คำอธิบาย",
                      "งบประมาณ + ราคากลาง (บาท/แนะนำ)",
                    ]}
                  />
                ),
              },
              {
                actor: "kor",
                content: (
                  <>
                    <ArrowLeft label="ส่งแผน" />
                    <StepBox step={7} title="รอรับแผนจัดซื้อ" bullets={["ตรวจสอบความสมบูรณ์"]} />
                    <ArrowDown />
                    <Diamond label={"เพียงพอ?"} />
                    <div className="flex gap-2 text-[9px] text-gray-500 mt-1">
                      <span>ใช่ ↓</span>
                      <span>ไม่ใช่ ← ปรับปรุง</span>
                    </div>
                  </>
                ),
              },
            ]}
          />

          {/* ── Phase 4: กระบวนการอนุมัติแผน ── */}
          <PhaseRow
            label="กระบวนการ อนุมัติแผน (4 ปี)"
            minHeight={360}
            cells={[
              {
                actor: "vms",
                content: (
                  <>
                    <StepBox step={8} title="ตรวจสอบแผนการจัดซื้อรถทดแทน" />
                    <ArrowDown />
                    <Diamond label={"ผ่าน?"} />
                    <div className="flex gap-2 text-[9px] text-gray-500 mt-1">
                      <span>ใช่ →</span>
                      <span>ไม่ผ่าน ↩</span>
                    </div>
                  </>
                ),
              },
              {
                actor: "kor",
                content: (
                  <>
                    <div className="h-12" />
                    <ArrowLeft label="ส่งผล" />
                    <StepBox
                      step={9}
                      title="ป้อนผลการประเมิน"
                      bullets={["ส่งผู้กำกับการตรวจสอบ"]}
                    />
                    <ArrowRight label="→ ผู้จัดการ" />
                  </>
                ),
              },
              {
                actor: "mgr",
                content: (
                  <>
                    <div className="h-20" />
                    <StepBox step={10} title="ผู้จัดการฝ่ายพิจารณา" />
                    <ArrowDown />
                    <Diamond label={"ผ่าน?"} />
                    <div className="flex gap-2 text-[9px] text-gray-500 mt-1">
                      <span>ใช่ →</span>
                      <span>ไม่ผ่าน ↩</span>
                    </div>
                  </>
                ),
              },
              {
                actor: "sec",
                content: (
                  <>
                    <div className="h-28" />
                    <StepBox
                      step={11}
                      title="บันทึก กลั่น กรองแผน"
                      bullets={["ตรวจสอบความถูกต้อง", "เสนอต่อคณะกรรมการ"]}
                    />
                    <ArrowDown />
                    <Diamond label={"ผ่าน?"} />
                    <div className="flex gap-2 text-[9px] text-gray-500 mt-1">
                      <span>ใช่ →</span>
                      <span>ไม่ผ่าน ↩</span>
                    </div>
                  </>
                ),
              },
              {
                actor: "chief",
                content: (
                  <>
                    <div className="h-40" />
                    <StepBox step={12} title="กรรมการฝ่ายพิจารณาอนุมัติ" />
                    <ArrowDown />
                    <Diamond label={"อนุมัติ?"} />
                    <div className="flex gap-2 text-[9px] text-gray-500 mt-1">
                      <span>ใช่ →</span>
                      <span>ไม่ ↩</span>
                    </div>
                  </>
                ),
              },
              {
                actor: "board",
                content: (
                  <>
                    <div className="h-52" />
                    <StepBox step={13} title="กรม/กอง ฝ่ายจัดซื้อรับแผน" />
                  </>
                ),
              },
            ]}
          />

          {/* ── Phase 5: กิจกรรมเผยแพร่ ── */}
          <PhaseRow
            label="กิจกรรม เผยแพร่"
            minHeight={200}
            cells={[
              {
                actor: "vms",
                content: (
                  <>
                    <StepBox step={14} title="ระบุ/ป้อนข้อมูลรายการจัดซื้อ" />
                    <ArrowDown />
                    <StepBox step={15} title="บันทึกสร้าง PR (Purchase Request)" />
                    <ArrowDown />
                    <StepBox step={16} title="ส่งต่อฝ่ายจัดซื้อดำเนินการ" />
                  </>
                ),
              },
            ]}
          />
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-12 h-5 border border-gray-400 bg-white rounded" />
            <span>กระบวนการ / ขั้นตอน</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-5 h-5 border border-gray-400 bg-white"
              style={{ transform: "rotate(45deg)" }}
            />
            <span>การตัดสินใจ</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-10 h-px bg-gray-400" />
            <div className="text-gray-400">►</div>
            <span>ทิศทางการไหลของกระบวนการ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
