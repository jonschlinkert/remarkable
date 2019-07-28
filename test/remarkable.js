import path from 'path';
import { addTests } from './utils';
import { Remarkable } from '../lib/index';

describe('remarkable', function () {
  var md = new Remarkable('full', {
    html: true,
    langPrefix: '',
    typographer: true,
  });

  addTests(path.join(__dirname, 'fixtures/remarkable'), md);
});
