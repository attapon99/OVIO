export type WeekStripDay = {
  key: string;
  label: string;
  day: string | number;
  date: Date;
};

export type WeekStripProps = {
  selectedDate: Date;
  onSelectDate?: (date: Date) => void;
  onNavigateWeek?: (direction: "previous" | "next") => void;
};
