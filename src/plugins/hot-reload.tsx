import { Elysia, ws } from "elysia";

import * as tHTML from "typed-html";

let reload = true;
let enabled = false;

interface HotReloadWrapperI extends tHTML.Children {
  request: Request;
  page: any;
  App: ({ children }: tHTML.Children) => JSX.Element;
}

const HotReloadUpdate = ({ children }: tHTML.Children) => (
  <div id="hot-reload-content" hx-swap-oob="true">
    {children}
  </div>
);

export const HotReloadConnection = () => (
  <div hx-ext="ws" ws-connect="/hot-reload">
    <div id="reload-anc" />
  </div>
);

export const HotReloadWrapper = ({ App, page, request }: HotReloadWrapperI) => {
  const HotReloadContent = () => (
    <>
      {enabled && <HotReloadConnection />}
      <div id="hot-reload-content" class="max-w-full">
        {page}
      </div>
    </>
  );

  if (request.headers.get("HR-Request") === "true") {
    return <HotReloadContent />;
  }

  return (
    <App>
      <HotReloadContent />
    </App>
  );
};

const HotReloadIndicator = () => (
  <div
    id="reload-anc"
    hx-swap-oob="true"
    hx-target="this"
    hx-trigger="load"
    ws-send
  />
);

export const hotReload = () => {
  enabled = true;

  return new Elysia().use(ws()).ws("/hot-reload", {
    open(ws) {
      if (reload) {
        ws.send(<HotReloadIndicator />);
      }
      reload = false;
    },
    async message(ws, message: { HEADERS: { [x: string]: string } }) {
      const currentUrl = message.HEADERS["HX-Current-URL"];

      const response = await fetch(currentUrl, {
        headers: { "HR-Request": "true" },
      });

      const page = await response.text();

      ws.send(<HotReloadUpdate>{page}</HotReloadUpdate>);
    },
  });
};
