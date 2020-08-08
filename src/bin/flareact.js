#!/usr/bin/env node
const concurrently = require("concurrently");

["react", "react-dom"].forEach((dependency) => {
  try {
    require.resolve(dependency);
  } catch (err) {
    console.warn(
      `The module '${dependency}' was not found. Flareact requires that you include it in 'dependencies' of your 'package.json'. To add it, run 'npm install ${dependency}'`
    );
  }
});

const command = process.argv[2];

if (command === "dev") {
  console.log("Starting Flareact dev server...");

  concurrently(
    [
      { command: "WORKER_DEV=true wrangler dev", name: "wrangler" },
      {
        command:
          "NODE_ENV=development webpack-dev-server --config node_modules/flareact/configs/webpack.client.config.js --mode development",
        name: "client",
      },
    ],
    {
      prefix: "name",
      killOthers: ["failure"],
      restartTries: 0,
    }
  ).then(
    () => {},
    (error) => {
      console.error(error);
    }
  );
}

if (command === "publish") {
  console.log("Publishing your Flareact project to Cloudflare...");

  concurrently(
    [
      {
        command:
          "webpack --config node_modules/flareact/configs/webpack.client.config.js --out ./out --mode production && wrangler publish",
        name: "publish",
      },
    ],
    {
      prefix: "name",
      killOthers: ["failure"],
      restartTries: 0,
    }
  ).then(
    () => {},
    (error) => {
      console.error(error);
    }
  );
}