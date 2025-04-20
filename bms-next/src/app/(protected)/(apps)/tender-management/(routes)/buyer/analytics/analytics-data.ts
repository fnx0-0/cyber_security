import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import moment from "moment";

export default async function getDraftData(){
    const response = await getMyInstancesV2({
      processName: "RFP Draft",
      predefinedFilters: { taskName: "View" },
    });
    const rfpDraftData = Array.isArray(response)
      ? response.map((e: any) => e.data)
      : [];

    //return rfpDraftData;
    console.log(rfpDraftData);
    const tenderVolumeOverTime: { value: number; name: string }[] = [
    { value: 0, name: 'January' },
    { value: 0, name: 'February' },
    { value: 0, name: 'March' },
    { value: 0, name: 'April' },
    { value: 0, name: 'May' },
    { value: 0, name: 'June' },
    { value: 0, name: 'July' },
    { value: 0, name: 'August' },
    { value: 0, name: 'September' },
    { value: 0, name: 'October' },
    { value: 0, name: 'November' },
    { value: 0, name: 'December' }
];
   
     rfpDraftData.forEach(element => {
      /* volume over time */
      if (element.publishedTime === undefined) {
        return;
      }
      let date = moment(element.publishedTime).format('MMMM');
      let index = tenderVolumeOverTime.findIndex((x) => x.name === date);
        if (index !== -1) {
            tenderVolumeOverTime[index].value += 1;
        }
     });

const tenderStatusDistribution: { value: number; name: string }[] = [
    { value: 150, name: 'Open' },
    { value: 75, name: 'Closed' },
    { value: 50, name: 'Awarded' },
    { value: 25, name: 'Rejected' },
    { value: 30, name: 'Under Review' }
];

const bidToAwardRatio: { value: number; name: string }[] = [
    { value: 200, name: 'Bids' },
    { value: 50, name: 'Awards' }
];

const tenderValueByCategory: { value: number; name: string }[] = [
    { value: 500000, name: 'Construction' },
    { value: 300000, name: 'IT Services' },
    { value: 200000, name: 'Consultancy' },
    { value: 100000, name: 'Healthcare' },
    { value: 150000, name: 'Education' }
];
const revenueFromTenders: { value: number; name: string }[] = [
    { value: 100000, name: 'January' },
    { value: 200000, name: 'February' },
    { value: 150000, name: 'March' },
    { value: 250000, name: 'April' },
    { value: 300000, name: 'May' },
    { value: 350000, name: 'June' },
    { value: 400000, name: 'July' },
    { value: 450000, name: 'August' },
    { value: 500000, name: 'September' },
    { value: 550000, name: 'October' },
    { value: 600000, name: 'November' },
    { value: 650000, name: 'December' }
];

const lineChartConfiguration: any = {
    categoryKey: 'name',   // Data field for categories
    valueKey: 'value',     // Data field for values
    showLegend: false,      // Show legend
    showCursor: false,      // Show cursor interaction
    title: ' ',
    showScrollx: false,     // Enable x-axis scrolling
    showScrolly: false,     // Enable y-axis scrolling
    colors : ['#EE6666']
};



 const barChartConfiguration= {
    categoryKey: 'name',   // Data field for categories
    valueKey: 'value',     // Data field for values
    showLegend: true,      // Show legend
    showCursor: true,      // Show cursor interaction
    title: ' ',
    showScrollx: true,     // Enable x-axis scrolling
    showScrolly: true,     // Enable y-axis scrolling
    colors : ['#800000', '#91CC75', '#EE6666']
};

const piechart_configurationObj: any = {
    title: ' ',
    // colorPalette: defaultColors_PieChart,
    showLegend: true,
    showCursor: true,
    showoverallTooltip: true,
    overallTooltip: "{b}: {c}",
    colors: ['#800000', '#91CC75', '#EE6666', '#FFB980', '#FF99C3']
};
  

 return [
    {
        id: "0",
        type: 'Line-Chart',
        data: tenderVolumeOverTime,
        configurationObj: lineChartConfiguration
    },
    {
        id: "1",
        type: 'Bar-Chart',
        data: tenderValueByCategory,
        configurationObj: barChartConfiguration
    },
    {
        id: "3",
        configurationObj: piechart_configurationObj,
        type: "Pie-Chart",
        data: tenderStatusDistribution
    },
    {
        id: "2",
        type: 'Bar-Chart',
        data: bidToAwardRatio,
        configurationObj: barChartConfiguration
    }, 
    {
        id: "0",
        type: 'Line-Chart',
        data: revenueFromTenders,
        configurationObj: lineChartConfiguration
    },

]
}