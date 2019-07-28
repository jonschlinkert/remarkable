import path from 'path';
import assert from 'assert';
import { addTests } from './utils';
import { Remarkable } from '../lib/index';
import { linkify } from '../lib/linkify';

describe('linkify plugin', function () {
  var md = new Remarkable({ html: true }).use(linkify);
  addTests(path.join(__dirname, 'fixtures/linkify.txt'), md);
});

describe('linkify option', function () {
  it('should warn about using linkify option instead of plugin', () => {
    const messages = []
    const oldWarn = console.warn;
    console.warn = message => messages.push(message);
    var md = new Remarkable({ html: true, linkify: true });
    console.warn = oldWarn;
    assert.deepEqual(messages, [
      `linkify option is removed. Use linkify plugin instead:\n\n` +
      `import Remarkable from 'remarkable';\n` +
      `import linkify from 'remarkable/linkify';\n` +
      `new Remarkable().use(linkify)\n`
    ])
  });
});
