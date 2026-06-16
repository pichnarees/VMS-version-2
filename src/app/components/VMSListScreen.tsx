/**
 * Hi-Fi Grayscale Wireframe — แผนการสรรหายานพาหนะ
 * Layout & proportions match the Figma design 1:1; all colour replaced with grey.
 */

import {
  Home,
  Car,
  AlertTriangle,
  Shield,
  Database,
  Zap,
  Wrench,
  Siren,
  Newspaper,
  Sun,
  Bell,
  Search,
  ListFilter,
  Plus,
  FileText,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ─── design tokens (greyscale) ─────────────────────── */
// All bg / border / text mirrors the Figma values but desaturated.
const T = {
  sidebarBg: "#ffffff",
  sidebarBorder: "#eaecf0",
  headerBg: "#ffffff",
  headerBorder: "#eaecf0",
  pageBg: "#ffffff",
  tableTH: "#f2f4f7",
  tableRowAlt: "#f9fafb",
  tableRowBorder: "#eaecf0",
  border: "#d0d5dd",
  text1: "#101828",
  text2: "#344054",
  text3: "#475467",
  text4: "#667085",
  text5: "#98a2b3",
  btnPrimary: "#374151",   // purple → dark grey
  btnPrimaryText: "#ffffff",
  iconColor: "#667085",
  badgeBorder: "#d0d5dd",
  badgeBg: "#f2f4f7",
  badgeText: "#344054",
  pagActiveBtn: "#eaecf0",
};

/* ─── sidebar nav items ─────────────────────────────── */
const NAV_ICONS = [
  { icon: Home,          key: "home" },
  { icon: Car,           key: "car_rental" },
  { icon: AlertTriangle, key: "traffic_jam" },
  { icon: Shield,        key: "car_insurance" },
  { icon: Database,      key: "database" },
  { icon: Zap,           key: "ev_station" },
  { icon: Wrench,        key: "build" },
  { icon: Siren,         key: "emergency" },
  { icon: Newspaper,     key: "news" },
];

/* ─── table data ────────────────────────────────────── */
type Status = "pending" | "rejected" | "approved";
interface Row {
  name: string;
  year: string;
  amount: string;
  count: string;
  date: string;
  time: string;
  status: string;
  variant: Status;
}

const ROWS: Row[] = [
  {
    name: "แผนการสรรหายานพาหนะประจำปี 2569",
    year: "2569 - 2570",
    amount: "204,000,000",
    count: "36",
    date: "16 พ.ค. 2568",
    time: "15:18",
    status: "รอดำเนินการอนุมัติ",
    variant: "pending",
  },
  {
    name: "แผนการสรรหายานพาหนะเพิ่มเติมประจำปี 2568",
    year: "2568 - 2569",
    amount: "185,000,000",
    count: "24",
    date: "12 ส.ค. 2568",
    time: "13:45",
    status: "ไม่อนุมัติ",
    variant: "rejected",
  },
  {
    name: "แผนการสรรหายานพาหนะเฉพาะกิจ ปี 2568",
    year: "2569 - 2570",
    amount: "120,000,000",
    count: "12",
    date: "20 มิ.ย. 2568",
    time: "16:03",
    status: "อนุมัติ",
    variant: "approved",
  },
  {
    name: "แผนการสรรหายานพาหนะประจำปี 2568",
    year: "2567 - 2568",
    amount: "215,000,000",
    count: "40",
    date: "3 ก.พ. 2567",
    time: "11:10",
    status: "อนุมัติ",
    variant: "approved",
  },
];

/* ─── sub-components ────────────────────────────────── */

/** Sidebar icon button */
function NavBtn({ Icon, active }: { Icon: React.ElementType; active?: boolean; key?: any }) {
  return (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
        active ? "bg-gray-100" : "bg-white hover:bg-gray-50"
      }`}
    >
      <Icon size={20} color={T.iconColor} strokeWidth={1.5} />
    </div>
  );
}

/** Status badge – all visually identical grey, labelled differently */
function Badge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center px-[8px] py-[2px] rounded-full text-[12px] whitespace-nowrap"
      style={{
        background: T.badgeBg,
        border: `1px solid ${T.badgeBorder}`,
        color: T.badgeText,
        fontWeight: 600,
        letterSpacing: "-0.2px",
      }}
    >
      {label}
    </span>
  );
}

/** Tertiary action icon button */
function ActionBtn({ Icon }: { Icon: React.ElementType }) {
  return (
    <div className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-50">
      <Icon size={18} color={T.text3} strokeWidth={1.5} />
    </div>
  );
}

/* ─── main export ───────────────────────────────────── */
export default function VMSListScreen() {
  return (
    /* Viewport fill – flex row (sidebar | main) */
    <div className="h-full flex overflow-hidden" style={{ background: T.pageBg, fontFamily: "'IBM Plex Sans Thai', sans-serif" }}>

      {/* ══ Sidebar 80 px ══ */}
      <aside
        className="shrink-0 flex flex-col items-center gap-[8px] px-[16px] py-[12px] overflow-y-auto"
        style={{
          width: 80,
          background: T.sidebarBg,
          borderRight: `1px solid ${T.sidebarBorder}`,
        }}
      >
        {/* Brand logo */}
        <div className="w-10 h-10 flex items-center justify-center shrink-0 mb-[4px]">
          {/* Monochrome V mark */}
          <svg width="32" height="29" viewBox="0 0 32 28.43" fill="none">
            <path d="M16 28.43L0 0h8L16 14.43 24 0h8L16 28.43Z" fill="#6b7280" fillOpacity="0.9" />
          </svg>
        </div>

        {/* Nav icons */}
        {NAV_ICONS.map(({ icon: Icon, key }) => (
          <NavBtn key={key} Icon={Icon} />
        ))}
      </aside>

      {/* ══ Main column ══ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header 64 px */}
        <header
          className="shrink-0 flex items-center justify-end px-[32px]"
          style={{
            height: 64,
            background: T.headerBg,
            borderBottom: `1px solid ${T.headerBorder}`,
          }}
        >
          <div className="flex items-center gap-[4px]">
            {/* Light mode toggle */}
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
              <Sun size={20} color={T.iconColor} strokeWidth={1.5} />
            </div>

            {/* Notification with dot */}
            <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
              <Bell size={20} color={T.iconColor} strokeWidth={1.5} />
              <span
                className="absolute top-[4px] right-[5px] w-[6px] h-[6px] rounded-full"
                style={{ background: "#6b7280" }}
              />
            </div>

            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full ml-[4px] flex items-center justify-center shrink-0"
              style={{ background: "#d1d5db", border: "2px solid #9ca3af" }}
            >
              <span className="text-xs font-semibold text-gray-600">U</span>
            </div>
          </div>
        </header>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto" style={{ background: T.pageBg }}>
          <div className="flex flex-col gap-[32px] p-[32px]">

            {/* ── Page header (breadcrumb + title) ── */}
            <div className="flex flex-col gap-[24px]">
              {/* Breadcrumb */}
              <div className="flex items-center gap-[4px]">
                <Home size={16} color={T.text3} strokeWidth={1.5} />
                <ChevronRight size={14} color={T.text5} strokeWidth={1.5} />
                <span
                  className="text-[12px]"
                  style={{ color: T.text3, letterSpacing: "-0.2px" }}
                >
                  จัดการเหตุรถเสีย
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-[32px] leading-[1.5]"
                style={{ color: T.text1, fontWeight: 700, letterSpacing: "-0.5px" }}
              >
                แผนการสรรหายานพาหนะ
              </h1>
            </div>

            {/* ── Table section ── */}
            <div className="flex flex-col gap-[24px]">

              {/* Search + actions row */}
              <div className="flex items-center justify-between gap-[12px]">
                {/* Search */}
                <div
                  className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[8px]"
                  style={{
                    width: 320,
                    background: "#fff",
                    border: `1px solid ${T.border}`,
                    flexShrink: 0,
                  }}
                >
                  <Search size={18} color={T.text4} strokeWidth={1.5} />
                  <span className="text-[16px] leading-[1.5]" style={{ color: T.text5 }}>
                    ชื่อแผนการสรรหา
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-[12px]">
                  {/* Filter */}
                  <button
                    className="flex items-center gap-[4px] px-[12px] py-[8px] rounded-[8px] bg-white"
                    style={{ border: `1px solid ${T.border}`, height: 40, cursor: "pointer" }}
                  >
                    <ListFilter size={18} color={T.text3} strokeWidth={1.5} />
                    <span
                      className="text-[14px] font-semibold"
                      style={{ color: T.text3, letterSpacing: "-0.2px" }}
                    >
                      ตัวกรอง
                    </span>
                  </button>

                  {/* Create */}
                  <button
                    className="flex items-center gap-[4px] px-[12px] py-[8px] rounded-[8px]"
                    style={{
                      height: 40,
                      background: T.btnPrimary,
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={18} color="#fff" strokeWidth={2} />
                    <span className="text-[14px] font-semibold text-white" style={{ letterSpacing: "-0.2px" }}>
                      สร้างแผน
                    </span>
                  </button>
                </div>
              </div>

              {/* Table – horizontal scroll wrapper */}
              <div className="overflow-x-auto" style={{ borderRadius: 0 }}>
                <table className="border-collapse" style={{ minWidth: 1200, width: "100%" }}>
                  <thead>
                    <tr style={{ background: T.tableTH, borderBottom: `1px solid ${T.tableRowBorder}` }}>
                      {/* ชื่อแผน */}
                      <th
                        className="text-left px-[16px] py-[12px] text-[14px] font-semibold"
                        style={{ color: T.text1, letterSpacing: "-0.2px", minWidth: 320 }}
                      >
                        ชื่อแผน
                      </th>
                      {/* ปีงบประมาณ */}
                      <th
                        className="text-center px-[16px] py-[12px] text-[14px] font-semibold"
                        style={{ color: T.text1, letterSpacing: "-0.2px", minWidth: 150 }}
                      >
                        ปีงบประมาณ
                      </th>
                      {/* จำนวนเงิน */}
                      <th
                        className="text-left px-[16px] py-[12px] text-[14px] font-semibold"
                        style={{ color: T.text1, letterSpacing: "-0.2px", minWidth: 160 }}
                      >
                        จำนวนเงิน
                      </th>
                      {/* จำนวนรถ */}
                      <th
                        className="text-center px-[16px] py-[12px] text-[14px] font-semibold"
                        style={{ color: T.text1, letterSpacing: "-0.2px", minWidth: 110 }}
                      >
                        จำนวนรถ
                      </th>
                      {/* วันที่ */}
                      <th
                        className="text-left px-[16px] py-[12px] text-[14px] font-semibold"
                        style={{ color: T.text1, letterSpacing: "-0.2px", minWidth: 160 }}
                      >
                        วันที่
                      </th>
                      {/* สถานะ */}
                      <th
                        className="text-left px-[16px] py-[12px] text-[14px] font-semibold"
                        style={{ color: T.text1, letterSpacing: "-0.2px", minWidth: 190 }}
                      >
                        สถานะ
                      </th>
                      {/* actions */}
                      <th style={{ minWidth: 132 }} />
                    </tr>
                  </thead>

                  <tbody>
                    {ROWS.map((row, i) => (
                      <tr
                        key={i}
                        style={{
                          background: i % 2 === 1 ? T.tableRowAlt : "#ffffff",
                          borderBottom: `1px solid ${T.tableRowBorder}`,
                          height: 56,
                        }}
                      >
                        {/* ชื่อแผน */}
                        <td className="px-[16px] py-[8px]">
                          <span
                            className="text-[14px] font-medium"
                            style={{ color: T.text1 }}
                          >
                            {row.name}
                          </span>
                        </td>

                        {/* ปีงบประมาณ */}
                        <td className="px-[16px] py-[8px] text-center">
                          <span
                            className="text-[14px]"
                            style={{ color: T.text1, letterSpacing: "-0.2px" }}
                          >
                            {row.year}
                          </span>
                        </td>

                        {/* จำนวนเงิน */}
                        <td className="px-[16px] py-[8px]">
                          <span className="text-[14px]" style={{ color: T.text1, letterSpacing: "-0.2px" }}>
                            {row.amount}
                          </span>
                        </td>

                        {/* จำนวนรถ */}
                        <td className="px-[16px] py-[8px] text-center">
                          <span className="text-[14px]" style={{ color: T.text1, letterSpacing: "-0.2px" }}>
                            {row.count}
                          </span>
                        </td>

                        {/* วันที่ */}
                        <td className="px-[16px] py-[8px]">
                          <div className="flex flex-col">
                            <span className="text-[14px]" style={{ color: T.text1, letterSpacing: "-0.2px" }}>
                              {row.date}
                            </span>
                            <span className="text-[12px]" style={{ color: T.text3, letterSpacing: "-0.2px" }}>
                              {row.time}
                            </span>
                          </div>
                        </td>

                        {/* สถานะ */}
                        <td className="px-[16px] py-[8px]">
                          <Badge label={row.status} />
                        </td>

                        {/* actions */}
                        <td className="px-[16px] py-[8px]">
                          <div className="flex items-center gap-[2px] justify-center">
                            <ActionBtn Icon={FileText} />
                            <ActionBtn Icon={Pencil} />
                            <ActionBtn Icon={Trash2} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination row */}
              <div className="flex items-center justify-between">
                {/* Left: count + per-page */}
                <div className="flex items-center gap-[8px]">
                  <span className="text-[14px]" style={{ color: T.text1, letterSpacing: "-0.2px" }}>
                    แสดง 1 ถึง 4 จาก 4 รายการ
                  </span>
                  {/* Per-page dropdown */}
                  <div
                    className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[8px] bg-white"
                    style={{ border: `1px solid ${T.border}`, height: 40 }}
                  >
                    <span className="text-[14px]" style={{ color: T.text1 }}>10</span>
                    <ChevronDown size={16} color={T.text4} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Right: page buttons */}
                <div
                  className="flex items-center rounded-[8px] overflow-hidden"
                  style={{ border: `1px solid ${T.border}` }}
                >
                  {/* Prev */}
                  <div
                    className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 cursor-pointer"
                    style={{ borderRight: `1px solid ${T.border}` }}
                  >
                    <ChevronLeft size={18} color={T.text5} strokeWidth={1.5} />
                  </div>
                  {/* Page 1 (active) */}
                  <div
                    className="w-10 h-10 flex items-center justify-center cursor-pointer"
                    style={{ background: T.pagActiveBtn, borderRight: `1px solid ${T.border}` }}
                  >
                    <span className="text-[14px]" style={{ color: T.text3 }}>1</span>
                  </div>
                  {/* Next */}
                  <div
                    className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <ChevronRight size={18} color={T.text5} strokeWidth={1.5} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
