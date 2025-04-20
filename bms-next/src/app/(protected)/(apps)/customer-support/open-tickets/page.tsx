import OpenTicketsDatatable from "../components/ticket-datatable";
import fetchTicketDetails from "../components/ticket-details";
import TicketWidget from "../components/ticket-widget";

export default async function CustomerSupportOpenTickets() {

    const ticketData = await fetchTicketDetails();
    console.log("Open Tickets: from main page", ticketData);

    const { openTickets, openTicketsCount, completedTicketsCount, unassignedTicketsCount, totalTicketsCount, myTickets } = ticketData;

  return (
    <main>
      <h2>Open tickets</h2>
      <div className="w-full h-full flex flex-col gap-3">
        {/* <Widgets widgetData={WidgetData} /> */}
        <TicketWidget
          openTicketsCount={openTicketsCount}
          completedTicketsCount={completedTicketsCount}
          totalTicketsCount={totalTicketsCount}
          unassignedTicketsCount={unassignedTicketsCount}
          myTickets={myTickets}
        />
        <div className="flex-grow overflow-hidden">
          <OpenTicketsDatatable ticketData={openTickets}/>
        </div>
      </div>
    </main>
  );
}
