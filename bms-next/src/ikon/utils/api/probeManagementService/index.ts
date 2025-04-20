"use server";
import ikonBaseApi from "@/ikon/utils/api/ikonBaseApi";
import {
  GetInstructionHistoryProps,
  InstructionHistoryProps,
  LiveInstructionProps,
} from "./type";

export async function getInstructionHistory({
  probeId,
  fromDate,
  toDate,
}: GetInstructionHistoryProps): Promise<InstructionHistoryProps[]> {
  const result = await ikonBaseApi({
    service: "probeManagementService",
    operation: "getInstructionHistory",
    arguments_: [probeId, fromDate, toDate],
  });
  return result.data;
}

export async function getLiveInstructions({
  probeId,
}: {
  probeId: string;
}): Promise<LiveInstructionProps[]> {
  const result = await ikonBaseApi({
    service: "probeManagementService",
    operation: "getLiveInstructions",
    arguments_: [probeId],
  });
  return result.data;
}
