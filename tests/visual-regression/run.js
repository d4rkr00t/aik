const { spawn, execSync } = require("child_process");
const { join } = require("path");
const chalk = require("chalk");
const proq = require("proq");

const tests = [
  {
    pattern: "Thinking in React",
    args: ["examples/thinking-in-react/src/index.js"]
  },
  {
    pattern: "Simple Counter in Cycle.js",
    args: ["examples/simple-counter-cyclejs/src/index.js"]
  },
  {
    pattern: "TodoMVC Vue",
    args: ["examples/todomvc-vue/src/index.js"]
  }
];

const command = process.argv[2] === "update" ? "update" : "test";
const suite = command === "update" ? null : process.argv[2];

function isReady(data) {
  return data && data.match(/Compiled/) && data.match(/Server:/);
}

function startPhantom(cb) {
  // eslint-disable-next-line
  console.log(`${chalk.blue("Starting PhantomJS...")}`);
  const phantomProcess = spawn("phantomjs", ["--webdriver=5555"], {
    env: process.env,
    cwd: process.cwd()
  });
  let wasCalled = false;

  phantomProcess.stdout.on("data", () => {
    if (!wasCalled) {
      wasCalled = true;
      cb(phantomProcess);
    }
  });
}

function runGeminiForPattern(pattern) {
  try {
    execSync(`./node_modules/.bin/gemini ${command} --grep "${pattern}" --reporter flat`, {
      env: process.env,
      cwd: process.cwd(),
      stdio: "inherit"
    });
  } catch (error) {
    return pattern;
  }
}

function runSingleTest(testConfig, result) {
  // eslint-disable-next-line
  console.log(`${chalk.blue("Running visual regression tests for:")} ${chalk.yellow(testConfig.pattern)}`);
  console.log(); // eslint-disable-line

  return new Promise(resolve => {
    const aikProcess = spawn("./../../cli.js", testConfig.args, {
      env: process.env,
      cwd: join(process.cwd(), "tests", "heavy")
    });

    aikProcess.stdout.on("data", data => {
      if (isReady(data.toString())) {
        result.push(runGeminiForPattern(testConfig.pattern));
        aikProcess.kill("SIGTERM");

        console.log(); // eslint-disable-line

        resolve(result);
      }
    });
  });
}

function main() {
  startPhantom(phatomProcess => {
    const selectedTests = suite ? tests.filter(t => t.pattern.startsWith(suite)) : tests;

    const promiseList = selectedTests.map(test => result => runSingleTest(test, result));

    proq(promiseList, []).then(rawResults => {
      phatomProcess.kill("SIGTERM");

      const results = rawResults.filter(r => !!r);

      console.log(chalk.dim("-----------------------")); // eslint-disable-line

      if (results.length) {
        console.log(); // eslint-disable-line
        results.map(result =>
          // eslint-disable-next-line
          console.log(`${chalk.red("Error in:")} ${result}`)
        );
        process.exit(1);
      } else {
        console.log(chalk.green("DONE")); // eslint-disable-line
      }
    });
  });
}

main();
