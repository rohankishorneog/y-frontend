import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { MousePointerClick } from "lucide-react";

export type ChartData = [string, number][];

interface ChartCardProps {
  title: string;
  data: ChartData;
  chartType: "bar" | "line";
  onBarClick?: (id: string) => void;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  chartType,
  onBarClick,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                layout="vertical"
                data={data.map(([key, value]) => ({
                  _id: key,
                  totalTime: value,
                }))}
                onClick={(d) => onBarClick?.(d.activeLabel)}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="_id" />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalTime" fill="#8884d8" />
              </BarChart>
            ) : (
              <LineChart
                data={data.map(([date, totalTime]) => ({ date, totalTime }))}
              >
                <CartesianGrid strokeDasharray="9 9" />
                <XAxis
                  dataKey="date"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString();
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString();
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="totalTime" stroke="#82ca9d" />
                <Brush
                  dataKey="date"
                  height={30}
                  stroke="#8884d8"
                  startIndex={0}
                  endIndex={data.length - 1}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
      {chartType === "bar" && (
        <CardFooter className="gap-2 items-center flex justify-center mt-2">
          <MousePointerClick />
          Click on each feature to see the trend
        </CardFooter>
      )}
    </Card>
  );
};

export default ChartCard;
