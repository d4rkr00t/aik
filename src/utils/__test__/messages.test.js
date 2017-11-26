import stripAnsi from "strip-ansi";

import syntaxErrorMock from "./mock-data/syntax-error.json";
import buildStatsMock from "./mock-data/build-stats.json";

import {
  eslintExtraWarningMsg,
  fileDoesNotExistMsg,
  foundPackageJson,
  installingModuleMsg,
  packageJsonHasNotBeenFound,
  devServerBanner,
  devServerInvalidBuildMsg,
  devServerCompiledSuccessfullyMsg,
  devServerFailedToCompileMsg,
  devServerCompiledWithWarningsMsg,
  devServerFileDoesNotExistMsg,
  devServerRestartMsg,
  devServerModuleDoesntExists,
  devServerFrameworkDetectedRestartMsg,
  devServerReactRequired,
  builderBanner,
  builderRemovingDistMsg,
  builderRunningBuildMsg,
  builderErrorMsg,
  builderSuccessMsg,
  addTopSpace,
  addBottomSpace,
  joinWithSeparator
} from "../messages";

const print = msg => {
  // console.log(msg.join("\n"));
  return stripAnsi(msg.join("\n"));
};

const filename = "./src/index.js";

describe("Helpers", () => {
  test("#addTopSpace", () => {
    expect(addTopSpace(["msg", "content"]).join("")).toBe(["", "msg", "content"].join(""));
  });

  test("#addBottomSpace", () => {
    expect(addBottomSpace(["msg", "content"]).join("")).toBe(["msg", "content", ""].join(""));
  });

  describe("#joinWithSeparator", () => {
    test("array of string", () => {
      expect(joinWithSeparator("|", ["msg", "content", "here"]).join("")).toBe(
        ["msg", "|", "content", "|", "here"].join("")
      );
    });

    test("array of string arrays", () => {
      expect(joinWithSeparator("|", [["msg", "content"], ["here"]]).join("")).toBe(
        ["msg", "content", "|", "here"].join("")
      );
    });
  });
});

describe("Common Messages", () => {
  test("#eslintExtraWarningMsg", () => {
    expect(print(eslintExtraWarningMsg())).toMatchSnapshot();
  });

  test("#fileDoesNotExistMsg", () => {
    expect(print(fileDoesNotExistMsg(filename))).toMatchSnapshot();
  });

  test("#foundPackageJson", () => {
    expect(print(foundPackageJson())).toMatchSnapshot();
  });

  test("#installingModuleMsg", () => {
    expect(print(installingModuleMsg("react"))).toMatchSnapshot();
  });

  test("#packageJsonHasNotBeenFound", () => {
    expect(print(packageJsonHasNotBeenFound())).toMatchSnapshot();
  });
});

describe("Dev Server Messages", () => {
  describe("#devServerBanner", () => {
    let params;

    beforeEach(() => {
      params = {
        filename,
        host: "localhost",
        port: 3334,
        oldPort: 3333,
        framework: "react",
        template: {
          short: "index.html"
        },
        ngrok: "http://43kd92j3h.ngrok.com"
      };
    });

    test("all flags enabled", () => {
      expect(print(devServerBanner(params))).toMatchSnapshot();
    });

    test("no template", () => {
      params.template = {};
      expect(print(devServerBanner(params))).toMatchSnapshot();
    });

    test("no old port", () => {
      params.oldPort = false;
      expect(print(devServerBanner(params))).toMatchSnapshot();
    });

    test("no ngrok", () => {
      params.ngrok = false;
      expect(print(devServerBanner(params))).toMatchSnapshot();
    });
  });

  test("#devServerCompiledSuccessfullyMsg", () => {
    const params = {
      filename,
      host: "localhost",
      port: 3334,
      oldPort: 3333,
      framework: "react",
      template: {
        short: "index.html"
      },
      ngrok: "http://43kd92j3h.ngrok.com"
    };

    expect(print(devServerCompiledSuccessfullyMsg(params, 5800))).toMatchSnapshot();
  });

  test("#devServerCompiledWithWarningsMsg", () => {
    const params = {
      filename,
      host: "localhost",
      port: 3334,
      oldPort: 3333,
      framework: "react",
      template: {
        short: "index.html"
      },
      ngrok: "http://43kd92j3h.ngrok.com"
    };

    expect(print(devServerCompiledWithWarningsMsg(params, 5800))).toMatchSnapshot();
  });

  test("#devServerInvalidBuildMsg", () => {
    expect(print(devServerInvalidBuildMsg())).toMatchSnapshot();
  });

  test("#devServerFailedToCompileMsg", () => {
    expect(print(devServerFailedToCompileMsg())).toMatchSnapshot();
  });

  test("#devServerFileDoesNotExistMsg", () => {
    expect(print(devServerFileDoesNotExistMsg(filename))).toMatchSnapshot();
  });

  test("#devServerRestartMsg", () => {
    expect(print(devServerRestartMsg("react"))).toMatchSnapshot();
  });

  test("#devServerModuleDoesntExists", () => {
    expect(print(devServerModuleDoesntExists("react", filename))).toMatchSnapshot();
  });

  test("#devServerFrameworkDetectedRestartMsg", () => {
    expect(print(devServerFrameworkDetectedRestartMsg("react"))).toMatchSnapshot();
  });

  test("#devServerReactRequired", () => {
    expect(print(devServerReactRequired())).toMatchSnapshot();
  });
});

describe("Build Messages", () => {
  describe("#builderBanner", () => {
    let params;

    beforeEach(() => {
      params = {
        filename,
        base: "/subfolder/",
        template: {
          short: "index.html"
        }
      };
    });

    test("all flags and params", () => {
      expect(print(builderBanner(params))).toMatchSnapshot();
    });

    test("no template", () => {
      params.template = {};
      expect(print(builderBanner(params))).toMatchSnapshot();
    });

    test("no base", () => {
      params.base = "";
      expect(print(builderBanner(params))).toMatchSnapshot();
    });

    test("basic", () => {
      expect(print(builderBanner({ filename, template: {} }))).toMatchSnapshot();
    });
  });

  test("#builderRemovingDistMsg", () => {
    expect(print(builderRemovingDistMsg("./dist"))).toMatchSnapshot();
  });

  test("#builderRunningBuildMsg", () => {
    expect(print(builderRunningBuildMsg())).toMatchSnapshot();
  });

  describe("#builderErrorMsg?", () => {
    test("Custom Error message", () => {
      expect(print(builderErrorMsg(["Some error message"]))).toMatchSnapshot();
    });

    test("Syntax Error", () => {
      expect(print(builderErrorMsg(syntaxErrorMock))).toMatchSnapshot();
    });
  });

  test("#builderSuccessMsg", () => {
    expect(print(builderSuccessMsg("./dist", buildStatsMock))).toMatchSnapshot();
  });
});
