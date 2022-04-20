import Router from "koa-router";

import { handleTransactions } from "../controller/appController";
import { StatusCodes } from "http-status-codes";

/**
 * App router represents all app-related endpoints.
 * @returns {Router}
 */
export function createAppRouter(): Router {
    const router: Router = new Router();
   
    router.get("Transactions", "/transactions", async (ctx) => { 
        ctx.body = { 
            isSuccess: true,
            status: StatusCodes.OK,
            message: "Transaction monitoring has been started. Please check your DB for more information about each transaction."
        };
        await handleTransactions(ctx);
    });

    return router;
}
