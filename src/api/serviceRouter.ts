import Router from "koa-router";

import { Context} from "koa";
import { healthCheckController, serviceConfigController } from "../controller/serviceController";

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

    router.get("ServiceConfig", "/_serviceConfig", async (ctx: Context) => {
        const res = await serviceConfigController(ctx);
        ctx.body = res;
    });

    return router;
}
