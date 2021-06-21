import initAdapters from "./plugins.js";
import { assertEquals, assertObjectMatch, assertThrows } from "../dev_deps.js";

const test = Deno.test;

test("sucessfully compose plugins", () => {
  const plugin1 = ({
    id: "plugin1",
    port: "default",
    load: (env) => ({ ...env, hello: "world" }),
    link: (env) => () => ({ hello: () => env.hello }),
  });

  const plugin2 = (config) => ({
    id: "plugin2",
    port: "default",
    load: (env) => ({ ...env, ...config }),
    link: (env) => (plugin) => ({ ...plugin, beep: () => env }),
  });

  const config = {
    adapters: [
      { port: "default", plugins: [plugin2({ foo: "bar" }), plugin1] },
    ],
  };
  const adapters = initAdapters(config.adapters);

  assertEquals(adapters.default.hello(), "world");
  assertObjectMatch(adapters.default.beep(), { foo: "bar", hello: "world" });
});

test("throw if plugin is missing link method", () => {
  const plugin1 = ({
    id: "plugin1",
    port: "default",
    load: (env) => ({ ...env, hello: "world" }),
    link: (env) => () => ({ hello: () => env.hello }),
  });

  const noLinkPlugin = (config) => ({
    id: "plugin2",
    port: "default",
    load: (env) => ({ ...env, ...config }),
  });

  const config = {
    adapters: [
      { port: "default", plugins: [noLinkPlugin({ foo: "bar" }), plugin1] },
    ],
  };

  assertThrows(() => initAdapters(config.adapters), Error);
});
