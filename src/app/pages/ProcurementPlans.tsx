import React, { useState } from "react";
import { 
  Search, Filter, ChevronRight, FileText, Clock, CheckCircle2, 
  RotateCcw, Eye, Edit3, Trash2, Plus, X, BarChart3, TrendingUp, 
  Check, Archive, Award, ShieldAlert, FileSpreadsheet, Building2, Calendar,
  ChevronDown, ChevronLeft, FileSearch, Settings, Sliders
} from "lucide-react";
import type { Page } from "../components/Sidebar";

const C = {
  primary: "#334155", 
  border: "#e2e8f0", 
  bg: "#f8fafc", 
  surface: "#ffffff",
  text: "#0f172a", 
  sub: "#475569", 
  muted: "#94a3b8",
  success: "#16a34a", 
  warning: "#d97706", 
  danger: "#dc2626",
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
  progress: number; // 0 - 100
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
  const [critName, setCritName] = useState("เกณฑ์อายุรถทดแทนกรณีทั่วไป");
  const [critType, setCritType] = useState<"age" | "condition" | "repair">("age");
  const [critNewTypeInput, setCritNewTypeInput] = useState("");
  const [selectedVehiclesForCrit, setSelectedVehiclesForCrit] = useState<string[]>([
    "รถเครน (Crane Truck)",
    "รถกระเช้า (Bucket Truck)",
    "รถตู้โดยสาร / รถตู้ EV",
    "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)"
  ]);
  const [isVehDropdownOpen, setIsVehDropdownOpen] = useState(false);
  const [vehSearchQuery, setVehSearchQuery] = useState("");

  const [truckAgeOperator, setTruckAgeOperator] = useState("มากกว่า");
  const [truckAgeValue, setTruckAgeValue] = useState("12");
  const [basketAgeOperator, setBasketAgeOperator] = useState("ระหว่าง");
  const [basketAgeMin, setBasketAgeMin] = useState("15");
  const [basketAgeMax, setBasketAgeMax] = useState("17");

  const [vanAgeOperator, setVanAgeOperator] = useState("มากกว่า");
  const [vanAgeValue, setVanAgeValue] = useState("10");
  const [pickupAgeOperator, setPickupAgeOperator] = useState("มากกว่า");
  const [pickupAgeValue, setPickupAgeValue] = useState("8");

  const [manualLicenceInput, setManualLicenceInput] = useState("");
  const [isSearchingVehicle, setIsSearchingVehicle] = useState(false);
  const [searchedVehicle, setSearchedVehicle] = useState<{
    licence: string;
    parentType: string;
    age: number;
    condition: string;
    budget: number;
    repairCount: number;
    statusMsg: string;
  } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [vehicleToUncheck, setVehicleToUncheck] = useState<{ id: string; licence: string; parentType: string } | null>(null);
  const [uncheckReasonText, setUncheckReasonText] = useState("");

  // Integrated workspace Step 2 filters
  const [fleetSearchQuery, setFleetSearchQuery] = useState("");
  const [fleetTypeFilter, setFleetTypeFilter] = useState("all");
  const [fleetStatusFilter, setFleetStatusFilter] = useState("all");
  const [showManualAddPanel, setShowManualAddPanel] = useState(false);

  const [fleetList, setFleetList] = useState([
    { id: "v-1", parentType: "รถเครน (Crane Truck)", licence: "กฟภ. 0981", details: "อายุ 14 ปี • สภาพ 2.1 (รถเครนปักเสา 5 ตัน) • ซ่อมบำรุง 4 ครั้ง", budget: 3200000, checked: true, remark: "" },
    { id: "v-2", parentType: "รถเครน (Crane Truck)", licence: "กฟภ. 0982", details: "อายุ 13 ปี • สภาพ 3.0 (รถเฮี๊ยบขนส่งอุปกรณ์) • ซ่อมบำรุง 5 ครั้ง", budget: 3200000, checked: true, remark: "" },
    { id: "v-3", parentType: "รถเครน (Crane Truck)", licence: "กฟภ. 0983", details: "อายุ 15 ปี • สภาพ 1.9 (รถเครนไฮดรอลิกฐานงานระบบ) • ซ่อมบำรุง 8 ครั้ง", budget: 3200000, checked: true, remark: "" },
    { id: "v-4", parentType: "รถกระเช้า (Bucket Truck)", licence: "กฟภ. 1104", details: "อายุ 16 ปี • สภาพ 1.8 (รถกระเช้าซ่อมสายไฟแรงสูง 15ม.) • ซ่อมบำรุง 9 ครั้ง", budget: 4500000, checked: true, remark: "" },
    { id: "v-5", parentType: "รถกระเช้า (Bucket Truck)", licence: "กฟภ. 1105", details: "อายุ 17 ปี • สภาพ 2.5 (รถกระเช้าบูมพับแก้ไขไฟดับ) • ซ่อมบำรุง 7 ครั้ง", budget: 4500000, checked: true, remark: "" },
    { id: "v-6", parentType: "รถตู้โดยสาร / รถตู้ EV", licence: "กฟภ. 5511", details: "อายุ 11 ปี • สภาพ 2.8 (รถตู้โดยสารประจำสำนักงานกอง) • ซ่อมบำรุง 3 ครั้ง", budget: 1100000, checked: true, remark: "" },
    { id: "v-7", parentType: "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)", licence: "กฟภ. 3312", details: "อายุ 10 ปี • สภาพ 2.4 (รถกระบะแค็บ กองบำรุงรักษา) • ซ่อมบำรุง 4 ครั้ง", budget: 850000, checked: true, remark: "" },
  ]);

  // Template index selected
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [prefilledMessage, setPrefilledMessage] = useState<string | null>(null);

  const pastTemplates = [
    {
      id: "TEMP-2566",
      name: "แผนจัดซื้อยานพาหนะ ปี 2566",
      procurementType: "purchase" as ProcurementType,
      fiscalYear: "2567 - 2568",
      budget: 23500000,
      status: "approved",
      category: "รถทดแทน",
      remarks: "โควตารอบปี 2566 เพื่อทดแทนรถกระบะและรถเก๋งประจำกองปฏิบัติการเสื่อมสภาพ",
      criteria: [
        "ผ่านเกณฑ์ประเมินความคุ้มทุนทดแทน (VMS)",
        "อายุการใช้งานจริงสะสมเกิน 8 ปีขึ้นไป",
        "ฝ่ายช่างรับรองสภาพและเลขไมล์สะสม"
      ]
    },
    {
      id: "TEMP-2565",
      name: "แผนจัดซื้อยานพาหนะ ปี 2565",
      procurementType: "purchase" as ProcurementType,
      fiscalYear: "2565 - 2566",
      budget: 1200000,
      status: "approved",
      category: "รถเพิ่มเติม (ตามโควตาพื้นฐาน)",
      remarks: "จัดหารถกระบะเพิ่มเติมประจำจุดสายย่อยเพื่อกระจายงานบริการลูกค้า",
      criteria: [
        "สอดคล้องกับกรอบโควตาจัดสรรประจำปี 2565",
        "ผ่านมติรับรองความจำเป็นโดยคณะทำงานเขต"
      ]
    },
    {
      id: "TEMP-2564",
      name: "แผนจัดซื้อยานพาหนะ ปี 2564",
      procurementType: "purchase" as ProcurementType,
      fiscalYear: "2564",
      budget: 800000,
      status: "approved",
      category: "รถเพิ่มเติมกรณีพิเศษ",
      remarks: "ซื้อยานพาหนะเฉพาะกิจตอบสนองภัยพิบัติฉุกเฉินความมั่นคงสูง",
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

  // Pre-fill left form with selected template card values
  const useTemplatePreset = () => {
    const temp = pastTemplates[selectedTemplateIndex];
    setDraftName(`${temp.name} (ต้นแบบ)`);
    setDraftMode(temp.procurementType);
    setDraftBudget(String(temp.budget));
    setDraftRemarks(temp.remarks);
    setDraftCriteria([...temp.criteria]);
    setDraftCategory(temp.category);
    
    // Set success banner feedback
    setPrefilledMessage(`ดึงข้อมูลต้นแบบจาก "${temp.name}" มากรอกในแบบร่างเรียบร้อยแล้ว!`);
    setTimeout(() => {
      setPrefilledMessage(null);
    }, 5000);
  };

  // Add custom criterion inside left page list
  const handleAddNewCriterion = () => {
    if (newCriteriaText.trim()) {
      setDraftCriteria([...draftCriteria, newCriteriaText.trim()]);
      setNewCriteriaText("");
      setShowAddCriteria(false);
    }
  };

  // Remove criterion
  const handleRemoveCriterion = (indexToRemove: number) => {
    setDraftCriteria(draftCriteria.filter((_, idx) => idx !== indexToRemove));
  };

  // Save the custom draft and go back to main table
  const handleSaveDraftFromSA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftName.trim()) {
      alert("กรุณาระบุชื่อแผนงานหลัก");
      return;
    }

    const newId = `PLAN-2571-0${plans.length + 1}`;
    const newPlan: ProcurementPlan = {
      id: newId,
      name: draftName,
      fiscalYear: `${draftStartYear}-${draftEndYear}`,
      procurementType: draftMode,
      version: "v1.0",
      department: "ฝ่ายปฏิบัติการและจัดซื้อ (สอป.)",
      status: "draft",
      progress: 10,
      totalVehicles: draftMode === "purchase" ? 18 : 6,
      totalBudget: Number(draftBudget) || 12000000,
      createdDate: "11 มิ.ย. 2568",
      remarks: draftRemarks + (draftCriteria.length ? ` [เกณฑ์ควบคุม: ${draftCriteria.join(", ")}]` : ""),
    };

    setPlans([newPlan, ...plans]);
    setIsCreatingNewDraft(false);
    alert(`สร้างแผนแบบร่างเลขที่ ${newId} สำเร็จเรียบร้อยแล้ว!`);
  };

  // UI state render: NEW CREATE PLAN SCREEN (MATCHING SA DESIGN EXACTLY)
  if (isCreatingNewDraft) {
    if (draftWizardStep === "criteria") {
      const selectedCount = fleetList.filter(f => f.checked).length;
      const totalBudgetVal = fleetList.reduce((sum, f) => sum + (f.checked ? f.budget : 0), 0);
      const formattedM = (totalBudgetVal / 1000000).toFixed(2);

      const handleCriteriaSaveDraft = () => {
        const newId = `PLAN-2571-0${plans.length + 1}`;
        const newPlan: ProcurementPlan = {
          id: newId,
          name: draftName,
          fiscalYear: `${draftStartYear} - ${draftEndYear}`,
          procurementType: draftMode,
          version: "v1.0",
          department: "ฝ่ายปฏิบัติการและจัดซื้อ (สอป.)",
          status: "draft",
          progress: 50,
          totalVehicles: selectedCount,
          totalBudget: totalBudgetVal,
          createdDate: "16 พ.ค. 2568",
          remarks: "แบบร่างแผนเกณฑ์ทดแทน: " + critName,
        };
        setPlans([newPlan, ...plans]);
        setIsCreatingNewDraft(false);
        setDraftWizardStep("form");
        alert(`บันทึกแบบร่างแผน ${newPlan.id} เรียบร้อยแล้ว`);
      };

      const handleCriteriaSubmitPlan = () => {
        const newId = `PLAN-2571-0${plans.length + 1}`;
        const newPlan: ProcurementPlan = {
          id: newId,
          name: draftName,
          fiscalYear: `${draftStartYear} - ${draftEndYear}`,
          procurementType: draftMode,
          version: "v1.0",
          department: "ฝ่ายปฏิบัติการและจัดซื้อ (สอป.)",
          status: "pending",
          progress: 50,
          totalVehicles: selectedCount,
          totalBudget: totalBudgetVal,
          createdDate: "16 พ.ค. 2568",
          remarks: "กำหนดเกณฑ์ทดแทนเรียบร้อยสำหรับการจัดหาแทนชุดเก่าตามวาระ",
        };
        setPlans([newPlan, ...plans]);
        setIsCreatingNewDraft(false);
        setDraftWizardStep("form");
        alert(`ส่งข้อมูลแผนเรียบร้อยแล้ว: ${newPlan.name}`);
      };

      const handleSearchVehicle = () => {
        const query = manualLicenceInput.trim();
        if (!query) {
          setSearchError("กรุณากรอกระบุหมายเลขทะเบียนที่ต้องการค้นหาประวัติทะเบียนรถ");
          setSearchedVehicle(null);
          return;
        }

        setIsSearchingVehicle(true);
        setSearchError(null);
        setSearchedVehicle(null);

        setTimeout(() => {
          setIsSearchingVehicle(false);
          
          // Check collision / duplication with current fleetList
          const isExist = fleetList.some(f => f.licence.toLowerCase() === query.toLowerCase());
          if (isExist) {
            setSearchError(`คันหมายเลขทะเบียน "${query}" อยู่ในรายการบัญชีแผนงานจัดทุนนี้แล้ว`);
            return;
          }

          // Generate interesting mock specs based on input string hash formula
          const dummyTypes = [
            "รถเก๋ง (Sedan) และ รถ SUV",
            "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)",
            "รถตู้โดยสาร / รถตู้ EV",
            "รถผู้บริหาร",
            "รถบรรทุก (ขนาด 3 ตัน และ 6 ตันขึ้นไป)",
            "รถกระเช้า (Bucket Truck)",
            "รถเครน (Crane Truck)",
            "รถขุดเจาะ (Boring Truck)",
            "รถแก้กระแสไฟฟ้า Troubleshooting Truck (3 ตัน)",
            "รถล้างลูกถ้วย",
            "รถงานร้อน (Hotline)",
            "รถบรรทุกน้ำ",
            "รถพ่วง"
          ];
          let chosenType = dummyTypes[Math.abs(query.charCodeAt(0) || 0) % dummyTypes.length];
          if (query.includes("เก๋ง") || query.includes("suv") || query.includes("SUV")) chosenType = "รถเก๋ง (Sedan) และ รถ SUV";
          if (query.includes("กระบะ")) chosenType = "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)";
          if (query.includes("ตู้")) chosenType = "รถตู้โดยสาร / รถตู้ EV";
          if (query.includes("ผู้บริหาร")) chosenType = "รถผู้บริหาร";
          if (query.includes("บรรทุก")) chosenType = "รถบรรทุก (ขนาด 3 ตัน และ 6 ตันขึ้นไป)";
          if (query.includes("กระเช้า")) chosenType = "รถกระเช้า (Bucket Truck)";
          if (query.includes("เครน") || query.includes("เฮี๊ยบ")) chosenType = "รถเครน (Crane Truck)";
          if (query.includes("ขุด") || query.includes("เจาะ")) chosenType = "รถขุดเจาะ (Boring Truck)";
          if (query.includes("แก้ไฟ") || query.includes("trouble")) chosenType = "รถแก้กระแสไฟฟ้า Troubleshooting Truck (3 ตัน)";
          if (query.includes("ล้าง")) chosenType = "รถล้างลูกถ้วย";
          if (query.includes("ร้อน") || query.includes("hotline") || query.includes("Hotline")) chosenType = "รถงานร้อน (Hotline)";
          if (query.includes("น้ำ")) chosenType = "รถบรรทุกน้ำ";
          if (query.includes("พ่วง")) chosenType = "รถพ่วง";

          const age = Math.abs(((query.charCodeAt(1) || 4) + (query.charCodeAt(2) || 2)) % 10) + 4; // age 4-13
          const conditionVal = (1.5 + (Math.abs((query.charCodeAt(0) || 7)) % 25) / 10).toFixed(1); // 1.5 - 4.0
          const repairs = Math.abs(((query.charCodeAt(3) || 1) * 3) % 8) + 2; // 2-9
          
          let budget = 1500000;
          if (chosenType === "รถเก๋ง (Sedan) และ รถ SUV") budget = 360000;
          else if (chosenType === "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)") budget = 420000;
          else if (chosenType === "รถตู้โดยสาร / รถตู้ EV") budget = 450000;
          else if (chosenType === "รถผู้บริหาร") budget = 600000;
          else if (chosenType === "รถบรรทุก (ขนาด 3 ตัน และ 6 ตันขึ้นไป)") budget = 2200000;
          else if (chosenType === "รถกระเช้า (Bucket Truck)") budget = 4500000;
          else if (chosenType === "รถเครน (Crane Truck)") budget = 3200000;
          else if (chosenType === "รถขุดเจาะ (Boring Truck)") budget = 3800000;
          else if (chosenType === "รถแก้กระแสไฟฟ้า Troubleshooting Truck (3 ตัน)") budget = 1800000;
          else if (chosenType === "รถล้างลูกถ้วย") budget = 7500000;
          else if (chosenType === "รถงานร้อน (Hotline)") budget = 6500000;
          else if (chosenType === "รถบรรทุกน้ำ") budget = 2400000;
          else if (chosenType === "รถพ่วง") budget = 1200000;

          setSearchedVehicle({
            licence: query,
            parentType: chosenType,
            age: age,
            condition: conditionVal,
            budget: budget,
            repairCount: repairs,
            statusMsg: "พร้อมสำหรับการพิจารณาเข้าร่วมสมทบแผนเกณฑ์ทดแทนยานพาหนะของ กฟภ."
          });
        }, 750);
      };

      const handleConfirmAddManualVeh = () => {
        if (!searchedVehicle) return;
        const newVeh = {
          id: `v-${Date.now()}`,
          parentType: searchedVehicle.parentType,
          licence: searchedVehicle.licence,
          details: `อายุ ${searchedVehicle.age} ปี • สภาพ ${searchedVehicle.condition} (ประวัติเข้าซ่อมบำรุงสะสม ${searchedVehicle.repairCount} ครั้ง)`,
          budget: searchedVehicle.budget,
          checked: true,
          remark: ""
        };
        setFleetList([...fleetList, newVeh]);
        setSearchedVehicle(null);
        setManualLicenceInput("");
      };

      const toggleVehType = (type: string) => {
        if (selectedVehiclesForCrit.includes(type)) {
          setSelectedVehiclesForCrit(selectedVehiclesForCrit.filter(v => v !== type));
        } else {
          setSelectedVehiclesForCrit([...selectedVehiclesForCrit, type]);
        }
      };

      return (
        <div className="flex flex-col gap-6 p-8 min-h-screen bg-[#FCFCFC] text-[#1D2939]">
          
          {/* Breadcrumb path matching SA design */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 text-xs text-[#667085] font-medium font-sans">
              <span>สร้างแผน</span>
              <ChevronRight size={10} className="text-[#98A2B3]" />
              <span className="text-[#1D2939] font-medium bg-[#F2F4F7] px-2 py-0.5 rounded">กำหนดเกณฑ์ทดแทน</span>
            </div>
          </div>

          {/* Sub Header info bar */}
          <div className="flex flex-col md:flex-row items-center justify-between bg-white border border-[#EAECF0] p-4.5 rounded-xl gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-[#F2F4F7] text-[#344054] px-4.5 py-1.5 rounded-lg text-sm font-bold border border-[#D0D5DD] font-sans">
                แผนจัดซื้อ {draftEndYear}
              </span>
              <span className="text-sm font-semibold text-[#475467] font-sans">
                ปีงบประมาณ {draftStartYear}–{draftEndYear}
              </span>
            </div>
            <div className="text-[#027A48] font-bold text-lg font-sans">
              วงเงินรวม : {selectedCount === 0 ? "0 M" : formattedM} M ฿
            </div>
          </div>

          {/* Core Stats Overview Row (4 blocks) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Card 1: เกณฑ์ทั้งหมด */}
            <div className="bg-white border border-[#EAECF0] p-5 rounded-2xl flex flex-col justify-between align-start min-h-[110px]">
              <span className="text-[13px] font-medium text-[#667085] font-sans">เกณฑ์ทั้งหมด</span>
              <span className="text-2xl font-bold text-[#1D2939] font-sans mt-2">1 เกณฑ์</span>
            </div>

            {/* Card 2: สมบูรณ์ */}
            <div className="bg-white border border-[#EAECF0] p-5 rounded-2xl flex flex-col justify-between align-start min-h-[110px]">
              <span className="text-[13px] font-medium text-[#667085] font-sans">สมบูรณ์</span>
              <span className="text-2xl font-bold text-[#1D2939] font-sans mt-2">0</span>
            </div>

            {/* Card 3: จำนวนรถรวม */}
            <div className="bg-white border border-[#EAECF0] p-5 rounded-2xl flex flex-col justify-between align-start min-h-[110px]">
              <span className="text-[13px] font-medium text-[#667085] font-sans">จำนวนรถรวม</span>
              <span className="text-2xl font-bold text-[#1D2939] font-sans mt-2">
                {selectedCount} คัน
              </span>
            </div>

            {/* Card 4: วงเงินรวม */}
            <div className="bg-white border border-[#EAECF0] p-5 rounded-2xl flex flex-col justify-between align-start min-h-[110px] relative overflow-hidden">
              <span className="text-[13px] font-medium text-[#667085] font-sans">วงเงินรวม</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-300 font-mono text-sm leading-none shrink-0 font-sans">───────────►</span>
                <span className="text-2xl font-bold text-[#027A48] font-sans bg-[#ECFDF3] px-2.5 py-1 rounded-xl">
                  {selectedCount === 0 ? "0 ฿" : `${formattedM}M ฿`}
                </span>
              </div>
            </div>

          </div>

          {/* "+ สร้างเกณฑ์ใหม่" Outline button */}
          <div className="flex">
            <button 
              type="button"
              onClick={() => alert("เริ่มสร้างเกณฑ์พิจารณารายการรถทดแทนชุดที่ 2")}
              className="flex items-center gap-2 px-4.5 py-2.5 bg-white border border-[#EAECF0] text-[#344054] hover:bg-[#F9FAFB] rounded-xl text-sm font-semibold transition-colors font-sans"
            >
              <Plus size={16} />
              สร้างเกณฑ์ใหม่
            </button>
          </div>

          {/* Section: กำหนดเกณฑ์ทดแทน */}
          <div className="bg-white border border-[#EAECF0] rounded-2xl p-6.5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F2F4F7] pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Filter size={18} className="stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1D2939] font-sans">กำหนดเกณฑ์ทดแทน</h2>
                  <p className="text-xs text-[#667085] mt-0.5 font-sans">ระบุค่าสัมพัทธ์พารามิเตอร์คัดกรองขีดความสามารถสมรถนะตามที่ได้รับอนุมัติแบบบูรณาการ</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-slate-50 text-[#344054] border border-[#EAECF0] rounded-xl font-bold font-sans">
                  แผนจัดซื้อ {draftEndYear}
                </span>
                <span className="text-[#475467] font-medium font-sans">
                  ปีงบประมาณ {draftStartYear}–{draftEndYear}
                </span>
                <span className="text-[#027A48] font-bold font-sans bg-[#ECFDF3] border border-[#ABEFC6] px-2.5 py-0.5 rounded-full text-xs">
                  เลือกแล้ว {selectedCount} คัน • {selectedCount === 0 ? "0 M" : formattedM}M ฿
                </span>
              </div>
            </div>

            {/* Form grid inside */}
            <div className="flex flex-col gap-6">
              
              {/* Row 1: ชื่อเกณฑ์ และ ประเภทเกณฑ์ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#344054] font-sans flex items-center gap-1.5">
                    <span>ชื่อเกณฑ์เกณฑ์คุณภาพ *</span>
                    <span className="text-xs text-slate-400 font-normal font-sans">(ระบุเพื่ออ้างอิงรายโครงการ)</span>
                  </label>
                  <input 
                    type="text"
                    value={critName}
                    onChange={e => setCritName(e.target.value)}
                    placeholder="ระบุชื่อเกณฑ์ เช่น เกณฑ์ประเมินชำรุดทดแทนปี 2569..."
                    className="w-full h-11 px-3.5 border border-[#D0D5DD] rounded-xl text-[14px] font-sans font-medium text-[#1D2939] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-3xs transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#344054] font-sans flex items-center gap-1.5">
                    <span>ประเภทเกณฑ์การคำนวณ *</span>
                    <span className="text-xs text-slate-400 font-normal font-sans">(เลือกรูปแบบขีดความวิเคราะห์)</span>
                  </label>
                  <div className="grid grid-cols-3 border border-[#D0D5DD] p-1 bg-slate-50 rounded-xl h-11">
                    <button
                      type="button"
                      onClick={() => setCritType("age")}
                      className={`text-xs font-bold rounded-lg transition-all font-sans flex items-center justify-center gap-1 select-none ${
                        critType === "age" ? "bg-white text-slate-800 shadow-3xs border border-[#E2E8F0]" : "text-[#475467] hover:bg-slate-100"
                      }`}
                    >
                      <Clock size={13} className={critType === "age" ? "text-emerald-700" : "text-slate-400"} />
                      อายุรถ
                    </button>
                    <button
                      type="button"
                      onClick={() => setCritType("condition")}
                      className={`text-xs font-bold rounded-lg transition-all font-sans flex items-center justify-center gap-1 select-none ${
                        critType === "condition" ? "bg-white text-slate-800 shadow-3xs border border-[#E2E8F0]" : "text-[#475467] hover:bg-slate-100"
                      }`}
                    >
                      <Award size={13} className={critType === "condition" ? "text-emerald-700" : "text-slate-400"} />
                      สภาพรถ
                    </button>
                    <button
                      type="button"
                      onClick={() => setCritType("repair")}
                      className={`text-xs font-bold rounded-lg transition-all font-sans flex items-center justify-center gap-1 select-none ${
                        critType === "repair" ? "bg-white text-slate-800 shadow-3xs border border-[#E2E8F0]" : "text-[#475467] hover:bg-slate-100"
                      }`}
                    >
                      <RotateCcw size={13} className={critType === "repair" ? "text-emerald-700" : "text-slate-400"} />
                      ค่าซ่อม
                    </button>
                  </div>
                </div>
              </div>

              {/* Or Custom Criteria Title Input */}
              <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-amber-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-[#475467] font-sans">ระบุประเภทเกณฑ์เพิ่มเติมจำลองกรณีพิเศษ (ถ้ามี):</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto flex-grow max-w-lg">
                  <input 
                    type="text"
                    placeholder="ระบุข้อกำหนดเฉพาะกิจ (เช่น คาร์บอนต่ำ EV, ชำรุดเร่งด่วน)..."
                    value={critNewTypeInput}
                    onChange={e => setCritNewTypeInput(e.target.value)}
                    className="w-full h-9 px-3 border border-[#D0D5DD] rounded-lg text-xs bg-white text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!critNewTypeInput.trim()) return;
                      alert(`บันทึกเกณฑ์จำลองเพิ่มเติมสำเร็จ: ${critNewTypeInput}`);
                      setCritNewTypeInput("");
                    }}
                    className="px-4 border border-[#D0D5DD] hover:border-emerald-500 hover:text-emerald-700 bg-white hover:bg-emerald-50 text-xs font-bold text-[#344054] rounded-lg font-sans shrink-0 transition-colors cursor-pointer mr-0.5"
                  >
                    + เพิ่มประเภทเกณฑ์
                  </button>
                </div>
              </div>

              {/* Row 3: ประเภทรถและเงื่อนไขรายประเภท */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-[#1D2939] font-sans flex items-center gap-1.5 select-none">
                    <span>📌 ข้อกำหนดเกณฑ์และอายุใช้งานรายประเภทรถหลัก</span>
                    <span className="text-xs text-slate-400 font-normal font-sans">(เปิด-ปิด และระบุอายุสูงสุดเกณฑ์แต่ละคันได้ทันที)</span>
                  </label>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 border border-emerald-100 rounded-lg">
                    เป้าหมายการจัดหาทดแทนหลัก
                  </span>
                </div>
                
                {/* Direct Card-Based Core Vehicles Grid Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Card 1: รถเครน */}
                  {(() => {
                    const type = "รถเครน (Crane Truck)";
                    const isActive = selectedVehiclesForCrit.includes(type);
                    return (
                      <div className={`relative rounded-2xl border p-4.5 transition-all text-sm flex flex-col gap-3 ${
                        isActive 
                          ? "border-emerald-350 bg-emerald-50/20 shadow-xs" 
                          : "border-slate-200 bg-slate-50/45 opacity-65"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">รถเครน (Crane Truck)</span>
                          <button
                            type="button"
                            onClick={() => toggleVehType(type)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                              isActive 
                                ? "bg-[#D1FADF] text-[#027A48] border border-[#A9F5C5]" 
                                : "bg-white text-slate-500 hover:text-slate-700 border border-slate-250"
                            }`}
                          >
                            {isActive ? "✓ เปิดเกณฑ์" : "+ คลิกเปิด"}
                          </button>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] text-slate-400 font-semibold font-sans">เกณฑ์อายุใช้งานสะสม</span>
                          <div className="flex gap-1.5">
                            <select 
                              value={truckAgeOperator}
                              onChange={e => setTruckAgeOperator(e.target.value)}
                              disabled={!isActive}
                              className="w-[55%] h-8 px-1.5 text-xs bg-white border border-[#D0D5DD] rounded-lg focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 font-sans cursor-pointer font-bold"
                            >
                              <option value="มากกว่า">มากกว่า</option>
                              <option value="น้อยกว่า">น้อยกว่า</option>
                              <option value="ระหว่าง">ระหว่าง</option>
                            </select>
                            <div className="relative flex-1">
                              <input 
                                type="number"
                                value={truckAgeValue}
                                onChange={e => setTruckAgeValue(e.target.value)}
                                disabled={!isActive}
                                className="w-full h-8 px-1.5 text-center text-xs border border-[#D0D5DD] bg-white rounded-lg focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 font-bold text-slate-700 font-sans"
                              />
                              <span className="absolute right-1 text-[#98A2B3] top-1/2 -translate-y-1/2 text-[9px] font-bold">ปี</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 bg-slate-100/50 p-2 rounded-lg leading-relaxed mt-auto font-sans text-center">
                          พิกัดกำหนด: &gt; <strong>{truckAgeValue} ปี</strong>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Card 2: รถกระเช้า */}
                  {(() => {
                    const type = "รถกระเช้า (Bucket Truck)";
                    const isActive = selectedVehiclesForCrit.includes(type);
                    return (
                      <div className={`relative rounded-2xl border p-4.5 transition-all text-sm flex flex-col gap-3 ${
                        isActive 
                          ? "border-emerald-350 bg-emerald-50/20 shadow-xs" 
                          : "border-slate-200 bg-slate-50/45 opacity-65"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">รถกระเช้า (Bucket Truck)</span>
                          <button
                            type="button"
                            onClick={() => toggleVehType(type)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                              isActive 
                                ? "bg-[#D1FADF] text-[#027A48] border border-[#A9F5C5]" 
                                : "bg-white text-slate-500 hover:text-slate-700 border border-slate-250"
                            }`}
                          >
                            {isActive ? "✓ เปิดเกณฑ์" : "+ คลิกเปิด"}
                          </button>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] text-slate-400 font-semibold font-sans">เกลณฑ์อายุใช้งานสะสม</span>
                          <div className="flex flex-col gap-1">
                            <select 
                              value={basketAgeOperator}
                              onChange={e => setBasketAgeOperator(e.target.value)}
                              disabled={!isActive}
                              className="w-full h-8 px-1 text-[11px] bg-white border border-[#D0D5DD] rounded-lg focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 font-sans cursor-pointer font-bold"
                            >
                              <option value="ระหว่าง">ระหว่างช่วงปี</option>
                              <option value="มากกว่า">มากกว่า</option>
                              <option value="น้อยกว่า">น้อยกว่า</option>
                            </select>
                            <div className="flex items-center gap-1 w-full mt-0.5">
                              <input 
                                type="number"
                                value={basketAgeMin}
                                onChange={e => setBasketAgeMin(e.target.value)}
                                disabled={!isActive}
                                className="w-[40%] h-7 text-center text-xs border border-[#D0D5DD] bg-white rounded-lg focus:outline-none disabled:bg-slate-100 font-bold"
                              />
                              <span className="text-gray-400 text-[10px] font-bold font-sans">ถึง</span>
                              <input 
                                type="number"
                                value={basketAgeMax}
                                onChange={e => setBasketAgeMax(e.target.value)}
                                disabled={!isActive}
                                className="w-[40%] h-7 text-center text-xs border border-[#D0D5DD] bg-white rounded-lg focus:outline-none disabled:bg-slate-100 font-bold"
                              />
                              <span className="text-[10px] text-slate-400 font-bold font-sans">ปี</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 bg-slate-100/50 p-2 rounded-lg leading-relaxed mt-auto font-sans text-center">
                          ช่วงพิกัดปลอดภัย: <strong>{basketAgeMin}-{basketAgeMax} ปี</strong>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Card 3: รถตู้โดยสาร */}
                  {(() => {
                    const type = "รถตู้โดยสาร / รถตู้ EV";
                    const isActive = selectedVehiclesForCrit.includes(type);
                    return (
                      <div className={`relative rounded-2xl border p-4.5 transition-all text-sm flex flex-col gap-3 ${
                        isActive 
                          ? "border-emerald-350 bg-emerald-50/20 shadow-xs" 
                          : "border-slate-200 bg-slate-50/45 opacity-65"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">รถตู้โดยสาร / EV</span>
                          <button
                            type="button"
                            onClick={() => toggleVehType(type)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                              isActive 
                                ? "bg-[#D1FADF] text-[#027A48] border border-[#A9F5C5]" 
                                : "bg-white text-slate-500 hover:text-slate-700 border border-slate-250"
                            }`}
                          >
                            {isActive ? "✓ เปิดเกณฑ์" : "+ คลิกเปิด"}
                          </button>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] text-slate-400 font-semibold font-sans">เกลณฑ์อายุสัญญาระหว่างใช้งาน</span>
                          <div className="flex gap-1.5">
                            <select 
                              value={vanAgeOperator}
                              onChange={e => setVanAgeOperator(e.target.value)}
                              disabled={!isActive}
                              className="w-[55%] h-8 px-1.5 text-xs bg-white border border-[#D0D5DD] rounded-lg focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 font-sans cursor-pointer font-bold"
                            >
                              <option value="มากกว่า">มากกว่า</option>
                              <option value="น้อยกว่า">น้อยกว่า</option>
                              <option value="ระหว่าง">ระหว่าง</option>
                            </select>
                            <div className="relative flex-1">
                              <input 
                                type="number"
                                value={vanAgeValue}
                                onChange={e => setVanAgeValue(e.target.value)}
                                disabled={!isActive}
                                className="w-full h-8 px-1.5 text-center text-xs border border-[#D0D5DD] bg-white rounded-lg focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 font-bold text-slate-700"
                              />
                              <span className="absolute right-1 text-[#98A2B3] top-1/2 -translate-y-1/2 text-[9px] font-bold">ปี</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 bg-slate-100/50 p-2 rounded-lg leading-relaxed mt-auto font-sans text-center">
                          รอบทดแทน: <strong>{vanAgeValue} ปี</strong>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Card 4: รถกระบะ 1 ตัน */}
                  {(() => {
                    const type = "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)";
                    const isActive = selectedVehiclesForCrit.includes(type);
                    return (
                      <div className={`relative rounded-2xl border p-4.5 transition-all text-sm flex flex-col gap-3 ${
                        isActive 
                          ? "border-emerald-350 bg-emerald-50/20 shadow-xs" 
                          : "border-slate-200 bg-slate-50/45 opacity-65"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">รถกระบะ 1 ตัน</span>
                          <button
                            type="button"
                            onClick={() => toggleVehType(type)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                              isActive 
                                ? "bg-[#D1FADF] text-[#027A48] border border-[#A9F5C5]" 
                                : "bg-white text-slate-500 hover:text-slate-700 border border-slate-250"
                            }`}
                          >
                            {isActive ? "✓ เปิดเกณฑ์" : "+ คลิกเปิด"}
                          </button>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] text-slate-400 font-semibold font-sans">เกลณฑ์สัญญาสัญญาเช่าประเมิน</span>
                          <div className="flex gap-1.5">
                            <select 
                              value={pickupAgeOperator}
                              onChange={e => setPickupAgeOperator(e.target.value)}
                              disabled={!isActive}
                              className="w-[55%] h-8 px-1.5 text-xs bg-white border border-[#D0D5DD] rounded-lg focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 font-sans cursor-pointer font-bold"
                            >
                              <option value="มากกว่า">มากกว่า</option>
                              <option value="น้อยกว่า">น้อยกว่า</option>
                              <option value="ระหว่าง">ระหว่าง</option>
                            </select>
                            <div className="relative flex-1">
                              <input 
                                type="number"
                                value={pickupAgeValue}
                                onChange={e => setPickupAgeValue(e.target.value)}
                                disabled={!isActive}
                                className="w-full h-8 px-1.5 text-center text-xs border border-[#D0D5DD] bg-white rounded-lg focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 font-bold text-slate-700"
                              />
                              <span className="absolute right-1 text-[#98A2B3] top-1/2 -translate-y-1/2 text-[9px] font-bold">ปี</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 bg-slate-100/50 p-2 rounded-lg leading-relaxed mt-auto font-sans text-center">
                          พิกัดเช่าพิจารณา: <strong>{pickupAgeValue} ปี</strong>
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* Advanced / Niche Vehicle Categories Collapsible Drawer */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs mt-3">
                  <div 
                    onClick={() => setIsVehDropdownOpen(!isVehDropdownOpen)}
                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100/90 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-150"
                  >
                    <div className="flex items-center gap-2">
                      <Settings size={14} className="text-[#344054] animate-spin-hover" />
                      <span className="text-xs font-bold text-slate-700 font-sans select-none">
                        ⚙️ จัดการข้อกำหนดเกณฑ์พิจารณาสำหรับประเภทรถอื่น ๆ ในระบบ ({selectedVehiclesForCrit.filter(v => !["รถเครน (Crane Truck)", "รถกระเช้า (Bucket Truck)", "รถตู้โดยสาร / รถตู้ EV", "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)"].includes(v)).length} ประเภท)
                      </span>
                    </div>
                    <ChevronDown 
                      size={14} 
                      className={`text-[#344054] transition-transform duration-250 ${isVehDropdownOpen ? "rotate-180" : ""}`} 
                    />
                  </div>

                  {isVehDropdownOpen && (
                    <div className="p-4 bg-white flex flex-col gap-4 animate-in fade-in duration-100">
                      <p className="text-xs text-[#475467] font-medium font-sans">
                        คลิกเลือกประเภทรถเฉพาะกิจหลักในการดงหน่วย เพื่อวิเคราะห์ในรายงานตามต้องการ
                      </p>

                      {/* Multi-select triggers */}
                      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg min-h-11">
                        {selectedVehiclesForCrit.filter(v => !["รถเครน (Crane Truck)", "รถกระเช้า (Bucket Truck)", "รถตู้โดยสาร / รถตู้ EV", "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)"].includes(v)).length === 0 ? (
                          <span className="text-xs text-slate-450 italic font-sans pl-1">ไม่มีประเภทรถพิเศษอื่นถูกเปิดใช้งานเกณฑ์แยกย่อย</span>
                        ) : (
                          selectedVehiclesForCrit.filter(v => !["รถเครน (Crane Truck)", "รถกระเช้า (Bucket Truck)", "รถตู้โดยสาร / รถตู้ EV", "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)"].includes(v)).map(v => (
                            <span
                              key={v}
                              onClick={() => toggleVehType(v)}
                              className="inline-flex items-center gap-1.5 bg-[#FFF2E6] text-[#B25900] border border-[#FFD9B3] text-xs font-bold px-2.5 py-1 rounded-lg hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all font-sans cursor-pointer group"
                              title="คลิกเพื่อเอาเกณฑ์ประเภทนี้ออก"
                            >
                              <span>{v}</span>
                              <X size={10} className="text-[#8C4A00] group-hover:text-rose-750 shrink-0" />
                            </span>
                          ))
                        )}
                      </div>

                      {/* Selection buttons of all available types */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          "รถเก๋ง (Sedan) และ รถ SUV",
                          "รถผู้บริหาร",
                          "รถบรรทุก (ขนาด 3 ตัน และ 6 ตันขึ้นไป)",
                          "รถขุดเจาะ (Boring Truck)",
                          "รถแก้กระแสไฟฟ้า Troubleshooting Truck (3 ตัน)",
                          "รถล้างลูกถ้วย",
                          "รถงานร้อน (Hotline)",
                          "รถบรรทุกน้ำ",
                          "รถพ่วง"
                        ].map(typeItem => {
                          const isChosen = selectedVehiclesForCrit.includes(typeItem);
                          return (
                            <button
                              key={typeItem}
                              type="button"
                              onClick={() => toggleVehType(typeItem)}
                              className={`px-3 py-2 text-left text-xs rounded-xl border transition-all font-sans font-semibold flex items-center justify-between cursor-pointer ${
                                isChosen 
                                  ? "bg-amber-50/50 text-amber-900 border-amber-300 shadow-3xs" 
                                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-205"
                              }`}
                            >
                              <span className="truncate pr-1">{typeItem}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-md shrink-0 ${
                                isChosen ? "bg-amber-100 text-amber-900 font-bold" : "bg-slate-100 text-slate-400 font-medium font-sans"
                              }`}>
                                {isChosen ? "เปิดเกณฑ์แล้ว" : "ปิดอยู่"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Criteria Button row */}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => alert("ระบบได้รวบรับประมวลผลรถตามเกณฑ์การคัดสรรใหม่เรียบร้อยแล้ว")}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-md font-sans flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sliders size={13} />
                    ประมวลผลกรองยอดคัดเลือกยานพาหนะตามเงื่อนไขใหม่
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Section: เลือกรถที่ตรงเกณฑ์ */}
          <div className="bg-white border border-[#EAECF0] rounded-2xl p-6.5 text-[#1D2939]">
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F2F4F7] mb-5">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#1D2939] font-sans">เลือกรถที่ตรงเกณฑ์</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#344054] font-sans text-slate-700">
                  เลือกแล้ว {selectedCount}/{fleetList.length} คัน
                </span>
                <span className="px-3 py-1 bg-[#FFF1F0] text-[#D92D20] border border-dashed border-[#FECDCA] rounded-xl text-xs font-semibold font-sans">
                  ⚠ ซ้ำ (0)
                </span>
              </div>
            </div>

            {/* Quick search filters matching visual layout perfectly */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
              <input 
                type="text"
                placeholder="ค้นหาทะเบียน / ตัวถัง..."
                className="h-11 px-3.5 border border-[#D0D5DD] rounded-xl text-sm outline-none bg-white font-sans"
              />
              <select className="h-11 px-3 border border-[#D0D5DD] bg-[#FAFAFA] rounded-xl text-sm text-[#475467] font-sans outline-none cursor-pointer">
                <option>ประเภทรถ</option>
                <option>รถพ่วง</option>
                <option>รถกระเช้า</option>
              </select>
              <select className="h-11 px-3 border border-[#D0D5DD] bg-[#FAFAFA] rounded-xl text-sm text-[#475467] font-sans outline-none cursor-pointer">
                <option>สถานะ</option>
                <option>ใช้งานได้ปกติ</option>
                <option>รอกำจัดจำหน่าย</option>
              </select>
            </div>

            <div className="border border-slate-200 overflow-hidden rounded-2xl shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-medium uppercase tracking-wider">
                    <th className="px-4.5 py-3.5 w-14 text-center">
                      <div className="relative inline-flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={selectedCount === fleetList.length}
                          onChange={(e) => {
                            const val = e.target.checked;
                            if (!val) {
                              alert("ระบุหมายเหตุเกณฑ์การยกเว้นได้โดยนำเครื่องหมายถูกออกรายคันที่ต้องการยกเว้น");
                              return;
                            }
                            setFleetList(fleetList.map(f => ({ ...f, checked: true, remark: "" })));
                          }}
                          className="peer shrink-0 size-5 appearance-none rounded-md border-2 border-slate-300 bg-white checked:bg-[#027A48] checked:border-[#027A48] focus:outline-none focus:ring-1 focus:ring-[#027A48] transition-all cursor-pointer shadow-2xs"
                        />
                        <Check className="absolute size-3 text-white pointer-events-none stroke-[3.5] hidden peer-checked:block" />
                      </div>
                    </th>
                    <th className="px-4.5 py-3.5 font-medium font-sans text-xs tracking-normal text-[#5c687a]">ประเภทรถ / ทะเบียน</th>
                    <th className="px-4.5 py-3.5 font-medium font-sans text-xs tracking-normal text-[#5c687a]">รายละเอียด</th>
                    <th className="px-4.5 py-3.5 font-medium font-sans text-xs tracking-normal text-[#5c687a]">สถานะและเหตุผลเพิ่มเติม</th>
                    <th className="px-4.5 py-3.5 font-medium font-sans text-xs tracking-normal text-right text-[#5c687a]">งบประมาณ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-sm text-[#344054] font-sans">
                  
                  {/* Category Group 1: รถเครน (Crane Truck) */}
                  {selectedVehiclesForCrit.includes("รถเครน (Crane Truck)") && (
                    <>
                      <tr className="bg-slate-50/70 font-medium border-b border-slate-100">
                        <td className="px-4.5 py-3.5 text-center">
                          <div className="relative inline-flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={fleetList.filter(f => f.parentType === "รถเครน (Crane Truck)" && f.checked).length === fleetList.filter(f => f.parentType === "รถเครน (Crane Truck)").length}
                              onChange={(e) => {
                                  const checked = e.target.checked;
                                  if (!checked) {
                                    alert("ระบุหมายเหตุเกณฑ์การยกเว้นได้โดยนำเครื่องหมายถูกออกรายคันที่ต้องการยกเว้น");
                                    return;
                                  }
                                  setFleetList(fleetList.map(f => f.parentType === "รถเครน (Crane Truck)" ? { ...f, checked: true, remark: "" } : f));
                              }}
                              className="peer shrink-0 size-5 appearance-none rounded-md border-2 border-slate-300 bg-white checked:bg-[#027A48] checked:border-[#027A48] focus:outline-none focus:ring-1 focus:ring-[#027A48] transition-all cursor-pointer shadow-2xs"
                            />
                            <Check className="absolute size-3 text-white pointer-events-none stroke-[3.5] hidden peer-checked:block" />
                          </div>
                        </td>
                        <td className="px-4.5 py-3.5 flex items-center gap-2 text-slate-700 font-medium select-none cursor-default">
                          <ChevronDown size={14} className="text-[#027A48] shrink-0 stroke-[2.5]" />
                          <span className="text-sm font-medium">รถเครน (Crane Truck) (อายุ &gt; {truckAgeValue} ปี)</span>
                        </td>
                        <td className="px-4.5 py-3.5">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-xs text-[#475467] rounded-md font-medium">
                            {fleetList.filter(f => f.parentType === "รถเครน (Crane Truck)").length} คัน
                          </span>
                        </td>
                        <td className="px-4.5 py-3.5 text-xs text-slate-500 font-medium italic">
                          รถเครนไฮดรอลิก/รถเฮี๊ยบสำหรับย้ายเสาและหม้อแปลงระบบไฟฟ้าพิกดปลดระวาง
                        </td>
                        <td className="px-4.5 py-3.5 text-right font-medium text-slate-700 font-sans text-sm">
                          {fleetList.filter(f => f.parentType === "รถเครน (Crane Truck)").reduce((s, x) => s + x.budget, 0).toLocaleString()} ฿
                        </td>
                      </tr>

                      {/* Sub rows for รถเครน (Crane Truck) */}
                      {fleetList.filter(f => f.parentType === "รถเครน (Crane Truck)").map(vehicle => {
                        const isRowChecked = vehicle.checked;
                        return (
                          <tr 
                            key={vehicle.id} 
                            className={`transition-all ${isRowChecked ? "hover:bg-[#F4FBF7]/30" : "bg-red-50/15 hover:bg-red-50/30 text-[#98A2B3]"}`}
                          >
                            <td className="px-4.5 py-3 text-center pl-8">
                              <div className="relative inline-flex items-center justify-center">
                                <input 
                                  type="checkbox" 
                                  checked={isRowChecked}
                                  onChange={(e) => {
                                    const val = e.target.checked;
                                    if (!val) {
                                      setVehicleToUncheck({ id: vehicle.id, licence: vehicle.licence, parentType: vehicle.parentType });
                                      setUncheckReasonText("");
                                    } else {
                                      setFleetList(fleetList.map(f => f.id === vehicle.id ? { ...f, checked: true, remark: "" } : f));
                                    }
                                  }}
                                  className="peer shrink-0 size-4.5 appearance-none rounded-md border-2 border-slate-300 bg-white checked:bg-[#027A48] checked:border-[#027A48] focus:outline-none focus:ring-1 focus:ring-[#027A48] transition-all cursor-pointer shadow-3xs"
                                />
                                <Check className="absolute size-2.5 text-white pointer-events-none stroke-[3.5] hidden peer-checked:block" />
                              </div>
                            </td>
                            <td className={`px-4.5 py-3 pl-10 font-medium font-sans text-sm ${isRowChecked ? "text-slate-700" : "text-slate-400 line-through"}`}>
                              {vehicle.licence}
                            </td>
                            <td className={`px-4.5 py-3 font-medium text-xs font-sans ${isRowChecked ? "text-slate-600" : "text-slate-400"}`}>
                              {vehicle.details}
                            </td>
                            <td className="px-4.5 py-3 font-medium font-sans">
                              {!isRowChecked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FEE4E2] text-[#D92D20] border border-[#FECDCA] max-w-[280px] break-words">
                                  ⚠️ สิทธิ์ยกเว้น: {vehicle.remark || "-"}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-[#027A48] font-medium bg-[#ECFDF3] border border-[#ABEFC6] px-2.5 py-1 rounded-lg">
                                  ✓ จัดซื้อทดแทนตามเกณฑ์ กฟภ.
                                </span>
                              )}
                            </td>
                            <td className={`px-4.5 py-3 text-right font-medium text-slate-800 font-sans text-sm ${!isRowChecked ? "line-through text-slate-300" : ""}`}>
                              {vehicle.budget.toLocaleString()} ฿
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}

                  {/* Category Group 2: รถกระเช้า (Bucket Truck) */}
                  {selectedVehiclesForCrit.includes("รถกระเช้า (Bucket Truck)") && (
                    <>
                      <tr className="bg-slate-50/70 font-medium border-b border-slate-100 border-t border-slate-200">
                        <td className="px-4.5 py-3.5 text-center">
                          <div className="relative inline-flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={fleetList.filter(f => f.parentType === "รถกระเช้า (Bucket Truck)" && f.checked).length === fleetList.filter(f => f.parentType === "รถกระเช้า (Bucket Truck)").length}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (!checked) {
                                  alert("ระบุหมายเหตุเกณฑ์การยกเว้นได้โดยนำเครื่องหมายถูกออกรายคันที่ต้องการยกเว้น");
                                  return;
                                }
                                setFleetList(fleetList.map(f => f.parentType === "รถกระเช้า (Bucket Truck)" ? { ...f, checked: true, remark: "" } : f));
                              }}
                              className="peer shrink-0 size-5 appearance-none rounded-md border-2 border-slate-300 bg-white checked:bg-[#027A48] checked:border-[#027A48] focus:outline-none focus:ring-1 focus:ring-[#027A48] transition-all cursor-pointer shadow-2xs"
                            />
                            <Check className="absolute size-3 text-white pointer-events-none stroke-[3.5] hidden peer-checked:block" />
                          </div>
                        </td>
                        <td className="px-4.5 py-3.5 flex items-center gap-2 text-slate-700 font-medium select-none cursor-default">
                          <ChevronDown size={14} className="text-[#027A48] shrink-0 stroke-[2.5]" />
                          <span className="text-sm font-medium">รถกระเช้า (Bucket Truck) (อายุ {basketAgeMin} - {basketAgeMax} ปี)</span>
                        </td>
                        <td className="px-4.5 py-3.5">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-xs text-[#475467] rounded-md font-medium">
                            {fleetList.filter(f => f.parentType === "รถกระเช้า (Bucket Truck)").length} คัน
                          </span>
                        </td>
                        <td className="px-4.5 py-3.5 text-xs text-slate-500 font-medium italic">
                          รถกระเช้าซ่อมแซมระบบไฟฟ้าแรงสูงและแก้ไขไฟดับเร่งด่วน
                        </td>
                        <td className="px-4.5 py-3.5 text-right font-medium text-slate-700 font-sans text-sm">
                          {fleetList.filter(f => f.parentType === "รถกระเช้า (Bucket Truck)").reduce((s, x) => s + x.budget, 0).toLocaleString()} ฿
                        </td>
                      </tr>

                      {/* Sub rows for รถกระเช้า (Bucket Truck) */}
                      {fleetList.filter(f => f.parentType === "รถกระเช้า (Bucket Truck)").map(vehicle => {
                        const isRowChecked = vehicle.checked;
                        return (
                          <tr 
                            key={vehicle.id} 
                            className={`transition-all ${isRowChecked ? "hover:bg-[#F4FBF7]/30" : "bg-red-50/25 hover:bg-red-50/30 text-[#98A2B3]"}`}
                          >
                            <td className="px-4.5 py-3 text-center pl-8">
                              <div className="relative inline-flex items-center justify-center">
                                <input 
                                  type="checkbox" 
                                  checked={isRowChecked}
                                  onChange={(e) => {
                                    const val = e.target.checked;
                                    if (!val) {
                                      setVehicleToUncheck({ id: vehicle.id, licence: vehicle.licence, parentType: vehicle.parentType });
                                      setUncheckReasonText("");
                                    } else {
                                      setFleetList(fleetList.map(f => f.id === vehicle.id ? { ...f, checked: true, remark: "" } : f));
                                    }
                                  }}
                                  className="peer shrink-0 size-4.5 appearance-none rounded border-2 border-slate-300 bg-white checked:bg-[#027A48] checked:border-[#027A48] focus:outline-none focus:ring-1 focus:ring-[#027A48] transition-all cursor-pointer shadow-3xs"
                                />
                                <Check className="absolute size-2.5 text-white pointer-events-none stroke-[3.5] hidden peer-checked:block" />
                              </div>
                            </td>
                            <td className={`px-4.5 py-3 pl-10 font-medium font-sans text-sm ${isRowChecked ? "text-slate-700" : "text-slate-400 line-through"}`}>
                              {vehicle.licence}
                            </td>
                            <td className={`px-4.5 py-3 font-medium text-xs font-sans ${isRowChecked ? "text-slate-600" : "text-slate-400"}`}>
                              {vehicle.details}
                            </td>
                            <td className="px-4.5 py-3 font-medium font-sans">
                              {!isRowChecked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FEE4E2] text-[#D92D20] border border-[#FECDCA] max-w-[280px] break-words">
                                  ⚠️ สิทธิ์ยกเว้น: {vehicle.remark || "-"}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-[#027A48] font-medium bg-[#ECFDF3] border border-[#ABEFC6] px-2.5 py-1 rounded-lg">
                                  ✓ จัดซื้อทดแทนตามเกณฑ์ กฟภ.
                                </span>
                              )}
                            </td>
                            <td className={`px-4.5 py-3 text-right font-medium text-slate-800 font-sans text-sm ${!isRowChecked ? "line-through text-slate-300" : ""}`}>
                              {vehicle.budget.toLocaleString()} ฿
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}

                  {/* Category Group 3: รถตู้โดยสาร / รถตู้ EV */}
                  {selectedVehiclesForCrit.includes("รถตู้โดยสาร / รถตู้ EV") && (
                    <>
                      <tr className="bg-slate-50/70 font-medium border-b border-slate-100 border-t border-slate-200">
                        <td className="px-4.5 py-3.5 text-center">
                          <div className="relative inline-flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={fleetList.filter(f => f.parentType === "รถตู้โดยสาร / รถตู้ EV" && f.checked).length === fleetList.filter(f => f.parentType === "รถตู้โดยสาร / รถตู้ EV").length}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (!checked) {
                                  alert("ระบุหมายเหตุเกณฑ์การยกเว้นได้โดยนำเครื่องหมายถูกออกรายคันที่ต้องการยกเว้น");
                                  return;
                                }
                                setFleetList(fleetList.map(f => f.parentType === "รถตู้โดยสาร / รถตู้ EV" ? { ...f, checked: true, remark: "" } : f));
                              }}
                              className="peer shrink-0 size-5 appearance-none rounded-md border-2 border-slate-300 bg-white checked:bg-[#027A48] checked:border-[#027A48] focus:outline-none focus:ring-1 focus:ring-[#027A48] transition-all cursor-pointer shadow-2xs"
                            />
                            <Check className="absolute size-3 text-white pointer-events-none stroke-[3.5] hidden peer-checked:block" />
                          </div>
                        </td>
                        <td className="px-4.5 py-3.5 flex items-center gap-2 text-slate-700 font-medium select-none cursor-default">
                          <ChevronDown size={14} className="text-[#027A48] shrink-0 stroke-[2.5]" />
                          <span className="text-sm font-medium">รถตู้โดยสาร / รถตู้ EV (อายุ &gt; {vanAgeValue} ปี)</span>
                        </td>
                        <td className="px-4.5 py-3.5">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-xs text-[#475467] rounded-md font-medium">
                            {fleetList.filter(f => f.parentType === "รถตู้โดยสาร / รถตู้ EV").length} คัน
                          </span>
                        </td>
                        <td className="px-4.5 py-3.5 text-xs text-slate-500 font-medium italic">
                          รถตู้โดยสารประจำกลุ่มงานฝ่ายบริหารกึ่งการไฟฟ้าส่วนภูมิภาค
                        </td>
                        <td className="px-4.5 py-3.5 text-right font-medium text-slate-700 font-sans text-sm">
                          {fleetList.filter(f => f.parentType === "รถตู้โดยสาร / รถตู้ EV").reduce((s, x) => s + x.budget, 0).toLocaleString()} ฿
                        </td>
                      </tr>

                      {/* Sub rows for รถตู้โดยสาร / รถตู้ EV */}
                      {fleetList.filter(f => f.parentType === "รถตู้โดยสาร / รถตู้ EV").map(vehicle => {
                        const isRowChecked = vehicle.checked;
                        return (
                          <tr 
                            key={vehicle.id} 
                            className={`transition-all ${isRowChecked ? "hover:bg-[#F4FBF7]/30" : "bg-red-50/15 hover:bg-red-50/30 text-[#98A2B3]"}`}
                          >
                            <td className="px-4.5 py-3 text-center pl-8">
                              <div className="relative inline-flex items-center justify-center">
                                <input 
                                  type="checkbox" 
                                  checked={isRowChecked}
                                  onChange={(e) => {
                                    const val = e.target.checked;
                                    if (!val) {
                                      setVehicleToUncheck({ id: vehicle.id, licence: vehicle.licence, parentType: vehicle.parentType });
                                      setUncheckReasonText("");
                                    } else {
                                      setFleetList(fleetList.map(f => f.id === vehicle.id ? { ...f, checked: true, remark: "" } : f));
                                    }
                                  }}
                                  className="peer shrink-0 size-4.5 appearance-none rounded border-2 border-slate-300 bg-white checked:bg-[#027A48] checked:border-[#027A48] focus:outline-none focus:ring-1 focus:ring-[#027A48] transition-all cursor-pointer shadow-3xs"
                                />
                                <Check className="absolute size-2.5 text-white pointer-events-none stroke-[3.5] hidden peer-checked:block" />
                              </div>
                            </td>
                            <td className={`px-4.5 py-3 pl-10 font-medium font-sans text-sm ${isRowChecked ? "text-slate-700" : "text-slate-400 line-through"}`}>
                              {vehicle.licence}
                            </td>
                            <td className={`px-4.5 py-3 font-medium text-xs font-sans ${isRowChecked ? "text-slate-600" : "text-slate-400"}`}>
                              {vehicle.details}
                            </td>
                            <td className="px-4.5 py-3 font-medium font-sans">
                              {!isRowChecked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FEE4E2] text-[#D92D20] border border-[#FECDCA] max-w-[280px] break-words">
                                  ⚠️ สิทธิ์ยกเว้น: {vehicle.remark || "-"}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-[#027A48] font-medium bg-[#ECFDF3] border border-[#ABEFC6] px-2.5 py-1 rounded-lg">
                                  ✓ จัดซื้อทดแทนตามเกณฑ์ กฟภ.
                                </span>
                              )}
                            </td>
                            <td className={`px-4.5 py-3 text-right font-medium text-slate-800 font-sans text-sm ${!isRowChecked ? "line-through text-slate-300" : ""}`}>
                              {vehicle.budget.toLocaleString()} ฿
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}

                  {/* Category Group 4: รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน) */}
                  {selectedVehiclesForCrit.includes("รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)") && (
                    <>
                      <tr className="bg-slate-50/70 font-medium border-b border-slate-100 border-t border-slate-200">
                        <td className="px-4.5 py-3.5 text-center">
                          <div className="relative inline-flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={fleetList.filter(f => f.parentType === "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)" && f.checked).length === fleetList.filter(f => f.parentType === "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)").length}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (!checked) {
                                  alert("ระบุหมายเหตุเกณฑ์การยกเว้นได้โดยนำเครื่องหมายถูกออกรายคันที่ต้องการยกเว้น");
                                  return;
                                }
                                setFleetList(fleetList.map(f => f.parentType === "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)" ? { ...f, checked: true, remark: "" } : f));
                              }}
                              className="peer shrink-0 size-5 appearance-none rounded-md border-2 border-slate-300 bg-white checked:bg-[#027A48] checked:border-[#027A48] focus:outline-none focus:ring-1 focus:ring-[#027A48] transition-all cursor-pointer shadow-2xs"
                            />
                            <Check className="absolute size-3 text-white pointer-events-none stroke-[3.5] hidden peer-checked:block" />
                          </div>
                        </td>
                        <td className="px-4.5 py-3.5 flex items-center gap-2 text-slate-700 font-medium select-none cursor-default">
                          <ChevronDown size={14} className="text-[#027A48] shrink-0 stroke-[2.5]" />
                          <span className="text-sm font-medium">รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน) (อายุ &gt; {pickupAgeValue} ปี)</span>
                        </td>
                        <td className="px-4.5 py-3.5">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-xs text-[#475467] rounded-md font-medium">
                            {fleetList.filter(f => f.parentType === "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)").length} คัน
                          </span>
                        </td>
                        <td className="px-4.5 py-3.5 text-xs text-slate-500 font-medium italic">
                          รถกระบะอเนกประสงค์ขนาด 1 ตัน สำหรับทีมแก้ไขไฟฟ้าขัดข้องและช่างเทคนิค
                        </td>
                        <td className="px-4.5 py-3.5 text-right font-medium text-slate-700 font-sans text-sm">
                          {fleetList.filter(f => f.parentType === "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)").reduce((s, x) => s + x.budget, 0).toLocaleString()} ฿
                        </td>
                      </tr>

                      {/* Sub rows for รถกระบะ 1 ตัน */}
                      {fleetList.filter(f => f.parentType === "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)").map(vehicle => {
                        const isRowChecked = vehicle.checked;
                        return (
                          <tr 
                            key={vehicle.id} 
                            className={`transition-all ${isRowChecked ? "hover:bg-[#F4FBF7]/30" : "bg-red-50/15 hover:bg-red-50/30 text-[#98A2B3]"}`}
                          >
                            <td className="px-4.5 py-3 text-center pl-8">
                              <div className="relative inline-flex items-center justify-center">
                                <input 
                                  type="checkbox" 
                                  checked={isRowChecked}
                                  onChange={(e) => {
                                    const val = e.target.checked;
                                    if (!val) {
                                      setVehicleToUncheck({ id: vehicle.id, licence: vehicle.licence, parentType: vehicle.parentType });
                                      setUncheckReasonText("");
                                    } else {
                                      setFleetList(fleetList.map(f => f.id === vehicle.id ? { ...f, checked: true, remark: "" } : f));
                                    }
                                  }}
                                  className="peer shrink-0 size-4.5 appearance-none rounded border-2 border-slate-300 bg-white checked:bg-[#027A48] checked:border-[#027A48] focus:outline-none focus:ring-1 focus:ring-[#027A48] transition-all cursor-pointer shadow-3xs"
                                />
                                <Check className="absolute size-2.5 text-white pointer-events-none stroke-[3.5] hidden peer-checked:block" />
                              </div>
                            </td>
                            <td className={`px-4.5 py-3 pl-10 font-medium font-sans text-sm ${isRowChecked ? "text-slate-700" : "text-slate-400 line-through"}`}>
                              {vehicle.licence}
                            </td>
                            <td className={`px-4.5 py-3 font-medium text-xs font-sans ${isRowChecked ? "text-slate-600" : "text-slate-400"}`}>
                              {vehicle.details}
                            </td>
                            <td className="px-4.5 py-3 font-medium font-sans">
                              {!isRowChecked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FEE4E2] text-[#D92D20] border border-[#FECDCA] max-w-[280px] break-words">
                                  ⚠️ สิทธิ์ยกเว้น: {vehicle.remark || "-"}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-[#027A48] font-medium bg-[#ECFDF3] border border-[#ABEFC6] px-2.5 py-1 rounded-lg">
                                  ✓ จัดซื้อทดแทนตามเกณฑ์ กฟภ.
                                </span>
                              )}
                            </td>
                            <td className={`px-4.5 py-3 text-right font-medium text-slate-800 font-sans text-sm ${!isRowChecked ? "line-through text-slate-300" : ""}`}>
                              {vehicle.budget.toLocaleString()} ฿
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}

                  {/* Manual add-ons or other groups */}
                  {fleetList.filter(f => f.parentType !== "รถเครน (Crane Truck)" && f.parentType !== "รถกระเช้า (Bucket Truck)" && f.parentType !== "รถตู้โดยสาร / รถตู้ EV" && f.parentType !== "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)").length > 0 && (
                    <>
                      <tr className="bg-slate-50/70 font-medium border-b border-slate-100 border-t border-slate-200">
                        <td className="px-4.5 py-3.5 text-center">
                          <div className="relative inline-flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={fleetList.filter(f => f.parentType !== "รถเครน (Crane Truck)" && f.parentType !== "รถกระเช้า (Bucket Truck)" && f.parentType !== "รถตู้โดยสาร / รถตู้ EV" && f.parentType !== "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)" && f.checked).length === fleetList.filter(f => f.parentType !== "รถเครน (Crane Truck)" && f.parentType !== "รถกระเช้า (Bucket Truck)" && f.parentType !== "รถตู้โดยสาร / รถตู้ EV" && f.parentType !== "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)").length}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (!checked) {
                                  alert("ระบุหมายเหตุเกณฑ์การยกเว้นได้โดยนำเครื่องหมายถูกออกรายคันที่ต้องการยกเว้น");
                                  return;
                                }
                                setFleetList(fleetList.map(f => (f.parentType !== "รถเครน (Crane Truck)" && f.parentType !== "รถกระเช้า (Bucket Truck)" && f.parentType !== "รถตู้โดยสาร / รถตู้ EV" && f.parentType !== "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)") ? { ...f, checked: true, remark: "" } : f));
                              }}
                              className="peer shrink-0 size-5 appearance-none rounded-md border-2 border-slate-300 bg-white checked:bg-[#027A48] checked:border-[#027A48] focus:outline-none focus:ring-1 focus:ring-[#027A48] transition-all cursor-pointer shadow-2xs"
                            />
                            <Check className="absolute size-3 text-white pointer-events-none stroke-[3.5] hidden peer-checked:block" />
                          </div>
                        </td>
                        <td className="px-4.5 py-3.5 flex items-center gap-2 text-slate-700 font-medium select-none cursor-default">
                          <ChevronDown size={14} className="text-[#027A48] shrink-0 stroke-[2.5]" />
                          <span className="text-sm font-medium">รถพิจารณาเติมนอกเกณฑ์อัตโนมัติ</span>
                        </td>
                        <td className="px-4.5 py-3.5">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-xs text-[#475467] rounded-md font-medium">
                            {fleetList.filter(f => f.parentType !== "รถเครน (Crane Truck)" && f.parentType !== "รถกระเช้า (Bucket Truck)" && f.parentType !== "รถตู้โดยสาร / รถตู้ EV" && f.parentType !== "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)").length} คัน
                          </span>
                        </td>
                        <td className="px-4.5 py-3.5 text-xs text-slate-500 font-medium italic">
                          รถนอกเกณฑ์อายุที่พิจารณาความจำนงแนบตรวจสอบความจำเป็นพิเศษรายคัน
                        </td>
                        <td className="px-4.5 py-3.5 text-right font-medium text-slate-700 font-sans text-sm">
                          {fleetList.filter(f => f.parentType !== "รถเครน (Crane Truck)" && f.parentType !== "รถกระเช้า (Bucket Truck)" && f.parentType !== "รถตู้โดยสาร / รถตู้ EV" && f.parentType !== "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)").reduce((s, x) => s + x.budget, 0).toLocaleString()} ฿
                        </td>
                      </tr>

                      {fleetList.filter(f => f.parentType !== "รถเครน (Crane Truck)" && f.parentType !== "รถกระเช้า (Bucket Truck)" && f.parentType !== "รถตู้โดยสาร / รถตู้ EV" && f.parentType !== "รถกระบะ 1 ตัน (ตอนเดียว / ครึ่ง / 2 ตอน)").map(vehicle => {
                        const isRowChecked = vehicle.checked;
                        return (
                          <tr 
                            key={vehicle.id} 
                            className={`transition-all ${isRowChecked ? "hover:bg-[#F4FBF7]/30" : "bg-red-50/15 hover:bg-red-50/30 text-[#98A2B3]"}`}
                          >
                            <td className="px-4.5 py-3 text-center pl-8">
                              <div className="relative inline-flex items-center justify-center">
                                <input 
                                  type="checkbox" 
                                  checked={isRowChecked}
                                  onChange={(e) => {
                                    const val = e.target.checked;
                                    if (!val) {
                                      setVehicleToUncheck({ id: vehicle.id, licence: vehicle.licence, parentType: vehicle.parentType });
                                      setUncheckReasonText("");
                                    } else {
                                      setFleetList(fleetList.map(f => f.id === vehicle.id ? { ...f, checked: true, remark: "" } : f));
                                    }
                                  }}
                                  className="peer shrink-0 size-4.5 appearance-none rounded-md border-2 border-slate-300 bg-white checked:bg-[#027A48] checked:border-[#027A48] focus:outline-none focus:ring-1 focus:ring-[#027A48] transition-all cursor-pointer shadow-3xs"
                                />
                                <Check className="absolute size-2.5 text-white pointer-events-none stroke-[3.5] hidden peer-checked:block" />
                              </div>
                            </td>
                            <td className={`px-4.5 py-3 pl-10 font-medium font-sans text-sm ${isRowChecked ? "text-slate-700" : "text-slate-400 line-through"}`}>
                              {vehicle.licence}
                            </td>
                            <td className={`px-4.5 py-3 font-medium text-xs font-sans ${isRowChecked ? "text-slate-600" : "text-slate-400"}`}>
                              {vehicle.details}
                            </td>
                            <td className="px-4.5 py-3 font-medium font-sans">
                              {!isRowChecked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FEE4E2] text-[#D92D20] border border-[#FECDCA] max-w-[280px] break-words">
                                  ⚠️ สิทธิ์ยกเว้น: {vehicle.remark || "-"}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-[#027A48] font-medium bg-[#ECFDF3] border border-[#ABEFC6] px-2.5 py-1 rounded-lg">
                                  ✓ จัดซื้อทดแทนตามเกณฑ์ กฟภ.
                                </span>
                              )}
                            </td>
                            <td className={`px-4.5 py-3 text-right font-medium text-slate-800 font-sans text-sm ${!isRowChecked ? "line-through text-slate-300" : ""}`}>
                              {vehicle.budget.toLocaleString()} ฿
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}

                  {/* Summary dynamic green row strictly matching mockup */}
                  <tr className="bg-[#ECFDF3]/80 text-[#027A48] font-medium border-t border-[#ABEFC6]">
                    <td className="px-4.5 py-3.5"></td>
                    <td className="px-4.5 py-3.5 text-sm font-medium font-sans">รวมที่เลือก ({selectedCount} คัน)</td>
                    <td className="px-4.5 py-3.5"></td>
                    <td className="px-4.5 py-3.5 text-xs font-normal text-right text-[#027A48]/90 font-sans">
                      รวมฐานพาหนะที่ร่วมแผนจัดทุนทั้งหมด
                    </td>
                    <td className="px-4.5 py-3.5 text-right text-sm font-semibold font-sans text-[#027A48]">
                      {totalBudgetVal.toLocaleString()} ฿
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
               {/* Sub-section: เพิ่มสมทบยานพาหนะรายคัน (Integrated seamlessly inside the same panel) */}
          <div className="mt-8 pt-7 border-t border-[#EAECF0]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
              <h3 className="text-sm font-bold text-[#1D2939] font-sans flex items-center gap-1.5">
                ➕ เพิ่มสมทบยานพาหนะรายคัน (นอกเหนือจากเกณฑ์ประเมินอัตโนมัติ)
              </h3>
            </div>
            <p className="text-xs text-[#667085] mb-5 font-normal font-sans leading-relaxed">
              สำหรับรถที่ไม่เข้าเกณฑ์ตามอายุใช้งานปกติ (เช่น คันเกิดเหตุความเสี่ยงสูง, สภาพทรุดโทรมเด่นชัด, ชำรุดพิกัดถดถอย) กรุณาค้นหาเพื่อตรวจสอบประวัติจากบัญชีทะเบียนรถเพื่อยืนยันจัดส่งเข้าร่วม
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left query control block */}
              <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-2.5">
                <label className="text-xs font-bold text-[#344054] font-sans font-sans">หมายเลขทะเบียนรถหลัก</label>
                <div className="relative flex gap-2 h-11">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 font-sans">
                    <Search size={16} />
                  </div>
                  <input 
                    type="text"
                    placeholder="ระบุเลขทะเบียนที่ต้องการตรวจสอบ (เช่น กธ-8821)"
                    value={manualLicenceInput}
                    onChange={e => {
                      setManualLicenceInput(e.target.value);
                      setSearchError(null);
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearchVehicle();
                      }
                    }}
                    className="w-full pl-9 pr-3 border border-[#D0D5DD] rounded-xl text-sm bg-white text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-[#027A48] font-sans font-medium hover:border-[#98A2B3] focus:border-[#027A48] transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleSearchVehicle}
                    disabled={isSearchingVehicle}
                    className="px-5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all font-sans flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isSearchingVehicle ? (
                      <RotateCcw className="animate-spin size-3.5" />
                    ) : (
                      <Search size={14} />
                    )}
                    ค้นหาทะเบียน
                  </button>
                </div>
                <span className="text-[11px] text-[#667085] font-normal leading-relaxed font-sans font-sans">
                  * ค้นด้วยทะเบียนต้นแบบทดลอง กธ-8821 หรือ ทะเบียนอื่นๆ ในสารระบบยานพาหนะ
                </span>

                {/* Search Error State */}
                {searchError && (
                  <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] text-xs text-[#B42318] rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5 font-sans" />
                    <span className="font-semibold leading-normal font-sans">{searchError}</span>
                  </div>
                )}
              </div>

              {/* Right result/review details block */}
              <div className="lg:col-span-12 xl:col-span-7">
                {isSearchingVehicle && (
                  <div className="border border-dashed border-[#EAECF0] rounded-xl p-6 text-center bg-gray-50/50 flex flex-col items-center justify-center gap-3 animate-pulse h-[178px] font-sans">
                    <div className="p-2.5 bg-slate-100 rounded-full font-sans">
                      <RotateCcw className="animate-spin size-5 text-[#344054]" />
                    </div>
                    <div className="flex flex-col gap-1.5 font-sans">
                      <div className="h-4 w-32 bg-slate-200 rounded-md mx-auto" />
                      <div className="h-3 w-48 bg-slate-100 rounded-md mx-auto" />
                    </div>
                  </div>
                )}

                {!isSearchingVehicle && !searchedVehicle && !searchError && (
                  <div className="border border-dashed border-[#EAECF0] rounded-xl p-6 text-center bg-gray-50/40 text-gray-400 flex flex-col items-center justify-center gap-2.5 h-[178px] font-sans">
                    <FileSearch className="text-[#98A2B3] stroke-[1.5]" size={36} />
                    <p className="text-xs font-medium text-[#475467] font-sans">
                      ระบบสแตนด์บายพิจารณารถรายทะเบียนวิเคราะห์จัดคัดสมทบ
                    </p>
                    <p className="text-[11px] text-[#98A2B3] font-sans px-4">
                      ป้อนระบุป้ายทะเบียนและคลิกค้นหา เพื่อนำสเปกและวงเงินจัดหามาตรวจเช็คก่อนกดยืนยันเข้าร่วมแผนสลับสับเปลี่ยน
                    </p>
                  </div>
                )}

                {!isSearchingVehicle && searchedVehicle && (
                  <div className="border border-emerald-100 bg-[#EEFDF4]/45 rounded-xl p-5 flex flex-col gap-3 animate-in zoom-in-95 duration-200 font-sans shadow-xs">
                    
                    {/* Header Spec found */}
                    <div className="flex items-center justify-between border-b border-[#E8F7EE] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-[#E8F7EE] text-[#027A48] border border-[#ABEFC6] text-xs font-bold px-2.5 py-1 rounded-lg">
                          {searchedVehicle.licence}
                        </span>
                        <span className="text-xs bg-slate-100 text-[#344054] border border-[#E4E7EC] font-semibold px-2 py-0.5 rounded-md">
                          {searchedVehicle.parentType}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#027A48] font-bold flex items-center gap-1">
                        <Check size={11} className="stroke-[3]" /> ประวัติผ่านระบบคัดหาข้อมูลเรียบร้อย
                      </span>
                    </div>

                    {/* Specifications detail rows */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white border border-slate-100 p-2.5 rounded-lg flex flex-col gap-0.5 shadow-2xs">
                        <span className="text-[10px] text-gray-400 font-semibold font-sans">อายุการสะสมใช้งาน</span>
                        <span className="text-xs font-bold text-slate-800 font-sans">{searchedVehicle.age} ปี</span>
                      </div>
                      <div className="bg-white border border-slate-100 p-2.5 rounded-lg flex flex-col gap-0.5 shadow-2xs">
                        <span className="text-[10px] text-gray-400 font-semibold font-sans font-sans">ค่าระดับความเสื่อม (Grade)</span>
                        <span className="text-xs font-bold text-slate-800 font-sans">{searchedVehicle.condition} / 5.0</span>
                      </div>
                      <div className="bg-white border border-slate-100 p-2.5 rounded-lg flex flex-col gap-0.5 shadow-2xs">
                        <span className="text-[10px] text-gray-400 font-semibold font-sans font-sans">วงเงินจัดหา</span>
                        <span className="text-xs font-bold text-[#027A48] font-sans">{(searchedVehicle.budget / 1000000).toFixed(2)}M ฿</span>
                      </div>
                    </div>

                    {/* Secondary system remarks block */}
                    <div className="text-[11px] text-gray-500 font-medium py-1 px-2.5 bg-slate-50 rounded-lg flex items-center justify-between font-sans">
                      <span>🔧 ประวัติการซ่อมบำรุงสะสมในระบบ: <strong className="text-[#344054]">{searchedVehicle.repairCount} ครั้ง</strong></span>
                      <span className="text-amber-600 font-bold">อัตราสึกหรอสูง (แนะนำเปลี่ยนทดแทนโดยเร็ว)</span>
                    </div>

                    {/* Actions bar for confirmation */}
                    <div className="mt-1.5 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchedVehicle(null);
                          setManualLicenceInput("");
                        }}
                        className="px-3.5 py-1.5 text-xs text-[#475467] hover:text-red-650 bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-200 font-bold rounded-lg transition-all cursor-pointer font-sans"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmAddManualVeh}
                        className="px-4 py-1.5 text-xs bg-[#027A48] hover:bg-[#026038] text-white border border-[#027A48] font-bold rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer shadow-3xs"
                      >
                        <Plus size={12} />
                        ยืนยันนำเข้ารายการพร้อมจัดงบคันนี้
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* Alert duplicate box at the bottom matching mockup */}
            <div className="mt-5 p-4 bg-[#F8FAFC] border border-slate-205 rounded-xl">
              <div className="text-[12px] text-[#475467] font-semibold font-sans flex items-center gap-1.5 leading-normal">
                <ShieldAlert size={15} className="text-[#64748B] shrink-0" />
                ระบบตรวจประเมินคุมซ้ำฉับพลัน: ทุกครั้งที่คุณตรวจสอบและสับเปลี่ยน ข้อมูลจะถูกเชื่อมคำนวณและปัดประวัติซ้ำโดยสิ้นเชิง
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: เพิ่มรายคัน */}
          <div className="bg-white border border-[#EAECF0] rounded-2xl p-6.5">
            <h3 className="text-base font-bold text-[#1D2939] mb-1 font-sans flex items-center gap-1.5">
              ③ เพิ่มสมทบยานพาหนะรายคัน
            </h3>
            <p className="text-xs text-[#667085] mb-5 font-normal font-sans">
              สำหรับรถที่ไม่เข้าเกณฑ์อัตโนมัติ (เช่น คันเกิดเหตุความเสี่ยงสูง, สภาพทรุดโทรมเฉียบพลัน) กรุณาค้นหาเพื่อตรวจสอบประวัติจากบัญชีทะเบียนรถก่อนจัดส่งเข้าร่วม
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left query control block */}
              <div className="lg:col-span-5 flex flex-col gap-2.5">
                <label className="text-xs font-bold text-[#344054] font-sans">หมายเลขทะเบียนรถ</label>
                <div className="relative flex gap-2 h-11">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={16} />
                  </div>
                  <input 
                    type="text"
                    placeholder="ระบุเลขทะเบียนที่ต้องการตรวจสอบ (เช่น กธ-1234)"
                    value={manualLicenceInput}
                    onChange={e => {
                      setManualLicenceInput(e.target.value);
                      setSearchError(null);
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearchVehicle();
                      }
                    }}
                    className="w-full pl-9 pr-3 border border-[#D0D5DD] rounded-xl text-sm bg-white text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleSearchVehicle}
                    disabled={isSearchingVehicle}
                    className="px-5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all font-sans flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isSearchingVehicle ? (
                      <RotateCcw className="animate-spin size-3.5" />
                    ) : (
                      <Search size={14} />
                    )}
                    ค้นหา
                  </button>
                </div>
                <span className="text-[11px] text-[#667085] font-normal leading-relaxed">
                  * กรอกเฉพาะส่วนทะเบียนที่มีในระบบ หรือ กด Enter เพื่อส่งคำสั่งค้นหา
                </span>

                {/* Search Error State */}
                {searchError && (
                  <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] text-xs text-[#B42318] rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                    <span className="font-semibold leading-normal">{searchError}</span>
                  </div>
                )}
              </div>

              {/* Right result/review details block */}
              <div className="lg:col-span-7">
                {isSearchingVehicle && (
                  <div className="border border-dashed border-[#EAECF0] rounded-xl p-6 text-center bg-gray-50/50 flex flex-col items-center justify-center gap-3 animate-pulse h-[178px]">
                    <div className="p-2.5 bg-slate-100 rounded-full">
                      <RotateCcw className="animate-spin size-5 text-[#344054]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="h-4 w-32 bg-slate-200 rounded-md mx-auto" />
                      <div className="h-3 w-48 bg-slate-100 rounded-md mx-auto" />
                    </div>
                  </div>
                )}

                {!isSearchingVehicle && !searchedVehicle && !searchError && (
                  <div className="border border-dashed border-[#EAECF0] rounded-xl p-6 text-center bg-gray-50/40 text-gray-400 flex flex-col items-center justify-center gap-2.5 h-[178px]">
                    <FileSearch className="text-[#98A2B3] stroke-[1.5]" size={36} />
                    <p className="text-xs font-medium text-[#475467] font-sans">
                      รอดำเนินการค้นหาเพื่อแสดงรายละเอียดทะเบียนพาหนะ
                    </p>
                    <p className="text-[11px] text-[#98A2B3] font-sans">
                      ป้อนระบุแผ่นป้ายหมายเลขทะเบียนรถและคลิกค้นหา เพื่อนำประวัติมาสอบทานก่อนยืนยันสมทบในตารางแผนงาน ตัวอย่าง: "กธ-8821"
                    </p>
                  </div>
                )}

                {!isSearchingVehicle && searchedVehicle && (
                  <div className="border border-green-100 bg-[#F4FBF7]/50 rounded-xl p-5 flex flex-col gap-3 animate-in zoom-in-95 duration-200 shadow-xs">
                    
                    {/* Header Spec found */}
                    <div className="flex items-center justify-between border-b border-[#E8F7EE] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-[#E8F7EE] text-[#027A48] border border-[#ABEFC6] text-xs font-bold px-2.5 py-1 rounded-lg">
                          {searchedVehicle.licence}
                        </span>
                        <span className="text-xs bg-slate-100 text-[#344054] border border-[#E4E7EC] font-semibold px-2 py-0.5 rounded-md">
                          {searchedVehicle.parentType}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#027A48] font-bold flex items-center gap-1 bg-[#EEFDF4] px-2 py-0.5 rounded">
                        <Check size={11} /> ทะเบียนรถตรงในฐานข้อมูลกองการยานคลัง
                      </span>
                    </div>

                    {/* Specifications detail rows */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/80 border border-slate-50 p-2.5 rounded-lg flex flex-col gap-0.5 shadow-2xs">
                        <span className="text-[10px] text-gray-400 font-semibold">อายุการสะสมใช้งาน</span>
                        <span className="text-xs font-bold text-slate-800 font-sans">{searchedVehicle.age} ปี</span>
                      </div>
                      <div className="bg-white/80 border border-slate-50 p-2.5 rounded-lg flex flex-col gap-0.5 shadow-2xs">
                        <span className="text-[10px] text-gray-400 font-semibold">ค่าระดับความเสื่อม (Grade)</span>
                        <span className="text-xs font-bold text-slate-800 font-sans">{searchedVehicle.condition} / 5.0</span>
                      </div>
                      <div className="bg-white/80 border border-slate-50 p-2.5 rounded-lg flex flex-col gap-0.5 shadow-2xs">
                        <span className="text-[10px] text-gray-400 font-semibold">วงเงินงบจัดหาสมทบ</span>
                        <span className="text-xs font-bold text-[#027A48] font-sans">{(searchedVehicle.budget / 1000000).toFixed(2)}M ฿</span>
                      </div>
                    </div>

                    {/* Secondary system remarks block */}
                    <div className="text-[11px] text-gray-500 font-medium py-1 px-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                      <span>🔧 ประวัติการซ่อมบำรุงสะสมในระบบ: <strong className="text-[#344054]">{searchedVehicle.repairCount} ครั้ง</strong></span>
                      <span className="text-amber-600 font-bold">อัตราความเสี่ยงปานกลาง</span>
                    </div>

                    {/* Actions bar for confirmation */}
                    <div className="mt-1.5 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchedVehicle(null);
                          setManualLicenceInput("");
                        }}
                        className="px-3.5 py-1.5 text-xs text-[#475467] hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 font-bold rounded-lg transition-all cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmAddManualVeh}
                        className="px-4 py-1.5 text-xs bg-[#027A48] hover:bg-[#026038] text-white border border-[#027A48] font-bold rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Plus size={12} />
                        ยืนยันนำเข้ารายการจัดหา
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* Alert duplicate box at the bottom matching mockup */}
            <div className="mt-5 p-4 bg-[#FFF1F0] border border-dashed border-[#FECDCA] rounded-xl">
              <div className="text-[13px] text-[#D92D20] font-medium font-sans flex items-center gap-1.5">
                <ShieldAlert size={15} />
                ระบบตรวจซ้ำอัตโนมัติ: ตัวกรองแบบละเอียดพร้อมทำงาน ตรวจพบซ้ำซ้อน 0 คัน ไม่พบคันที่ชนเกณฑ์ซ้ำซาก
              </div>
            </div>

          </div>

          {/* Bottom Bar Buttons */}
          <div className="flex items-center justify-between border-t border-[#EAECF0] pt-6 mt-4 pb-6">
            <button
              type="button"
              onClick={() => setDraftWizardStep("form")}
              className="px-5 py-3 border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] text-[#344054] font-semibold text-sm rounded-xl transition-all font-sans"
            >
              ย้อนกลับ
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCriteriaSaveDraft}
                className="px-5 py-3 border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] text-[#344054] font-semibold text-sm rounded-xl transition-all font-sans"
              >
                บันทึกแบบร่าง
              </button>
              <button
                type="button"
                onClick={handleCriteriaSubmitPlan}
                className="px-6 py-3 bg-[#027A48] hover:bg-[#02663c] text-white font-semibold text-sm rounded-xl shadow-xs transition-all font-sans cursor-pointer"
              >
                ส่งเข้าแผน
              </button>
            </div>
          </div>

          {/* MODAL OVERLAY FOR UNCHECK EXPLANATION */}
          {vehicleToUncheck && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
              <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-150">
                
                {/* Modal Header */}
                <div className="px-6 py-4.5 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <ShieldAlert className="text-amber-500 animate-pulse" size={18} />
                    ระบุหมายเหตุเกณฑ์การยกเว้นจัดหาแทน คัน {vehicleToUncheck.licence}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setVehicleToUncheck(null)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 flex flex-col gap-4">
                  
                  {/* Selected Vehicle Info */}
                  <div className="p-3.5 bg-amber-50/50 border border-amber-100/75 rounded-xl text-xs md:text-sm text-slate-700">
                    <div className="grid grid-cols-2 gap-y-1.5 font-medium">
                      <div><span className="text-gray-500 font-normal">ประเภทรถ:</span> <span className="font-bold text-slate-900">{vehicleToUncheck.parentType}</span></div>
                      <div><span className="text-gray-500 font-normal">หมายเลขทะเบียน:</span> <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[#334155] font-bold">{vehicleToUncheck.licence}</span></div>
                    </div>
                  </div>

                  {/* Premade Preset Quick Reasons */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#475467]">เลือกเหตุผลประกอบเพิ่มเติม (คลิกเลือกใช้งานทันที):</label>
                    <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {[
                        "สภาพรถจริงยังใช้งานได้สมบูรณ์มาก ฝ่ายซ่อมบำรุงวิเคราะห์ควรเลื่อนทดแทนออกไป 1 - 2 ปี",
                        "มีแผนสลับปรับเปลี่ยนไปใช้ประโยชน์สายย่อยพิเศษแทน ไม่จำเป็นต้องของบรถกลุ่มรถพ่วงนี้",
                        "รถเกิดอุบัติเหตุรุนแรงเตรียมจัดหาเครื่องทดแทนกรณีเร่งด่วนอื่น ไม่อยู่ในแผนทั่วไปชุดนี้",
                        "จำนวนการใช้งานจริงสะสมต่ำกว่าเกณฑ์การวิเคราะห์ค่าเสื่อมโดยภาพรวมสถิติทรัพย์สิน",
                      ].map((reason, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setUncheckReasonText(reason)}
                          className="w-full text-left px-3 py-2 text-xs border border-gray-100 hover:border-green-100 bg-slate-50 hover:bg-green-50/50 text-[#344054] hover:text-[#027A48] rounded-xl transition-all font-medium text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer hover:shadow-xs"
                        >
                          💡 {reason}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Area for manual entry */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#475467]">ระบุสาเหตุ / ความจำเป็นเชิงอุบัติภัยหรือปรับปรุงแผน (บังคับกรอก) *</label>
                    <textarea
                      rows={3}
                      placeholder="กรุณาระบุรายละเอียดให้ครบถ้วนเพื่อใช้อ้างอิงการจัดทำเอกสารงบการจัดหากลุ่มยานพาหนะ..."
                      value={uncheckReasonText}
                      onChange={(e) => setUncheckReasonText(e.target.value)}
                      className="w-full p-3 border border-[#D0D5DD] bg-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                    />
                  </div>

                </div>

                {/* Modal Actions Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setVehicleToUncheck(null)}
                    className="px-4 py-2 border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] text-[#344054] text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    ยกเลิก (ยังไม่นำออก)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!uncheckReasonText.trim()) {
                        alert("กรุณากรอกระบุเหตุผลในการไม่จัดซื้อยานพาหนะคันนี้ในหมายเหตุก่อนส่งข้ามเกณฑ์");
                        return;
                      }
                      setFleetList(fleetList.map(f => f.id === vehicleToUncheck.id ? { ...f, checked: false, remark: uncheckReasonText.trim() } : f));
                      setVehicleToUncheck(null);
                    }}
                    className="px-4.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    ยืนยันการนำออกและบันทึกหมายเหตุ
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      );
    }

    const selectedTemp = pastTemplates[selectedTemplateIndex];
    return (
      <div className="flex flex-col gap-6 p-8 min-h-screen bg-slate-50 text-slate-800">
        {/* Breadcrumb path matching SA design */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>ระบบ VMS</span>
          <ChevronRight size={10} className="text-slate-400" />
          <span>สร้างแผน</span>
          <ChevronRight size={10} className="text-slate-400" />
          <span className="text-slate-900 font-medium bg-slate-200/60 px-2 py-0.5 rounded">V1: แบบร่าง</span>
        </div>

        {/* Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium text-slate-900 tracking-tight font-sans">สร้างแผนจัดซื้อจัดจ้าง</h1>
            <p className="text-xs text-slate-500 mt-1 font-light">กำหนดขั้นตอน ข้อมูล และรายละเอียดงบประมาณประจำรอบปีเพื่อส่งรายงานอนุมัติ</p>
          </div>
          <button 
            type="button"
            onClick={() => setIsCreatingNewDraft(false)}
            className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-medium rounded-xl transition-colors shrink-0"
          >
            ย้อนกลับไปตารางแผน
          </button>
        </div>

        {/* Success toast dynamic banner */}
        {prefilledMessage && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500 rounded-r-xl text-xs flex justify-between items-center transition-all animate-pulse">
            <span className="font-medium flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-600 inline-block shrink-0" />
              {prefilledMessage}
            </span>
            <button onClick={() => setPrefilledMessage(null)} className="text-emerald-500 hover:text-emerald-800 font-medium px-2">✕</button>
          </div>
        )}

        {/* Main Columns Container matching Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: INPUT FORM (7 columns) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 p-4 shrink-0 flex justify-between items-center">
              <span className="text-xs font-medium text-slate-600 block">1. กรอกรายละเอียดและงบประมาณแบบร่าง</span>
              <span className="text-[10px] text-slate-400 font-mono">ID: AUTO_GENERATED</span>
            </div>

            <form onSubmit={handleSaveDraftFromSA} className="p-6 flex flex-col gap-5">
              
              {/* Toggle Purchase/Rent buttons */}
              <div className="flex flex-col gap-1.5">
                <label className="text-base font-semibold text-[#475467] leading-6 break-words font-sans">ประเภทข้อเสนอจัดหา *</label>
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl max-w-xs">
                  <button
                    type="button"
                    onClick={() => setDraftMode("purchase")}
                    className={`py-2 text-base font-semibold rounded-lg transition-all text-center ${
                      draftMode === "purchase" 
                        ? "bg-white text-slate-900 shadow-sm font-semibold" 
                        : "text-slate-500 hover:text-slate-800 font-normal"
                    }`}
                  >
                    จัดซื้อ
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftMode("rent")}
                    className={`py-2 text-base font-semibold rounded-lg transition-all text-center ${
                      draftMode === "rent" 
                        ? "bg-white text-slate-900 shadow-sm font-semibold" 
                        : "text-slate-500 hover:text-slate-800 font-normal"
                    }`}
                  >
                    เช่า
                  </button>
                </div>
              </div>

              {/* Plan Name */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-base font-semibold text-[#475467] leading-6 break-words font-sans">ชื่อแผนงาน *</label>
                  <span className="text-base font-normal text-[#98A2B3] leading-6 break-words font-sans">จำเป็น</span>
                </div>
                <input 
                  type="text"
                  value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  placeholder="ระบุชื่อแผนสนับสนุนประจำปี..."
                  className="px-3.5 py-2.5 h-11 bg-white border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl text-base font-normal text-slate-900 placeholder-[#98A2B3] outline-none leading-6 font-sans"
                  required
                />
              </div>

              {/* Procurement Category dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-base font-semibold text-[#475467] leading-6 break-words font-sans">ประเภทการจัดหา *</label>
                <select
                  value={draftCategory}
                  onChange={e => setDraftCategory(e.target.value)}
                  className="px-3.5 py-2 h-11 bg-white border border-slate-200 focus:border-slate-400 rounded-xl text-base font-normal text-slate-900 outline-none leading-6 font-sans cursor-pointer"
                >
                  <option value="รถทดแทน">รถทดแทน</option>
                  <option value="รถเพิ่มเติม">รถเพิ่มเติม</option>
                  <option value="รถเพิ่มเติม (ตามโควตาพื้นฐาน)">รถเพิ่มเติม (ตามโควตาพื้นฐาน)</option>
                  <option value="รถเพิ่มเติมกรณีพิเศษ">รถเพิ่มเติมกรณีพิเศษ</option>
                </select>
              </div>

              {/* Start year & End year Grid row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-base font-semibold text-[#475467] leading-6 break-words font-sans">ปีงบประมาณ เริ่มต้น *</label>
                  <select
                    value={draftStartYear}
                    onChange={e => setDraftStartYear(e.target.value)}
                    className="px-3.5 py-2 h-11 bg-white border border-slate-200 focus:border-slate-400 rounded-xl text-base font-normal text-slate-900 outline-none leading-6 font-sans cursor-pointer"
                  >
                    <option value="2569">2569</option>
                    <option value="2570">2570</option>
                    <option value="2571">2571</option>
                    <option value="2572">2572</option>
                    <option value="2573">2573</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-base font-semibold text-[#475467] leading-6 break-words font-sans">ปีงบประมาณ สิ้นสุด *</label>
                  <select
                    value={draftEndYear}
                    onChange={e => setDraftEndYear(e.target.value)}
                    className="px-3.5 py-2 h-11 bg-white border border-slate-200 focus:border-slate-400 rounded-xl text-base font-normal text-slate-900 outline-none leading-6 font-sans cursor-pointer"
                  >
                    <option value="2569">2569</option>
                    <option value="2570">2570</option>
                    <option value="2571">2571</option>
                    <option value="2572">2572</option>
                    <option value="2573">2573</option>
                  </select>
                </div>
              </div>

              {/* Plan Creation date and Budget Grid row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-base font-semibold text-[#475467] leading-6 break-words font-sans">วันที่จัดทำแผน</label>
                  <div className="relative">
                    <input 
                      type="date"
                      value={draftDate}
                      onChange={e => setDraftDate(e.target.value)}
                      className="w-full px-3.5 h-11 text-base border border-slate-200 focus:border-slate-400 rounded-xl outline-none font-normal text-slate-900 font-sans"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-base font-semibold text-[#475467] leading-6 break-words font-sans">วงเงินงบประมาณรวม (โดยประมาณ)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={draftBudget}
                      onChange={e => setDraftBudget(e.target.value)}
                      placeholder="0.00"
                      className="w-full pr-12 pl-3.5 h-11 text-base border border-slate-200 focus:border-slate-400 rounded-xl outline-none font-normal text-slate-900 placeholder-[#98A2B3] font-sans"
                    />
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 text-base text-[#475467] font-semibold font-sans">บาท</div>
                  </div>
                </div>
              </div>

              {/* Remarks/Objective */}
              <div className="flex flex-col gap-1.5">
                <label className="text-base font-semibold text-[#475467] leading-6 break-words font-sans">หมายเหตุ / วัตถุประสงค์</label>
                <textarea
                  value={draftRemarks}
                  onChange={e => setDraftRemarks(e.target.value)}
                  placeholder="ระบุข้อแนะนำ เหตุผล ความเหมาะสมเบื้องต้น..."
                  rows={2}
                  className="px-3.5 py-2.5 text-base border border-slate-200 focus:border-slate-400 rounded-xl outline-none resize-none text-slate-900 placeholder-[#98A2B3] font-normal font-sans"
                />
              </div>

              {/* Criteria Section inside border styled precisely like image */}
              <div className="flex flex-col gap-2 p-5 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 mt-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-semibold text-[#475467] leading-6 break-words font-sans">กำหนดเกณฑ์มาตรฐาน (VMS Criteria)</h4>
                    <p className="text-base font-normal text-[#98A2B3] leading-6 break-words font-sans">เพิ่มเกณฑ์พิจารณาเพื่อใช้กลั่นกรองสิทธิ์รถยนต์ชำรุดทดแทน</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddCriteria(!showAddCriteria)}
                    className="flex items-center gap-1.5 px-4.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-all font-sans"
                  >
                    <Plus size={12} />
                    เพิ่มเกณฑ์กำหนด
                  </button>
                </div>

                {/* Sub form to add items in-place */}
                {showAddCriteria && (
                  <div className="flex items-center gap-2 mt-2 p-3 bg-white rounded-xl border border-slate-200">
                    <input 
                      value={newCriteriaText}
                      onChange={e => setNewCriteriaText(e.target.value)}
                      placeholder="เช่น ข้อมูลเลขไมล์สะสมล่าสุดเกิน 200,000 กม."
                      className="flex-1 px-3.5 py-2.5 h-11 text-base bg-white border border-slate-200 outline-none rounded-xl text-slate-900 placeholder-[#98A2B3] font-normal font-sans"
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddNewCriterion())}
                    />
                    <button 
                      type="button" 
                      onClick={handleAddNewCriterion}
                      className="px-4.5 py-2.5 h-11 bg-emerald-600 text-white text-base font-medium rounded-xl hover:bg-emerald-700 font-sans flex items-center justify-center whitespace-nowrap"
                    >
                      ยืนยัน
                    </button>
                  </div>
                )}

                {/* Criteria List */}
                <div className="flex flex-col gap-2 mt-3 text-base">
                  {draftCriteria.map((crit, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-3xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="size-1.5 rounded-full bg-slate-500 shrink-0" />
                        <span className="font-normal text-slate-800 font-sans">{crit}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCriterion(idx)}
                        className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {draftCriteria.length === 0 && (
                    <div className="text-center py-4 text-base text-[#98A2B3] font-normal font-sans">ยังไม่ได้กำหนดเกณฑ์พิเศษเพิ่มเติม</div>
                  )}
                </div>
              </div>

              {/* Bottom footer button bar */}
              <div className="flex items-center justify-between border-t border-slate-100 mt-4 pt-4.5">
                <button
                  type="button"
                  onClick={() => setIsCreatingNewDraft(false)}
                  className="px-5 py-2.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-medium rounded-xl transition-all"
                >
                  ยกเลิก
                </button>

                <div className="flex gap-2 font-sans">
                  <button
                    type="button"
                    onClick={handleSaveDraftFromSA}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium rounded-xl transition-all"
                  >
                    บันทึกแบบร่าง (ออก)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!draftName.trim()) {
                        alert("กรุณาระบุชื่อแผนงานหลัก");
                        return;
                      }
                      setDraftWizardStep("criteria");
                    }}
                    className="px-5 py-2.5 bg-[#027A48] hover:bg-[#02663c] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    ขั้นตอนถัดไป (กำหนดเกณฑ์ทดแทน) →
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* RIGHT PANEL: SELECTED BASELINE TEMPLATES & DETAILS SIDEBAR (4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6 font-sans">
            
            {/* Template select selection panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
              <div>
                <h3 className="text-base font-medium text-slate-800 tracking-normal font-sans">เลือกจากแผนซื้อที่เคยอนุมัติ</h3>
                <p className="text-sm text-[#98A2B3] font-light tracking-normal mt-1 font-sans">คลิกเพื่อนำค่าหรือเกณฑ์จากแผนในอดีตมาเสมือนเป็นต้นแบบ</p>
              </div>

              <div className="flex flex-col gap-2.5">
                {pastTemplates.map((temp, index) => {
                  const isSel = selectedTemplateIndex === index;
                  return (
                    <div
                      key={temp.id}
                      onClick={() => setSelectedTemplateIndex(index)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                        isSel 
                          ? "border-slate-800 bg-slate-50/70 shadow-3xs" 
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-base font-medium tracking-normal font-sans ${isSel ? "text-slate-950" : "text-slate-700"}`}>
                          {temp.name}
                        </p>
                        {isSel && <div className="size-1.5 rounded-full bg-slate-800 mt-1.5" />}
                      </div>
                      <div className="flex justify-between items-center text-sm text-[#98A2B3] font-normal mt-1.5 tracking-normal font-sans">
                        <span className="font-light">วงเงิน {temp.budget.toLocaleString()} บาท</span>
                        <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded text-xs">อนุมัติแล้ว</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic summary card for selected baseline template */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4.5">
              <h3 className="text-base font-medium text-slate-800 tracking-normal font-sans">สรุปข้อมูลแผนที่เลือก</h3>
              
              <div className="flex flex-col gap-3.5 font-normal text-sm text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-100 tracking-normal font-sans">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[#98A2B3] font-light shrink-0">ชื่อแผน</span>
                  <span className="text-right text-slate-900 font-medium text-sm">{selectedTemp.name}</span>
                </div>
                <hr className="border-slate-100/70" />
                <div className="flex justify-between">
                  <span className="text-[#98A2B3] font-light">ประเภทการจัดหา</span>
                  <span className="text-slate-900 font-medium">{selectedTemp.procurementType === "purchase" ? "จัดซื้อยานพาหนะ" : "เช่ายานพาหนะ"}</span>
                </div>
                <hr className="border-slate-100/70" />
                <div className="flex justify-between">
                  <span className="text-[#98A2B3] font-light">ปีงบประมาณ</span>
                  <span className="text-slate-900 font-medium font-sans">{selectedTemp.fiscalYear}</span>
                </div>
                <hr className="border-slate-100/70" />
                <div className="flex justify-between">
                  <span className="text-[#98A2B3] font-light">วงเงินรวม</span>
                  <span className="text-slate-950 font-medium text-sm">{selectedTemp.budget.toLocaleString()} บาท</span>
                </div>
                <hr className="border-slate-100/70" />
                <div className="flex justify-between items-center">
                  <span className="text-[#98A2B3] font-light">สถานะ</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-medium text-xs rounded-full">
                    อนุมัติแล้ว
                  </span>
                </div>
              </div>

              {/* Action prefill confirmation button configured cleanly */}
              <button
                type="button"
                onClick={useTemplatePreset}
                className="w-full py-2.5 bg-white border border-slate-800 text-slate-900 hover:bg-slate-50 text-base font-medium rounded-xl transition-all shadow-3xs flex items-center justify-center gap-1.5 tracking-normal font-sans"
              >
                <FileText size={16} />
                ใช้ข้อมูลนี้เป็นต้นแบบ
              </button>

            </div>

          </div>

        </div>
      </div>
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 text-white hover:bg-slate-700 transition-colors"
        >
          <Plus size={14} /> สร้างแผนจัดหารถใหม่
        </button>
      </div>

      {/* Main Table View */}
      <div className="border border-[#EAECF0] bg-white overflow-hidden">
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
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          title="ดูรายละเอียดแผน"
                          onClick={() => handleOpenDetail(r)}
                          className="text-[#475467] hover:text-[#1D2939] transition-colors p-1"
                        >
                          <FileSearch size={18} />
                        </button>
                        <button 
                          title="แก้ไขแผนจัดหา"
                          onClick={() => handleOpenEdit(r)}
                          className="text-[#475467] hover:text-[#1570EF] transition-colors p-1"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          title="ลบแผนจัดหา"
                          onClick={() => handleDelete(r.id)}
                          className="text-[#475467] hover:text-[#D92D20] transition-colors p-1"
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
              className="p-2.5 border border-[#D0D5DD] rounded-l-xl text-[#667085] bg-[#FFFFFF] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed h-11 w-11 flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            {/* Page 1 (Active) */}
            <button className="px-4.5 py-2 border-t border-b border-[#D0D5DD] text-sm font-semibold text-[#1D2939] bg-[#F2F4F7] h-11 flex items-center justify-center font-sans">
              1
            </button>
            {/* Next icon button */}
            <button 
              disabled
              className="p-2.5 border border-[#D0D5DD] rounded-r-xl text-[#667085] bg-[#FFFFFF] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed h-11 w-11 flex items-center justify-center -ml-[1px]"
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
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-medium hover:bg-slate-700"
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
                className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-medium hover:bg-slate-700"
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
