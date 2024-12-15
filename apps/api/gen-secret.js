const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, ".dev.vars");
const envVariables = fs.readFileSync(envPath, "utf-8").split("\n");

const envJson = {};
envVariables.forEach((line) => {
  const [key, value] = line.split("=");
  if (key && value) {
    envJson[key] = value;
  }
});

fs.writeFileSync(".env.json", JSON.stringify(envJson, null, 2));
