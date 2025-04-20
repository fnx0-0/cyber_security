
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shadcn/ui/card';
import { TabsContent } from '@/shadcn/ui/tabs';
import React, { useEffect, useState } from 'react';
import EChartLineComponent from '../eChartsMultipleSeries/multiple-series-line-chart';
import { Button } from '@/shadcn/ui/button';
import { AlertOctagon, AlertTriangle, Check, Clock, Droplets, Gauge, Lightbulb, Thermometer, Wind } from 'lucide-react';
import { ResponsiveContainer } from 'recharts';
import { getData, getLiveData } from '../../get-data/get-cassandra-data';
import { getAlertData } from '../action';

const param = {
  dataCount: 1000,
  service_name: null,
  serviceNameList: ['AHU-01 RA Temp', 'RA Humid'],
  endDate: null,
  timePeriod: null,
};

const systemStatus = [
  { name: "HVAC System", status: "operational", icon: Wind },
  { name: "Lighting Control", status: "operational", icon: Lightbulb },
  { name: "Security System", status: "operational", icon: Gauge },
  { name: "Fire Alarm", status: "warning", icon: AlertTriangle },
  { name: "Water Management", status: "operational", icon: Droplets },
];

const OverviewTab = () => {
  const [recentAlarms, setrecentAlarms] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const alertData = await getAlertData();
      let tempObject: any = {};
      let tempData: any = [];
      for (let i = 0; i < alertData.length; i++) {
        const element: any = alertData[i];
        tempObject.id = element.data.id;
        tempObject.message = element.data.notification_name;
        tempObject.time = new Date(element.data.lastEvaluatedOn).toLocaleString('en-US', { timeZone: 'UTC' });
        tempObject.severity = element.data.state;
        // tempObject.severity = "critical"; // Default severity
        tempData.push(tempObject);
        tempObject = {};
      }
      console.log("Alert data:", alertData);
      setrecentAlarms(tempData);
      // fetchedData.sort((a, b) => new Date(a.data_received_on.replace(' UTC', '')) - new Date(b.data_received_on.replace(' UTC', '')));
      //console.log("fetchedData", fetchedData);
      // setData(fetchedData);
    };

    fetchData();
  }, []);


  // const temperatureData = data.filter(item => item.service_name === 'AHU-01 RA Temp');
  // const humidityData = data.filter(item => item.service_name === 'RA Humid');

  // Mock recent alarms
  // const recentAlarms = [
  //   { id: 1, message: "High temperature in Server Room", time: "10:23 AM", severity: "warning" },
  //   { id: 2, message: "Fire alarm test required", time: "Yesterday", severity: "info" },
  //   { id: 3, message: "Low water pressure in Zone B", time: "Yesterday", severity: "warning" },
  //   { id: 4, message: "HVAC filter replacement due", time: "2 days ago", severity: "info" },
  // ];

  return (
    <div>
      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {/* Temperature & Humidity Chart */}
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>Temperature & Humidity (24h)</CardTitle>
              <CardDescription>
                Real-time monitoring of building conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] p-0 m-0">
              <ResponsiveContainer width="100%" height="100%">
                <EChartLineComponent chartData={{ temperatureData: [], humidityData: [] }} />
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="col-span-full md:col-span-1">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current operational status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.map((system, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <system.icon className="h-5 w-5 text-muted-foreground" />
                      <span>{system.name}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${system.status === "operational"
                        ? "text-green-500"
                        : "text-amber-500"
                      }`}>
                      {system.status === "operational" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <span className="capitalize text-sm">
                        {system.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alarms */}
          <Card className="col-span-full lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Alarms</CardTitle>
                <CardDescription>
                  Latest alerts and notifications
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlarms.map((alarm) => (
                  <div key={alarm.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-1 ${alarm.severity === "critical"
                          ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200"
                          : alarm.severity === "warning"
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                        }`}>
                        {alarm.severity === "critical" ? (
                          <AlertOctagon className="h-4 w-4" />
                        ) : alarm.severity === "warning" ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{alarm.message}</p>
                        <p className="text-sm text-muted-foreground">{alarm.time}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="whitespace-nowrap">
                      Acknowledge
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-full md:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common system controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-20 flex flex-col gap-1">
                  <Thermometer className="h-5 w-5" />
                  <span className="text-xs sm:text-sm">Adjust Temp</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-1">
                  <Lightbulb className="h-5 w-5" />
                  <span className="text-xs sm:text-sm">Lighting</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-1">
                  <Wind className="h-5 w-5" />
                  <span className="text-xs sm:text-sm">HVAC</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-1">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-xs sm:text-sm">Diagnostics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
};

export default OverviewTab;
