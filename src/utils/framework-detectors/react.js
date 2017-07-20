/* @flow */

import traverse from "babel-traverse";
import { File, Comment } from "babylon";

export function isAikModeReactComment(comment: Comment): boolean {
  return comment.value.replace(/[\s\t]+/gi, "") === "aik-mode:react";
}

export default function isReact(ast: File): boolean {
  let detected = false;

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === "react") {
        detected = true;
        return;
      }

      if (path.node.leadingComments && path.node.leadingComments.length) {
        path.node.leadingComments.forEach(comment => {
          if (isAikModeReactComment(comment)) {
            detected = true;
          }
        });
      }
    },
    Program(path) {
      if (path.node.innerComments && path.node.innerComments.length) {
        path.node.innerComments.forEach(comment => {
          if (isAikModeReactComment(comment)) {
            detected = true;
          }
        });
      }
    }
  });

  return detected;
}
