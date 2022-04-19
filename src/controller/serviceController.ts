import { Context} from "koa";
import { version } from "pjson";
import { HealthCheckResponse } from "../utils/types";
import { APP_NAME as source } from "../utils/constants";

/**
 * Handles the response of the /_healthcheck endpoint.
 * Prints the current app version and name, requestId and informative message.
 *
 * @param {Context} ctx
 */
 export async function healthCheckController(ctx: Context): Promise<HealthCheckResponse> {
  ctx.log.info("Got a request from %s for %s", ctx.hostname, ctx.path);
  return {
      isSuccessful: true,
      result: {
          version,
          source,
          requestId: <string>ctx.reqId,
          message: "Ethereum ruling system is up and running."
      }
  };
}
