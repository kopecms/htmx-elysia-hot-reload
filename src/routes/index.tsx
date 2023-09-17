import Elysia from "elysia";
import { App } from "fsd/app/App";
import { Home } from "fsd/pages/home";
import { Info } from "fsd/pages/info";

export const routes = new Elysia()
  .get("/", (props) => (
    <App {...props} title="Home">
      <Home />
    </App>
  ))
  .get("/info", (props) => (
    <App {...props} title="Info">
      <Info />
    </App>
  ));
