import path from 'path';
import { addTests } from './utils';
import Remarkable from '../lib/index';
import linkify from '../lib/linkify';

describe('linkify plugin', function () {
  var md = new Remarkable({ html: true }).use(linkify);
  addTests(path.join(__dirname, 'fixtures/linkify.txt'), md);
});
