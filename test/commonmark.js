import path from 'path';
import { addTests } from './utils';
import { Remarkable } from '../lib/index';

describe('CommonMark', function () {
  var md = new Remarkable('commonmark');
  addTests(path.join(__dirname, 'fixtures/commonmark/good.txt'), md);
});
