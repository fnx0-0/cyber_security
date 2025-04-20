import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { getData, getLiveData } from '../../get-data/get-cassandra-data';
import { Skeleton } from '@/shadcn/ui/skeleton'; // Adjust path if needed

interface ChartData {
  time: string;
  temperature: number;
  humidity: number;
}

interface EChartLineComponentProps {
  chartData: {
    temperatureData: ChartData[];
    humidityData: ChartData[];
  };
}

const param = {
  dataCount: 100,
  service_name: null,
  serviceNameList: ['AHU-01 RA Temp', 'RA Humid'],
  startDate: null,
  endDate: null,
  timePeriod: null,
};

const EChartLineComponent: React.FC<EChartLineComponentProps> = ({ chartData }) => {
  const [data, setData] = useState<any[]>([]);
  const [liveData, setLiveData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const chartRef = useRef<HTMLDivElement | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getData(param);
      fetchedData.sort(
        (a: any, b: any) =>
          new Date(a.data_received_on.replace(' UTC', '')).getTime() -
          new Date(b.data_received_on.replace(' UTC', '')).getTime()
      );
      setData(fetchedData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Fetch live data
  useEffect(() => {
    const fetchLiveData = () => {
      function updateLiveData(event: any) {
        if (event?.data) {
          setLiveData(event.data);
        }
      }
      getLiveData(updateLiveData);
    };

    fetchLiveData();

    return () => {
      // Cleanup logic for live data subscription
    };
  }, []);

  // Merge live data with existing data
  useEffect(() => {
    if (Array.isArray(liveData.monitoring_data)) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      liveData.monitoring_data.forEach((item: any) => {
        if (item.object_name === 'AHU-01 RA Temp' || item.object_name === 'RA Humid') {
          setData((prevData) => [...prevData, item]);
        }
      });
    }
  }, [liveData]);

  const formatTime = (time: string): string => {
    const correctedTime = time.replace(' UTC', 'Z');
    const date = new Date(correctedTime);
    if (Number.isNaN(date.getTime())) {
      console.error('Invalid date:', time);
      return 'Invalid Date';
    }

    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }).format(date);
  };

  const temperatureData = data.filter((item) => item.service_name === 'AHU-01 RA Temp');
  const humidityData = data.filter((item) => item.service_name === 'RA Humid');

  const formattedTemperatureData = temperatureData.map((item) => ({
    ...item,
    time: formatTime(item.data_received_on),
  }));

  const formattedHumidityData = humidityData.map((item) => ({
    ...item,
    time: formatTime(item.data_received_on),
  }));

  const chartOptionMultipleLineTempVsHumid = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Temperature (°C)', 'Humidity (%)'],
      top: '90%',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: formattedTemperatureData.map((item) => item.time),
    },
    yAxis: [
      {
        type: 'value',
        name: 'Temperature (°C)',
      },
      {
        type: 'value',
        name: 'Humidity (%)',
        position: 'right',
      },
    ],
    series: [
      {
        name: 'Temperature (°C)',
        type: 'line',
        data: formattedTemperatureData.map((item) => item.monitoring_data),
        lineStyle: { color: '#8884d8' },
        symbolSize: 8,
        smooth: true,
      },
      {
        name: 'Humidity (%)',
        type: 'line',
        data: formattedHumidityData.map((item) => item.monitoring_data),
        lineStyle: { color: '#82ca9d' },
        yAxisIndex: 1,
      },
    ],
  };

 useEffect(() => {
  if (!chartRef.current || loading) return;

  const chart = echarts.init(chartRef.current);

  const option = {
    ...chartOptionMultipleLineTempVsHumid,
    xAxis: {
      ...chartOptionMultipleLineTempVsHumid.xAxis,
      data: formattedTemperatureData.map((item) => item.time),
    },
    series: [
      {
        ...chartOptionMultipleLineTempVsHumid.series[0],
        data: formattedTemperatureData.map((item) => item.monitoring_data),
      },
      {
        ...chartOptionMultipleLineTempVsHumid.series[1],
        data: formattedHumidityData.map((item) => item.monitoring_data),
      },
    ],
  };

  chart.setOption(option, true); // <- `true` ensures the option is updated completely

  return () => {
    chart.dispose();
  };
}, [formattedTemperatureData, formattedHumidityData, loading]);

  return (
    <div>
      {loading ? (
        <Skeleton className="w-full h-[300px] rounded-md bg-gray-400" />
      ) : (
        <div ref={chartRef} style={{ height: 300, width: '100%' }} />
      )}
    </div>
  );
};

export default EChartLineComponent;
