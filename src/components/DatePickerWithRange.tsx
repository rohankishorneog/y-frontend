import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Value {
  from: Date | null;
  to: Date | null;
}
interface Props {
  value: Value;
  onChange: (value: Value) => void;
}


type Dates = [Date | null, Date | null];
const DatePickerWithRange = ({ value, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const startDate = value?.from;
  const endDate = value?.to;
  const ref = useRef(null);

  const handleDateChange = (dates: Dates) => {
    const [start, end] = dates;
    onChange({
      from: start || null,
      to: end || null,
    });
    if (start && end) {
      setIsOpen(false);
    }
  };

  const buttonText =
    startDate && endDate
      ? `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`
      : "Pick a date range";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative date-picker-container" ref={ref}>
      <Button
        variant="outline"
        className={cn(
          "w-[280px] justify-start text-left font-normal",
          !startDate && "text-muted-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-md shadow-lg">
          <DatePicker
            yearDropdownItemNumber={90}
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            showYearDropdown
            scrollableYearDropdown
            minDate={new Date("1965-10-10")}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default DatePickerWithRange;
