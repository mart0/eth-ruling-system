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

type ServiceConfigResponseBody = {
  currentServiceConfiguration: {
    preserveAllTransactions: boolean;
    preserveNonZeroTx: boolean;
    preserveExpensiveTx: boolean;
  }
};

export type HealthCheckResponse = BasicResponse & HealthCheckBody;
export type TransactionResponse = BasicResponse & TransactionResponseBody;
export type ServiceConfigResponse = BasicResponse & ServiceConfigResponseBody;

