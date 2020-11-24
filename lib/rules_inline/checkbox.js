// Process [x] Checkboxes

'use strict';

module.exports = function links(state /*, silent */) {
  var pos = state.pos;
  var maxpos = state.posMax;
  if (pos === maxpos) {
    return false;
  }
  if (state.src.charCodeAt(pos) !== 91) {
    return false;
  }
  ++pos;
  if (state.src.charCodeAt(pos) === 93) {
    state.push({
      type: 'checkbox',
      checked: false,
      level: state.level
    });
    state.pos = pos + 1;
    return true;
  }
  if (state.src.charCodeAt(pos) === 120 || state.src.charCodeAt(pos) === 88 || state.src.charCodeAt(pos) === 32) {
    var checked = (state.src.charCodeAt(pos) !== 32);
    ++pos;
    if (state.src.charCodeAt(pos) !== 93) {
      return false;
    }
    state.push({
      type: 'checkbox',
      checked: checked,
      level: state.level
    });
    state.pos = pos + 1;
    return true;
  }
  return false;
};
