export type WeekStripDay = {
  key: string;
  label: string;
  day: string | number;
};

export type WeekStripProps = {
  days: WeekStripDay[];
  activeKey?: string | null;
  onSelect?: (key: string) => void;
};
