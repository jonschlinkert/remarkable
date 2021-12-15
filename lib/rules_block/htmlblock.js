// HTML block

import html_blocks from '../common/html_blocks';


var HTML_TAG_OPEN_RE = /^<([a-zA-Z_-]{1,15})[\s\/>]/;
var HTML_TAG_CLOSE_RE = /^<\/([a-zA-Z_-]{1,15})[\s>]/;

function isLetter(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
}

export default function htmlblock(state, startLine, endLine, silent) {
  var ch, match, nextLine,
      pos = state.bMarks[startLine],
      max = state.eMarks[startLine],
      shift = state.tShift[startLine];

  pos += shift;

  let allowedBlocks = html_blocks;

  if (!state.options.html) { return false; }

  if (Array.isArray(state.options.htmlAllowedTags)) {
    allowedBlocks = state.options.htmlAllowedTags;
  }

  if (shift > 3 + state.blkIndent || pos + 2 >= max) { return false; }

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  ch = state.src.charCodeAt(pos + 1);

  if (ch === 0x21/* ! */ || ch === 0x3F/* ? */) {
    // Directive start / comment start / processing instruction start
    if (silent) { return true; }

  } else if (ch === 0x2F/* / */ || isLetter(ch)) {

    // Probably start or end of tag
    if (ch === 0x2F/* \ */) {
      // closing tag
      match = state.src.slice(pos, max).match(HTML_TAG_CLOSE_RE);
      if (!match) { return false; }
    } else {
      // opening tag
      match = state.src.slice(pos, max).match(HTML_TAG_OPEN_RE);
      if (!match) { return false; }
    }

    // Make sure tag name is valid
    const tagToCheck = match[1].toLowerCase();
    if (!allowedBlocks.includes(tagToCheck)) {
      const regExpressions = allowedBlocks
        .filter(possibleExpression => typeof possibleExpression !== 'string')
        .filter(possibleExpression => !!possibleExpression.test);

      if (!regExpressions.some(x => x.test(tagToCheck))) {
        return false;
      }
    }

    if (silent) { return true; }

  } else {
    return false;
  }

  // If we are here - we detected HTML block.
  // Let's roll down till empty line (block end).
  nextLine = startLine + 1;
  while (nextLine < state.lineMax && !state.isEmpty(nextLine)) {
    nextLine++;
  }

  state.line = nextLine;
  state.tokens.push({
    type: 'htmlblock',
    level: state.level,
    lines: [ startLine, state.line ],
    content: state.getLines(startLine, nextLine, 0, true)
  });

  return true;
};
