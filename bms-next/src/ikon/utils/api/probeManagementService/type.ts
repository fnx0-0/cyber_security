export interface GetInstructionHistoryProps {
  probeId: string;
  fromDate: string;
  toDate: string;
}

export interface InstructionHistoryProps {
  cancelled_at: string | null;
  process_id: string;
  cancelled_by: string | null;
  finished_at: string;
  serviceName: string;
  instruction_id_ts: string;
  software_id: string;
  service_schedule: {
    scheduleType: "once" | string;
  };
  account_id: string;
  processName: string | null;
  instruction_type: "Standard" | string;
  service_id: string;
  posted_by: string;
  instruction_id: string;
}


export interface LiveInstructionProps {
  cancelled_at: string | null;
  process_id: string;
  cancelled_by: string | null;
  finished_at: string | null;
  serviceName: string;
  instruction_id_ts: string;
  software_id: string;
  service_schedule: string;
  account_id: string;
  processName: string | null;
  instruction_type: string;
  service_id: string;
  posted_by: string;
  instruction_id: string;
  instruction_class: string;
  probe_id: string;
}
