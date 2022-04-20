import { Context} from "koa";
import { version } from "pjson";
import { HealthCheckResponse, ServiceConfigResponse } from "../utils/types";
import { 
    APP_NAME as source,
    PRESERVE_ALL_TRANSACTIONS as preserveAllTransactions,
    PRESERVE_EXPENSIVE_TX as preserveExpensiveTx, 
    PRESERVE_NON_ZERO_TX as preserveNonZeroTx
} from "../utils/constants";
import { StatusCodes } from "http-status-codes";

/**
 * Handles the response of the /_healthcheck endpoint.
 * Prints the current app version and name, requestId and informative message.
 *
 * @param {Context} ctx
 */
 export async function healthCheckController(ctx: Context): Promise<HealthCheckResponse> {
  ctx.log.info("Got a request from %s for %s", ctx.hostname, ctx.path);
  return {
      isSuccess: true,
      status: StatusCodes.OK,
      version,
      source,
      requestId: <string>ctx.reqId,
      message: "Ethereum ruling system is up and running."
  };
}

/**
 * Handles the response of the /_serviceConfig endpoint.
 * Prints the current service configuration which defined which
 * transactons will be persisted and monitored.
 *
 * @param {Context} ctx
 */
 export async function serviceConfigController(ctx: Context): Promise<ServiceConfigResponse> {
    ctx.log.info("Got a request from %s for %s", ctx.hostname, ctx.path);
    return {
        isSuccess: true,
        status: StatusCodes.OK,
        currentServiceConfiguration: {
            preserveAllTransactions,
            preserveNonZeroTx,
            preserveExpensiveTx,
        }
    };
  }
