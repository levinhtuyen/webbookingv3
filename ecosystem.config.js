module.exports = {
  apps: [
    {
      name: "fe-server",
      script: "app/service/server-side-render-service/index.ts",
      instances: 1,
      exec_mode: "cluster_mode",
      interpreter: "./node_modules/.bin/sucrase-node",
      interpreter_args: "--require sucrase/register --require tsconfig-paths/register",
      merge_logs: true,
      max_restarts: 10,
      // autorestart: true,
    },
  ],
};
