import fetchTicketDetails from "../components/ticket-details";
import TicketWidget from "../components/ticket-widget";
import Card from "./components/Card";
import PieChart from "./components/PieChart";

export default async function Summary() {
  const ticketData = await fetchTicketDetails();
  console.log("Fetched ticket data:", ticketData);
 console.log("Fetched ticket data:", ticketData);
console.log("priorityWiseTicketInfo:", ticketData?.priorityWiseTicketInfo);
console.log("sssssss:", ticketData?.typeCounts);
console.log(ticketData.typeCounts);
const allTickets = ticketData?.priorityWiseTicketInfo;



const typeChartData = Object.entries(ticketData.typeCounts).map(([label, value]) => ({
  label,
  value,
}));
const severityChartData = Object.entries(ticketData.priorityCounts).map(([label, value]) => ({
  label,
  value,
}));

const statusChartData = Object.entries(ticketData.statusCounts).map(([label, value]) => ({
  label,
  value,
}));

const accountChartData = Object.entries(ticketData.accountCounts).map(([label, value]) => ({
  label,
  value,
}));


console.log("Formatted Chart Data:", typeChartData);

  // const chartDatas = [
  //   { label: "Bugs", value: 6 },
  //   { label: "Incident", value: 7 },
  //   { label: "Feature", value: 6 },
  // ];
  return (
    <main className="p-4 bg-gray-900 text-white min-h-screen">
      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <Card title="By Type">
          <PieChart data={typeChartData} />
        </Card>

        <Card title="By Severity">
          <PieChart data={severityChartData} />
        </Card>

        <Card title="By Status">
          <PieChart data={statusChartData} />
        </Card>

        <Card title="By Account">
          <PieChart data={accountChartData} />
        </Card>

        {/* <Card title="By Infrastructure">
          <PieChart />
        </Card> */}

        <Card title="Ticket Generation Frequency" children={undefined}>
          {/* Add a bar chart component for ticket generation */}
        </Card>
      </div>
    </main>
  );
}
function alasql(arg0: string, arg1: import("../components/type").TicketsDetails[]) {
  throw new Error("Function not implemented.");
}

