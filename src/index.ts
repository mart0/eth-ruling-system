
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import koaBunyanLogger from "koa-bunyan-logger";
import database from "../src/db/initDatabase";

import { Server, createServer } from "http";
import { createAppRouter,  createServiceRouter } from "./api";
import { APP_PORT, HOSTNAME } from "../src/utils/constants";
import { TransactionsMap } from "./db/models/transactions";

export function main(): Server {
    const app: Koa = new Koa();

    // Main routers
    const appRouter = createAppRouter();
    const serviceRouter = createServiceRouter();

    // Logger middleware
    app.use(koaBunyanLogger())
        .use(koaBunyanLogger.requestIdContext());

    // A body parser for koa, supports json
    app.use(bodyParser());

    app.use(appRouter.routes());
    app.use(serviceRouter.routes());

    return createServer(app.callback());
}

async function startService() {
    try {
        // Check connection and initialize DB first
        await database.authenticate();
        TransactionsMap(database);
        console.log('DB connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }

    const server: Server = main();
    server.listen(APP_PORT);

    console.info(
        `Application started on ${HOSTNAME}:${APP_PORT}. 
         Please navigate to the /transactions endpoint in order to trigger the transaction monitoring.`
    );
}

startService();
