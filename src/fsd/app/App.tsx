import * as tHTML from "typed-html";

import { HotReloadWrapper } from "plugins/hot-reload";

import { Head } from "./Head";

interface AppI extends tHTML.Children {
  title: string;
  request: Request;
}

export const App = ({ children, title, request }: AppI) => {
  const { headers } = request;

  const htmx = headers.get("HX-Request") === "true";

  if (htmx) {
    return <>{children}</>;
  }

  return (
    <HotReloadWrapper
      request={request}
      page={<div id="body-content">{children}</div>}
      App={({ children }) => (
        <html lang="en" hx-boost="true">
          <Head title={title} />
          <body>{children}</body>
        </html>
      )}
    />
  );
};
