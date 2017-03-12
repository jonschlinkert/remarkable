#!/usr/bin/env node
/*eslint no-console:0*/

'use strict';


var fs = require('fs');
var argparse = require('argparse');

var Remarkable = require('..');

////////////////////////////////////////////////////////////////////////////////

var cli = new argparse.ArgumentParser({
  prog: 'remarkable',
  version: require('../package.json').version,
  addHelp: true
});

cli.addArgument([ 'file' ], {
  help: 'File to read (Defaults to standard input)',
  nargs: '?',
  defaultValue: '-'
});

cli.addArgument([ '--no-html' ], {
  help: 'Escape HTML tags in source',
  nargs: 0
});

cli.addArgument([ '--breaks' ], {
  help: 'Convert \'\\n\' in paragraphs into <br>',
  nargs: 0
});

cli.addArgument([ '--no-linkify' ], {
  help: 'Disable autoconverting of URL-like text',
  nargs: 0
});

cli.addArgument([ '--no-typographer' ], {
  help: 'Disable typographic marks replacement and smart quotes',
  nargs: 0
});

cli.addArgument([ '--highlight' ], {
  help: 'Enable syntax highlighting for fenced blocks (Requires highlight.js be installed)',
  nargs: 0
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

  var mdopts = {
    html: options.no_html ? false : true,
    breaks: options.breaks ? true : false,
    linkify: options.no_linkify ? false : true,
    typographer: options.no_typographer ? false : true
  };

  if (options.highlight) {
    var hljs;

    try {
      hljs = require('highlight.js');
    } catch (e) {
      console.error('highlight.js could not be loaded. Please make sure it is installed before using --highlight');
      process.exit(1);
    }

    mdopts.highlight = function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (e) {}
      }

      try {
        return hljs.highlightAuto(str).value;
      } catch (e) {}

      return ''; // use external default escaping
    };
  }

  md = new Remarkable('full', mdopts);

  try {
    output = md.render(input);
  } catch (e) {
    console.error(e.stack || e.message || String(e));
    process.exit(1);
  }

  process.stdout.write(output);
  process.exit(0);
});
