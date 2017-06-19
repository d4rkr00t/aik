function test(suite) {
  suite.setUrl("/").setCaptureElements("body").capture("plain", actions => {
    actions
      .setWindowSize(800, 800)
      .wait(1000)
      .waitForElementToShow("body", 5000);
  });
}

gemini.suite("Thinking in React", test);
gemini.suite("Simple Counter in Cycle.js", test);
gemini.suite("TodoMVC Vue", test);
