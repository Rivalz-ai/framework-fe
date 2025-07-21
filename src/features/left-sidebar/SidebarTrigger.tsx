import { Button } from "@/components/ui/button";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SidebarTrigger() {
  const { setOpen, open, openMobile, setOpenMobile, isMobile } = useSidebar();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            id="sidebar-trigger-button"
            onClick={() =>
              isMobile ? setOpenMobile(!openMobile) : setOpen(!open)
            }
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-muted-foreground"
          >
            <Sidebar className="!size-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{open ? "close" : "open"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
