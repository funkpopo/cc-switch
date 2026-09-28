import { Portal as TooltipPortal } from "@radix-ui/react-tooltip";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ToolbarButtonProps extends Omit<ButtonProps, "title" | "asChild"> {
  tooltip: string;
}

export function ToolbarButton({
  tooltip,
  className,
  children,
  ...props
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={tooltip}
          className={cn(
            "w-8 px-2 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
            className,
          )}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          side="top"
          align="center"
          // Use the button's upper padding to keep the label above its icon.
          sideOffset={-4}
          avoidCollisions={false}
          className="pointer-events-none max-w-40 select-none truncate rounded-md border border-border-default bg-popover px-1.5 py-px text-center text-[11px] font-medium leading-[14px] text-popover-foreground shadow-sm duration-150"
        >
          {tooltip}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}
