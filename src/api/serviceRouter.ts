import Router from "koa-router";

import { Context} from "koa";
import { 
    healthCheckController, 
    serviceConfigController,
    changeConfigController, 
} from "../controller/serviceController";
import { TransactionTypes } from "../utils/types";

/**
 * Router which represents all service-related endpoints, like /_healthcheck,
 * /_serviceConfig, etc.
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

    router.post("ChangeServiceConfig", "/serviceConfig", async (ctx: Context) => {
        const payload = ctx.request.body as TransactionTypes;
        const res = await changeConfigController(payload);
        ctx.body = res;
    });

    return router;
}
