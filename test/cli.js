import ChildProcess from "child_process";
import assert from 'assert';

// placed here to make multiline indentation easier, feel free to move if you're
// adding more tests here
const desiredOutput = `<h3>This is a simple Markdown document</h3>
<blockquote>
<p>It’s really just here to make sure the Remarkable CLI can take a Markdown
document as an input</p>
</blockquote>
<p><strong>It’s not comprehensive or anything</strong></p>
<p>Hopefully the CLI can handle it though</p>
`;

describe("Remarkable CLI", function() {
  this.timeout(10000);
  it("simple Markdown file as input", function(done) {
    const command = "node -r esm ../lib/cli.js ./fixtures/cli-input.md"
    ChildProcess.exec(command, { cwd: __dirname }, (error, stdout) => {
      assert.strictEqual(stdout.toString(), desiredOutput);
      done();
    });
  });
});
