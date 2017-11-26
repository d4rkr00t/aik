import { detectFramework } from "../index";

describe("Framework Detectors", () => {
  describe("#detectFramework", () => {
    test("should return null if framework hasn't been detected", () => {
      expect(detectFramework("src/utils/framework-detectors/__test__/mock-data/empty.js")).toBe(null);
    });

    describe("#isReact", () => {
      test("should detect react in simple case", () => {
        expect(detectFramework("src/utils/framework-detectors/__test__/mock-data/react/simple.js")).toBe("react");
      });

      test("should detect react when aik-mode comment is above import statement", () => {
        expect(detectFramework("src/utils/framework-detectors/__test__/mock-data/react/comment-above-import.js")).toBe(
          "react"
        );
      });

      test("should detect react when aik-mode comment is the only content of the file", () => {
        expect(detectFramework("src/utils/framework-detectors/__test__/mock-data/react/only-comment.js")).toBe("react");
      });
    });
  });
});
