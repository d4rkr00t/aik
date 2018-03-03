const { spawn } = require("child_process");
const { join } = require("path");
const stripAnsi = require("strip-ansi");
const puppeteer = require("puppeteer");
const { toMatchImageSnapshot } = require("jest-image-snapshot");
expect.extend({ toMatchImageSnapshot });

const TIMEOUT = 10000;

jest.setTimeout(TIMEOUT);

function isReady(data) {
  return data && data.match(/Open/);
}

function runExample(config) {
  return new Promise((resolve, reject) => {
    const aikProcess = spawn("./../../cli.js", config.args, {
      env: process.env,
      cwd: join(__dirname, "..", "..", "tests", "heavy")
    });

    const timeout = setTimeout(() => {
      aikProcess.kill("SIGTERM");
      reject(new Error(`Timeout for test: "${config.pattern}"`));
    }, TIMEOUT);

    aikProcess.stdout.on("data", data => {
      if (isReady(stripAnsi(data.toString()))) {
        clearTimeout(timeout);
        resolve(() => aikProcess.kill("SIGTERM"));
      }
    });
  });
}

describe("Visual Regression Tests", () => {
  let browser;

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  [
    {
      pattern: "Hello World",
      args: ["examples/hello-world/src/index.js"]
    },
    {
      pattern: "Images Loading",
      args: ["examples/images-loading/src/index.js"]
    },
    {
      pattern: "Simple Counter in Cycle.js",
      args: ["examples/simple-counter-cyclejs/src/index.js"]
    },
    {
      pattern: "Simple React Decorators",
      args: ["examples/simple-react-decorators/src/index.js"]
    },
    {
      pattern: "Thinking in React",
      args: ["examples/thinking-in-react/src/index.js"]
    },
    {
      pattern: "TodoMVC Vue",
      args: ["examples/todomvc-vue/src/index.js"]
    }
  ].forEach(test => {
    it(test.pattern, async () => {
      const stop = await runExample(test);

      const page = await browser.newPage();
      await page.goto("http://localhost:4444");
      const image = await page.screenshot();
      stop();

      expect(image).toMatchImageSnapshot({
        customDiffConfig: {
          threshold: 0.5
        }
      });
    });
  });
});
