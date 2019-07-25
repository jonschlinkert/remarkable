import Ruler from './ruler';
import StateInline from './rules_inline/state_inline';
import * as utils from './common/utils';

import text from './rules_inline/text';
import newline from './rules_inline/newline';
import escape from './rules_inline/escape';
import backticks from './rules_inline/backticks';
import del from './rules_inline/del';
import ins from './rules_inline/ins';
import mark from './rules_inline/mark';
import emphasis from './rules_inline/emphasis';
import sub from './rules_inline/sub';
import sup from './rules_inline/sup';
import links from './rules_inline/links';
import footnote_inline from './rules_inline/footnote_inline';
import footnote_ref from './rules_inline/footnote_ref';
import autolink from './rules_inline/autolink';
import htmltag from './rules_inline/htmltag';
import entity from './rules_inline/entity';

/**
 * Inline Parser `rules`
 */

var _rules = [
  [ 'text',            text ],
  [ 'newline',         newline ],
  [ 'escape',          escape ],
  [ 'backticks',       backticks ],
  [ 'del',             del ],
  [ 'ins',             ins ],
  [ 'mark',            mark ],
  [ 'emphasis',        emphasis ],
  [ 'sub',             sub ],
  [ 'sup',             sup ],
  [ 'links',           links ],
  [ 'footnote_inline', footnote_inline ],
  [ 'footnote_ref',    footnote_ref ],
  [ 'autolink',        autolink ],
  [ 'htmltag',         htmltag ],
  [ 'entity',          entity ]
];

/**
 * Inline Parser class. Note that link validation is stricter
 * in Remarkable than what is specified by CommonMark. If you
 * want to change this you can use a custom validator.
 *
 * @api private
 */

export default function ParserInline() {
  this.ruler = new Ruler();
  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }

  // Can be overridden with a custom validator
  this.validateLink = validateLink;
}

/**
 * Skip a single token by running all rules in validation mode.
 * Returns `true` if any rule reports success.
 *
 * @param  {Object} `state`
 * @api privage
 */

ParserInline.prototype.skipToken = function (state) {
  var rules = this.ruler.getRules('');
  var len = rules.length;
  var pos = state.pos;
  var i, cached_pos;

  if ((cached_pos = state.cacheGet(pos)) > 0) {
    state.pos = cached_pos;
    return;
  }

  for (i = 0; i < len; i++) {
    if (rules[i](state, true)) {
      state.cacheSet(pos, state.pos);
      return;
    }
  }

  state.pos++;
  state.cacheSet(pos, state.pos);
};

/**
 * Generate tokens for the given input range.
 *
 * @param  {Object} `state`
 * @api private
 */

ParserInline.prototype.tokenize = function (state) {
  var rules = this.ruler.getRules('');
  var len = rules.length;
  var end = state.posMax;
  var ok, i;

  while (state.pos < end) {

    // Try all possible rules.
    // On success, the rule should:
    //
    // - update `state.pos`
    // - update `state.tokens`
    // - return true
    for (i = 0; i < len; i++) {
      ok = rules[i](state, false);

      if (ok) {
        break;
      }
    }

    if (ok) {
      if (state.pos >= end) { break; }
      continue;
    }

    state.pending += state.src[state.pos++];
  }

  if (state.pending) {
    state.pushPending();
  }
};

/**
 * Parse the given input string.
 *
 * @param  {String} `str`
 * @param  {Object} `options`
 * @param  {Object} `env`
 * @param  {Array} `outTokens`
 * @api private
 */

ParserInline.prototype.parse = function (str, options, env, outTokens) {
  var state = new StateInline(str, this, options, env, outTokens);
  this.tokenize(state);
};

/**
 * Validate the given `url` by checking for bad protocols.
 *
 * @param  {String} `url`
 * @return {Boolean}
 */

function validateLink(url) {
  var BAD_PROTOCOLS = [ 'vbscript', 'javascript', 'file', 'data' ];
  var str = url.trim().toLowerCase();
  // Care about digital entities "javascript&#x3A;alert(1)"
  str = utils.replaceEntities(str);
  if (str.indexOf(':') !== -1 && BAD_PROTOCOLS.indexOf(str.split(':')[0]) !== -1) {
    return false;
  }
  return true;
}
