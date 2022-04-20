import { StatusCodes } from "http-status-codes";

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

type ServiceConfigResponseBody = {
  currentServiceConfiguration: TransactionTypes
};

export type HealthCheckResponse = BasicResponse & HealthCheckBody;
export type TransactionResponse = BasicResponse & TransactionResponseBody;
export type ConfigResponse = BasicResponse & { message: string } & ServiceConfigResponseBody;

