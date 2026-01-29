import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type NavProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell:
          "h-9 w-9 text-center text-sm p-0 relative " +
          "[&:has([aria-selected].day-range-end)]:rounded-r-md " +
          "[&:has([aria-selected].day-outside)]:bg-accent/50 " +
          "[&:has([aria-selected])]:bg-accent " +
          "first:[&:has([aria-selected])]:rounded-l-md " +
          "last:[&:has([aria-selected])]:rounded-r-md " +
          "focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        // ✅ כאן מתקנים את ה"התנהגות" של החצים ב-RTL:
        // הכפתור השמאלי -> חודש הבא
        // הכפתור הימני -> חודש קודם
        Nav: (navProps: NavProps) => {
          const isRTL = navProps.dir === "rtl";

          const leftIsNext = isRTL;
          const rightIsPrev = isRTL;

          const leftDisabled = leftIsNext ? !navProps.nextMonth : !navProps.previousMonth;
          const rightDisabled = rightIsPrev ? !navProps.previousMonth : !navProps.nextMonth;

          const onLeftClick = (e: React.MouseEvent) => {
            if (leftIsNext) navProps.onNextClick?.(e);
            else navProps.onPreviousClick?.(e);
          };

          const onRightClick = (e: React.MouseEvent) => {
            if (rightIsPrev) navProps.onPreviousClick?.(e);
            else navProps.onNextClick?.(e);
          };

          return (
            <div className="rdp-nav">
              {/* שמאל */}
              <button
                type="button"
                aria-label={leftIsNext ? "Go to next month" : "Go to previous month"}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rdp-nav_button rdp-nav_button_previous h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1",
                )}
                disabled={leftDisabled}
                onClick={onLeftClick}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* ימין */}
              <button
                type="button"
                aria-label={rightIsPrev ? "Go to previous month" : "Go to next month"}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rdp-nav_button rdp-nav_button_next h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1",
                )}
                disabled={rightDisabled}
                onClick={onRightClick}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          );
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
