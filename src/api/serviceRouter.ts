import Router from "koa-router";

import { Context} from "koa";
import { 
    healthCheckController, 
    serviceConfigController,
    changeConfigController as createConfigController, 
} from "../controller/serviceController";
import { TransactionTypes } from "../utils/types";

/**
 * Router which represents all service-related endpoints:
 * 
 * - GET /_healthcheck - Check if the app is up and running + some additional information about the app.
 * - GET /serviceConfig - Check the current dynamic configuration used by the app.
 * - POST /serviceConfig - Create new dynamic configuration to be used by the app.
 * @returns {Router}
 */
export function createServiceRouter(): Router {
    const router: Router = new Router();

    router.get("HealthCheck", "/_healthcheck", async (ctx: Context) => {
        const res = await healthCheckController(ctx);
        ctx.body = res;
    });

    router.get("ServiceConfig", "/serviceConfig", async (ctx: Context) => {
        const res = await serviceConfigController();
        ctx.body = res;
    });

    router.post("CreateServiceConfig", "/serviceConfig", async (ctx: Context) => {
        const payload = ctx.request.body as TransactionTypes;
        const res = await createConfigController(payload, ctx);
        ctx.body = res;
    });

    return router;
}
