import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import DatePickerWithRange from "../components/DatePickerWithRange";
import { Header } from "../components/Header";
import { ageOptions, genderOptions } from "@/constants";
import FilterSelect from "../components/filter/FilterSelect";
import ChartCard, { ChartData } from "../components/cards/ChartCard";

const Dashboard = () => {
  const { token } = useAuth();
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);

  console.log(lineData);

  const defaultDateRange = {
    from: new Date(new Date("2022-01-01").setMonth(new Date().getMonth() - 1)),
    to: new Date("2022-12-12"),
  };

  const [filters, setFilters] = useState(() => {
    try {
      const savedPreferences = Cookies.get("userPreferences");
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        if (parsed.filters) {
          return parsed.filters;
        }
      }
    } catch (error) {
      console.error("Error loading initial filters:", error);
    }
    return {
      age: "all",
      gender: "all",
    };
  });

  const [dateRange, setDateRange] = useState(() => {
    try {
      const savedPreferences = Cookies.get("userPreferences");
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        if (parsed.dateRange?.from && parsed.dateRange?.to) {
          return {
            from: new Date(parsed.dateRange.from),
            to: new Date(parsed.dateRange.to),
          };
        }
      }
    } catch (error) {
      console.error("Error loading initial dateRange:", error);
    }
    return defaultDateRange;
  });

  useEffect(() => {
    const savePreferences = async () => {
      try {
        const preferences = {
          dateRange: {
            from: dateRange?.from?.toISOString(),
            to: dateRange?.to?.toISOString(),
          },
          filters: {
            age: filters.age,
            gender: filters.gender,
          },
        };

        Cookies.set("userPreferences", JSON.stringify(preferences), {
          expires: 7,
          path: "/",
          secure: window.location.protocol === "https:",
        });

        await fetch("/api/preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(preferences),
        });
      } catch (error) {
        console.error("Error saving preferences:", error);
      }
    };

    if (dateRange?.from && dateRange?.to && filters.age && filters.gender) {
      savePreferences();
    }
  }, [dateRange, filters, token]);

  useEffect(() => {
    const fetchBarData = async () => {
      if (!dateRange?.from || !dateRange?.to) return;
      try {
        const response = await fetch(
          `/api/data/features?startDate=${dateRange.from.toISOString().split("T")[0]}&endDate=${dateRange.to.toISOString().split("T")[0]}&age=${filters.age}&gender=${filters.gender}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setBarData(data);
      } catch (error) {
        console.error("Error fetching bar data:", error);
      }
    };

    fetchBarData();
  }, [dateRange, filters, token]);

  useEffect(() => {
    const fetchLineData = async () => {
      if (!selectedFeature || !dateRange.from || !dateRange.to) return;
      try {
        const response = await fetch(
          `/api/data/trend?feature=${selectedFeature}&startDate=${dateRange.from.toISOString().split("T")[0]}&endDate=${dateRange.to.toISOString().split("T")[0]}&age=${filters.age}&gender=${filters.gender}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        setLineData(
          data.map((item) => ({
            date: new Date(item.date).toISOString().split("T")[0],
            totalTime: item.totalTime,
          }))
        );
      } catch (error) {
        console.error("Error fetching trend data:", error);
      }
    };

    fetchLineData();
  }, [selectedFeature, dateRange, token, filters.age, filters.gender]);

  return (
    <div className="p-6 space-y-6">
      <Header />
      <div className="flex flex-wrap gap-4 items-center">
        <DatePickerWithRange value={dateRange} onChange={setDateRange} />

        <FilterSelect
          value={filters.age}
          onChange={(value) => setFilters((prev) => ({ ...prev, age: value }))}
          placeholder="Select Age"
          options={ageOptions}
        />
        <FilterSelect
          value={filters.gender}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, gender: value }))
          }
          placeholder="Select Gender"
          options={genderOptions}
        />
      </div>

      <ChartCard
        title="Feature Usage Overview"
        data={Object.entries(barData) as ChartData}
        chartType="bar"
        onBarClick={setSelectedFeature}
      />

      {selectedFeature && (
        <ChartCard
          title={`Time Trend for Feature ${selectedFeature}`}
          data={lineData.map(
            ({ date, totalTime }) => [date, totalTime] as [string, number]
          )}
          chartType="line"
        />
      )}
    </div>
  );
};

export default Dashboard;
