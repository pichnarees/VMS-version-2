import svgPaths from "../../imports/Sidebar/svg-15ru6tftq4";
import { imgVector } from "../../imports/Sidebar/svg-694a3";
import { ListFilter, PlusSquare, Settings2, FileSpreadsheet } from "lucide-react";

export type Page =
  /* ── Legacy scenario pages (kept for backwards compat) ── */
  | "dashboard" | "vehicle-list" | "vehicle-review" | "create-plan"
  | "plan-criteria" | "plan-confirm"
  | "budget-validation" | "request-detail"
  | "approval-inbox" | "approval-timeline" | "procurement-handoff"
  | "demand-collection" | "gap-analysis"
  | "special-request-list" | "special-criteria"
  /* ── Unified system pages ── */
  | "all-requests" | "create-request" | "source-data"
  | "requirement-analysis" | "plan-form" | "review-submit" | "settings"
  | "procurement-plans";

/* Map each Figma nav icon slot to a page (null = decorative only) */
const NAV: { title: string; page: Page | null; render: () => React.ReactNode }[] = [
  {
    title: "แผงควบคุม",
    page: "dashboard",
    render: () => (
      <div className="relative shrink-0 size-[24px]" data-name="home-24-300-round">
        <div className="absolute inset-[16.91%_18.75%_14.58%_18.75%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4.5px_-4.058px] mask-size-[24px_24px]"
          style={{ maskImage: `url("${imgVector}")` }}>
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 16.4423">
            <path d={svgPaths.p886ab00} fill="#667085" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: "รายการรถทดแทน",
    page: "vehicle-list",
    render: () => (
      <div className="relative shrink-0 size-[24px]" data-name="car_rental-24-300-round">
        <div className="absolute inset-[6.01%_22.68%_11.14%_22.68%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-5.442px_-1.442px] mask-size-[24px_24px]"
          style={{ maskImage: `url("${imgVector}")` }}>
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.1155 19.8845">
            <path d={svgPaths.p9e037c0} fill="#667085" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: "กล่องอนุมัติ",
    page: "approval-inbox",
    render: () => (
      <div className="relative shrink-0 size-[24px]" data-name="traffic_jam-24-300-round">
        <div className="absolute inset-[6.53%_6.73%_10.42%_6.25%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px_-1.567px] mask-size-[24px_24px]"
          style={{ maskImage: `url("${imgVector}")` }}>
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.8845 19.9328">
            <path d={svgPaths.p18418980} fill="#667085" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: "ติดตามการอนุมัติ",
    page: "approval-timeline",
    render: () => (
      <div className="relative shrink-0 size-[24px]" data-name="car_insurance">
        <div className="-translate-y-1/2 absolute aspect-[17/15] left-[14.58%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3.5px_-5.5px] mask-size-[24px_24px] right-[14.58%] top-[calc(50%+1px)]"
          style={{ maskImage: `url("${imgVector}")` }}>
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 15">
            <path d={svgPaths.pb4b4900} fill="#667085" />
          </svg>
        </div>
        {/* Shield sub-icon */}
        <div className="absolute inset-[12.5%_14.06%_58.28%_62.5%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-15px_-3px] mask-size-[24px_24px]"
          style={{ maskImage: `url("${imgVector}")` }}>
          <div className="absolute inset-[-5.35%_-6.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.375 7.76316">
              <path d={svgPaths.pa96df00} fill="#667085" stroke="#667085" strokeWidth="0.75" />
            </svg>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "รายละเอียดคำขอ",
    page: "request-detail",
    render: () => (
      <div className="relative shrink-0 size-[24px]" data-name="database-24-300-round">
        <div className="absolute inset-[14.58%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3.5px_-3.5px] mask-size-[24px_24px]"
          style={{ maskImage: `url("${imgVector}")` }}>
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
            <path d={svgPaths.p33609600} fill="#667085" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: "ส่งต่อจัดซื้อ",
    page: "procurement-handoff",
    render: () => (
      <div className="relative shrink-0 size-[24px]" data-name="ev_station">
        <div className="absolute inset-[14.58%_11.58%_14.58%_18.75%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4.5px_-3.5px] mask-size-[24px_24px]"
          style={{ maskImage: `url("${imgVector}")` }}>
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.721 17">
            <path d={svgPaths.p724cb00} fill="#667085" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: "สร้างแผนทดแทน",
    page: "create-plan",
    render: () => (
      <div className="relative shrink-0 size-[24px]" data-name="build">
        <div className="absolute inset-[13.54%_15.51%_15.26%_13.3%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3.192px_-3.25px] mask-size-[24px_24px]"
          style={{ maskImage: `url("${imgVector}")` }}>
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.0865 17.0865">
            <path d={svgPaths.p329dd280} fill="#667085" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: "ตรวจสอบงบประมาณ",
    page: "budget-validation",
    render: () => (
      <div className="relative shrink-0 size-[24px]" data-name="e911_emergency">
        <div className="absolute inset-[14.34%_5.21%_18.75%_5.21%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.25px_-3.442px] mask-size-[24px_24px]"
          style={{ maskImage: `url("${imgVector}")` }}>
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 16.0578">
            <path d={svgPaths.p26cca780} fill="#667085" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: "รายการแผนจัดหารถ",
    page: "procurement-plans" as Page,
    render: () => <FileSpreadsheet size={22} color="#667085" />,
  },
  {
    title: "คำขอทั้งหมด",
    page: "all-requests" as Page,
    render: () => <ListFilter size={22} color="#667085" />,
  },
  {
    title: "สร้างคำขอใหม่",
    page: "create-request" as Page,
    render: () => <PlusSquare size={22} color="#667085" />,
  },
  {
    title: "การตั้งค่า",
    page: "settings" as Page,
    render: () => <Settings2 size={22} color="#667085" />,
  },
  {
    title: "ข้อมูล",
    page: null,
    render: () => (
      <div className="relative shrink-0 size-[24px]" data-name="news">
        <div className="absolute inset-[14.58%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3.5px_-3.5px] mask-size-[24px_24px]"
          style={{ maskImage: `url("${imgVector}")` }}>
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
            <path d={svgPaths.p247c9900} fill="#667085" />
          </svg>
        </div>
      </div>
    ),
  },
];

export default function Sidebar({
  activePage,
  onNavigate,
}: {
  activePage: Page;
  onNavigate: (p: Page) => void;
}) {
  return (
    <aside
      className="bg-white flex flex-col gap-[20px] items-center px-[16px] py-[12px] shrink-0 relative"
      style={{ width: 80, borderRight: "1px solid #eaecf0", height: "100vh", overflowY: "auto" }}
    >
      {/* Brand logo */}
      <div className="flex flex-col items-center justify-center shrink-0 size-[40px]">
        <div className="h-[28.431px] relative shrink-0 w-[32px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 28.4306">
            <g>
              <path clipRule="evenodd" d={svgPaths.pbd55100} fill="url(#paint0_linear)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p31c3b7f0} fill="url(#paint1_linear)" fillRule="evenodd" />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="32" x2="12.5178" y1="14.2157" y2="14.2157">
                <stop stopColor="#F9AC12" />
                <stop offset="1" stopColor="#FFC556" />
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear" x1="-0.000792314" x2="19.4822" y1="14.2157" y2="14.2157">
                <stop stopColor="#A80689" />
                <stop offset="0.41" stopColor="#AA068B" />
                <stop offset="0.66" stopColor="#B20692" />
                <stop offset="0.87" stopColor="#C1069E" />
                <stop offset="1" stopColor="#CF07AA" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex flex-col gap-[8px] items-start w-full">
        {NAV.map(({ title, page, render }) => {
          const active = page !== null && activePage === page;
          return (
            <button
              key={title}
              title={title}
              onClick={() => page && onNavigate(page)}
              className="flex gap-[8px] isolate items-center p-[8px] relative rounded-[8px] shrink-0 size-[40px]"
              style={{
                background: active ? "#f2f4f7" : "#ffffff",
                cursor: page ? "pointer" : "default",
              }}
            >
              {render()}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
