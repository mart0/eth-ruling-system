import Router from "koa-router";

import { Context} from "koa";
import { StatusCodes } from "http-status-codes";
import { healthCheckController } from "../controller/serviceController";

/**
 * Router represents all service-related endpoints, like /_healthcheck for example.
 * @returns {Router}
 */
export function createServiceRouter(): Router {
    const router: Router = new Router();

    router.get("/_healthcheck", async (ctx: Context) => {
        const res = await healthCheckController(ctx);

        if (res?.isSuccessful) {
            ctx.status = StatusCodes.OK;
        } else {
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
        }

        ctx.body = res ? res.result : { error: "An error occurred" };
        ctx.response.set("Content-Type", "application/json");
    });

    return router;
}
