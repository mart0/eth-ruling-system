import { Context} from "koa";
import { version } from "pjson";
import { ConfigResponse, HealthCheckResponse, TransactionTypes } from "../utils/types";
import { APP_NAME as source } from "../utils/constants";
import { StatusCodes } from "http-status-codes";
import { fetchLatestConfig, updateDynamicConfiguration } from "../db/repositories/ConfigRepository";

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
 */
 export async function serviceConfigController(): Promise<ConfigResponse> {
    const currentConfig = await fetchLatestConfig();
    return {
        isSuccess: true,
        status: StatusCodes.OK,
        message: "This is the current configuration that the application is using.",
        currentServiceConfiguration: currentConfig
    };
}

export async function changeConfigController(payload: TransactionTypes): Promise<ConfigResponse> {
    await updateDynamicConfiguration(payload);
    return {
        isSuccess: true,
        status: StatusCodes.OK,
        message: "Configuration has been updated successfuly!",
        currentServiceConfiguration: payload
    };
}


