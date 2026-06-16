import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, Filter, ChevronRight, FileText, Clock, CheckCircle2, 
  RotateCcw, Eye, Trash2, Plus, X, BarChart3, TrendingUp, 
  Check, ShieldAlert, FileSpreadsheet, Building2, Calendar,
  ChevronDown, ChevronLeft, FileSearch, Settings, Sliders, AlertTriangle
} from "lucide-react";

interface ProcurementPlan {
  id: string;
  name: string;
  fiscalYear: string;
  procurementType: "purchase" | "rent";
  version: string;
  department: string;
  status: "draft" | "pending" | "approved" | "rejected";
  progress: number;
  totalVehicles: number;
  totalBudget: number;
  createdDate: string;
  remarks: string;
}

interface CreateProcurementPlanWizardProps {
  plans: ProcurementPlan[];
  setPlans: React.Dispatch<React.SetStateAction<ProcurementPlan[]>>;
  setIsCreatingNewDraft: (v: boolean) => void;
  draftWizardStep: "form" | "criteria";
  setDraftWizardStep: (v: "form" | "criteria") => void;
  draftName: string;
  setDraftName: (v: string) => void;
  draftStartYear: string;
  setDraftStartYear: (v: string) => void;
  draftEndYear: string;
  setDraftEndYear: (v: string) => void;
  draftRemarks: string;
  setDraftRemarks: (v: string) => void;
  draftCategory: string;
  setDraftCategory: (v: string) => void;
  draftDate: string;
  setDraftDate: (v: string) => void;
  draftBudget: string;
  setDraftBudget: (v: string) => void;
  draftMode: "purchase" | "rent";
  setDraftMode: (v: "purchase" | "rent") => void;
  pastTemplates: Array<{
    id: string;
    name: string;
    procurementType: "purchase" | "rent";
    fiscalYear: string;
    budget: number;
    status: string;
    category: string;
    remarks: string;
    criteria: string[];
  }>;
}

export default function CreateProcurementPlanWizard({
  plans,
  setPlans,
  setIsCreatingNewDraft,
  draftWizardStep,
  setDraftWizardStep,
  draftName,
  setDraftName,
  draftStartYear,
  setDraftStartYear,
  draftEndYear,
  setDraftEndYear,
  draftRemarks,
  setDraftRemarks,
  draftCategory,
  setDraftCategory,
  draftDate,
  setDraftDate,
  draftBudget,
  setDraftBudget,
  draftMode,
  setDraftMode,
  pastTemplates
}: CreateProcurementPlanWizardProps) {
  // New States for Step 1 & Step 2 visual items
  const [usePastPlan, setUsePastPlan] = useState(false);
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState<number>(0);
  const [infoToast, setInfoToast] = useState<string | null>(null);

  // Step 1: Types selected (can select multiple in checkbox as requested)
  const [purchaseSelected, setPurchaseSelected] = useState(true);
  const [rentSelected, setRentSelected] = useState(true);

  // Step 2 subcategory toggles
  const [purchaseSubCategories, setPurchaseSubCategories] = useState<{ [key: string]: boolean }>({
    "ซื้อทดแทน": true,
    "ซื้อเพิ่มเติม": false,
    "ซื้อเพิ่มเติมโควตาพิเศษ": false
  });
  const [rentSubCategories, setRentSubCategories] = useState<{ [key: string]: boolean }>({
    "เช่าระยะสั้น": true,
    "เช่าระยะยาว": false,
    "เช่าแบบมีสิทธิ์ซื้อ": false
  });

  // VMS Criteria State & Controls Model
  const [activeCriteria, setActiveCriteria] = useState<string[]>(["อายุรถ", "สภาพรถ"]);
  const [vmsMatchMode, setVmsMatchMode] = useState<"AND" | "OR">("AND");

  // State variables for unchecking/excluding confirmation
  const [pendingUncheckId, setPendingUncheckId] = useState<string | null>(null);
  const [uncheckPresetReason, setUncheckPresetReason] = useState<string>("งบประมาณประจำส่วนไม่เพียงพอ");
  const [uncheckCustomReason, setUncheckCustomReason] = useState<string>("");

  const [activeVehicleTypes, setActiveVehicleTypes] = useState<string[]>([
    "รถยนต์นั่ง",
    "รถกระบะ",
    "รถตู้โดยสาร (12-15 ที่นั่ง)"
  ]);

  const [criteriaSettings, setCriteriaSettings] = useState<{
    [vehicleType: string]: {
      age: string;
      condition: string;
      repairFreq: string;
      odometer: string;
    }
  }>({
    "รถยนต์นั่ง": { age: "12", condition: "เสื่อมสภาพ", repairFreq: "สูง", odometer: "200000" },
    "รถกระบะ": { age: "12", condition: "เสื่อมสภาพ", repairFreq: "สูง", odometer: "200000" },
    "รถตู้โดยสาร (12-15 ที่นั่ง)": { age: "10", condition: "ชำรุด", repairFreq: "ปานกลาง", odometer: "150000" },
    "รถบรรทุก": { age: "15", condition: "เสื่อมสภาพ", repairFreq: "สูง", odometer: "250000" },
    "รถโดยสารพิเศษ": { age: "15", condition: "ชำรุด", repairFreq: "สูง", odometer: "300000" },
  });

  const [searchVehQuery, setSearchVehQuery] = useState("");
  const [vehCurrentPage, setVehCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Procurement Plan Version History & Target Recovery Rollback State
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [snapshotNameInput, setSnapshotNameInput] = useState<string>("");
  const [savedVersions, setSavedVersions] = useState<Array<{
    version: number;
    timestamp: string;
    name: string;
    description: string;
    allocatedCount: number;
    excludedCount: number;
    excludedVehicles: Array<{ id: string; licence: string; type: string; reason: string }>;
  }>>([
    {
      version: 1,
      timestamp: "2026-06-16 09:12:05",
      name: "เวอร์ชัน 1 (ข้อมูลตั้งต้นแผนจัดหาประจำปี)",
      description: "ข้อมูลริเริ่มจากการดึงฐานข้อมูลจัดจ่ายปกติ (มีข้อมูลพัสดุครบถ้วน)",
      allocatedCount: 24,
      excludedCount: 0,
      excludedVehicles: []
    },
    {
      version: 2,
      timestamp: "2026-06-16 09:30:15",
      name: "เวอร์ชัน 2 (ประหยัดค่าใช้จ่ายช่วงไตรมาสแรก)",
      description: "มีการตัดยอดงบประมาณและยกเว้นยานพาหนะซ่อมต่อเอง 2 คันเพื่อปันงบคงเหลือ",
      allocatedCount: 22,
      excludedCount: 2,
      excludedVehicles: [
        { id: "v-2", licence: "งข-3382 กรุงเทพฯ", type: "รถกระบะ", reason: "งบประมาณประจำส่วนไม่เพียงพอจัดสรรในปีนี้" },
        { id: "v-18", licence: "นค-5208 เชียงราย", type: "รถตู้โดยสาร (12-15 ที่นั่ง)", reason: "ฝ่ายธุรการประเมินแล้วยังคงซ่อมแซมต่อเองได้ตามแผน" }
      ]
    },
    {
      version: 3,
      timestamp: "2026-06-16 09:44:22",
      name: "เวอร์ชัน 3 (ปรับปรุงแผนช่วงครึ่งปีหลัง)",
      description: "คัดกรองรถออกจากโครงการจัดเสนอจัดจ่ายเพิ่มเติมอีก 3 คันตามพารามิเตอร์ VMS ความคุ้มทุน",
      allocatedCount: 19,
      excludedCount: 5,
      excludedVehicles: [
        { id: "v-2", licence: "งข-3382 กรุงเทพฯ", type: "รถกระบะ", reason: "งบประมาณประจำส่วนไม่เพียงพอจัดสรรในปีนี้" },
        { id: "v-18", licence: "นค-5208 เชียงราย", type: "รถตู้โดยสาร (12-15 ที่นั่ง)", reason: "ฝ่ายธุรการประเมินแล้วยังคงซ่อมแซมต่อเองได้ตามแผน" },
        { id: "v-7", licence: "นค-1822 นนทบุรี", type: "รถตู้โดยสาร (12-15 ที่นั่ง)", reason: "ถอดเพื่อนำหน้าที่ดังกล่าวไปใช้โครงการตู้โดยสารเช่ากองกลางแทน" },
        { id: "v-12", licence: "นค-5202 นครปฐม", type: "รถกระบะ", reason: "มีรถยนต์ทดสอบใช้งานหมุนเวียนเพียงพอแล้ว" },
        { id: "v-15", licence: "นค-5205 สงขลา", type: "รถโดยสารพิเศษ", reason: "มีรถยนต์ทดสอบใช้งานหมุนเวียนเพียงพอแล้ว" }
      ]
    }
  ]);

  const handleSaveCurrentSnapshot = (customName?: string) => {
    const currentExclusions = vehicles
      .filter(v => !v.checked)
      .map(v => ({
        id: v.id,
        licence: v.licence,
        type: v.type,
        reason: v.exclusionReason || "ยกเว้นโดยดุลยพินิจฝ่ายธุรการ"
      }));
    const nextVer = Math.max(...savedVersions.map(s => s.version), 0) + 1;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newSnap = {
      version: nextVer,
      timestamp: formattedDate,
      name: customName?.trim() || `เวอร์ชัน ${nextVer} (ตรวจทานสถานะแก้ไข ณ ขณะทำงาน)`,
      description: `สแนปช็อตรุ่นแผนจัดหารวมจากการทำงานหลัก (${vehicles.filter(v => v.checked).length} จัดหา / ${currentExclusions.length} คัดออก)`,
      allocatedCount: vehicles.filter(v => v.checked).length,
      excludedCount: currentExclusions.length,
      excludedVehicles: currentExclusions
    };

    setSavedVersions(prev => [...prev, newSnap]);
    setSnapshotNameInput("");
    setInfoToast(`บันทึก Snapshot รุ่นที่ ${nextVer} เรียบร้อยแล้ว สามารถนำไปเปรียบเทียบกู้คืนข้อมูลได้ทันที`);
    setTimeout(() => setInfoToast(null), 3000);
  };

  const handleRestoreVehicle = (vehId: string, licenceNo: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehId) {
        return {
          ...v,
          checked: true,
          exclusionReason: undefined
        };
      }
      return v;
    }));
    setInfoToast(`ดึงยานพาหนะทะเบียน "${licenceNo}" กลับคืนเข้ามายังสถานะหลัก (Version ปัจจุบัน) เรียบร้อย`);
    setTimeout(() => setInfoToast(null), 3500);
  };

  const handleRestoreAllFromVersion = (verId: number) => {
    const ver = savedVersions.find(s => s.version === verId);
    if (!ver || ver.excludedVehicles.length === 0) return;
    
    const idsToRestore = ver.excludedVehicles.map(x => x.id);
    setVehicles(prev => prev.map(v => {
      if (idsToRestore.includes(v.id)) {
        return {
          ...v,
          checked: true,
          exclusionReason: undefined
        };
      }
      return v;
    }));
    setInfoToast(`กู้คืนรถยนต์คัดออกทั้งหมด (${ver.excludedVehicles.length} คัน) ของเวอร์ชัน ${verId} เรียบร้อย`);
    setTimeout(() => setInfoToast(null), 3500);
  };

  // Realistic Master database of 40 vehicles with rich structural telemetry fields
  const initialVehicles = useMemo(() => [
    { id: "v-1", licence: "งน-1024 เชียงใหม่", type: "รถยนต์นั่ง", age: 18, condition: "ชำรุดมาก", repairFreq: "สูง", odometer: 245000, department: "ฝบท. กองบำรุงรักษา", price: 1400000, checked: true },
    { id: "v-2", licence: "งข-3382 กรุงเทพฯ", type: "รถกระบะ", age: 17, condition: "ชำรุด", repairFreq: "สูง", odometer: 210000, department: "สายงาน (ต)", price: 950000, checked: true },
    { id: "v-3", licence: "นค-4401 ภูเก็ต", type: "รถตู้โดยสาร (12-15 ที่นั่ง)", age: 12, condition: "ชำรุด", repairFreq: "ปานกลาง", odometer: 185000, department: "ฝบต. กองกลาง", price: 1200000, checked: true },
    { id: "v-4", licence: "ษห-9905 ชลบุรี", type: "รถบรรทุก", age: 16, condition: "เสื่อมสภาพ", repairFreq: "สูง", odometer: 280050, department: "ผวก. สำนักงานใหญ่", price: 3200000, checked: true },
    { id: "v-5", licence: "งน-4412 เชียงใหม่", type: "รถยนต์นั่ง", age: 11, condition: "ปกติ", repairFreq: "ปกติ", odometer: 115000, department: "ฝบท. กองบำรุงรักษา", price: 1400000, checked: true },
    { id: "v-6", licence: "งก-2019 สระบุรี", type: "รถกระบะ", age: 15, condition: "เสื่อมสภาพ", repairFreq: "ปานกลาง", odometer: 195000, department: "สายงาน (ต)", price: 950000, checked: true },
    { id: "v-7", licence: "นค-1822 นนทบุรี", type: "รถตู้โดยสาร (12-15 ที่นั่ง)", age: 10, condition: "ชำรุด", repairFreq: "สูง", odometer: 162000, department: "ฝบต. กองกลาง", price: 1200000, checked: true },
    { id: "v-8", licence: "จร-4081 อยุธยา", type: "รถโดยสารพิเศษ", age: 15, condition: "ชำรุด", repairFreq: "สูง", odometer: 320000, department: "ฝ่ายฝึกอบรม", price: 4500000, checked: true },
    { id: "v-9", licence: "งน-3051 เชียงใหม่", type: "รถยนต์นั่ง", age: 17, condition: "เสื่อมสภาพ", repairFreq: "ปานกลาง", odometer: 180000, department: "ผวก. สำนักงานใหญ่", price: 1400000, checked: true },
    { id: "v-10", licence: "งข-8841 กรุงเทพฯ", type: "รถกระบะ", age: 12, condition: "ชำรุด", repairFreq: "สูง", odometer: 201000, department: "สายงาน (ต)", price: 950000, checked: true },
    { id: "v-11", licence: "นค-5201 นครปฐม", type: "รถยนต์นั่ง", age: 15, condition: "เสื่อมสภาพ", repairFreq: "สูง", odometer: 220000, department: "ฝ่ายตรวจสอบ", price: 1500000, checked: true },
    { id: "v-12", licence: "นค-5202 นครปฐม", type: "รถกระบะ", age: 14, condition: "ชำรุด", repairFreq: "ปานกลาง", odometer: 198000, department: "เขตการบิน 2", price: 980000, checked: true },
    { id: "v-13", licence: "นค-5203 นนทบุรี", type: "รถตู้โดยสาร (12-15 ที่นั่ง)", age: 9, condition: "ปกติ", repairFreq: "ปกติ", odometer: 125000, department: "ฝบท. กองคลัง", price: 1150000, checked: true },
    { id: "v-14", licence: "นค-5204 ชลบุรี", type: "รถบรรทุก", age: 12, condition: "ปกติ", repairFreq: "ปกติ", odometer: 140000, department: "กองซ่อมเครื่องจักร", price: 3100000, checked: true },
    { id: "v-15", licence: "นค-5205 สงขลา", type: "รถโดยสารพิเศษ", age: 14, condition: "เสื่อมสภาพ", repairFreq: "สูง", odometer: 295000, department: "ฝ่ายบริการท่าอากาศ", price: 4600000, checked: true },
    { id: "v-16", licence: "นค-5206 สุราษฎร์ฯ", type: "รถยนต์นั่ง", age: 13, condition: "ชำรุด", repairFreq: "สูง", odometer: 190000, department: "กองประสานงาน", price: 1450000, checked: true },
    { id: "v-17", licence: "นค-5207 ขอนแก่น", type: "รถกระบะ", age: 12, condition: "เสื่อมสภาพ", repairFreq: "สูง", odometer: 215000, department: "สายงาน (ต)", price: 950000, checked: true },
    { id: "v-18", licence: "นค-5208 เชียงราย", type: "รถตู้โดยสาร (12-15 ที่นั่ง)", age: 12, condition: "ชำรุด", repairFreq: "สูง", odometer: 175000, department: "สโมสรพนักงาน", price: 1250000, checked: true },
    { id: "v-19", licence: "ชร-8101 เชียงราย", type: "รถบรรทุก", age: 18, condition: "ชำรุด", repairFreq: "สูง", odometer: 320000, department: "งานโยธาบำรุง", price: 3300000, checked: true },
    { id: "v-20", licence: "ชร-8102 นราธิวาส", type: "รถยนต์นั่ง", age: 16, condition: "เสื่อมสภาพ", repairFreq: "ปานกลาง", odometer: 231000, department: "ฝ่ายธุรการ", price: 1380000, checked: true },
    { id: "v-101", licence: "กม-1234 น่าน", type: "รถยนต์นั่ง", age: 8, condition: "ปกติ", repairFreq: "ปกติ", odometer: 95000, department: "กองพัฒนาธุรกิจ", price: 1250000, checked: true },
    { id: "v-102", licence: "ตร-5544 ตรัง", type: "รถกระบะ", age: 6, condition: "ปกติ", repairFreq: "ปกติ", odometer: 72000, department: "สายงาน (ต)", price: 920000, checked: true },
    { id: "v-103", licence: "มค-2231 สารคาม", type: "รถตู้โดยสาร (12-15 ที่นั่ง)", age: 5, condition: "ปกติ", repairFreq: "ปกติ", odometer: 63000, department: "กองกลาง", price: 1100000, checked: true },
    { id: "v-21", licence: "ชร-8103 เชียงราย", type: "รถกระบะ", age: 16, condition: "เสื่อมสภาพ", repairFreq: "ปานกลาง", odometer: 201000, department: "งานช่างเทคนิค", price: 920000, checked: true },
    { id: "v-22", licence: "ชร-8104 สมุทรปราการ", type: "รถตู้โดยสาร (12-15 ที่นั่ง)", age: 11, condition: "ชำรุด", repairFreq: "สูง", odometer: 168000, department: "กองสวัสดิการ", price: 1200000, checked: true },
    { id: "v-23", licence: "ชร-8105 นนทบุรี", type: "รถโดยสารพิเศษ", age: 16, condition: "ชำรุดมาก", repairFreq: "สูง", odometer: 340000, department: "ฝ่ายขนส่งพัสดุ", price: 4700000, checked: true },
    { id: "v-24", licence: "ษห-4501 กรุงเทพฯ", type: "รถยนต์นั่ง", age: 10, condition: "ปกติ", repairFreq: "ปกติ", odometer: 110000, department: "ฝบท. กองบำรุงรักษา", price: 1420000, checked: true },
    { id: "v-25", licence: "ษห-4502 ปทุมธานี", type: "รถกระบะ", age: 11, condition: "ปกติ", repairFreq: "ปกติ", odometer: 135000, department: "สายงาน (ต)", price: 940000, checked: true },
    { id: "v-26", licence: "ษห-4503 ลำปาง", type: "รถตู้โดยสาร (12-15 ที่นั่ง)", age: 8, condition: "ปกติ", repairFreq: "ปกติ", odometer: 98000, department: "ส่วนต้อนรับ", price: 1180000, checked: true },
    { id: "v-27", licence: "ษห-4504 นครสวรรค์", type: "รถบรรทุก", age: 14, condition: "เสื่อมสภาพ", repairFreq: "ปานกลาง", odometer: 220000, department: "กองอาคารสถานที่", price: 3150000, checked: true },
    { id: "v-28", licence: "ษห-4505 นครปฐม", type: "รถโดยสารพิเศษ", age: 12, condition: "เสื่อมสภาพ", repairFreq: "ปานกลาง", odometer: 230000, department: "บริหารงานทั่วไป", price: 4400000, checked: true },
    { id: "v-29", licence: "ษห-4506 สมุทรสาคร", type: "รถยนต์นั่ง", age: 18, condition: "ชำรุด", repairFreq: "สูง", odometer: 240000, department: "ส่วนรักษาความปลอดภัย", price: 1400000, checked: true },
    { id: "v-30", licence: "ษห-4507 พระนครศรีฯ", type: "รถกระบะ", age: 17, condition: "ชำรุดมาก", repairFreq: "สูง", odometer: 255000, department: "กองคลังอาวุธ", price: 910000, checked: true },
    { id: "v-31", licence: "กข-3101 สุโขทัย", type: "รถตู้โดยสาร (12-15 ที่นั่ง)", age: 14, condition: "ชำรุดมาก", repairFreq: "สูง", odometer: 190000, department: "งานขนส่งบุคลากร", price: 1240000, checked: true },
    { id: "v-32", licence: "กข-3102 พิจิตร", type: "รถบรรทุก", age: 17, condition: "ชำรุด", repairFreq: "สูง", odometer: 290000, department: "งานทางระบายน้ำ", price: 3250000, checked: true },
    { id: "v-33", licence: "กข-3103 พิษณุโลก", type: "รถโดยสารพิเศษ", age: 18, condition: "ชำรุด", repairFreq: "สูง", odometer: 360000, department: "ฝ่ายฝึกอบรมนักเรียน", price: 4800000, checked: true },
    { id: "v-34", licence: "กข-3104 ลพบุรี", type: "รถยนต์นั่ง", age: 15, condition: "ชำรุด", repairFreq: "สูง", odometer: 212000, department: "ฝบท. กองคลัง", price: 1390000, checked: true },
    { id: "v-35", licence: "กข-3105 ลพบุรี", type: "รถกระบะ", age: 14, condition: "เสื่อมสภาพ", repairFreq: "สูง", odometer: 218000, department: "สายงาน (ต)", price: 935000, checked: true },
    { id: "v-36", licence: "กข-3106 ชัยนาท", type: "รถตู้โดยสาร (12-15 ที่นั่ง)", age: 12, condition: "เสื่อมสภาพ", repairFreq: "ปานกลาง", odometer: 182000, department: "สวัสดิการพนักงาน", price: 1210000, checked: true },
    { id: "v-37", licence: "กข-3107 ชัยนาท", type: "รถบรรทุก", age: 15, condition: "ชำรุด", repairFreq: "สูง", odometer: 260000, department: "งานช่างสนาม", price: 3200000, checked: true },
    { id: "v-38", licence: "กข-3108 อ่างทอง", type: "รถโดยสารพิเศษ", age: 13, condition: "ชำรุด", repairFreq: "ปานกลาง", odometer: 245000, department: "ส่วนบำรุงรถบัส", price: 4450000, checked: true },
    { id: "v-39", licence: "กข-3109 สิงห์บุรี", type: "รถยนต์นั่ง", age: 14, condition: "ชำรุด", repairFreq: "สูง", odometer: 205000, department: "กองพัฒนาธุรกิจ", price: 1410000, checked: true },
    { id: "v-40", licence: "กข-3110 สระบุรี", type: "รถกระบะ", age: 13, condition: "เสื่อมสภาพ", repairFreq: "ปกติ", odometer: 155000, department: "กองตรวจการขนส่ง", price: 945000, checked: true }
  ], []);

  // Filter helper using dynamic settings with AND / OR modes supporting "any of the criteria" examples
  const filterVehiclesByVMS = (
    types: string[],
    activeCrits: string[],
    settings: {
      [vehicleType: string]: {
        age: string;
        condition: string;
        repairFreq: string;
        odometer: string;
      }
    }
  ) => {
    return initialVehicles.filter(v => {
      // 1. Check vehicle type
      if (!types.includes(v.type)) return false;

      // 2. If no criteria active, allow everything of that type
      if (activeCrits.length === 0) return true;

      const checkSingleCrit = (crit: string) => {
        const typeSetting = settings[v.type];
        if (!typeSetting) return true;

        if (crit === "อายุรถ") {
          const threshold = Number(typeSetting.age) || 0;
          return v.age >= threshold;
        }
        if (crit === "สภาพรถ") {
          const activeCond = typeSetting.condition;
          if (activeCond === "ทุกสภาพ") return true;
          if (activeCond === "ชำรุด") {
            return v.condition === "ชำรุด" || v.condition === "ชำรุดมาก";
          }
          if (activeCond === "เสื่อมสภาพ") {
            return v.condition === "เสื่อมสภาพ" || v.condition === "ชำรุด" || v.condition === "ชำรุดมาก";
          }
          if (activeCond === "ชำรุดมาก") {
            return v.condition === "ชำรุดมาก";
          }
          return v.condition === activeCond;
        }
        if (crit === "ประวัติซ่อมบำรุง") {
          const activeRepair = typeSetting.repairFreq;
          if (activeRepair === "ปกติ") return true;
          if (activeRepair === "ปานกลาง") {
            return v.repairFreq === "ปานกลาง" || v.repairFreq === "สูง";
          }
          return v.repairFreq === activeRepair; // "สูง"
        }
        if (crit === "มาตรวัดระยะทาง") {
          const odometerThreshold = Number(typeSetting.odometer) || 0;
          return v.odometer >= odometerThreshold;
        }
        return true;
      };

      // To give a highly useful review table, we let any vehicle that matches AT LEAST ONE dynamic criteria pass into the workbench list
      // So the user can inspect both "Fully Compliant" (สอดคล้องครบถ้วน) and "Partially Compliant" (ตรงบางเกณฑ์)
      return activeCrits.some(checkSingleCrit);
    });
  };

  // State of active loaded vehicles, pre-filtered with defaults on mount
  const [vehicles, setVehicles] = useState<{
    id: string;
    licence: string;
    type: string;
    age: number;
    condition: string;
    repairFreq: string;
    odometer: number;
    department: string;
    price: number;
    checked: boolean;
    exclusionReason?: string;
  }[]>(() => {
    const defaultTypes = ["รถยนต์นั่ง", "รถกระบะ", "รถตู้โดยสาร (12-15 ที่นั่ง)"];
    return initialVehicles
      .filter(v => defaultTypes.includes(v.type))
      .map(v => ({ ...v, checked: true }));
  });

  // Sync vehicle list dynamically in real-time when criteria, settings, vmsMatchMode, or chosen vehicle types change
  useEffect(() => {
    const sortedResult = filterVehiclesByVMS(activeVehicleTypes, activeCriteria, criteriaSettings);
    setVehicles(prev => {
      return sortedResult.map(v => {
        const totalActive = activeCriteria.length;
        let matchedCount = 0;
        const typeSet = criteriaSettings[v.type as keyof typeof criteriaSettings];
        if (typeSet) {
          if (activeCriteria.includes("อายุรถ") && v.age >= (Number(typeSet.age) || 0)) {
            matchedCount++;
          }
          if (activeCriteria.includes("สภาพรถ")) {
            const activeCond = typeSet.condition;
            let condMatch = false;
            if (activeCond === "ทุกสภาพ") condMatch = true;
            else if (activeCond === "ชำรุด" && (v.condition === "ชำรุด" || v.condition === "ชำรุดมาก")) condMatch = true;
            else if (activeCond === "เสื่อมสภาพ" && (v.condition === "เสื่อมสภาพ" || v.condition === "ชำรุด" || v.condition === "ชำรุดมาก")) condMatch = true;
            else if (activeCond === "ชำรุดมาก" && v.condition === "ชำรุดมาก") condMatch = true;
            else if (v.condition === activeCond) condMatch = true;
            if (condMatch) matchedCount++;
          }
          if (activeCriteria.includes("ประวัติซ่อมบำรุง")) {
            const activeRepair = typeSet.repairFreq;
            let repairMatch = false;
            if (activeRepair === "ปกติ") repairMatch = true;
            else if (activeRepair === "ปานกลาง" && (v.repairFreq === "ปานกลาง" || v.repairFreq === "สูง")) repairMatch = true;
            else if (v.repairFreq === activeRepair) repairMatch = true;
            if (repairMatch) matchedCount++;
          }
          if (activeCriteria.includes("มาตรวัดระยะทาง") && v.odometer >= (Number(typeSet.odometer) || 0)) {
            matchedCount++;
          }
        }

        const isFullyCompliant = (vmsMatchMode === "AND") ? (matchedCount === totalActive) : (matchedCount > 0);
        
        const found = prev.find(p => p.id === v.id);
        
        if (found) {
          return {
            ...v,
            checked: found.checked,
            exclusionReason: found.exclusionReason
          };
        } else {
          return {
            ...v,
            checked: isFullyCompliant,
            exclusionReason: isFullyCompliant ? undefined : "สอดคล้องไม่ครบทุกเกณฑ์ชี้วัด (VMS)"
          };
        }
      });
    });
    setVehCurrentPage(1);
  }, [activeVehicleTypes, activeCriteria, criteriaSettings, vmsMatchMode]);

  // Interactive metrics calculation
  const selectedCount = vehicles.filter(v => v.checked).length;
  
  // Real budget calculation strictly based on sum of prices of checked vehicles
  const currentDisplayedBudget = useMemo(() => {
    return vehicles.reduce((sum, v) => sum + (v.checked ? v.price : 0), 0);
  }, [vehicles]);

  // Handle templating logic
  const handleUseTemplate = (idx: number) => {
    setSelectedTemplateIdx(idx);
    const temp = pastTemplates[idx];
    setDraftName(`${temp.name} (ต้นแบบ)`);
    setDraftRemarks(temp.remarks);
    if (temp.procurementType === "purchase") {
      setPurchaseSelected(true);
      setRentSelected(false);
    } else {
      setPurchaseSelected(false);
      setRentSelected(true);
    }
    setInfoToast(`โหลดข้อมูลต้นแบบแผนงานระดับประเทศ "${temp.name}" สำเร็จเรียบร้อย`);
    setTimeout(() => setInfoToast(null), 3000);
  };

  // Pagination & Filtering
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const q = searchVehQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        v.licence.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        v.department.toLowerCase().includes(q) ||
        v.condition.toLowerCase().includes(q) ||
        v.repairFreq.toLowerCase().includes(q)
      );
    });
  }, [vehicles, searchVehQuery]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (vehCurrentPage - 1) * pageSize;
    return filteredVehicles.slice(startIndex, startIndex + pageSize);
  }, [filteredVehicles, vehCurrentPage, pageSize]);

  const totalPages = Math.ceil(filteredVehicles.length / pageSize) || 1;

  // Toggle check/uncheck for single rows with warning modal confirmation
  const toggleRowChecked = (id: string) => {
    const target = vehicles.find(v => v.id === id);
    if (!target) return;

    if (target.checked) {
      // Trigger modal confirmation
      setPendingUncheckId(id);
      setUncheckPresetReason("งบประมาณประจำส่วนไม่เพียงพอ");
      setUncheckCustomReason("");
    } else {
      // Check immediately
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, checked: true, exclusionReason: undefined } : v));
      setInfoToast(`นำพัสดุทะเบียน "${target.licence.split(" ").slice(0, 2).join(" ")}" กลับเข้าแผนงานจัดหาเรียบร้อย`);
      setTimeout(() => setInfoToast(null), 3000);
    }
  };

  // Toggle check all rows on current page
  const isAllPageChecked = useMemo(() => {
    if (paginatedVehicles.length === 0) return false;
    return paginatedVehicles.every(v => v.checked);
  }, [paginatedVehicles]);

  const toggleAllPageChecked = () => {
    const targetStatus = !isAllPageChecked;
    const paginatedIds = paginatedVehicles.map(v => v.id);
    setVehicles(prev => prev.map(v => paginatedIds.includes(v.id) ? { ...v, checked: targetStatus } : v));
  };

  const handleResetCriteria = () => {
    setActiveCriteria(["อายุรถ", "สภาพรถ"]);
    setActiveVehicleTypes(["รถยนต์นั่ง", "รถกระบะ", "รถตู้โดยสาร (12-15 ที่นั่ง)"]);
    setCriteriaSettings({
      "รถยนต์นั่ง": { age: "12", condition: "เสื่อมสภาพ", repairFreq: "สูง", odometer: "200000" },
      "รถกระบะ": { age: "12", condition: "เสื่อมสภาพ", repairFreq: "สูง", odometer: "200000" },
      "รถตู้โดยสาร (12-15 ที่นั่ง)": { age: "10", condition: "ชำรุด", repairFreq: "ปานกลาง", odometer: "150000" },
      "รถบรรทุก": { age: "15", condition: "เสื่อมสภาพ", repairFreq: "สูง", odometer: "250000" },
      "รถโดยสารพิเศษ": { age: "15", condition: "ชำรุด", repairFreq: "สูง", odometer: "300000" },
    });
    setPurchaseSelected(true);
    setRentSelected(true);
    setPurchaseSubCategories({ "ซื้อทดแทน": true, "ซื้อเพิ่มเติม": false, "ซื้อเพิ่มเติมโควตาพิเศษ": false });
    setRentSubCategories({ "เช่าระยะสั้น": true, "เช่าระยะยาว": false, "เช่าแบบมีสิทธิ์ซื้อ": false });
    
    // Default filter on reset
    const defaultFilteredOnReset = initialVehicles.filter(v => {
      const defaultTypes = ["รถยนต์นั่ง", "รถกระบะ", "รถตู้โดยสาร (12-15 ที่นั่ง)"];
      if (!defaultTypes.includes(v.type)) return false;
      return v.age >= 12 || v.condition === "เสื่อมสภาพ" || v.condition === "ชำรุด" || v.condition === "ชำรุดมาก";
    });
    setVehicles(defaultFilteredOnReset.map(v => ({ ...v, checked: true })));
    setInfoToast("รีเซ็ตเกณฑ์เงื่อนไขมาตรฐานและการประมวลผลกลับเป็นค่าตั้งต้นแล้ว");
    setTimeout(() => setInfoToast(null), 3500);
  };

  const handleApplyCriteria = () => {
    const result = filterVehiclesByVMS(activeVehicleTypes, activeCriteria, criteriaSettings);
    setVehicles(result.map(v => ({ ...v, checked: true })));
    setVehCurrentPage(1);
    
    // Generate helpful toast string describing what was queried
    const critsStr = activeCriteria.length > 0 ? activeCriteria.join(", ") : "ไม่มีเกณฑ์";
    setInfoToast(`ประมวลผล VMS สำเร็จ! คัดเลือกยานพาหนะตามเกณฑ์: (${critsStr}) ดึงพัสดุผ่านเข้าร่างแผนทั้งหมด ${result.length} รายการ`);
    setTimeout(() => setInfoToast(null), 4000);
  };

  const handleApplyToAll = (sourceType: string) => {
    const sourceSettings = criteriaSettings[sourceType];
    if (!sourceSettings) return;
    
    const newSettings = { ...criteriaSettings };
    activeVehicleTypes.forEach(t => {
      if (t !== sourceType) {
        newSettings[t] = { ...sourceSettings };
      }
    });
    setCriteriaSettings(newSettings);
    setInfoToast(`สำเร็จ! คัดลอกค่ากำหนดเงื่อนไขของ "${sourceType}" ไปใช้กับทุกกลุ่มประเภทรถยนต์แล้ว`);
    setTimeout(() => setInfoToast(null), 3500);
  };

  const deleteRow = (id: string, licence: string) => {
    const target = vehicles.find(v => v.id === id);
    if (!target) return;
    
    if (target.checked) {
      setPendingUncheckId(id);
      setUncheckPresetReason("สภาพทั่วไปยังใช้งานได้ตามนโยบายประหยัด");
      setUncheckCustomReason("");
    } else {
      if (confirm(`คุณต้องการลบทะเบียน ${licence} ออกไปจากลิสต์ตารางถาวรหรือไม่? (จะไม่ปรากฏในหน้านี้แทน)`)) {
        setVehicles(prev => prev.filter(v => v.id !== id));
        setInfoToast(`ลบรายการรถทะเบียน ${licence} ออกจากรายการแล้ว`);
        setTimeout(() => setInfoToast(null), 3000);
      }
    }
  };

  const handleSaveDraft = () => {
    // Adds a new draft plan to the list
    const newId = `PLAN-${draftStartYear || "2569"}-0${plans.length + 1}`;
    const newPlan: ProcurementPlan = {
      id: newId,
      name: draftName || "แผนการสรรหายานพาหนะประจำปี",
      fiscalYear: `${draftStartYear || "2568"} - ${draftEndYear || "2569"}`,
      procurementType: purchaseSelected ? "purchase" : "rent",
      version: "1.0",
      department: "ฝบท. กองบำรุงรักษายานพาหนะ",
      status: "draft",
      progress: 33,
      totalVehicles: selectedCount,
      totalBudget: currentDisplayedBudget,
      createdDate: "16 มิ.ย. 2568",
      remarks: draftRemarks || "ร่างผ่านเกณฑ์ประเมิน"
    };

    setPlans([newPlan, ...plans]);
    setIsCreatingNewDraft(false);
    alert(`บันทึกแผนงานแบบร่าง ${newPlan.id} สำเร็จ!`);
  };

  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen bg-[#F9FAFB] text-[#111827]">
      {/* Dynamic Toast Message */}
      {infoToast && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-white border-l-4 border-[#9D0C82] shadow-xl rounded-r-xl text-sm text-[#0c1322] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="size-2 rounded-full bg-[#9D0C82] animate-ping" />
          <p className="font-semibold">{infoToast}</p>
        </div>
      )}

      {/* TOP HEADER PATTERNS matching screenshots */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-[#6B7280] font-sans">
          <span className="hover:text-slate-800 transition-colors cursor-pointer" onClick={() => setIsCreatingNewDraft(false)}>หน้าหลัก</span>
          <ChevronRight size={12} className="text-gray-300 shrink-0" />
          <span className="hover:text-slate-800 transition-colors cursor-pointer" onClick={() => setIsCreatingNewDraft(false)}>แผนสรรหายานพาหนะ</span>
          <ChevronRight size={12} className="text-gray-300 shrink-0" />
          <span className="text-[#9D0C82] font-semibold bg-[#FAE6F4] px-2 py-0.5 rounded">สร้างแผนจัดหายานพาหนะใหม่</span>
        </div>

        <div className="flex justify-between items-center mt-1">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">สร้างแผนจัดหายานพาหนะใหม่</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">ระบุข้อมูลเบื้องต้นและตั้งเงื่อนไขพารามิเตอร์ VMS เพื่อจัดเรียงความจำเป็นในงบประมาณประจำภาคส่วน</p>
          </div>
          <button 
            type="button"
            onClick={() => setIsCreatingNewDraft(false)}
            className="px-4.5 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            ย้อนกลับไปตารางแผน
          </button>
        </div>
      </div>

      {/* HORIZONTAL STEPPER WITH MULTI-STEP SLANTED CONNECTORS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-3xs">
        
        {/* Step 1 button info */}
        <button
          onClick={() => setDraftWizardStep("form")}
          className={`relative p-5 text-left flex items-center gap-4.5 transition-all outline-none ${
            draftWizardStep === "form" 
              ? "bg-[#FAE6F4]/40" 
              : "bg-white hover:bg-slate-50/50"
          }`}
        >
          <div className={`size-10 rounded-full flex items-center justify-center font-bold text-base border-2 transition-all ${
            draftWizardStep === "form"
              ? "border-[#9D0C82] text-[#9D0C82] bg-white shadow-2xs"
              : "border-gray-300 text-gray-400 bg-gray-50"
          }`}>
            01
          </div>
          <div>
            <p className={`text-xs font-semibold ${draftWizardStep === "form" ? "text-gray-400 font-medium" : "text-gray-400 font-normal"}`}>ขั้นตอนที่ 1</p>
            <p className={`text-sm font-bold mt-0.5 ${draftWizardStep === "form" ? "text-[#9D0C82]" : "text-gray-700"}`}>ระบุข้อมูลเบื้องต้น</p>
          </div>
          {/* Slanted connector pointer */}
          <div className="absolute top-0 right-[-1px] h-full w-4 z-20 hidden md:block select-none overflow-hidden pointers-none">
            <svg className={`h-full w-full ${draftWizardStep === "form" ? "text-[#FAE6F4]/90" : "text-white"}`} viewBox="0 0 10 100" fill="currentColor" preserveAspectRatio="none">
              <polygon points="0,0 10,50 0,100" />
            </svg>
          </div>
        </button>

        {/* Step 2 button info */}
        <button
          onClick={() => {
            if (!draftName.trim()) {
              alert("กรุณากรอกชื่อแผนงานหลักก่อนในขั้นตอนที่ 1");
              return;
            }
            setDraftWizardStep("criteria");
          }}
          className={`relative p-5 text-left flex items-center gap-4.5 transition-all outline-none ${
            draftWizardStep === "criteria" 
              ? "bg-[#FAE6F4]/40" 
              : "bg-white hover:bg-slate-50/50"
          }`}
        >
          {/* If step 1 completed, render checkmark */}
          <div className={`size-10 rounded-full flex items-center justify-center font-bold text-base border-2 transition-all ${
            draftWizardStep === "criteria"
              ? "border-[#9D0C82] text-[#9D0C82] bg-white shadow-2xs"
              : "border-emerald-500 bg-[#E8F8F0] text-emerald-600"
          }`}>
            {draftWizardStep !== "criteria" ? <Check size={16} /> : "02"}
          </div>
          <div>
            <p className={`text-xs font-semibold text-gray-400 font-medium`}>ขั้นตอนที่ 2</p>
            <p className={`text-sm font-bold mt-0.5 ${draftWizardStep === "criteria" ? "text-[#9D0C82]" : "text-gray-700"}`}>ระบุเกณฑ์การจัดหาและเลือกรายการ</p>
          </div>
          {/* Slanted connector pointer */}
          <div className="absolute top-0 right-[-1px] h-full w-4 z-20 hidden md:block select-none overflow-hidden pointers-none">
            <svg className={`h-full w-full ${draftWizardStep === "criteria" ? "text-[#FAE6F4]/90" : "text-white"}`} viewBox="0 0 10 100" fill="currentColor" preserveAspectRatio="none">
              <polygon points="0,0 10,50 0,100" />
            </svg>
          </div>
        </button>

        {/* Step 3 button info */}
        <button
          disabled
          className="relative p-5 text-left flex items-center gap-4.5 bg-white opacity-85 outline-none cursor-not-allowed"
        >
          <div className="size-10 rounded-full flex items-center justify-center font-bold text-base border-2 border-gray-200 text-gray-300 bg-gray-50">
            03
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 font-normal">ขั้นตอนที่ 3</p>
            <p className="text-sm font-bold text-gray-400 mt-0.5">ตรวจสอบข้อมูลและยืนยัน</p>
          </div>
        </button>

      </div>

      {/* ─── STEP 1: INITIAL DETAILS (SCREENSHOT 1 DESIGN) ─── */}
      {draftWizardStep === "form" && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden p-7 flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <div className="w-1 h-5 bg-[#9D0C82] rounded-full" />
            <h2 className="text-lg font-bold text-slate-800 font-sans">ระบุข้อมูลเบื้องต้น</h2>
          </div>

          {/* Past templates / draft switch panel */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-gray-600 font-sans pl-1">เลือกจากแผนซื้อที่เคยอนุมัติ</span>
            <div className="flex bg-[#F3F4F6] p-1 rounded-xl w-fit">
              <button 
                type="button"
                onClick={() => setUsePastPlan(false)}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${!usePastPlan ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-gray-500 hover:text-slate-800"}`}
              >
                แผนใหม่
              </button>
              <button 
                type="button"
                onClick={() => setUsePastPlan(true)}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${usePastPlan ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-gray-500 hover:text-slate-800"}`}
              >
                แผนที่เคยอนุมัติ
              </button>
            </div>
          </div>

          {/* If approved template list is chosen */}
          {usePastPlan && (
            <div className="p-4.5 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col gap-3">
              <p className="text-xs font-bold text-slate-600">แผนงานสนับสนุนระดับประเทศ/กอง ปีที่เคยสรุปเสร็จสิ้น (คลิกเลือกข้อมูลต้นแบบ):</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {pastTemplates.map((temp, index) => (
                  <button
                    key={temp.id}
                    type="button"
                    onClick={() => handleUseTemplate(index)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      selectedTemplateIdx === index 
                        ? "border-[#9D0C82] bg-[#FAE6F4]/20 shadow-3xs" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xs font-bold text-[#9D0C82]">{temp.id}</span>
                    <span className="text-sm font-bold text-gray-800 line-clamp-1 mt-0.5">{temp.name}</span>
                    <span className="text-xs text-gray-400 mt-1">งบประมาณ {temp.budget.toLocaleString()} บาท</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* REORGANIZED & STYLISH FORM FIELDS */}
          <div className="flex flex-col gap-6 mt-2">
            
            {/* Row 1: Plan Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <span>ชื่อแผนงาน / วัตถุประสงค์หลักคัดสรร</span>
                <span className="text-[#9D0C82] font-semibold text-sm">*</span>
              </label>
              <input 
                type="text"
                value={draftName}
                onChange={e => setDraftName(e.target.value)}
                placeholder="เช่น แผนการสรรหายานพาหนะประจำปีงบประมาณ 2573"
                className="w-full px-4 py-3 h-12 bg-white border border-[#E5E7EB] focus:border-[#9D0C82] focus:ring-1 focus:ring-[#9D0C82] rounded-xl text-sm text-slate-900 outline-none transition-all font-sans shadow-3xs font-medium"
                required
              />
            </div>

            {/* Row 2: Grid of secondary metadata */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              
              {/* Year Start */}
              <div className="flex flex-col gap-1.5 text-slate-700">
                <label className="text-xs font-bold text-slate-500">ปีเริ่มต้นงบประมาณ</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    value={draftStartYear}
                    onChange={e => setDraftStartYear(e.target.value)}
                    className="w-full pl-10 pr-10 h-11 bg-white border border-[#E5E7EB] focus:border-[#9D0C82] rounded-xl text-sm font-semibold text-slate-800 outline-none cursor-pointer appearance-none font-sans shadow-3xs"
                  >
                    <option value="2568">2568</option>
                    <option value="2569">2569</option>
                    <option value="2570">2570</option>
                    <option value="2571">2571</option>
                    <option value="2572">2572</option>
                    <option value="2573">2573</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Year End */}
              <div className="flex flex-col gap-1.5 text-slate-700">
                <label className="text-xs font-bold text-slate-500">ปีสิ้นสุดงบประมาณ</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    value={draftEndYear}
                    onChange={e => setDraftEndYear(e.target.value)}
                    className="w-full pl-10 pr-10 h-11 bg-white border border-[#E5E7EB] focus:border-[#9D0C82] rounded-xl text-sm font-semibold text-slate-800 outline-none cursor-pointer appearance-none font-sans shadow-3xs"
                  >
                    <option value="2568">2568</option>
                    <option value="2569">2569</option>
                    <option value="2570">2570</option>
                    <option value="2571">2571</option>
                    <option value="2572">2572</option>
                    <option value="2573">2573</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Version */}
              <div className="flex flex-col gap-1.5 text-slate-700">
                <label className="text-xs font-bold text-slate-500">เวอร์ชั่น</label>
                <input 
                  type="text"
                  value="1.0"
                  disabled
                  className="w-full px-4 h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm font-bold text-slate-400 font-sans cursor-not-allowed shadow-3xs text-center"
                />
              </div>

              {/* Budget Estimation */}
              <div className="flex flex-col gap-1.5 text-slate-700">
                <label className="text-xs font-bold text-slate-500">วงเงินงบประมาณรวม (โดยประมาณ)</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={Number(draftBudget || 0).toLocaleString()}
                    disabled
                    className="w-full pl-4 pr-12 h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm font-bold text-slate-500 font-sans cursor-not-allowed shadow-3xs text-right"
                  />
                  <div className="absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-bold text-slate-400 mt-[1px]">บาท</div>
                </div>
              </div>

            </div>

            {/* Row 3: Redesigned Procurement Selector Block matching exact image */}
            <div className="flex flex-col gap-2.5 font-sans w-full">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-slate-700">ประเภทการสรรหา <span className="text-[#9D0C82]">*</span></label>
                <span className="text-[11px] text-gray-400 font-medium bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-150">เลือกได้หลายประเภทพร้อมกัน</span>
              </div>

              <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-3xs flex flex-col">
                {/* Row 1: ซื้อ (Purchase) */}
                <div className={`p-5 flex flex-col gap-4 border-b border-slate-100 transition-all ${
                  purchaseSelected ? "bg-[#FAE6F4]/15" : "bg-white"
                }`}>
                  {/* Header line for Purchase */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const nextS = !purchaseSelected;
                          setPurchaseSelected(nextS);
                          if (nextS) {
                            const activeSubcatCount = Object.values(purchaseSubCategories).filter(Boolean).length;
                            if (activeSubcatCount === 0) {
                              setPurchaseSubCategories(prev => ({ ...prev, "ซื้อทดแทน": true }));
                            }
                          }
                        }}
                        className={`size-6 rounded-full flex items-center justify-center transition-all ${
                          purchaseSelected 
                            ? "bg-[#9D0C82] text-white shadow-xs scale-105" 
                            : "border-2 border-slate-300 bg-white hover:border-slate-400"
                        }`}
                      >
                        {purchaseSelected && <Check size={13} strokeWidth={3} />}
                      </button>
                      <span 
                        onClick={() => {
                          const nextS = !purchaseSelected;
                          setPurchaseSelected(nextS);
                          if (nextS) {
                            const activeSubcatCount = Object.values(purchaseSubCategories).filter(Boolean).length;
                            if (activeSubcatCount === 0) {
                              setPurchaseSubCategories(prev => ({ ...prev, "ซื้อทดแทน": true }));
                            }
                          }
                        }}
                        className="text-sm font-bold text-slate-900 cursor-pointer select-none"
                      >
                        ซื้อ
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wide px-2.5 py-0.5 rounded-full bg-[#FCF0FB] text-[#9D0C82] border border-[#FBE6F8] font-sans">
                        Purchase
                      </span>
                    </div>

                    {/* Right count badge */}
                    {purchaseSelected && (
                      <div className="bg-[#9D0C82] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
                        {Object.values(purchaseSubCategories).filter(Boolean).length} ประเภท
                      </div>
                    )}
                  </div>

                  {/* Subcategories for Purchase */}
                  <div className="flex flex-col gap-2 pl-9 animate-fade-in">
                    <span className="text-[11px] text-[#98A2B3] font-bold">เลือกประเภทประเภทย่อย (ได้หลายรายการ)</span>
                    <div className="flex flex-wrap items-center gap-2.5 mt-0.5">
                      {Object.keys(purchaseSubCategories).map(catKey => {
                        const isVal = purchaseSubCategories[catKey];
                        return (
                          <button
                            key={catKey}
                            type="button"
                            onClick={() => {
                              const newVal = !isVal;
                              setPurchaseSubCategories(prev => ({ ...prev, [catKey]: newVal }));
                              // Auto enable parent if checked nested
                              if (newVal && !purchaseSelected) {
                                setPurchaseSelected(true);
                              }
                            }}
                            className={`px-4 py-2 text-xs rounded-xl flex items-center gap-2 border transition-all ${
                              isVal && purchaseSelected
                                ? "bg-white border-[#E0A6D4] text-[#9D0C82] font-semibold shadow-3xs" 
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-305 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`size-4 rounded-full flex items-center justify-center transition-all ${
                              isVal && purchaseSelected ? "bg-[#9D0C82] text-white" : "border border-slate-300 bg-white"
                            }`}>
                              {isVal && purchaseSelected && <Check size={10} strokeWidth={3} />}
                            </div>
                            {catKey}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Row 2: เช่า (Rental) */}
                <div className={`p-5 flex flex-col gap-4 transition-all ${
                  rentSelected ? "bg-[#F1F3FE]/30" : "bg-white"
                }`}>
                  {/* Header line for Rental */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const nextS = !rentSelected;
                          setRentSelected(nextS);
                          if (nextS) {
                            const activeSubcatCount = Object.values(rentSubCategories).filter(Boolean).length;
                            if (activeSubcatCount === 0) {
                              setRentSubCategories(prev => ({ ...prev, "เช่าระยะสั้น": true }));
                            }
                          }
                        }}
                        className={`size-6 rounded-full flex items-center justify-center transition-all ${
                          rentSelected 
                            ? "bg-[#9D0C82] text-white shadow-xs scale-105" 
                            : "border-2 border-slate-300 bg-white hover:border-slate-400"
                        }`}
                      >
                        {rentSelected && <Check size={13} strokeWidth={3} />}
                      </button>
                      <span 
                        onClick={() => {
                          const nextS = !rentSelected;
                          setRentSelected(nextS);
                          if (nextS) {
                            const activeSubcatCount = Object.values(rentSubCategories).filter(Boolean).length;
                            if (activeSubcatCount === 0) {
                              setRentSubCategories(prev => ({ ...prev, "เช่าระยะสั้น": true }));
                            }
                          }
                        }}
                        className="text-sm font-bold text-slate-900 cursor-pointer select-none"
                      >
                        เช่า
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 px-2.5 py-0.5 rounded-full bg-[#EEF1FF] text-[#5D5FEF] border border-[#E3E8FF] font-sans">
                        Rental
                      </span>
                    </div>

                    {/* Right count badge */}
                    {rentSelected && (
                      <div className="bg-[#9D0C82] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
                        {Object.values(rentSubCategories).filter(Boolean).length} ประเภท
                      </div>
                    )}
                  </div>

                  {/* Subcategories for Rental */}
                  <div className="flex flex-col gap-2 pl-9 animate-fade-in">
                    <span className="text-[11px] text-[#98A2B3] font-bold">เลือกประเภทประเภทย่อย (ได้หลายรายการ)</span>
                    <div className="flex flex-wrap items-center gap-2.5 mt-0.5 font-sans">
                      {Object.keys(rentSubCategories).map(catKey => {
                        const isVal = rentSubCategories[catKey];
                        return (
                          <button
                            key={catKey}
                            type="button"
                            onClick={() => {
                              const newVal = !isVal;
                              setRentSubCategories(prev => ({ ...prev, [catKey]: newVal }));
                              // Auto enable parent if checked nested
                              if (newVal && !rentSelected) {
                                setRentSelected(true);
                              }
                            }}
                            className={`px-4 py-2 text-xs rounded-xl flex items-center gap-2 border transition-all ${
                              isVal && rentSelected
                                ? "bg-white border-[#E0A6D4] text-[#9D0C82] font-semibold shadow-3xs" 
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-305 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`size-4 rounded-full flex items-center justify-center transition-all ${
                              isVal && rentSelected ? "bg-[#9D0C82] text-white" : "border border-slate-300 bg-white"
                            }`}>
                              {isVal && rentSelected && <Check size={10} strokeWidth={3} />}
                            </div>
                            {catKey}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation alert if none of those selected */}
              {!purchaseSelected && !rentSelected && (
                <div className="flex items-center gap-2.5 p-3.5 bg-[#FFF9E6] border border-[#FFE599] rounded-xl text-[#854D0E] text-xs font-semibold mt-1 animate-pulse">
                  <AlertTriangle size={15} className="shrink-0 text-amber-600" />
                  <span>กรุณาเลือกอย่างน้อย 1 ประเภทการสรรหา</span>
                </div>
              )}
            </div>

            {/* Row 4: Remarks / Statement */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">หมายเหตุ (ถ้ามี)</label>
              <textarea 
                value={draftRemarks}
                onChange={e => setDraftRemarks(e.target.value)}
                placeholder="กรอกรายละเอียดเหตุผลประกอบการคัดเลือก หรือ หมายเหตุเพิ่มเติม..."
                rows={3}
                className="w-full px-4 py-3 bg-white border border-[#E5E7EB] focus:border-[#9D0C82] focus:ring-1 focus:ring-[#9D0C82] rounded-xl text-sm text-[#0F172A] outline-none resize-none transition-all font-sans shadow-3xs"
              />
            </div>

          </div>

          {/* ACTIONS BAR AT BOTTOM */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-3">
            <button
              type="button"
              onClick={() => setIsCreatingNewDraft(false)}
              className="text-[#9D0C82] hover:text-[#7d0a68] font-bold text-sm transition-colors px-1 cursor-pointer"
            >
              ยกเลิก
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-5 py-2.5 bg-[#FAE6F4] text-[#9D0C82] hover:bg-[#FAE6F4]/80 font-bold text-xs sm:text-sm rounded-xl border border-[#9D0C82]/30 transition-all cursor-pointer shadow-3xs"
              >
                บันทึกแบบร่าง
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!draftName.trim()) {
                    alert("กรุณากรอกระบุชื่อแผนงานหลักเพื่อดำเนินการถัดไป สิทธิ์การใช้ VMS");
                    return;
                  }
                  if (!purchaseSelected && !rentSelected) {
                    alert("กรุณาเปิดเลือกประเภทข้อเสนอจัดหาอย่างน้อย 1 แผนการจัดสรร (ซื้อ หรือ เช่า) !");
                    return;
                  }
                  setDraftWizardStep("criteria");
                }}
                className="px-6 py-2.5 bg-[#9D0C82] hover:bg-[#7d0a68] text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-sm"
              >
                ต่อไป
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ─── STEP 2: CRITERIA SELECTOR & GRID VEHICLES (SCREENSHOT 2 DESIGN) ─── */}
      {draftWizardStep === "criteria" && (
        <div className="flex flex-col gap-6 font-sans">
          
          {/* STATS COUNT SUMMARY (4 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric Card 1 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#6B7280]">เกณฑ์ทั้งหมด</span>
                <span className="text-xl font-extrabold text-[#9D0C82] mt-0.5">{activeCriteria.length} เกณฑ์</span>
                <span className="text-[11px] text-[#027A48] font-bold bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#BCF0DA] w-fit mt-1">
                  เกณฑ์: {activeCriteria.join(", ") || "ไม่มีเกณฑ์เปิดใช้งาน"}
                </span>
              </div>
              <div className="size-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                <Sliders size={20} />
              </div>
            </div>

            {/* Metric Card 2 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#6B7280]">ประเภทรถทั้งหมด</span>
                <span className="text-xl font-extrabold text-[#9D0C82] mt-0.5">{activeVehicleTypes.length} ประเภท</span>
                <span className="text-[11px] text-[#4B5563] font-semibold bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 w-fit mt-1">
                  {activeVehicleTypes.join(", ") || "ไม่ได้เลือกประเภทรถ"}
                </span>
              </div>
              <div className="size-11 rounded-xl bg-[#FAE6F4] text-[#9D0C82] flex items-center justify-center border border-[#FAE6F4]">
                <Building2 size={20} />
              </div>
            </div>

            {/* Metric Card 3 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#6B7280]">จำนวนรวม</span>
                <span className="text-xl font-extrabold text-[#9D0C82] mt-0.5">{selectedCount} รายการ</span>
                <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 w-fit mt-1">ความพร้อมส่งมอบยานพาหนะ 100%</span>
              </div>
              <div className="size-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <CheckCircle2 size={20} />
              </div>
            </div>

            {/* Metric Card 4 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#6B7280]">งบประมาณรวม</span>
                <span className="text-xl font-extrabold text-[#9D0C82] tracking-tight mt-0.5">{(currentDisplayedBudget).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ฿</span>
                <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 w-fit mt-1">
                  เฉลี่ยต่อคันประมาณ {selectedCount > 0 ? (currentDisplayedBudget / selectedCount).toLocaleString(undefined, {maximumFractionDigits: 0}) : "0"} ฿
                </span>
              </div>
              <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 animate-pulse">
                <TrendingUp size={20} />
              </div>
            </div>

          </div>

          {/* CRITERIA BUILDER MAIN CONTAINER CARD */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-3xs p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#9D0C82] rounded-full" />
              <h3 className="text-base font-bold text-slate-800">ระบุเกณฑ์การจัดหาและเลือกรายการ</h3>
            </div>

            {/* Segment inner title bar */}
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-xs tracking-wider text-slate-500 font-mono flex items-center justify-between">
              <span>ระบุเกณฑ์การจัดหา</span>
              <span className="text-[10px] text-slate-400">VMS CRITERIA ENG V.3</span>
            </div>

            {/* Procurement selection logic checkable columns */}
            <div className="flex flex-col gap-2.5 font-sans w-full">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-slate-700">ประเภทการสรรหา <span className="text-[#9D0C82] font-semibold text-sm">*</span></label>
                <span className="text-[11px] text-gray-400 font-medium bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-150">ปรับแต่งสัดส่วนรายจ่ายการจัดสรร</span>
              </div>

              <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-3xs flex flex-col">
                {/* Row 1: ซื้อ (Purchase) */}
                <div className={`p-5 flex flex-col gap-4 border-b border-slate-100 transition-all ${
                  purchaseSelected ? "bg-[#FAE6F4]/15" : "bg-white"
                }`}>
                  {/* Header line for Purchase */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const nextS = !purchaseSelected;
                          setPurchaseSelected(nextS);
                          if (nextS) {
                            const activeSubcatCount = Object.values(purchaseSubCategories).filter(Boolean).length;
                            if (activeSubcatCount === 0) {
                              setPurchaseSubCategories(prev => ({ ...prev, "ซื้อทดแทน": true }));
                            }
                          }
                        }}
                        className={`size-6 rounded-full flex items-center justify-center transition-all ${
                          purchaseSelected 
                            ? "bg-[#9D0C82] text-white shadow-xs scale-105" 
                            : "border-2 border-slate-300 bg-white hover:border-slate-400"
                        }`}
                      >
                        {purchaseSelected && <Check size={13} strokeWidth={3} />}
                      </button>
                      <span 
                        onClick={() => {
                          const nextS = !purchaseSelected;
                          setPurchaseSelected(nextS);
                          if (nextS) {
                            const activeSubcatCount = Object.values(purchaseSubCategories).filter(Boolean).length;
                            if (activeSubcatCount === 0) {
                              setPurchaseSubCategories(prev => ({ ...prev, "ซื้อทดแทน": true }));
                            }
                          }
                        }}
                        className="text-sm font-bold text-slate-900 cursor-pointer select-none"
                      >
                        ซื้อ
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wide px-2.5 py-0.5 rounded-full bg-[#FCF0FB] text-[#9D0C82] border border-[#FBE6F8] font-sans">
                        Purchase
                      </span>
                    </div>

                    {/* Right count badge */}
                    {purchaseSelected && (
                      <div className="bg-[#9D0C82] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
                        {Object.values(purchaseSubCategories).filter(Boolean).length} ประเภท
                      </div>
                    )}
                  </div>

                  {/* Subcategories for Purchase */}
                  <div className="flex flex-col gap-2 pl-9 animate-fade-in">
                    <span className="text-[11px] text-[#98A2B3] font-bold">เลือกประเภทประเภทย่อย (ได้หลายรายการ)</span>
                    <div className="flex flex-wrap items-center gap-2.5 mt-0.5">
                      {Object.keys(purchaseSubCategories).map(catKey => {
                        const isVal = purchaseSubCategories[catKey];
                        return (
                          <button
                            key={catKey}
                            type="button"
                            onClick={() => {
                              const newVal = !isVal;
                              setPurchaseSubCategories(prev => ({ ...prev, [catKey]: newVal }));
                              if (newVal && !purchaseSelected) {
                                setPurchaseSelected(true);
                              }
                            }}
                            className={`px-4 py-2 text-xs rounded-xl flex items-center gap-2 border transition-all ${
                              isVal && purchaseSelected
                                ? "bg-white border-[#E0A6D4] text-[#9D0C82] font-semibold shadow-3xs" 
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-305 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`size-4 rounded-full flex items-center justify-center transition-all ${
                              isVal && purchaseSelected ? "bg-[#9D0C82] text-white" : "border border-slate-300 bg-white"
                            }`}>
                              {isVal && purchaseSelected && <Check size={10} strokeWidth={3} />}
                            </div>
                            {catKey}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Row 2: เช่า (Rental) */}
                <div className={`p-5 flex flex-col gap-4 transition-all ${
                  rentSelected ? "bg-[#F1F3FE]/30" : "bg-white"
                }`}>
                  {/* Header line for Rental */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const nextS = !rentSelected;
                          setRentSelected(nextS);
                          if (nextS) {
                            const activeSubcatCount = Object.values(rentSubCategories).filter(Boolean).length;
                            if (activeSubcatCount === 0) {
                              setRentSubCategories(prev => ({ ...prev, "เช่าระยะสั้น": true }));
                            }
                          }
                        }}
                        className={`size-6 rounded-full flex items-center justify-center transition-all ${
                          rentSelected 
                            ? "bg-[#9D0C82] text-white shadow-xs scale-105" 
                            : "border-2 border-slate-300 bg-white hover:border-slate-400"
                        }`}
                      >
                        {rentSelected && <Check size={13} strokeWidth={3} />}
                      </button>
                      <span 
                        onClick={() => {
                          const nextS = !rentSelected;
                          setRentSelected(nextS);
                          if (nextS) {
                            const activeSubcatCount = Object.values(rentSubCategories).filter(Boolean).length;
                            if (activeSubcatCount === 0) {
                              setRentSubCategories(prev => ({ ...prev, "เช่าระยะสั้น": true }));
                            }
                          }
                        }}
                        className="text-sm font-bold text-slate-900 cursor-pointer select-none"
                      >
                        เช่า
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 px-2.5 py-0.5 rounded-full bg-[#EEF1FF] text-[#5D5FEF] border border-[#E3E8FF] font-sans">
                        Rental
                      </span>
                    </div>

                    {/* Right count badge */}
                    {rentSelected && (
                      <div className="bg-[#9D0C82] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
                        {Object.values(rentSubCategories).filter(Boolean).length} ประเภท
                      </div>
                    )}
                  </div>

                  {/* Subcategories for Rental */}
                  <div className="flex flex-col gap-2 pl-9 animate-fade-in">
                    <span className="text-[11px] text-[#98A2B3] font-bold">เลือกประเภทประเภทย่อย (ได้หลายรายการ)</span>
                    <div className="flex flex-wrap items-center gap-2.5 mt-0.5 font-sans">
                      {Object.keys(rentSubCategories).map(catKey => {
                        const isVal = rentSubCategories[catKey];
                        return (
                          <button
                            key={catKey}
                            type="button"
                            onClick={() => {
                              const newVal = !isVal;
                              setRentSubCategories(prev => ({ ...prev, [catKey]: newVal }));
                              if (newVal && !rentSelected) {
                                setRentSelected(true);
                              }
                            }}
                            className={`px-4 py-2 text-xs rounded-xl flex items-center gap-2 border transition-all ${
                              isVal && rentSelected
                                ? "bg-white border-[#E0A6D4] text-[#9D0C82] font-semibold shadow-3xs" 
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-305 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`size-4 rounded-full flex items-center justify-center transition-all ${
                              isVal && rentSelected ? "bg-[#9D0C82] text-white" : "border border-slate-300 bg-white"
                            }`}>
                              {isVal && rentSelected && <Check size={10} strokeWidth={3} />}
                            </div>
                            {catKey}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation alert if none of those selected */}
              {!purchaseSelected && !rentSelected && (
                <div className="flex items-center gap-2.5 p-3.5 bg-[#FFF9E6] border border-[#FFE599] rounded-xl text-[#854D0E] text-xs font-semibold mt-1 animate-pulse">
                  <AlertTriangle size={15} className="shrink-0 text-amber-600" />
                  <span>กรุณาเลือกอย่างน้อย 1 ประเภทการสรรหา</span>
                </div>
              )}
            </div>

            {/* TYPES OF CRITERIA SELECTORS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1.5 font-sans">
              
              {/* Select Active Criteria Multi-Choice */}
              <div className="flex flex-col gap-2 p-5 bg-slate-50/50 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-150 pb-3 mb-2">
                  <div className="flex flex-col">
                    <label className="text-sm font-extrabold text-slate-850">1. เลือกเกณฑ์การประมวลผลหลัก</label>
                    <span className="text-[10px] text-slate-500 font-medium">เปิด/ปิด เงื่อนไขเกณฑ์วัดเพื่อใช้ประกอบแผนงาน</span>
                  </div>
                  
                  {/* AND / OR Segment Switch */}
                  <div className="flex bg-slate-150/70 p-0.5 rounded-lg border border-slate-255 select-none self-start sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setVmsMatchMode("AND");
                        setInfoToast("เลือกการตรวจสอบ VMS ครบทั้งหมด (AND): ต้องตรงทุกเกณฑ์ที่เลือกประจุเป็นแผน");
                        setTimeout(() => setInfoToast(null), 3000);
                      }}
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md transition-all ${
                        vmsMatchMode === "AND"
                          ? "bg-[#9D0C82] text-white shadow-3xs"
                          : "text-slate-500 hover:text-slate-805"
                      }`}
                    >
                      ตรงทุกเกณฑ์ (AND)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVmsMatchMode("OR");
                        setInfoToast("เลือกการตรวจสอบ VMS ยืดหยุ่น (OR): ผ่านเกณฑ์ใดเกณฑ์หนึ่งก็อนุมัติจัดหา");
                        setTimeout(() => setInfoToast(null), 3505);
                      }}
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md transition-all ${
                        vmsMatchMode === "OR"
                          ? "bg-amber-600 text-white shadow-3xs"
                          : "text-slate-500 hover:text-slate-805"
                      }`}
                    >
                      ตรงตัวใดตัวหนึ่ง (OR)
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mb-1 leading-normal">
                  * หากเลิกติ๊กเกณฑ์ ระบบจะละทิ้งเกณฑ์นั้นจากการประมวลผลทั้งหมดแบบเสรี หรือสลับสิทธิ์การกรอง (AND / OR) ด้วยปุ่มเลือกด้านบน
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "อายุรถ", label: "อายุการใช้งาน (ปี)" },
                    { id: "สภาพรถ", label: "สภาพประเมินทางกายภาพ" },
                    { id: "ประวัติซ่อมบำรุง", label: "ความถี่การซ่อมบำรุง" },
                    { id: "มาตรวัดระยะทาง", label: "มาตรวัดระยะทาง (กิโลเมตร)" },
                  ].map(item => {
                    const isChecked = activeCriteria.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setActiveCriteria(prev => prev.filter(c => c !== item.id));
                          } else {
                            setActiveCriteria(prev => [...prev, item.id]);
                          }
                        }}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-2.5 transition-all outline-none ${
                          isChecked 
                            ? "bg-white border-[#E0A6D4] text-[#9D0C82] font-semibold ring-1 ring-[#FAE6F4] shadow-xs" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className={`mt-0.5 size-4 rounded flex items-center justify-center transition-all shrink-0 ${
                          isChecked ? "bg-[#9D0C82] text-white" : "border border-slate-300 bg-white"
                        }`}>
                          {isChecked && <Check size={11} strokeWidth={3.5} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight">{item.id}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            {/* VERSION HISTORY & RETRIEVAL WORKFLOW OVERLAY MODAL */}
            {isHistoryModalOpen && (
              <div id="version_history_modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full flex flex-col overflow-hidden max-h-[90vh]">
                  
                  {/* Modal Header */}
                  <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-10 bg-[#FAE6F4] text-[#9D0C82] rounded-2xl flex items-center justify-center border border-[#FAE6F4] shadow-3xs">
                        <Clock size={18} />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-bold text-slate-950">
                          สารบัญประวัติรุ่นแผน และ รายการกู้คืน (Version History)
                        </h4>
                        <span className="text-[10px] text-slate-500 italic font-medium leading-none mt-1">
                          เปรียบเทียบ ตรวจรายละเอียด และดึงรายการรถยนต์ที่ถูกจำหน่ายออกกลับเข้ารุ่นแผนปัจจุบัน
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsHistoryModalOpen(false)}
                      className="size-8 rounded-full hover:bg-slate-100 border border-slate-150 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer font-bold"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[calc(90vh-120px)]">
                    
                    {/* SAVE CURRENT SNAPSHOT CONTROLS */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 border border-slate-200 rounded-2xl p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-extrabold text-slate-705 leading-none">บันทึกสแนปช็อตรุ่นปัจจุบัน (Save Snapshot)</span>
                        <p className="text-[10px] text-slate-450 mt-1 leading-normal">
                          บันทึกโครงสร้างสิทธิ์การเลือกรถในเวลานี้ ({vehicles.filter(v => v.checked).length} คัน) เพื่อใช้เปรียบเทียบหรือกู้คืนข้ามรุ่นภายหลัง
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center font-sans">
                        <input
                          type="text"
                          placeholder="ดราฟต์แก้ไข v4 เพื่อประเมิน..."
                          value={snapshotNameInput}
                          onChange={e => setSnapshotNameInput(e.target.value)}
                          className="px-3 h-9 bg-white border border-slate-200 focus:border-[#9D0C82] text-xs font-semibold text-slate-800 rounded-xl outline-none font-sans max-w-[200px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveCurrentSnapshot(snapshotNameInput)}
                          className="px-4.5 h-9 bg-[#9D0C82] hover:bg-[#7d0a68] text-white text-xs font-extrabold rounded-xl transition-all shadow-3xs flex items-center gap-1.5 cursor-pointer select-none"
                        >
                          <Plus size={13} className="stroke-[3]" />
                          <span>บันทึกรุ่นใหม่</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 font-sans">
                      
                      {/* Timeline list of Saved Versions */}
                      <div className="lg:col-span-1 flex flex-col gap-2.5 max-h-[350px] overflow-y-auto pr-1 border-r border-slate-100">
                        <span className="text-xs font-extrabold text-slate-600">เลือกรุ่นแผนงานในประวัติศาสตร์</span>
                        
                        {savedVersions.map((sv) => {
                          const isSelected = selectedVersionId === sv.version;
                          
                          return (
                            <div 
                              key={sv.version} 
                              onClick={() => setSelectedVersionId(isSelected ? null : sv.version)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer select-none text-left flex flex-col gap-1.5 ${
                                isSelected 
                                  ? "bg-white border-[#9D0C82] shadow-xs ring-1 ring-[#9D0C82]" 
                                  : "bg-white hover:bg-slate-50/80 border-slate-200 shadow-3xs/5"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-[11px] font-extrabold ${isSelected ? "text-[#9D0C82]" : "text-slate-700"} truncate max-w-[140px]`}>
                                  {sv.name}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono flex items-center gap-0.5 shrink-0">
                                  <Clock size={10} />
                                  {sv.timestamp.split(" ")[1]}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-normal line-clamp-1">
                                {sv.description}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] text-emerald-800 bg-emerald-50/50 border border-emerald-200/50 px-1.5 py-0.2 rounded font-semibold whitespace-nowrap">
                                  จัดหา {sv.allocatedCount} คัน
                                </span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold whitespace-nowrap ${
                                  sv.excludedCount > 0 
                                    ? "text-rose-800 bg-rose-50/50 border border-rose-200/50" 
                                    : "text-slate-500 bg-slate-50 border border-slate-200"
                                }`}>
                                  นำออก {sv.excludedCount} คืน
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Version Detail Excluded List Explorer */}
                      <div className="lg:col-span-2 bg-slate-50/50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 min-h-[300px]">
                        {selectedVersionId !== null ? (() => {
                          const ver = savedVersions.find(s => s.version === selectedVersionId);
                          if (!ver) return null;
                          return (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                                <div className="flex flex-col">
                                  <h5 className="text-xs font-extrabold text-slate-850">
                                    รายการตรวจรายละเอียดและกู้คืนวัตถุ: {ver.name}
                                  </h5>
                                  <span className="text-[10px] text-slate-450 italic mt-0.5 font-mono">
                                    บันทึกระบบเมื่อ: {ver.timestamp}
                                  </span>
                                </div>
                                {ver.excludedVehicles.length > 0 && (
                                  <button
                                    onClick={() => handleRestoreAllFromVersion(ver.version)}
                                    className="text-[10px] font-extrabold text-[#9D0C82] hover:text-[#7d0a68] bg-[#FAE6F4] px-2.5 py-1 rounded-md border border-[#9D0C82]/10 transition-all cursor-pointer flex items-center gap-1"
                                  >
                                    <RotateCcw size={10} className="stroke-[3]" />
                                    กู้คืนทั้งหมด ({ver.excludedVehicles.length} รายการ)
                                  </button>
                                )}
                              </div>

                              {ver.excludedVehicles.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center text-slate-405 gap-1 my-auto">
                                  <CheckCircle2 size={24} className="text-emerald-500" />
                                  <span className="text-xs font-bold text-slate-700">เวอร์ชันนี้สะอาดสมบูรณ์ (ไม่มีรถที่ถูกลบหรือถอดสิทธิ)</span>
                                  <span className="text-[10px]">ในขณะบันทึกเวอร์ชันนี้ ยานพาหนะเข้าร่วมแผนครบทั้ง 100%</span>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2 overflow-y-auto max-h-[250px] pr-1">
                                  {ver.excludedVehicles.map(ev => {
                                    const isCurrentlyActiveInWorkplace = vehicles.find(v => v.id === ev.id)?.checked === true;
                                    return (
                                      <div key={ev.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition-all">
                                        <div className="flex items-start gap-2.5 min-w-0">
                                          <div className="size-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0 mt-0.5">
                                            <X size={10} className="stroke-[4]" />
                                          </div>
                                          <div className="flex flex-col gap-0.5 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-xs font-extrabold text-slate-800 truncate">
                                                {ev.licence}
                                              </span>
                                              <span className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.1 rounded whitespace-nowrap">
                                                {ev.type}
                                              </span>
                                            </div>
                                            <p className="text-[10.5px] text-rose-800 leading-tight italic truncate">
                                              "{ev.reason}"
                                            </p>
                                          </div>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-1.5 self-end sm:self-center">
                                          {isCurrentlyActiveInWorkplace ? (
                                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-150 px-2.5 py-0.5 rounded flex items-center gap-0.5 select-none scale-95">
                                              <Check size={9} className="stroke-[4]" />
                                              อยู่ในแผนปัจจุบันแล้ว
                                            </span>
                                          ) : (
                                            <button
                                              onClick={() => handleRestoreVehicle(ev.id, ev.licence)}
                                              className="text-[10px] font-extrabold text-[#027A48] hover:text-[#015f37] border border-[#BCF0DA] bg-[#ECFDF5] px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1"
                                            >
                                              <Plus size={10} className="stroke-[3]" />
                                              ดึงคันนี้คืนกลับมา
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          );
                        })() : (
                          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 gap-2.5 my-auto">
                            <div className="size-10 rounded-full bg-slate-50 text-slate-450 border border-slate-250 flex items-center justify-center">
                              <Clock size={18} />
                            </div>
                            <div className="text-xs font-bold text-slate-655">ยังไม่ได้เลือกรุ่นแผนงานประวัติศาสตร์</div>
                            <p className="text-[10.5px] text-slate-450 max-w-[280px]">
                              คลิกเลือกเวอร์ชันแผงด้านซ้าย เพื่อสำรวจรายการยานพาหนะที่เคยลบออกและกดดึงคืน กลับเข้าแผนจัดหาของรอบปัจจุบันได้ทันที
                            </p>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                  
                  {/* Modal Footer */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => setIsHistoryModalOpen(false)}
                      className="px-5 py-2 hover:bg-slate-100 text-xs text-slate-600 font-bold rounded-xl border border-slate-200 hover:text-[#9D0C82] hover:bg-[#FAE6F4]/10 transition-all cursor-pointer font-sans"
                    >
                      ปิดหน้าต่างประวัติ
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Column 2: Parameters settings of Active Criteria */}
            {activeVehicleTypes.length > 0 && (
              <div className="flex flex-col gap-3 p-5 bg-slate-50/50 rounded-2xl border border-slate-200">
                <div className="flex flex-col gap-0.5 border-b border-slate-150 pb-3 mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ส่วนที่ 2</span>
                  <label className="text-sm font-extrabold text-slate-850">กำหนดเงื่อนไขรายกลุ่มประเภทรถยนต์</label>
                  <span className="text-[10px] text-slate-500 font-medium">ตั้งเกณฑ์ขั้นต่ำในการพิจารณาเสนอขอขอจัดจ่ายรถยนต์แต่ละประเภท</span>
                </div>

                <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                  {activeVehicleTypes.map((vehicleType) => {
                    const settings = criteriaSettings[vehicleType];
                    if (!settings) return null;
                    return (
                      <div key={vehicleType} className="p-4 bg-white border border-slate-120 rounded-2xl shadow-3xs flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-xs font-extrabold text-slate-800">{vehicleType}</span>
                          <span className="text-[9px] text-[#9D0C82] bg-[#FAE6F4] border border-[#FAE6F4] px-2 py-0.5 rounded-full font-extrabold">ใช้งานเกณฑ์</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {/* Age criteria */}
                          {activeCriteria.includes("อายุรถ") && (
                            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#FAE6F4]/5 border border-[#FAE6F4]/30">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-extrabold text-[#9D0C82]">เกณฑ์อายุรถขั้นต่ำ (ปี)</span>
                              </div>
                              <input 
                                type="number"
                                value={settings.age}
                                onChange={e => {
                                  const text = e.target.value;
                                  setCriteriaSettings(prev => ({
                                    ...prev,
                                    [vehicleType]: { ...prev[vehicleType], age: text }
                                  }));
                                }}
                                className="w-full h-9 px-3 bg-white border border-[#E5E7EB] focus:border-[#9D0C82] text-xs font-bold text-slate-850 rounded-lg outline-none font-sans"
                              />
                            </div>
                          )}

                          {/* Condition criteria */}
                          {activeCriteria.includes("สภาพรถ") && (
                            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-blue-50/50 border border-blue-100/60">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-extrabold text-blue-700">เกณฑ์สภาพเสื่อมขั้นต่ำ</span>
                              </div>
                              <select 
                                value={settings.condition}
                                onChange={e => {
                                  const val = e.target.value;
                                  setCriteriaSettings(prev => ({
                                    ...prev,
                                    [vehicleType]: { ...prev[vehicleType], condition: val }
                                  }));
                                }}
                                className="w-full h-9 px-2 bg-white border border-[#E5E7EB] focus:border-[#9D0C82] text-xs font-bold text-slate-850 rounded-lg outline-none font-sans"
                              >
                                <option value="ทุกสภาพ">ทุกสภาพ</option>
                                <option value="เสื่อมสภาพ">เสื่อมสภาพ</option>
                                <option value="ชำรุด">ชำรุด</option>
                                <option value="ชำรุดมาก">ชำรุดมาก</option>
                              </select>
                            </div>
                          )}

                          {/* Repair frequency criteria */}
                          {activeCriteria.includes("ประวัติซ่อมบำรุง") && (
                            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-amber-50/50 border border-[#FFE7C4]/70">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-extrabold text-amber-700 font-sans">ค่าน้ำหนักความถี่ซ่อมสะสม</span>
                              </div>
                              <select 
                                value={settings.repairFreq}
                                onChange={e => {
                                  const val = e.target.value;
                                  setCriteriaSettings(prev => ({
                                    ...prev,
                                    [vehicleType]: { ...prev[vehicleType], repairFreq: val }
                                  }));
                                }}
                                className="w-full h-9 px-2 bg-white border border-[#E5E7EB] focus:border-[#9D0C82] text-xs font-bold text-slate-850 rounded-lg outline-none font-sans"
                              >
                                <option value="ปกติ">ปกติ / เสนอได้ทั้งหมด</option>
                                <option value="ปานกลาง">ปานกลางขึ้นไป</option>
                                <option value="สูง">เฉพาะสะสมสูง</option>
                              </select>
                            </div>
                          )}

                          {/* Mileage criteria */}
                          {activeCriteria.includes("มาตรวัดระยะทาง") && (
                            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-teal-50/40 border border-teal-100">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-extrabold text-teal-700">ระยะทางสะสมขั้นต่ำ (กม.)</span>
                              </div>
                              <input 
                                type="number"
                                value={settings.odometer}
                                onChange={e => {
                                  const text = e.target.value;
                                  setCriteriaSettings(prev => ({
                                    ...prev,
                                    [vehicleType]: { ...prev[vehicleType], odometer: text }
                                  }));
                                }}
                                className="w-full h-9 px-3 bg-white border border-[#E5E7EB] focus:border-[#9D0C82] text-xs font-bold text-slate-850 rounded-lg outline-none font-sans"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            </div>

            {/* CRITERIA BUILDER FOOTER: RESET AND ADD CARS */}
            <div className="flex items-center justify-between mt-3 pt-5 border-t border-gray-100 font-sans">
              <div className="flex items-center gap-3.5">
                <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  คัดแยกได้ {vehicles.length} จาก {initialVehicles.length} คันในระบบ VMS
                </span>
                <button
                  type="button"
                  onClick={handleResetCriteria}
                  className="text-[#9D0C82] hover:text-[#7d0a68] text-xs font-bold underline transition-all cursor-pointer bg-slate-50 px-2.5 py-1 rounded border border-slate-200"
                >
                  คืนค่าตั้งต้น
                </button>
              </div>

              <button
                type="button"
                onClick={handleApplyCriteria}
                className="px-6 py-3 bg-[#9D0C82] hover:bg-[#7d0a68] text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Plus size={16} strokeWidth={2.5} />
                คัดกรองพัสดุและจัดสรรแผนงานใหม่
              </button>
            </div>

          </div>



          {/* TABLE VEHCLES BOX */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-3xs p-6 flex flex-col gap-5 mt-1.5">
            
            {/* Control toolbar Header with Real-time active status banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <h4 className="text-sm font-bold text-slate-800">
                    บัญชีรายชื่อพาหนะและพัสดุ ผ่านเกณฑ์การคัดจัดจ่าย (VMS)
                  </h4>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="size-1 bg-emerald-500 rounded-full inline-block" />
                    ประมวลผลเป้าหมายอัตโนมัติ (Live Active)
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  ระบบคัดเลือกและคำนวณสิทธิ์จัดจ่ายยานพาหนะตามเกณฑ์มาตรฐาน VMS ล่าสุดแบบเรียลไทม์ (เมื่อเปลี่ยนอายุรถหรือเงื่อนไขพารามิเตอร์ด้านบน ตารางจะอัปเดตสิทธิ์ทันที)
                </p>
              </div>
              <div className="text-xs text-[#9D0C82] font-bold bg-[#FAE6F4] px-3.5 py-1.5 rounded-xl border border-[#9D0C82]/20 select-none flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                <CheckCircle2 size={13} className="text-[#9D0C82]" />
                <span>พร้อมจัดสรรงบประมาณ</span>
              </div>
            </div>

            {/* Search & Actions bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="relative w-full sm:max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="ค้นหาทะเบียนรถ / ประเภทรถยนต์ / ชื่อหน่วยงานพัสดุ..."
                  value={searchVehQuery}
                  onChange={e => {
                    setSearchVehQuery(e.target.value);
                    setVehCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 h-11 bg-slate-50 border border-[#E5E7EB] focus:border-[#9D0C82] focus:bg-white rounded-xl text-sm text-slate-800 outline-none transition-all font-sans"
                />
                {searchVehQuery && (
                  <button onClick={() => setSearchVehQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button className="flex items-center gap-1.5 px-4 h-11 bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-3xs transition-all cursor-pointer">
                  <Filter size={14} />
                  ตัวกรองย่อย
                </button>
                <button 
                  onClick={() => {
                    const checkedIds = vehicles.filter(v => v.checked).map(v => v.id);
                    if (checkedIds.length === 0) {
                      alert("กรุณาทำเครื่องหมายขีดเลือกรถในตารางที่ต้องการลบออกอย่างน้อย 1 รายการก่อน");
                      return;
                    }
                    if (confirm(`คุณต้องการลบรถที่เลือกทั้งจำนวน ${checkedIds.length} รายการออกใช่หรือไม่?`)) {
                      setVehicles(prev => prev.filter(v => !v.checked));
                      setInfoToast(`ลบรถออกจากเกณฑ์แผนงานสำเร็จ ${checkedIds.length} คัน`);
                      setTimeout(() => setInfoToast(null), 3000);
                    }
                  }}
                  className="px-4.5 h-11 bg-slate-100 hover:bg-red-50 hover:text-red-650 text-slate-650 rounded-xl text-xs font-semibold transition-all cursor-pointer border border-transparent hover:border-red-100"
                >
                  ลบออก ({vehicles.filter(v => v.checked).length})
                </button>
              </div>

            </div>

            {/* LIST VEHICLE DATA TABLE */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-3xs">
              <table className="w-full text-left border-collapse font-sans min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">
                      <input 
                        type="checkbox"
                        checked={isAllPageChecked}
                        onChange={toggleAllPageChecked}
                        className="accent-[#9D0C82] size-3.5 rounded cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-3 w-16 text-center">ลำดับ</th>
                    <th className="py-3.5 px-4">ป้ายทะเบียนรถ</th>
                    <th className="py-3.5 px-4">กลุ่มประเภทรถยนต์</th>
                    <th className="py-3.5 px-4">คุณลักษณะ (Telemetry)</th>
                    <th className="py-3.5 px-4 text-left">สถานะและการสอดคล้องเกณฑ์ VMS</th>
                    <th className="py-3.5 px-4">หน่วยงานรับจัดสรร</th>
                    <th className="py-3.5 px-4 text-right">ยอดราคารถ</th>
                    <th className="py-3.5 px-4 w-24 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-slate-700">
                  {paginatedVehicles.map((row, idx) => {
                    const fileIndex = (vehCurrentPage - 1) * pageSize + idx + 1;
                    
                    // Generate dynamic criteria evaluations for this vehicle row
                    const matchedCriteriaList: { name: string; val: string }[] = [];
                    const unmatchedCriteriaList: { name: string; val: string }[] = [];
                    const typeSet = criteriaSettings[row.type as keyof typeof criteriaSettings];
                    if (typeSet) {
                      // Age Check
                      if (activeCriteria.includes("อายุรถ")) {
                        const isMatch = row.age >= (Number(typeSet.age) || 0);
                        const labelObj = { name: "อายุรถ", val: `อายุ (${row.age}/${typeSet.age} ปี)` };
                        if (isMatch) matchedCriteriaList.push(labelObj);
                        else unmatchedCriteriaList.push(labelObj);
                      }
                      // Condition Check
                      if (activeCriteria.includes("สภาพรถ")) {
                        const activeCond = typeSet.condition;
                        let condMatch = false;
                        if (activeCond === "ทุกสภาพ") condMatch = true;
                        else if (activeCond === "ชำรุด" && (row.condition === "ชำรุด" || row.condition === "ชำรุดมาก")) condMatch = true;
                        else if (activeCond === "เสื่อมสภาพ" && (row.condition === "เสื่อมสภาพ" || row.condition === "ชำรุด" || row.condition === "ชำรุดมาก")) condMatch = true;
                        else if (activeCond === "ชำรุดมาก" && row.condition === "ชำรุดมาก") condMatch = true;
                        else if (row.condition === activeCond) condMatch = true;
                        
                        const labelObj = { name: "สภาพรถ", val: `สภาพ: ${row.condition}` };
                        if (condMatch) matchedCriteriaList.push(labelObj);
                        else unmatchedCriteriaList.push(labelObj);
                      }
                      // Repair Check
                      if (activeCriteria.includes("ประวัติซ่อมบำรุง")) {
                        const activeRepair = typeSet.repairFreq;
                        let repairMatch = false;
                        if (activeRepair === "ปกติ") repairMatch = true;
                        else if (activeRepair === "ปานกลาง" && (row.repairFreq === "ปานกลาง" || row.repairFreq === "สูง")) repairMatch = true;
                        else if (row.repairFreq === activeRepair) repairMatch = true;

                        const labelObj = { name: "ประวัติซ่อมบำรุง", val: `ซ่อมบำรุง: ${row.repairFreq}` };
                        if (repairMatch) matchedCriteriaList.push(labelObj);
                        else unmatchedCriteriaList.push(labelObj);
                      }
                      // Odometer Check
                      if (activeCriteria.includes("มาตรวัดระยะทาง")) {
                        const odometerThreshold = Number(typeSet.odometer) || 0;
                        const isMatch = row.odometer >= odometerThreshold;
                        const labelObj = { name: "มาตรวัดระยะทาง", val: `ไมล์ ${(row.odometer/1000).toFixed(0)}k/${(odometerThreshold/1000).toFixed(0)}k กม.` };
                        if (isMatch) matchedCriteriaList.push(labelObj);
                        else unmatchedCriteriaList.push(labelObj);
                      }
                    }
                    
                    const totalActiveCount = activeCriteria.length;
                    const matchedCount = matchedCriteriaList.length;

                    return (
                      <tr key={row.id} className={`hover:bg-[#FAE6F4]/5 transition-all text-slate-800 border-b border-gray-50 ${row.checked ? "bg-white" : "bg-slate-50/40 opacity-60"}`}>
                        <td className="py-4 px-4 text-center">
                          <input 
                            type="checkbox"
                            checked={row.checked}
                            onChange={() => toggleRowChecked(row.id)}
                            className="accent-[#9D0C82] size-3.5 rounded cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-3 text-center text-slate-400 font-mono text-xs font-semibold">{fileIndex}</td>
                        <td className="py-4 px-4">
                          {/* Thai License Plate Styled Badge */}
                          <div className="flex flex-col items-center justify-center p-1 px-2.5 bg-gradient-to-b from-white to-slate-50 border border-slate-300 rounded shadow-3xs leading-none min-w-[120px] max-w-[140px] inline-flex">
                            <span className="text-[13px] font-extrabold text-slate-800 tracking-tight">{row.licence.split(" ").slice(0, 2).join(" ")}</span>
                            <span className="text-[9px] font-bold text-slate-550 mt-1 select-none">{row.licence.split(" ").slice(2).join(" ") || "กรุงเทพฯ"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-left">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold leading-none shadow-3xs/5 border ${
                            row.type.includes("ตู้โดยสาร")
                              ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                              : row.type.includes("กระบะ")
                                ? "bg-[#FFE7C4]/30 border-[#FFE7C4]/60 text-amber-800"
                                : row.type.includes("บรรทุก")
                                  ? "bg-rose-50 border-rose-100 text-rose-700"
                                  : row.type.includes("นั่ง")
                                    ? "bg-[#FAE6F4] border-[#FAE6F4]/70 text-[#9D0C82]"
                                    : "bg-teal-50 border-teal-100 text-teal-700"
                          }`}>
                            {row.type}
                          </span>

                          {/* Dynamic VMS Parameter limits per row type */}
                          {typeSet && (
                            <div className="flex flex-col gap-0.5 mt-2 border-t border-dashed border-slate-150 pt-1.5 max-w-[170px] select-none">
                              <span className="text-[10px] text-slate-400 font-bold">เกณฑ์ปัจจุบัน VMS:</span>
                              <div className="flex flex-wrap gap-1 leading-none">
                                {activeCriteria.includes("อายุรถ") && (
                                  <span className="text-[9px] text-[#9D0C82] font-semibold bg-[#FAE6F4]/40 px-1 py-0.5 rounded border border-[#E0A6D4]/10">
                                    อายุ &ge; {typeSet.age} ปี
                                  </span>
                                )}
                                {activeCriteria.includes("สภาพรถ") && (
                                  <span className="text-[9px] text-blue-700 font-semibold bg-blue-50/70 px-1 py-0.5 rounded border border-blue-100/30">
                                    สภาพ &ge; {typeSet.condition === "ทุกสภาพ" ? "เสรี" : typeSet.condition}
                                  </span>
                                )}
                                {activeCriteria.includes("ประวัติซ่อมบำรุง") && (
                                  <span className="text-[9px] text-amber-700 font-semibold bg-amber-50/70 px-1 py-0.5 rounded border border-[#FFE7C4]/30">
                                    ซ่อม &ge; {typeSet.repairFreq}
                                  </span>
                                )}
                                {activeCriteria.includes("มาตรวัดระยะทาง") && (
                                  <span className="text-[9px] text-teal-700 font-semibold bg-teal-50/70 px-1 py-0.5 rounded border border-teal-100/30">
                                    ไมล์ &ge; {(Number(typeSet.odometer) / 1000).toFixed(0)}k กม.
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {/* Rich telemetry grid */}
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-sans tracking-tight max-w-[200px]">
                            <div className="flex items-center gap-1 text-slate-500">
                              <span>อายุรถ:</span>
                              <strong className="text-slate-800 font-bold bg-slate-100 px-1 py-0.5 rounded text-[10px]">{row.age} ปี</strong>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500">
                              <span>สภาพ:</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold leading-none ${
                                row.condition === "ชำรุดมาก" || row.condition === "ชำรุด" 
                                  ? "bg-rose-50 text-rose-700 border border-rose-100" 
                                  : row.condition === "เสื่อมสภาพ" 
                                    ? "bg-amber-50 text-amber-700 border border-[#FFE7C4]"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              }`}>{row.condition}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-400 font-mono col-span-2">
                              <span>มาตรวัดไมล์:</span>
                              <strong className="text-slate-705 font-bold">{row.odometer.toLocaleString()} กม.</strong>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-left">
                          {!row.checked ? (
                            /* Beautiful Deselect/Exclusion Status Indicator with Remarks and VMS Checklist */
                            <div className="flex flex-col gap-2 min-w-[200px] max-w-[244px]">
                              <div className="flex items-center">
                                {row.exclusionReason === "สอดคล้องไม่ครบทุกเกณฑ์ชี้วัด (VMS)" ? (
                                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-[11px] rounded-full shadow-3xs flex items-center gap-1.5 leading-none select-none">
                                    <span className="size-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
                                    ตรงบางเกณฑ์ (ไม่ได้จัดสรร) ({matchedCount}/{totalActiveCount})
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 bg-rose-50 border border-rose-150 text-rose-700 font-extrabold text-[11px] rounded-full shadow-3xs flex items-center gap-1.5 leading-none select-none">
                                    <span className="size-1.5 rounded-full bg-rose-500 inline-block" />
                                    ยกเว้นจัดสรร ({row.exclusionReason ? "กำหนดเอง" : "ข้าม"})
                                  </span>
                                )}
                              </div>

                              {row.exclusionReason !== "สอดคล้องไม่ครบทุกเกณฑ์ชี้วัด (VMS)" && (
                                <p className="text-[10px] bg-white text-slate-650 px-2.5 py-1.5 rounded-lg border border-red-100 font-medium leading-normal italic">
                                  "{row.exclusionReason || "งบประมาณประจำส่วนไม่เพียงพอ"}"
                                </p>
                              )}

                              {/* VMS compliance criteria dynamic check list showing passed/failed items even when deselected */}
                              {totalActiveCount > 0 && (
                                <div className="flex flex-col gap-1 border border-slate-150 rounded-xl p-2.5 bg-slate-50/50 shadow-3xs/5">
                                  {/* Matched ones (Pass) */}
                                  {matchedCriteriaList.map(item => (
                                    <div key={item.name} className="flex items-center gap-1.5 text-[9px] text-emerald-800 bg-emerald-50/40 border border-emerald-200/20 px-2 py-0.5 rounded select-none font-semibold">
                                      <Check size={8} className="stroke-[4] text-emerald-600 shrink-0" />
                                      <span className="truncate">{item.val}</span>
                                      <span className="ml-auto text-[7px] bg-emerald-500 text-white font-bold px-0.5 rounded scale-90">ผ่าน</span>
                                    </div>
                                  ))}
                                  
                                  {/* Unmatched ones (Fail) */}
                                  {unmatchedCriteriaList.map(item => (
                                    <div key={item.name} className="flex items-center gap-1.5 text-[9px] text-rose-750 bg-rose-50/40 border border-rose-200/20 px-2 py-0.5 rounded select-none font-bold">
                                      <X size={8} className="stroke-[4] text-rose-500 shrink-0" />
                                      <span className="truncate">{item.val}</span>
                                      <span className="ml-auto text-[7px] bg-rose-500 text-white font-bold px-0.5 rounded scale-90">ไม่สอดคล้อง</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2 min-w-[200px] max-w-[244px]">
                              {/* Compliance state Pill/Indicator */}
                              <div className="flex items-center">
                                {totalActiveCount === 0 ? (
                                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-500 font-bold text-[11px] rounded-full flex items-center gap-1.5 leading-none select-none">
                                    <span className="size-1.5 rounded-full bg-slate-400 inline-block" />
                                    ไม่ได้ระบุเกณฑ์ VMS
                                  </span>
                                ) : matchedCount === totalActiveCount ? (
                                  <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-150 text-emerald-700 font-extrabold text-[11px] rounded-full shadow-3xs flex items-center gap-1.5 leading-none select-none">
                                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                                    สอดคล้องครบถ้วน ({matchedCount}/{totalActiveCount})
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-700 font-extrabold text-[11px] rounded-full shadow-3xs flex items-center gap-1.5 leading-none select-none">
                                    <span className="size-1.5 rounded-full bg-amber-500 inline-block" />
                                    ตรงบางเกณฑ์ ({matchedCount}/{totalActiveCount})
                                  </span>
                                )}
                              </div>

                              {/* Corresponding sub-criteria list showing both passed and failed items */}
                              {totalActiveCount > 0 ? (
                                <div className="flex flex-col gap-1.5 border border-slate-150 rounded-xl p-2.5 bg-slate-50/50 shadow-3xs/5">
                                  {/* Matched ones (Pass) */}
                                  {matchedCriteriaList.map(item => (
                                    <div key={item.name} className="flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50/60 border border-emerald-200/50 px-2 py-1 rounded-md select-none font-semibold">
                                      <Check size={9} className="stroke-[4] text-emerald-600 shrink-0" />
                                      <span className="truncate">{item.val}</span>
                                      <span className="ml-auto text-[8px] bg-emerald-500 text-white font-bold px-1 rounded scale-90 select-none">ผ่าน</span>
                                    </div>
                                  ))}
                                  
                                  {/* Unmatched ones (Fail) */}
                                  {unmatchedCriteriaList.map(item => (
                                    <div key={item.name} className="flex items-center gap-1.5 text-[10px] text-rose-700 bg-rose-50/60 border border-rose-200/40 px-2 py-1 rounded-md select-none font-bold">
                                      <X size={9} className="stroke-[4] text-rose-500 shrink-0" />
                                      <span className="truncate">{item.val}</span>
                                      <span className="ml-auto text-[8px] bg-rose-500 text-white font-bold px-1 rounded scale-90 select-none">ไม่ถึงเกณฑ์</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">แสดงผลทุกรายการรถยนต์เนื่องจากไม่เลือกเกณฑ์</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-slate-600">{row.department}</td>
                        <td className="py-4 px-4 text-right font-extrabold font-mono tracking-tight text-slate-900 text-xs sm:text-sm">
                          {row.price.toLocaleString(undefined, {minimumFractionDigits: 2})} ฿
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="p-1 px-1.5 hover:text-slate-800 text-slate-400 hover:bg-slate-100 rounded-lg transition-all" title="ดูรายละเอียดพัสดุ">
                              <Eye size={14} />
                            </button>
                            <button 
                              onClick={() => deleteRow(row.id, row.licence)}
                              className="p-1 px-1.5 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-all" 
                              title="ลบย้ายออก"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedVehicles.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 px-4 text-center text-slate-400 font-sans">
                        <AlertTriangle size={24} className="mx-auto text-amber-500 mb-2" />
                        <p className="text-sm font-semibold text-slate-700">ไม่พบข้อมูลพัสดุตามเกณฑ์ VMS ปัจจุบัน</p>
                        <p className="text-xs text-slate-500 mt-1">กรุณาลองปรับลดเกณฑ์อายุการใช้งาน สภาพรถ หรือระยะไมล์ด้านบนอีกครั้ง</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total aggregation layout of the table */}
            <div className="flex justify-end p-2 pr-4 text-slate-700 font-sans border-t border-slate-100 pt-4">
              <p className="text-sm">
                จำนวนที่คัดกรองได้ <strong className="text-[#9D0C82] text-base">{filteredVehicles.length}</strong> คัน จากทั้งหมด <strong className="text-slate-700 text-base">{initialVehicles.length}</strong> คัน มูลค่าแผนรวม <strong className="text-[#9D0C82] text-base">{(currentDisplayedBudget).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ฿</strong>
              </p>
            </div>

            {/* PAGINATION ROW AT BOTTOM */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-5 text-xs text-[#4B5563] font-sans">
              
              <div className="flex items-center gap-3">
                <span>แสดง {filteredVehicles.length === 0 ? 0 : (vehCurrentPage - 1) * pageSize + 1} ถึง {Math.min(vehCurrentPage * pageSize, filteredVehicles.length)} จาก {filteredVehicles.length} รายการ</span>
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setVehCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-md outline-none cursor-pointer font-bold"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={vehCurrentPage === 1}
                    onClick={() => setVehCurrentPage(prev => prev - 1)}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: totalPages }, (_, pageIdx) => {
                    const pageNum = pageIdx + 1;
                    const isActive = vehCurrentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setVehCurrentPage(pageNum)}
                        className={`size-7.5 text-xs font-semibold rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isActive 
                            ? "bg-[#9D0C82] text-white font-bold" 
                            : "hover:bg-slate-100 text-slate-700 bg-white"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={vehCurrentPage === totalPages}
                    onClick={() => setVehCurrentPage(prev => prev + 1)}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}

            </div>

          </div>

          {/* DRAFT WIZARD ACTIONS BAR BOTTOM OF CRITERIA */}
          <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-2xl p-6.5 mt-2.5 font-sans shadow-3xs font-semibold">
            <button
              onClick={() => setDraftWizardStep("form")}
              className="text-[#9D0C82] hover:text-[#7d0a68] font-bold text-sm transition-colors cursor-pointer"
            >
              ย้อนกลับ
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-5 py-2.5 bg-[#FAE6F4] text-[#9D0C82] hover:bg-[#FAE6F4]/80 font-bold text-sm rounded-xl border border-[#9D0C82]/30 transition-all cursor-pointer"
              >
                บันทึกแบบร่าง
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedCount === 0) {
                    alert("กรุณาเลือกหรือเพิ่มรถตรงเกณฑ์ไว้ในตารางอย่างน้อย 1 ยานพาหนะ เพื่อดำเนินการส่งสรุปต่อไป");
                    return;
                  }
                  setDraftWizardStep("form" as any);
                  handleSaveDraft();
                }}
                className="px-6 py-2.5 bg-[#9D0C82] hover:bg-[#7d0a68] text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
              >
                ต่อไป (บันทึกข้อมูลแบบร่างถัดไป)
              </button>
            </div>
          </div>

        </div>
      )}

      {/* EXCLUSION REASON & CONFIRMATION MODAL */}
      {pendingUncheckId && (() => {
        const target = vehicles.find(v => v.id === pendingUncheckId);
        if (!target) return null;
        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300">
            <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header Box */}
              <div className="bg-[#9D0C82]/5 px-6 py-5 border-b border-rose-100/50 flex items-center gap-3">
                <div className="size-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-850">ยืนยันการไม่คืนจัดหา / ยกเว้นทะเบียนรถออก</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">ระบุหมายเหตุเพื่อยืนยันการยกเว้นจัดสรรพัสดุนี้ออกจากแผนงาน</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-4">
                
                {/* Micro info card of target vehicle */}
                <div className="bg-slate-50/70 p-3.5 border border-slate-150 rounded-xl grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-semibold text-slate-705">
                  <div>
                    เลขทะเบียนรถ: <span className="font-bold text-slate-900 font-mono text-[12px] tracking-tight">{target.licence}</span>
                  </div>
                  <div>
                    กลุ่มประเภท: <span className="font-bold text-slate-900">{target.type}</span>
                  </div>
                  <div>
                    สังกัดใช้พัสดุ: <span className="font-bold text-slate-900">{target.department}</span>
                  </div>
                  <div>
                    ประมาณการราคา: <span className="font-black text-[#9D0C82]">{target.price.toLocaleString()} บาท</span>
                  </div>
                </div>

                {/* Question */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-800">
                    กรุณาทำเครื่องหมายระบุเหตุผลประกอบการคัดออก <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-1.5 mt-1">
                    {[
                      "งบประมาณประจำส่วนไม่เพียงพอจัดสรรในปีนี้",
                      "ฝ่ายธุรการประเมินแล้วยังคงซ่อมแซมต่อเองได้ตามแผน",
                      "มีรถยนต์ทดสอบใช้งานหมุนเวียนเพียงพอแล้ว",
                      "ถอดเพื่อนำหน้าที่ดังกล่าวไปใช้โครงการตู้โดยสารเช่ากองกลางแทน",
                      "เหตุผลอื่นๆ (ระบุหมายเหตุเอง)"
                    ].map(reason => {
                      const isSelected = uncheckPresetReason === reason;
                      return (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setUncheckPresetReason(reason)}
                          className={`text-left text-[11px] p-2.5 rounded-xl border flex items-center gap-2.5 transition-all outline-none ${
                            isSelected 
                              ? "bg-rose-50/50 border-[#E0A6D4] text-[#9D0C82] font-semibold shadow-2xs" 
                              : "bg-white border-slate-200 text-slate-605 hover:bg-slate-50"
                          }`}
                          style={{ padding: '10px 14px' }}
                        >
                          <div className={`size-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? "border-[#9D0C82] bg-[#9D0C82]" : "border-slate-350 bg-white"
                          }`}>
                            {isSelected && <div className="size-1 rounded-full bg-white" />}
                          </div>
                          <span>{reason}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Remark Input */}
                {uncheckPresetReason === "เหตุผลอื่นๆ (ระบุหมายเหตุเอง)" && (
                  <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-1.5 duration-150">
                    <label className="text-[11px] font-bold text-slate-700">กรอกหมายเหตุระบุเหตุผลด้วยตนเอง <span className="text-rose-500">*</span></label>
                    <textarea
                      placeholder="กรุณากรอกระบุเหตุผลจำเพาะที่จำเป็นต้องเอาออกหรือไม่เอาไปจัดหา..."
                      value={uncheckCustomReason}
                      onChange={e => setUncheckCustomReason(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 focus:border-[#9D0C82] focus:bg-white rounded-xl outline-none font-sans leading-relaxed"
                    />
                  </div>
                )}

              </div>

              {/* Footer Actions */}
              <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-150 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPendingUncheckId(null)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const finalReason = uncheckPresetReason === "เหตุผลอื่นๆ (ระบุหมายเหตุเอง)" 
                      ? (uncheckCustomReason.trim() || "ถอดถอนผู้รับจัดหาโดยฝ่ายธุรการพัสดุ")
                      : uncheckPresetReason;
                    
                    setVehicles(prev => prev.map(v => v.id === pendingUncheckId ? { ...v, checked: false, exclusionReason: finalReason } : v));
                    setPendingUncheckId(null);
                    setInfoToast(`แก้ไขแผนและตัดการจัดหาพัสดุเลขทะเบียน "${target.licence.split(" ").slice(0, 2).join(" ")}" แล้ว`);
                    setTimeout(() => setInfoToast(null), 3000);
                  }}
                  className="px-5 py-2 bg-[#9D0C82] hover:bg-[#7d0a68] text-white font-extrabold text-xs rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  บันทึกคำคัดสรรและยกเว้นพัสดุ
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
