import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

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
        // ✅ חיצי ניווט בזהב
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 border border-amber-500/35 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10",
        ),
        // ✅ החלפה: בשמאל זה NEXT, בימין זה PREV (כמו שהגדרת)
        nav_button_next: "absolute left-1",
        nav_button_previous: "absolute right-1",

        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",

        cell:
          "h-9 w-9 text-center text-sm p-0 relative " +
          "[&:has([aria-selected].day-range-end)]:rounded-r-md " +
          "[&:has([aria-selected].day-outside)]:bg-transparent " +
          "[&:has([aria-selected])]:bg-transparent",

        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),

        day_range_end: "day-range-end",

        // ✅ נבחר: בלי primary בכלל, הכל זהב
        day_selected:
          "bg-transparent border border-amber-500 text-foreground " +
          "hover:bg-amber-500/10 hover:text-foreground " +
          "focus:bg-amber-500/10 focus:text-foreground",

        // ✅ היום: בלי bg-accent (שזה התכלת). רק טבעת/מסגרת זהב עדינה.
        day_today: "bg-transparent text-foreground border border-amber-500/25",

        // ✅ ימים מחוץ לחודש: בלי accent
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-transparent aria-selected:text-muted-foreground aria-selected:opacity-30",

        day_disabled: "text-muted-foreground opacity-50",

        // ✅ טווח (אם תשתמשי פעם): בלי accent
        day_range_middle: "aria-selected:bg-transparent aria-selected:text-foreground",

        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ArrowLeft className="h-4 w-4" />,
        IconRight: () => <ArrowRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
