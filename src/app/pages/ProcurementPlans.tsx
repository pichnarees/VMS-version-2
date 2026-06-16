import React, { useState } from "react";
import { 
  Search, Filter, ChevronRight, FileText, Clock, CheckCircle2, 
  RotateCcw, Eye, Edit3, Trash2, Plus, X, BarChart3, TrendingUp, 
  Check, Archive, Award, ShieldAlert, FileSpreadsheet, Building2, Calendar,
  ChevronDown, ChevronLeft, FileSearch, Settings, Sliders
} from "lucide-react";
import type { Page } from "../components/Sidebar";
import CreateProcurementPlanWizard from "./CreateProcurementPlanWizard";

const C = {
  primary: "#334155", 
  border: "#e2e8f0", 
  bg: "#f8fafc", 
  surface: "#ffffff",
  text: "#0f172a", 
};

type ProcurementType = "purchase" | "rent";
type PlanStatus = "draft" | "pending" | "approved" | "rejected";

interface ProcurementPlan {
  id: string;
  name: string;
  fiscalYear: string;
  procurementType: ProcurementType;
  version: string;
  department: string;
  status: PlanStatus;
  progress: number;
  totalVehicles: number;
  totalBudget: number;
  createdDate: string;
  createdTime?: string;
  remarks: string;
}

const INITIAL_PLANS: ProcurementPlan[] = [
  {
    id: "PLAN-2569-001",
    name: "แผนการสรรหายานพาหนะประจำปี 2569",
    fiscalYear: "2569 - 2570",
    procurementType: "purchase",
    version: "v1.0",
    department: "ฝ่ายปฏิบัติการและจัดซื้อ (สอป.)",
    status: "pending",
    progress: 50,
    totalVehicles: 36,
    totalBudget: 204000000,
    createdDate: "16 พ.ค. 2568",
    createdTime: "15:18",
    remarks: "รอดำเนินการวิเคราะห์และตรวจสอบงบประมาณ",
  },
  {
    id: "PLAN-2568-002",
    name: "แผนการสรรหายานพาหนะเพิ่มเติมประจำปี 2568",
    fiscalYear: "2568 - 2569",
    procurementType: "purchase",
    version: "v1.2",
    department: "กฟภ. เขต 1 (ภาคเหนือ 1)",
    status: "rejected",
    progress: 35,
    totalVehicles: 24,
    totalBudget: 185000000,
    createdDate: "12 ส.ค. 2568",
    createdTime: "13:45",
    remarks: "สเปกบางรายการไม่สอดคล้องตามมาตรฐานหลักเกณฑ์ ได้รับคำแนะนำเสนอใหม่",
  },
  {
    id: "PLAN-2568-003",
    name: "แผนการสรรหายานพาหนะเฉพาะกิจ ปี 2568",
    fiscalYear: "2569 - 2570",
    procurementType: "purchase",
    version: "v1.0",
    department: "กองระบบเครือข่ายส่งจ่าย (กนส.)",
    status: "approved",
    progress: 100,
    totalVehicles: 12,
    totalBudget: 120000000,
    createdDate: "20 มิ.ย. 2568",
    createdTime: "16:03",
    remarks: "อนุมัติเรียบร้อย ดำเนินการออกประกาศคุณสมบัติ",
  },
  {
    id: "PLAN-2568-004",
    name: "แผนการสรรหายานพาหนะประจำปี 2568",
    fiscalYear: "2567 - 2568",
    procurementType: "purchase",
    version: "v2.0",
    department: "กองการบริการและจำหน่ายระบบไฟฟ้า",
    status: "approved",
    progress: 100,
    totalVehicles: 40,
    totalBudget: 215000000,
    createdDate: "3 ก.พ. 2567",
    createdTime: "11:10",
    remarks: "อนุมัติสำหรับการจัดหาแทนชุดเก่าตามวาระโครงสร้างองค์กร",
  }
];

export default function ProcurementPlans({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [plans, setPlans] = useState<ProcurementPlan[]>(INITIAL_PLANS);
  
  // Search and filter States
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");

  // Dialog/Modal Action States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ProcurementPlan | null>(null);
  
  // Form States for Add/Edit
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formValues, setFormValues] = useState<Partial<ProcurementPlan>>({});

  // ─── SA Mockup FULL-SCREEN view states ───
  const [isCreatingNewDraft, setIsCreatingNewDraft] = useState(false);
  const [draftMode, setDraftMode] = useState<"purchase" | "rent">("purchase");
  const [draftName, setDraftName] = useState("แผนสนับสนุนประจำปีงบประมาณ 2573");
  const [draftCategory, setDraftCategory] = useState("รถทดแทน"); // รถทดแทน, รถเพิ่มเติม, รถเพิ่มเติม (ตามโควตาพื้นฐาน), รถเพิ่มเติมกรณีพิเศษ
  const [draftStartYear, setDraftStartYear] = useState("2571");
  const [draftEndYear, setDraftEndYear] = useState("2573");
  const [draftDate, setDraftDate] = useState("2026-06-11");
  const [draftBudget, setDraftBudget] = useState("23500000");
  const [draftRemarks, setDraftRemarks] = useState("ซื้อพิเศษ");
  const [draftCriteria, setDraftCriteria] = useState<string[]>([
    "อายุการใช้งานมากกว่า 8 ปีขึ้นไป",
    "ระยะทางการใช้งานเกินสะสม 200,000 กม."
  ]);
  const [newCriteriaText, setNewCriteriaText] = useState("");
  const [showAddCriteria, setShowAddCriteria] = useState(false);

  // ─── Step 2 "กำหนดเกณฑ์ทดแทน" Wizard States ───
  const [draftWizardStep, setDraftWizardStep] = useState<"form" | "criteria">("form");

  // Template index selected
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [prefilledMessage, setPrefilledMessage] = useState<string | null>(null);

  const pastTemplates = [
    {
      id: "TEMP-2566",
      name: "แผนจัดซื้อยานพาหนะ ปี 2566",
      procurementType: "purchase" as ProcurementType,
      fiscalYear: "2566",
      budget: 18000000,
      status: "approved",
      category: "รถทดแทน",
      remarks: "ผ่านการพิจารณารูปแบบจัดหาทดแทนรถประจำตำแหน่งครบเสื่อมสภาพ",
      criteria: ["อายุ &gt; 12 ปี", "ประเมินสมรรถนะสภาพ 1.8 พึงซ่อม"]
    },
    {
      id: "TEMP-2567",
      name: "แผนเช่ายานพาหนะรวมสิทธิ์จัดสรร ปี 2567",
      procurementType: "rent" as ProcurementType,
      fiscalYear: "2567",
      budget: 34500000,
      status: "approved",
      category: "รถเพิ่มเติม",
      remarks: "แผนเช่าใช้งานรวมพัสดุไฟฟ้า สายงานกองบำรุงรักษา",
      criteria: ["ระยะทางสะสม &gt; 250,000 กม.", "อายุรถยนต์นั่ง &gt; 7 ปี"]
    },
    {
      id: "TEMP-CORE",
      name: "แผนจัดหาครุภัณฑ์พิเศษระดับประเทศ ปี 2568",
      procurementType: "purchase" as ProcurementType,
      fiscalYear: "2568",
      budget: 132000000,
      status: "approved",
      category: "รถเพิ่มเติมกรณีพิเศษ",
      remarks: "สนับสนุนงานรับจ่ายกระแสไฟฟ้าฉุกเฉินระดับเขต",
      criteria: [
        "ผ่านเกณฑ์คุณลักษณะเฉพาะทางอเนกประสงค์",
        "วงเงินกรณีพิเศษพิจารณาอนุมัติเชิงนโยบาย"
      ]
    }
  ];

  // Statistics calculation
  const totalBudgetSum = plans.reduce((acc, curr) => acc + curr.totalBudget, 0);
  const totalVehiclesSum = plans.reduce((acc, curr) => acc + curr.totalVehicles, 0);
  const pendingCount = plans.filter(p => p.status === "pending").length;
  const approvedCount = plans.filter(p => p.status === "approved").length;

  const filteredPlans = plans.filter(p => {
    const term = search.toLowerCase();
    if (term && !p.id.toLowerCase().includes(term) && !p.name.toLowerCase().includes(term) && !p.department.toLowerCase().includes(term)) return false;
    if (filterType !== "all" && p.procurementType !== filterType) return false;
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterYear !== "all") {
      if (filterYear === "2568" && !p.fiscalYear.includes("2568")) return false;
      if (filterYear === "2567" && !p.fiscalYear.includes("2567")) return false;
    }
    return true;
  });

  const typeConfig: Record<ProcurementType, { label: string; bg: string; text: string; border: string }> = {
    purchase: { label: "การซื้อ", bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
    rent: { label: "การเช่า", bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
  };

  const statusConfig: Record<PlanStatus, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
    draft: { label: "ร่าง", icon: <FileText size={12} />, bg: "#f1f5f9", text: "#475569" },
    pending: { label: "รออนุมัติ", icon: <Clock size={12} />, bg: "#fef9c3", text: "#854d0e" },
    approved: { label: "อนุมัติแล้ว", icon: <CheckCircle2 size={12} />, bg: "#dcfce7", text: "#15803d" },
    rejected: { label: "ปฏิเสธ/ให้แก้ไข", icon: <RotateCcw size={12} />, bg: "#fee2e2", text: "#b91c1c" },
  };

  const handleOpenAdd = () => {
    // Open full-screen SA custom creation form directly
    setIsCreatingNewDraft(true);
    setDraftWizardStep("form");
    setDraftMode("purchase");
    setDraftName("แผนสนับสนุนประจำปีงบประมาณ 2573");
    setDraftCategory("รถทดแทน");
    setDraftStartYear("2571");
    setDraftEndYear("2573");
    setDraftDate("2026-06-11");
    setDraftBudget("23500000");
    setDraftRemarks("ซื้อพิเศษ");
    setDraftCriteria([
      "อายุการใช้งานมากกว่า 8 ปีขึ้นไป",
      "ระยะทางการใช้งานเกินสะสม 200,000 กม."
    ]);
    setSelectedTemplateIndex(0);
    setPrefilledMessage(null);
  };

  const handleOpenEdit = (plan: ProcurementPlan) => {
    setFormMode("edit");
    setFormValues(plan);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (plan: ProcurementPlan) => {
    setSelectedPlan(plan);
    setIsDetailOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแผนจัดหานี้?")) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name || !formValues.department) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    if (formMode === "add") {
      const newPlan: ProcurementPlan = {
        id: formValues.id || `PLAN-2568-0${plans.length + 1}`,
        name: formValues.name,
        fiscalYear: formValues.fiscalYear || "2568",
        procurementType: formValues.procurementType as ProcurementType,
        version: formValues.version || "v1.0",
        department: formValues.department,
        status: formValues.status as PlanStatus,
        progress: Number(formValues.progress) || 0,
        totalVehicles: Number(formValues.totalVehicles) || 0,
        totalBudget: Number(formValues.totalBudget) || 0,
        createdDate: formValues.createdDate || "12 มิ.ย. 2568",
        remarks: formValues.remarks || "",
      };
      setPlans([newPlan, ...plans]);
    } else {
      setPlans(plans.map(p => p.id === formValues.id ? (formValues as ProcurementPlan) : p));
    }
    setIsModalOpen(false);
  };

  // UI state render: NEW CREATE PLAN SCREEN (MATCHING SA DESIGN EXACTLY)
  if (isCreatingNewDraft) {
    return (
      <CreateProcurementPlanWizard
        plans={plans}
        setPlans={setPlans}
        setIsCreatingNewDraft={setIsCreatingNewDraft}
        draftWizardStep={draftWizardStep}
        setDraftWizardStep={setDraftWizardStep}
        draftName={draftName}
        setDraftName={setDraftName}
        draftStartYear={draftStartYear}
        setDraftStartYear={setDraftStartYear}
        draftEndYear={draftEndYear}
        setDraftEndYear={setDraftEndYear}
        draftRemarks={draftRemarks}
        setDraftRemarks={setDraftRemarks}
        draftCategory={draftCategory}
        setDraftCategory={setDraftCategory}
        draftDate={draftDate}
        setDraftDate={setDraftDate}
        draftBudget={draftBudget}
        setDraftBudget={setDraftBudget}
        draftMode={draftMode}
        setDraftMode={setDraftMode}
        pastTemplates={pastTemplates}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Upper header section with KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col gap-1 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <FileSpreadsheet size={16} />
            </div>
            <p className="text-xs font-medium text-slate-500">แผนจัดหารถยนต์ทั้งหมด</p>
          </div>
          <p className="text-2xl font-medium text-slate-800 mt-2">{plans.length} แผนงาน</p>
          <div className="text-[11px] text-slate-400 font-light">ครอบคลุมรถรวม {totalVehiclesSum} คัน</div>
        </div>

        <div className="flex flex-col gap-1 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Award size={16} />
            </div>
            <p className="text-xs font-medium text-emerald-700">แผนงานที่อนุมัติแล้ว</p>
          </div>
          <p className="text-2xl font-medium text-emerald-800 mt-2">{approvedCount} แผนงาน</p>
          <div className="text-[11px] text-emerald-500 font-light">ความพร้อมส่งมอบยานพาหนะ 100%</div>
        </div>

        <div className="flex flex-col gap-1 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock size={16} />
            </div>
            <p className="text-xs font-medium text-amber-700">รอทบทวนและอนุมัติ</p>
          </div>
          <p className="text-2xl font-medium text-amber-800 mt-2">{pendingCount} แผนงาน</p>
          <div className="text-[11px] text-amber-500 font-light">อยู่ระหว่างขั้นตอนกล่องรับแผนความต้องการ</div>
        </div>

        <div className="flex flex-col gap-1 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp size={16} />
            </div>
            <p className="text-xs font-medium text-indigo-700">งบประมาณตามแผนรวม</p>
          </div>
          <p className="text-2xl font-medium text-indigo-800 mt-2">{totalBudgetSum.toLocaleString()} ฿</p>
          <div className="text-[11px] text-indigo-500 font-light font-sans">ค่าเฉลี่ยต่อคันประมาณ {(totalVehiclesSum ? Math.round(totalBudgetSum / totalVehiclesSum) : 0).toLocaleString()} ฿</div>
        </div>
      </div>

      {/* Control bar / Filters & Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[280px] px-3.5 py-2 rounded-xl bg-white border border-slate-200">
          <Search size={15} color="#94a3b8" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาแผนจัดหา, เลขที่, หรือหน่วยงานรับผิดชอบหลัก..."
            className="flex-1 text-xs outline-none bg-transparent text-slate-800 font-light" 
          />
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-slate-400" />
          <select 
            value={filterYear} 
            onChange={e => setFilterYear(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 outline-hidden hover:bg-slate-50 cursor-pointer font-medium"
          >
            <option value="all">ทุกปีงบประมาณ</option>
            <option value="2568">2568</option>
            <option value="2567">2567</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 outline-hidden hover:bg-slate-50 cursor-pointer font-medium"
          >
            <option value="all">ทุกประเภทการจัดหา</option>
            <option value="purchase">การซื้อ (Purchase)</option>
            <option value="rent">การเช่า (Rent)</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 outline-hidden hover:bg-slate-50 cursor-pointer font-medium"
          >
            <option value="all">ทุกสถานะของแผน</option>
            <option value="draft">ร่าง (Draft)</option>
            <option value="pending">รอการวิเคราะห์อนุมัติ (Pending)</option>
            <option value="approved">ได้รับการอนุมัติแล้ว (Approved)</option>
            <option value="rejected">ถูกปฏิเสธให้แก้ไข (Rejected)</option>
          </select>
        </div>

        <div className="flex items-center gap-1 text-xs ml-auto text-slate-400 font-medium">
          <Filter size={11} /> แสดง {filteredPlans.length} / {plans.length} รายการแผน
        </div>

        <button 
          id="btn-create-sa-plan"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <Plus size={14} /> สร้างแผนจัดหารถใหม่
        </button>
      </div>

      {/* Main Table View */}
      <div className="border border-[#EAECF0] bg-white overflow-hidden rounded-2xl shadow-3xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#EAECF0] text-[#344054]">
                <th className="px-4 py-4 text-[14px] font-bold font-sans tracking-normal leading-[21px]">เลขที่แผน</th>
                <th className="px-4 py-4 text-[14px] font-bold font-sans tracking-normal leading-[21px] text-left">ชื่อแผนงาน/วัตถุประสงค์</th>
                <th className="px-4 py-4 text-[14px] font-bold font-sans tracking-normal leading-[21px] text-left">ปีงบประมาณ</th>
                <th className="px-4 py-4 text-[14px] font-bold font-sans tracking-normal leading-[21px] text-left">ประเภทการจัดหา</th>
                <th className="px-4 py-4 text-[14px] font-bold font-sans tracking-normal leading-[21px] text-left">เวอร์ชัน</th>
                <th className="px-4 py-4 text-[14px] font-bold font-sans tracking-normal leading-[21px] text-left">จำนวนรถ</th>
                <th className="px-4 py-4 text-[14px] font-bold font-sans tracking-normal leading-[21px] text-right">วงเงินงบประมาณ</th>
                <th className="px-4 py-4 text-[14px] font-bold font-sans tracking-normal leading-[21px] text-left">สถานะ</th>
                <th className="px-4 py-4 text-[14px] font-bold font-sans tracking-normal leading-[21px] text-left">วันที่จัดทำ</th>
                <th className="px-4 py-4 text-[14px] font-bold font-sans tracking-normal leading-[21px] text-center">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] bg-white">
              {filteredPlans.map((r) => {
                const tc = typeConfig[r.procurementType];
                
                // Determine status styles matching screenshot
                let statusLabel = "";
                let statusBg = "";
                let statusText = "";
                let statusBorder = "";

                if (r.status === "pending") {
                  statusLabel = "รอดำเนินการอนุมัติ";
                  statusBg = "bg-[#FFF9EC]";
                  statusText = "text-[#D97706]";
                  statusBorder = "border-[#FEDF89]";
                } else if (r.status === "rejected") {
                  statusLabel = "ไม่อนุมัติ";
                  statusBg = "bg-[#FFF1F0]";
                  statusText = "text-[#F04438]";
                  statusBorder = "border-[#FECDCA]";
                } else if (r.status === "approved") {
                  statusLabel = "อนุมัติ";
                  statusBg = "bg-[#ECFDF3]";
                  statusText = "text-[#027A48]";
                  statusBorder = "border-[#ABEFC6]";
                } else {
                  statusLabel = "ร่าง";
                  statusBg = "bg-[#F2F4F7]";
                  statusText = "text-[#344054]";
                  statusBorder = "border-[#D0D5DD]";
                }

                return (
                  <tr key={r.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-4 py-4.5 text-[14px] text-[#344054] font-normal leading-[21px] font-mono whitespace-nowrap align-middle">
                      {r.id}
                    </td>
                    <td className="px-4 py-4.5 max-w-[280px] align-middle">
                      <div className="text-[14px] font-medium text-black leading-[21px] break-words font-sans">
                        {r.name}
                      </div>
                      {r.remarks && (
                        <div className="text-[12px] text-[#98A2B3] mt-1 break-words font-normal leading-[18px] font-sans">
                          {r.remarks}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4.5 text-[14px] text-[#344054] font-normal leading-[21px] whitespace-nowrap font-sans align-middle text-left">
                      {r.fiscalYear}
                    </td>
                    <td className="px-4 py-4.5 whitespace-nowrap align-middle">
                      <span 
                        className="px-2.5 py-1 rounded-full text-[12px] font-medium border inline-block font-sans"
                        style={{ background: tc.bg, color: tc.text, borderColor: tc.border }}
                      >
                        {tc.label}
                      </span>
                    </td>
                    <td className="px-4 py-4.5 text-[14px] text-[#475467] font-medium font-sans align-middle text-left">
                      {r.version}
                    </td>
                    <td className="px-4 py-4.5 text-[14px] text-[#344054] font-normal leading-[21px] whitespace-nowrap font-sans align-middle text-left">
                      {r.totalVehicles}
                    </td>
                    <td className="px-4 py-4.5 text-[14px] text-[#344054] font-normal leading-[21px] whitespace-nowrap font-sans align-middle text-right">
                      {r.totalBudget.toLocaleString()} ฿
                    </td>
                    <td className="px-4 py-4.5 whitespace-nowrap align-middle text-left">
                      <span 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[14px] font-medium border ${statusBg} ${statusText} ${statusBorder} font-sans`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-4.5 align-middle text-left">
                      <div className="flex flex-col">
                        <span className="text-[14px] text-[#344054] font-normal leading-[21px] font-sans">
                          {r.createdDate}
                        </span>
                        <span className="text-[12px] text-[#98A2B3] font-normal leading-[18px] font-sans mt-0.5">
                          {r.createdTime || "12:00"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4.5 align-middle">
                      <div className="flex items-center justify-center gap-3 animate-fade-in">
                        <button 
                          title="ดูรายละเอียดแผน"
                          onClick={() => handleOpenDetail(r)}
                          className="text-[#475467] hover:text-[#1D2939] transition-colors p-1 cursor-pointer"
                        >
                          <FileSearch size={18} />
                        </button>
                        <button 
                          title="แก้ไขแผนจัดหา"
                          onClick={() => handleOpenEdit(r)}
                          className="text-[#475467] hover:text-[#1570EF] transition-colors p-1 cursor-pointer"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          title="ลบแผนจัดหา"
                          onClick={() => handleDelete(r.id)}
                          className="text-[#475467] hover:text-[#D92D20] transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPlans.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 px-4 bg-slate-50">
            <div className="p-3 bg-white rounded-full border border-slate-200 text-slate-400">
              <FileSpreadsheet size={32} />
            </div>
            <p className="text-sm font-medium text-slate-700">ไม่พบรายการแผนจัดหาตามที่ค้นหา</p>
            <p className="text-xs text-slate-400 max-w-sm text-center font-light">กรุณาปรับเกณฑ์การกรองหรือค้นหาข้อมูลใหม่อีกครั้ง หรือเพิ่มข้อมูลโดยกดปุ่ม "สร้างแผนจัดหารถใหม่"</p>
          </div>
        )}

        {/* High-Fidelity Pagination Footer Bar matching the screenshot exactly */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#EAECF0] bg-[#FFFFFF] px-6 py-5.5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#344054] font-normal font-sans">
            <span>แสดง 1 ถึง {filteredPlans.length} จาก {plans.length} รายการ</span>
            
            <div className="relative inline-block text-left">
              <select className="appearance-none pl-3 pr-8 py-2 border border-[#D0D5DD] rounded-xl text-sm text-[#344054] bg-white font-medium focus:outline-none focus:ring-1 focus:ring-slate-300 font-sans cursor-pointer h-11 w-20">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <div className="absolute inset-y-0 right-2 px-1 flex items-center pointer-events-none text-[#667085]">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {/* Prev icon button */}
            <button 
              disabled
              className="p-2.5 border border-[#D0D5DD] rounded-l-xl text-[#667085] bg-[#FFFFFF] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed h-11 w-11 flex items-center justify-center cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {/* Page 1 (Active) */}
            <button className="px-4.5 py-2 border-t border-b border-[#D0D5DD] text-sm font-semibold text-[#1D2939] bg-[#F2F4F7] h-11 flex items-center justify-center font-sans cursor-default">
              1
            </button>
            {/* Next icon button */}
            <button 
              disabled
              className="p-2.5 border border-[#D0D5DD] rounded-r-xl text-[#667085] bg-[#FFFFFF] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed h-11 w-11 flex items-center justify-center -ml-[1px] cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Footer bar matching Figma screen aesthetics */}
      <div className="flex items-center gap-8 px-6 py-4 rounded-xl bg-white border border-slate-200">
        <div className="flex gap-8 text-xs flex-1 text-slate-500">
          <span>รวมปริมาณรถยนต์ตามแผนกรอง: <strong className="text-slate-800 font-medium">{filteredPlans.reduce((s, r) => s + r.totalVehicles, 0)} คัน</strong></span>
          <span>วงเงินรวมของแผนจัดหาที่แสดง: <strong className="text-slate-800 font-medium">{filteredPlans.reduce((s, r) => s + r.totalBudget, 0).toLocaleString()} ฿</strong></span>
          <span>สัดส่วนการซื้อ: <strong className="text-slate-800 font-medium">{filteredPlans.filter(p => p.procurementType === "purchase").length} รายการ</strong></span>
          <span>สัดส่วนการเช่า: <strong className="text-slate-800 font-medium">{filteredPlans.filter(p => p.procurementType === "rent").length} รายการ</strong></span>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          ปรับปรุงล่าสุด: {plans[0]?.createdDate || "ไม่มีข้อมูลเพิ่มเติม"}
        </div>
      </div>

      {/* Add / Edit Plan Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-medium text-slate-800">
                {formMode === "add" ? "สร้างแผนการจัดหายานพาหนะใหม่" : `แก้ไขข้อมูลแผนจัดหา - ${formValues.id}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-500">
                <X size={15} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-slate-500">ชื่อแผนงานหลัก <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formValues.name || ""} 
                  onChange={e => setFormValues({ ...formValues, name: e.target.value })}
                  placeholder="ระบุชื่อแผนจัดหารถยนต์ทดแทน..."
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none text-slate-800 font-light"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-slate-500">ปีงบประมาณที่มีผลบังคับใช้ <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formValues.fiscalYear || ""} 
                    onChange={e => setFormValues({ ...formValues, fiscalYear: e.target.value })}
                    placeholder="เช่น 2568-2572 หรือ 2568"
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none text-slate-800 font-light"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-slate-500">ประเภทการสรรหา <span className="text-red-500">*</span></label>
                  <select 
                    value={formValues.procurementType || "purchase"} 
                    onChange={e => setFormValues({ ...formValues, procurementType: e.target.value as ProcurementType })}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-800 font-medium"
                  >
                    <option value="purchase">การซื้อ (Purchase)</option>
                    <option value="rent">การเช่า (Rent)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-slate-500">เวอร์ชันระบบแผน</label>
                  <input 
                    type="text" 
                    value={formValues.version || "v1.0"} 
                    onChange={e => setFormValues({ ...formValues, version: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none text-slate-800 font-light"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-slate-500">หน่วยงานรับผิดชอบหลัก <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formValues.department || ""} 
                    onChange={e => setFormValues({ ...formValues, department: e.target.value })}
                    placeholder="เช่น กองพัฒนาและจัดหา..."
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none text-slate-800 font-light"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-slate-500">จำนวนยานพาหนะรวม (คัน)</label>
                  <input 
                    type="number" 
                    value={formValues.totalVehicles || 0} 
                    onChange={e => setFormValues({ ...formValues, totalVehicles: Number(e.target.value) })}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none text-slate-800 font-light"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-slate-500">งบประมาณรวมทั้งสิ้น (฿)</label>
                  <input 
                    type="number" 
                    value={formValues.totalBudget || 0} 
                    onChange={e => setFormValues({ ...formValues, totalBudget: Number(e.target.value) })}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none text-slate-800 font-light"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-slate-500">เปอร์เซ็นต์ความสำเร็จโครงการ (%)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100"
                    value={formValues.progress || 0} 
                    onChange={e => setFormValues({ ...formValues, progress: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-[10px] text-right text-slate-500 font-medium">{formValues.progress || 0}%</div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-slate-500">สถานะและขั้นบันไดข้อมูล</label>
                  <select 
                    value={formValues.status || "draft"} 
                    onChange={e => setFormValues({ ...formValues, status: e.target.value as PlanStatus })}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-800 font-medium"
                  >
                    <option value="draft">ร่างแผนจัดทำ (Draft)</option>
                    <option value="pending">รอการอนุมัติ (Pending)</option>
                    <option value="approved">ได้รับการอนุมัติ (Approved)</option>
                    <option value="rejected">ปฏิเสธ / ส่งกลับทบทวน (Rejected)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-slate-500">หมายเหตุประกอบ / เหตุผลความคุ้มค่า</label>
                <textarea 
                  value={formValues.remarks || ""} 
                  onChange={e => setFormValues({ ...formValues, remarks: e.target.value })}
                  placeholder="ระบุหมายเหตุหรือข้อมูลที่เกี่ยวเนื่องกับโครงสร้างโควต้า..."
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none h-16 resize-none text-slate-800 font-light"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-medium hover:bg-slate-700 cursor-pointer"
                >
                  บันทึกข้อมูลแผน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Details Display Dialog */}
      {isDetailOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 center">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono font-medium text-[10px]">
                  {selectedPlan.id}
                </div>
                <h3 className="text-sm font-medium text-slate-800">รายละเอียดแผนจัดหาวารพานะ</h3>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-500">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[75vh]">
              {/* Header inside details info */}
              <div className="flex flex-col gap-2">
                <p className="text-base font-medium text-slate-800 leading-snug">{selectedPlan.name}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-light">วันที่จัดทำ: {selectedPlan.createdDate}</span>
                  <span className="text-slate-200">|</span>
                  <span className="text-[11px] text-slate-400 font-light">เวอร์ชันปัจจุบัน: {selectedPlan.version}</span>
                  <span className="text-slate-200">|</span>
                  <span className="text-[11px] text-slate-400 font-light">หน่วยงาน: {selectedPlan.department}</span>
                </div>
              </div>

              {/* Status and Progress section */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-medium text-slate-400">สถานะอนุมัติ</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        background: statusConfig[selectedPlan.status].bg, 
                        color: statusConfig[selectedPlan.status].text 
                      }}
                    >
                      {statusConfig[selectedPlan.status].icon}
                      {statusConfig[selectedPlan.status].label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 justify-center">
                  <div className="flex justify-between text-[10px] font-medium text-slate-400">
                    <span>ความสำเร็จ</span>
                    <span className="text-slate-700">{selectedPlan.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-slate-800 h-1.5 rounded-full" 
                      style={{ width: `${selectedPlan.progress}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Numerical breakdown values */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 border border-slate-200 rounded-xl">
                  <p className="text-[10px] font-medium text-slate-400">จำนวนรถยนต์</p>
                  <p className="text-xl font-medium text-slate-800 mt-1">{selectedPlan.totalVehicles} คัน</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl">
                  <p className="text-[10px] font-medium text-slate-400">วงเงินงบประมาณ</p>
                  <p className="text-xl font-medium text-slate-900 mt-1">{selectedPlan.totalBudget.toLocaleString()} ฿</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl">
                  <p className="text-[10px] font-medium text-slate-400">ปีงบประมาณ</p>
                  <p className="text-xl font-medium text-slate-800 mt-1">{selectedPlan.fiscalYear}</p>
                </div>
              </div>

              {/* Procurement strategy */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">ข้อมูลเชิงกระบวนการจัดหา</span>
                <div className="p-4 border border-slate-200 rounded-xl flex flex-col gap-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-light">ประเภทวิธีการจัดหา (Procurement Mode)</span>
                    <strong className="text-slate-800 font-medium font-sans">
                      {selectedPlan.procurementType === "purchase" ? "การซื้อยานพาหนะทดแทนขาด" : "การเช่าเพื่อนำมาใช้งานรายปี"}
                    </strong>
                  </div>
                  <hr className="border-slate-100" />
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-light">เกณฑ์ควบคุมความเหมาะสม</span>
                    <strong className="text-slate-800 font-medium">ผ่านการทวนเกณฑ์มาตรฐาน VMS (อายุ &gt; 8 ปี หรือ ระยะทางสะสม &gt; 200,000 กม.)</strong>
                  </div>
                  <hr className="border-slate-100" />
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-light">เอกสารแนบประเมินคุ้มทุน</span>
                    <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                      <Check size={12} /> ยืนยันครบถ้วน (PDF/XLSX)
                    </span>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {selectedPlan.remarks && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-medium text-slate-400 uppercase">หมายเหตุเพิ่มเติม</span>
                  <p className="text-xs bg-slate-50 text-slate-600 p-3.5 rounded-xl border border-slate-100 leading-relaxed font-light">
                    {selectedPlan.remarks}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 px-6 py-4.5 border-t border-slate-200 bg-slate-50">
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-medium hover:bg-slate-700 cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
