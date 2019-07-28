import fs from 'fs';
import argparse from 'argparse';
import { Remarkable } from './index';
import { linkify } from './linkify';
import { version } from '../package.json';

////////////////////////////////////////////////////////////////////////////////

var cli = new argparse.ArgumentParser({
  prog: 'remarkable',
  version: version,
  addHelp: true
});

cli.addArgument([ 'file' ], {
  help: 'File to read',
  nargs: '?',
  defaultValue: '-'
});

var options = cli.parseArgs();


function readFile(filename, encoding, callback) {
  if (options.file === '-') {
    var chunks = [];

    // read from stdin
    process.stdin.on('data', function(chunk) {
      chunks.push(chunk);
    });

    process.stdin.on('end', function() {
      return callback(null, Buffer.concat(chunks).toString(encoding));
    });
  } else {
    fs.readFile(filename, encoding, callback);
  }
}


////////////////////////////////////////////////////////////////////////////////

readFile(options.file, 'utf8', function (err, input) {
  var output, md;

  if (err) {
    if (err.code === 'ENOENT') {
      console.error('File not found: ' + options.file);
      process.exit(2);
    }

    console.error(err.stack || err.message || String(err));
    process.exit(1);
  }

  md = new Remarkable('full', {
    html: true,
    xhtmlOut: true,
    typographer: true,
  }).use(linkify);

  try {
    output = md.render(input);
  } catch (e) {
    console.error(e.stack || e.message || String(e));
    process.exit(1);
  }

  process.stdout.write(output);
  process.exit(0);
});
