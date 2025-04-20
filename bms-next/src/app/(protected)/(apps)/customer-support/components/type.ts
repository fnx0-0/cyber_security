
  export interface TicketData {
    subject: string;
    ticketNo: string;
    dateCreated: string;
    issueDate: string;
    accountName: string;
    accountId: string;
    assigneeName: string;
    assigneeId: string;
    type: "Bugs" | "Incident" | "Feature" | "Service Request";
    priority: "Critical" | "High" | "Medium" | "Low";
    status: "New" | "Closed" | "Resolved" | "Cancelled" | "In Progress" | "On Hold" | "Restoration";
    accountCounts: string
  }

  export interface TicketsDetails {
    openTickets: TicketData[];
    closedTickets: TicketData[];
    priorityWiseTicketInfo : TicketData[];
    myTickets: number;
    completedTicketsCount: number;
    totalTicketsCount: number;
    openTicketsCount: number;
    unassignedTicketsCount: number;
    typeCounts: { [key: string]: number }; // Counts for Bugs, Incident, Feature, Service Request
    priorityCounts: { [key: string]: number }; // Counts for Critical, High, Medium, Low
    statusCounts: { [key: string]: number };
     }