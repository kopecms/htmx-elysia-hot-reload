import { Elysia, ws } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { hotReload } from "plugins/hot-reload";

import { routes } from "routes";

const app = new Elysia()
  .use(ws())
  .use(staticPlugin())
  .use(html())
  .use(hotReload())
  .use(routes)
  .listen(3000);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
