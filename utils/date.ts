const TIMELINE_ROW_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const CALENDAR_MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const CALENDAR_MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
});

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const CALENDAR_WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;

export type TimelineWeekDay = {
  key: string;
  label: string;
  day: number;
  date: Date;
};

export type CalendarDay = {
  key: string;
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
};

export type CalendarMonthSection = {
  key: string;
  title: string;
  headerTitle: string;
  monthDate: Date;
  weeks: CalendarDay[][];
};

export function createLocalDate(year: number, monthIndex: number, day: number) {
  return new Date(year, monthIndex, day, 12);
}

export function addDays(date: Date, amount: number) {
  return createLocalDate(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function formatTimelineDate(selectedDate: Date) {
  return TIMELINE_ROW_DATE_FORMATTER.format(selectedDate);
}

export function formatCalendarMonthYear(date: Date) {
  return CALENDAR_MONTH_FORMATTER.format(date);
}

export function formatCalendarMonthLabel(date: Date) {
  return CALENDAR_MONTH_LABEL_FORMATTER.format(date);
}

export function buildTimelineWeek(selectedDate: Date): TimelineWeekDay[] {
  const activeDate = createLocalDate(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );
  const mondayOffset = (activeDate.getDay() + 6) % 7;
  const monday = createLocalDate(
    activeDate.getFullYear(),
    activeDate.getMonth(),
    activeDate.getDate() - mondayOffset
  );

  return Array.from({ length: 7 }, (_, index) => {
    const date = createLocalDate(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + index
    );

    return {
      key: formatDateKey(date),
      label: WEEKDAY_LABELS[date.getDay()],
      day: date.getDate(),
      date,
    };
  });
}

export function buildMonthGrid(monthDate: Date): CalendarDay[][] {
  const firstDayOfMonth = createLocalDate(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1
  );
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const gridStartDate = createLocalDate(
    firstDayOfMonth.getFullYear(),
    firstDayOfMonth.getMonth(),
    firstDayOfMonth.getDate() - startOffset
  );

  return Array.from({ length: 6 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const date = createLocalDate(
        gridStartDate.getFullYear(),
        gridStartDate.getMonth(),
        gridStartDate.getDate() + weekIndex * 7 + dayIndex
      );

      return {
        key: formatDateKey(date),
        date,
        dayNumber: date.getDate(),
        isCurrentMonth: date.getMonth() === monthDate.getMonth(),
      };
    })
  );
}

export function getCalendarWeekdayLabels() {
  return [...CALENDAR_WEEKDAY_LABELS];
}

export function addMonths(date: Date, amount: number) {
  return createLocalDate(date.getFullYear(), date.getMonth() + amount, 1);
}

export function startOfMonth(date: Date) {
  return createLocalDate(date.getFullYear(), date.getMonth(), 1);
}

export function buildCalendarMonthSections(
  anchorDate: Date,
  options?: { monthsBefore?: number; monthsAfter?: number }
) {
  const monthsBefore = options?.monthsBefore ?? 12;
  const monthsAfter = options?.monthsAfter ?? 24;
  const firstMonth = addMonths(startOfMonth(anchorDate), -monthsBefore);
  const totalMonths = monthsBefore + monthsAfter + 1;

  return Array.from({ length: totalMonths }, (_, index) => {
    const monthDate = addMonths(firstMonth, index);

    return {
      key: formatMonthKey(monthDate),
      title: formatCalendarMonthLabel(monthDate),
      headerTitle: formatCalendarMonthYear(monthDate),
      monthDate,
      weeks: buildMonthGrid(monthDate),
    };
  });
}

export function getMonthSectionIndex(
  anchorDate: Date,
  options?: { monthsBefore?: number }
) {
  return options?.monthsBefore ?? 12;
}

export function updateSelectedDate(
  currentDate: Date,
  nextValues: { monthIndex?: number; year?: number }
) {
  const nextYear = nextValues.year ?? currentDate.getFullYear();
  const nextMonthIndex = nextValues.monthIndex ?? currentDate.getMonth();
  const lastDayOfMonth = new Date(nextYear, nextMonthIndex + 1, 0).getDate();
  const nextDay = Math.min(currentDate.getDate(), lastDayOfMonth);

  return createLocalDate(nextYear, nextMonthIndex, nextDay);
}

export function isSameCalendarDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");

  return `${year}-${month}`;
}
