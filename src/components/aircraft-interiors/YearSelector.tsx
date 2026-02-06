import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaultYears = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034];

interface YearSelectorProps {
  value: number;
  onChange: (year: number) => void;
  label?: string;
  years?: number[];
}

export function YearSelector({ value, onChange, label = "Select Year", years = defaultYears }: YearSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3"
    >
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <Select value={value.toString()} onValueChange={(v) => onChange(parseInt(v))}>
        <SelectTrigger className="w-[120px] border-[hsl(217,33%,18%)] bg-[hsl(217,33%,14%)] text-[hsl(210,40%,96%)] [&>svg]:text-[hsl(210,40%,96%)]">
          <SelectValue placeholder="Year" className="text-[hsl(210,40%,96%)]" />
        </SelectTrigger>
        <SelectContent className="bg-[hsl(222,47%,11%)] border-[hsl(217,33%,18%)] text-[hsl(210,40%,96%)]">
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()} className="text-[hsl(210,40%,96%)] focus:bg-[hsl(217,33%,18%)] focus:text-[hsl(210,40%,96%)]">
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
}
