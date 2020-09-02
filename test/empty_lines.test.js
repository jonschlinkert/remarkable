
import assert from 'assert';
import { Remarkable } from '../lib/index';

describe('Test empty lines plugin', function() {
  it('should render with empty lines when enabled', function() {
    [
      ['', ''],
      ['abc\n\ndef\n', '<p>abc</p>\n<p>def</p>\n'],
      ['abc\n\n\ndef\n', '<p>abc</p>\n<p>def</p>\n'],
      ['abc\n\n\n\ndef\n\n\n\nghi\n', '<p>abc</p>\n<p></p>\n<p>def</p>\n<p></p>\n<p>ghi</p>\n'],
      ['line1\n\n\n\nline3\n', '<p>line1</p>\n<p></p>\n<p>line3</p>\n'],
      ['* line1\n* line2\n\n\nline4\n', '<ul>\n<li>line1</li>\n<li>line2</li>\n</ul>\n<p>line4</p>\n']
    ].forEach(function(data) {
      var [text, expected] = data;
      var md = new Remarkable('full', { emptyLines: true });
      var rendered = md.render(text);
      assert.strictEqual(rendered, expected);
    });
  });

  it('should render without empty lines when disabled', function() {
    [
      ['', ''],
      ['abc\n\ndef\n', '<p>abc</p>\n<p>def</p>\n'],
      ['abc\n\n\ndef\n', '<p>abc</p>\n<p>def</p>\n'],
      ['line1\n\n\n\nline3\n', '<p>line1</p>\n<p>line3</p>\n'],
      ['* line1\n* line2\n\n\n\n\n\n\nline4\n', '<ul>\n<li>line1</li>\n<li>line2</li>\n</ul>\n<p>line4</p>\n']
    ].forEach(function(data) {
      var [text, expected] = data;
      var md = new Remarkable('full');
      var rendered = md.render(text);
      assert.strictEqual(rendered, expected);
    });
  });
});
