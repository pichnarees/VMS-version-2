import svgPaths from "../../imports/ProcumentCritiriaConfigurationPlanCreationConfigurationStep1Default/svg-at4t87si4m";
import { imgVector } from "../../imports/ProcumentCritiriaConfigurationPlanCreationConfigurationStep1Default/svg-jbqev";
import type { Page } from "./Sidebar";

export default function Header({
  _title,
}: {
  title: string;
  description: string;
  page: Page;
  onNavigate: (p: Page) => void;
  _title?: string;
}) {
  return (
    <header
      className="shrink-0 flex items-center justify-end px-8"
      style={{
        height: 64,
        background: "#ffffff",
        borderBottom: "1px solid #eaecf0",
      }}
    >
      {/* Right icons — exact from Figma */}
      <div className="flex items-center">
        {/* Sun / light mode */}
        <div className="bg-white flex gap-2 isolate items-center p-2 relative rounded-lg shrink-0 size-10">
          <div className="relative shrink-0 size-6 z-[1]">
            <div className="absolute inset-[5.21%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.25px_-1.25px] mask-size-[24px_24px]"
              style={{ maskImage: `url("${imgVector}")` }}>
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 21.5">
                <path d={svgPaths.p4c6680} fill="#667085" />
              </svg>
            </div>
          </div>
        </div>
        {/* Bell / notification */}
        <div className="relative bg-white flex gap-2 isolate items-center p-2 relative rounded-lg shrink-0 size-10">
          <div className="absolute flex items-start p-px right-[3px] top-[4px] z-[2]">
            <div className="relative shrink-0 size-[6px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
                <circle cx="3" cy="3" fill="#98a2b3" r="3" />
              </svg>
            </div>
          </div>
          <div className="relative shrink-0 size-6 z-[1]">
            <div className="absolute inset-[10.42%_18.75%_9.62%_18.75%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4.5px_-2.5px] mask-size-[24px_24px]"
              style={{ maskImage: `url("${imgVector}")` }}>
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 19.1923">
                <path d={svgPaths.p3b858e00} fill="#667085" />
              </svg>
            </div>
          </div>
        </div>
        {/* Avatar placeholder */}
        <div className="relative shrink-0 size-9 ml-1 rounded-full overflow-hidden"
          style={{ background: "#d1d5db", border: "2px solid #9ca3af" }}>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold" style={{ color: "#4b5563" }}>U</span>
        </div>
      </div>
    </header>
  );
}
