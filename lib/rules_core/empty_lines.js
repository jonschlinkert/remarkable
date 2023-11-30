// Transform empty lines into empty <p> tags
// empty lines data comes from state.env.emptyLines,

export default function empty_lines_block(state) {
  var i, ln;
  var emptyLines = state.env.emptyLines;
  if (!emptyLines || state.options.emptyLines !== true) {
    return;
  }
  var tokens = state.tokens;
  var pendingTokens = [];
  var lastVisitedIndex = 0;
  for (var lineNumber in emptyLines) {
    for (i = lastVisitedIndex; i < tokens.length; i++) {
      var token = tokens[i];
      ln = Number(lineNumber);
      // find the first "paragraph" that after the current empty lines
      if (
        token.type === 'paragraph_open' &&
        token.lines &&
        token.lines[0] >= ln
      ) {
        // push the index info of the found "paragraph"
        pendingTokens.push({
          index: i,
          lineNumber: ln,
          level: token.level
        });
        lastVisitedIndex = ln;
        break;
      }
    }
  }

  // insert the empty line from last to first
  while (pendingTokens.length > 0) {
    var t = pendingTokens.pop();
    var idx = t.index, lvl = t.level;
    ln = t.lineNumber;
    for (i = 0; i < emptyLines[ln] - 1; i++) {
      tokens.splice(
        idx,
        0,
        {
          type: 'paragraph_open',
          tight: false,
          lines: [ln + i, ln + i + emptyLines[ln]],
          level: lvl
        },
        {
          type: 'paragraph_close',
          tight: false,
          level: lvl
        }
      );
    }
  }

  state.tokens = tokens;
};
