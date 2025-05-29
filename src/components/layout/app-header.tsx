import { APP_NAME } from "@/utils/constants";
import { GraduationCap } from "lucide-react";

export default function AppHeader(){
    return (
        <header className="bg-primary text-primary-foreground p-4 shadow-md flex items-center justify-between sticky top-0 z-40 h-18">
        <div className="flex items-center gap-1 sm:gap-2">
          <GraduationCap className="h-6 w-6" />
          <h1 className="text-base sm:text-xl font-bold tracking-tight leading-tight">{APP_NAME}</h1>
        </div>
        {/* Add any header actions if needed, e.g., settings, if not in bottom nav */}
      </header>
    )
}