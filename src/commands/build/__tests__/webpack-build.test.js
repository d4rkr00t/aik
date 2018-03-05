import path from "path";
import { createBuildStats } from "../webpack-build";
import { updateStatsMock } from "../../../test-helpers/update-stats-mock";

describe("#createBuildStata", () => {
  test("should create build stats from webpack stats json", () => {
    const stats = updateStatsMock("successful-build");
    const buildStats = createBuildStats(
      path.join(process.cwd(), "__fixtures__", "webpack-stats", "successful-build"),
      stats
    );
    expect(typeof buildStats.buildDuration).toBe("number");
    expect(buildStats.assets).toMatchSnapshot();
  });
});
