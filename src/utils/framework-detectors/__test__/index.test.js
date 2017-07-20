import detectFramework, { getFrameworkNameFromFlags, updateFrameworkFlags } from "../index";

describe("Framework Detectors", () => {
  describe("#getFrameworkNameFromFlags", () => {
    test("should return framework name that corresponds to given flags", () => {
      expect(getFrameworkNameFromFlags({ react: true })).toBe("react");
    });

    test("should return 'none' when there aren't any framework related flags", () => {
      expect(getFrameworkNameFromFlags({})).toBe("none");
    });
  });

  describe("#detectFramework", () => {
    test("should bail out eralier if framework flag has already been set", () => {
      expect(detectFramework("file.js", { react: true })).toMatchObject({});
    });

    test("should return empty framework flags if framework hasn't been detected", () => {
      expect(detectFramework("src/utils/framework-detectors/__test__/mock-data/empty.js", {})).toMatchObject({});
    });

    describe("#isReact", () => {
      test("should detect react in simple case", () => {
        expect(detectFramework("src/utils/framework-detectors/__test__/mock-data/react/simple.js", {})).toMatchObject({
          react: true
        });
      });

      test("should detect react when aik-mode comment is above import statement", () => {
        expect(
          detectFramework("src/utils/framework-detectors/__test__/mock-data/react/comment-above-import.js", {})
        ).toMatchObject({
          react: true
        });
      });

      test("should detect react when aik-mode comment is the only content of the file", () => {
        expect(
          detectFramework("src/utils/framework-detectors/__test__/mock-data/react/only-comment.js", {})
        ).toMatchObject({
          react: true
        });
      });
    });
  });

  describe("#updateFrameworkFlags", () => {
    test("should return updated CLIFlags is framework has been detected", () => {
      expect(
        updateFrameworkFlags("src/utils/framework-detectors/__test__/mock-data/react/simple.js", {})
      ).toMatchObject({
        react: true
      });
    });
  });
});
