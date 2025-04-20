"use client";
import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface PieChartProps {
  data: { label: string; value: number }[];
}

const PieChart = ({ data }: PieChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current, "dark"); // Dark theme

      // Total count to calculate percentages
      const total = data.reduce((sum, item) => sum + item.value, 0);

      const options = {
        backgroundColor: "transparent",
        title: {
          text: "Ticket(s)",
          left: "center",
          textStyle: { color: "#ffffff", fontSize: 14 },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)", // Show value and percentage
        },
        legend: {
          orient: "vertical",
          right: 10,
          top: "center",
          textStyle: { color: "#ffffff" },
          formatter: (name: string) => {
            const item = data.find((item) => item.label === name);
            return item ? `${name}: ${item.value}` : name;
          },
        },
        series: [
          {
            name: "Tickets",
            type: "pie",
            radius: ["50%", "70%"], // Donut shape
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 5,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: { show: false },
            labelLine: { show: false },
            data: data.map((item, index) => ({
              value: item.value,
              name: item.label,
              itemStyle: { color: ["#6ec6ff", "#4a90e2", "#7b6fe9", "#ff8c00"][index % 4] }, // Cycle through colors
            })),
          },
        ],
      };

      chart.setOption(options);

      return () => {
        chart.dispose();
      };
    }
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "250px" }} />;
};

export default PieChart;
