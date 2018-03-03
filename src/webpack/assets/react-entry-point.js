const React = require("react");
const ReactDOM = require("react-dom");
import { hot } from "react-hot-loader";

function renderEntry(exported) {
  if (exported.default) {
    exported = exported.default;
  }

  // Assumptions: the entry module either renders the app itself or exports a
  // React component (which is either a function or class) or element (which has
  // type and props properties).
  var element;
  if (Object.prototype.toString.call(exported) === "[object Function]") {
    element = React.createElement(hot(module)(exported));
  } else if (exported.type && exported.props) {
    element = exported;
  }
  if (element) {
    // eslint-disable-next-line
    ReactDOM.render(element, document.getElementById("app"));
  }
}

renderEntry(require("aikReactEntryPoint"));
