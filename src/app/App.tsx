import { useState } from "react";
export type RequestType = "replacement" | "quota" | "special" | null;
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ScenarioNav from "./components/ScenarioNav";
import type { Page } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import VehicleList from "./pages/VehicleList";
import VehicleReview from "./pages/VehicleReview";
import CreatePlan from "./pages/CreatePlan";
import PlanCriteria from "./pages/PlanCriteria";
import PlanConfirm from "./pages/PlanConfirm";
import BudgetValidation from "./pages/BudgetValidation";
import RequestDetail from "./pages/RequestDetail";
import ApprovalInbox from "./pages/ApprovalInbox";
import ApprovalTimeline from "./pages/ApprovalTimeline";
import ProcurementHandoff from "./pages/ProcurementHandoff";
import DemandCollection from "./pages/DemandCollection";
import GapAnalysis from "./pages/GapAnalysis";
import SpecialRequestList from "./pages/SpecialRequestList";
import SpecialCriteria from "./pages/SpecialCriteria";
import AllRequests from "./pages/AllRequests";
import CreateRequest from "./pages/CreateRequest";
import SourceData from "./pages/SourceData";
import RequirementAnalysis from "./pages/RequirementAnalysis";
import PlanForm from "./pages/PlanForm";
import ReviewSubmit from "./pages/ReviewSubmit";
import Settings from "./pages/Settings";
import ProcurementPlans from "./pages/ProcurementPlans";

const PAGE_META: Record<Page, { title: string; description: string }> = {
  "dashboard":           { title: "ภาพรวมระบบจัดหารถยนต์ทดแทน",          description: "ติดตามสถานะแผนและคำขอจัดหารถยนต์ทดแทนทั้งหมดในปีงบประมาณ 2568" },
  "vehicle-list":        { title: "รายการรถที่เข้าเกณฑ์ทดแทน",             description: "Phase 1 · ระบบ VMS ตรวจพบรถที่เข้าเกณฑ์ทดแทนตามอายุ ระยะทาง และสภาพ" },
  "vehicle-review":      { title: "ทบทวนรายละเอียดรถทดแทน",                description: "Phase 1 Step 3 · กอง. ตรวจสอบความถูกต้องและความจำเป็นในการทดแทน" },
  "create-plan":         { title: "สร้างแผนการจัดหายานพาหนะ",               description: "Step 1 / 3 · ระบุข้อมูลเบื้องต้น ชื่อแผน ปีงบประมาณ และประเภทการสรรหา" },
  "plan-criteria":       { title: "ระบุเกณฑ์การจัดหา",                     description: "Step 2 / 3 · กำหนดเกณฑ์ค้นหารถในระบบ VMS และเลือกรถที่ตรงเกณฑ์" },
  "plan-confirm":        { title: "ตรวจสอบข้อมูลและยืนยัน",                 description: "Step 3 / 3 · ทบทวนแผนและรายการรถที่ระบบค้นพบก่อนส่งขออนุมัติ" },
  "budget-validation":   { title: "ตรวจสอบและยืนยันงบประมาณ",               description: "Phase 3 · เปรียบเทียบงบที่ขอกับวงเงินที่ได้รับจัดสรรก่อนส่งอนุมัติ" },
  "request-detail":      { title: "รายละเอียดคำขอ VR-2568-0012",            description: "ตรวจสอบข้อมูลคำขอ รายการรถ เอกสาร และสถานะการอนุมัติทั้งหมด" },
  "approval-inbox":      { title: "กล่องอนุมัติ",                            description: "Phase 4 · รายการคำขอที่รออนุมัติในแต่ละระดับ — กอง. / ผู้ว่าการ / บอร์ด กฟภ. / สภาพัฒน์" },
  "approval-timeline":   { title: "ติดตามสถานะการอนุมัติ",                   description: "Phase 4 · แสดงขั้นตอนการอนุมัติและสถานะปัจจุบัน" },
  "procurement-handoff": { title: "ส่งต่อกระบวนการจัดซื้อจัดจ้าง",           description: "Phase 5 · คำขอที่อนุมัติครบแล้ว พร้อมดำเนินการ PR / E-Bid ผ่านระบบ e-GP" },
  "demand-collection":   { title: "รวบรวมความต้องการรถเพิ่มเติม",            description: "Phase 1 · รวบรวมและตรวจสอบความต้องการรถจากหน่วยงานต่าง ๆ เพื่อประกอบการจัดทำแผน" },
  "gap-analysis":           { title: "วิเคราะห์ส่วนต่างและเสนอจำนวนจัดซื้อ",     description: "Phase 2 · เปรียบเทียบจำนวนรถที่ควรมีตามโควต้ากับจำนวนรถที่มีอยู่จริง" },
  "special-request-list":  { title: "รายการคำขอรถกรณีพิเศษ",                   description: "Phase 1 · รวบรวมคำขอซื้อรถเพิ่มเติมกรณีพิเศษจากหน่วยงานต่าง ๆ ในระบบ VMS" },
  "special-criteria":      { title: "กำหนดเกณฑ์กรณีพิเศษและคำนวณจำนวนรถ",     description: "Phase 2 · กำหนดเกณฑ์พิเศษ ตรวจสอบคุณสมบัติ และคำนวณจำนวนรถที่ต้องจัดซื้อเพิ่ม" },
  /* ── Unified system ── */
  "all-requests":           { title: "คำขอจัดหารถยนต์ทั้งหมด",                  description: "รายการคำขอจัดหารถยนต์ส่วนกลางทุกประเภทและทุกสถานะ" },
  "create-request":         { title: "สร้างคำขอจัดหารถยนต์",                    description: "เลือกประเภทคำขอเพื่อเริ่มกระบวนการจัดหารถยนต์ส่วนกลาง" },
  "source-data":            { title: "รวบรวมข้อมูลและความต้องการ",               description: "รวบรวมข้อมูลตั้งต้นตามประเภทคำขอที่เลือก" },
  "requirement-analysis":   { title: "วิเคราะห์ความต้องการและจำนวนรถ",           description: "วิเคราะห์และคำนวณจำนวนรถที่ต้องจัดหาตามเกณฑ์ที่กำหนด" },
  "plan-form":              { title: "จัดทำแผนจัดหารถยนต์",                     description: "กรอกข้อมูลแผนจัดหา งบประมาณ รายการรถ และเอกสารประกอบ" },
  "review-submit":          { title: "ทบทวนและส่งอนุมัติ",                      description: "ตรวจสอบข้อมูลทั้งหมดและยืนยันก่อนส่งเข้าสู่กระบวนการอนุมัติ" },
  "settings":               { title: "การตั้งค่าระบบ",                           description: "ตั้งค่าเกณฑ์ เส้นทางอนุมัติ ประเภทรถ และเทมเพลตเอกสาร" },
  "procurement-plans":     { title: "รายงานและประมวลผลแผนจัดหารถยนต์",         description: "รายการสรุปแผนจัดหายานพาหนะทดแทนส่วนกลาง และการวิเคราะห์ Version Control" },
};

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [requestType, setRequestType] = useState<RequestType>(null);
  const meta = PAGE_META[page];

  function renderPage() {
    switch (page) {
      case "dashboard":           return <Dashboard           onNavigate={setPage} />;
      case "vehicle-list":        return <VehicleList         onNavigate={setPage} />;
      case "vehicle-review":      return <VehicleReview       onNavigate={setPage} />;
      case "create-plan":         return <div className="min-h-full"><CreatePlan    onNavigate={setPage} /></div>;
      case "plan-criteria":       return <div className="min-h-full"><PlanCriteria  onNavigate={setPage} /></div>;
      case "plan-confirm":        return <div className="min-h-full"><PlanConfirm   onNavigate={setPage} /></div>;
      case "budget-validation":   return <BudgetValidation    onNavigate={setPage} />;
      case "request-detail":      return <RequestDetail       onNavigate={setPage} />;
      case "approval-inbox":      return <ApprovalInbox       onNavigate={setPage} />;
      case "approval-timeline":   return <ApprovalTimeline    onNavigate={setPage} />;
      case "procurement-handoff": return <ProcurementHandoff  onNavigate={setPage} />;
      case "demand-collection":    return <DemandCollection    onNavigate={setPage} />;
      case "gap-analysis":         return <GapAnalysis         onNavigate={setPage} />;
      case "special-request-list": return <SpecialRequestList  onNavigate={setPage} />;
      case "special-criteria":     return <SpecialCriteria     onNavigate={setPage} />;
      /* ── Unified system ── */
      case "all-requests":         return <AllRequests          onNavigate={setPage} />;
      case "create-request":       return <CreateRequest        onNavigate={setPage} onSetType={setRequestType} />;
      case "source-data":          return <SourceData           onNavigate={setPage} requestType={requestType} />;
      case "requirement-analysis": return <RequirementAnalysis  onNavigate={setPage} requestType={requestType} />;
      case "plan-form":            return <PlanForm             onNavigate={setPage} requestType={requestType} />;
      case "review-submit":        return <ReviewSubmit         onNavigate={setPage} requestType={requestType} />;
      case "settings":             return <Settings             onNavigate={setPage} />;
      case "procurement-plans":    return <ProcurementPlans     onNavigate={setPage} />;
    }
  }

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ fontFamily: "'IBM Plex Sans Thai', sans-serif", filter: "grayscale(1)" }}
    >
      <Sidebar activePage={page} onNavigate={setPage} />
      <ScenarioNav activePage={page} onNavigate={setPage} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header title={meta.title} description={meta.description} page={page} onNavigate={setPage} />
        <main className="flex-1 overflow-y-auto" style={{ background: "#ffffff" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
