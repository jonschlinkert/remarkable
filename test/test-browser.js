import fs from 'fs';
import path from 'path';

const readFixture = file =>
  JSON.stringify(fs.readFileSync(file, 'utf-8'));

const readFixtureDir = dir =>
  fs.readdirSync(dir).map(file => [JSON.stringify(file), readFixture(path.join(dir, file))]);

const content = `
<script type="module">
  import RemarkableWithMap from './dist/esm/index.js';
  import RemarkableWithTextarea from './dist/esm/index.browser.js';

  const markdownWithMap = new RemarkableWithMap('commonmark');
  const markdownWithTextarea = new RemarkableWithMap('commonmark');

  const runTests = (name, input) => {
    input = input.replace(/→/g, '\\t');
    input.replace(/^\\.\\n([\\s\\S]*?)^\\.\\n([\\s\\S]*?)^\\.$/gm, function(__, md, html, offset, orig) {
      const result1 = html === markdownWithMap.render(md);
      const result2 = html === markdownWithTextarea.render(md);
      console.log(
        '%c %s %s %s',
        result1 === result2 ? 'color: green' : 'color: red',
        name,
        result1,
        result2
      );
    });
  };

  runTests('test/fixtures/commonmark/good.txt', ${readFixture('test/fixtures/commonmark/good.txt')});
  ${readFixtureDir('test/fixtures/remarkable')
    .map(([name, fixture]) => `runTests(${name}, ${fixture});`)
    .join('\n')}
</script>
`

fs.writeFileSync('index.html', content)
