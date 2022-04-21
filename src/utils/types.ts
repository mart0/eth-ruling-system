import { StatusCodes } from "http-status-codes";
import { TransactionTypeEnum } from "./enums";

type BasicResponse = {
  isSuccess: boolean;
  status: StatusCodes;
};

type TransactionResponseBody = {
  message: string;
};

type HealthCheckBody = {
  version: string;
  source: string;
  message: string;
  requestId: string;
  error?: string;
};

export type TransactionTypes = {
  allTransactions: boolean;
  nonZeroTx: boolean;
  expensiveTx: boolean;
};

export type TransactionDTO = {
  type: TransactionTypeEnum[];
  txHash: string;
  blockNumber: number;
  age: string;
  from: string;
  to: string;
  value: string;
  fee: string;
};

type ServiceConfigResponseBody = {
  currentServiceConfiguration: TransactionTypes
};

export type HealthCheckResponse = BasicResponse & HealthCheckBody;
export type TransactionResponse = BasicResponse & TransactionResponseBody;
export type ConfigResponse = BasicResponse & { message: string } & ServiceConfigResponseBody;

