"use strict";
var argparser = require("minimist");

/**
 * Alternative argument parser based on minimist.
 */
function ArgumentParser(info) {
  function message(message, stream) {
    var out = stream || process.stdout;
    out.write("" + message);
  }
  function showHelp(includeArgs = false) {
    var str = "usage: " + info.prog + " [-h] [-v] [{good,bad}] spec\n";
    if (includeArgs) {
      str +=
        "\n" +
        "Positional arguments:\n" +
        "  {good,bad}     type of examples to filter\n" +
        "  spec           spec file to read\n\n" +
        "Optional arguments:\n" +
        "  -h, --help     Show this help message and exit.\n" +
        "  -v, --version  Show program's version number and exit.\n";
    }
    message(str);
  }
  function showVersion() {
    message(info.version + "\n");
  }
  function parseError(msg, errNo = info.errNo) {
    showHelp();
    message(info.prog + ": error: " + msg + "\n");
    process.exit(errNo);
  }

  this.parseArgs = function() {
    var options = { type: null, spec: null };
    var opts = argparser(process.argv.slice(2), {
      boolean: ["help", "version"],
      alias: { v: "version", h: "help" },
      stopEarly: function() {
        showHelp();
        process.exit(1);
      }
    });
    if (opts.help) {
      showHelp(true);
      process.exit(0);
    }
    if (opts.version) {
      showVersion();
      process.exit(0);
    }

    // The way the args are defined, we've either got
    // two arguments (good or bad) followed by the spec file
    // or one argument, which we expect to be the spec file.
    var len = opts._.length;
    if (len == 0) {
      parseError("too few arguments");
    }
    if (len == 1) {
      options.spec = opts._[0];
    } else if (len > 1) {
      options.type = opts._[0];
      options.spec = opts._[1];
      if (!["good", "bad"].includes(options.type)) {
        parseError(
          'argument "type": Invalid choice: ' +
            options.type +
            " (choose from [good, bad])"
        );
      }
    }
    if (len > 2) {
      parseError("Unrecognized arguments: " + opts._.slice(2).join(" ") + ".");
    }
    return options;
  };
}

exports.ArgumentParser = ArgumentParser;
