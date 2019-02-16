"use strict";
var argparser = require("minimist");

/**
 * Alternative argument parser based on minimist.
 */
function nameForArg(arg) {
  var res =
    (arg.optional ? "{" : "")  + 
    (arg.values ? arg.values.join(",") : arg.name) +
    (arg.optional ? "}" : "");
  return res;
}

function helpForArg(arg, spaces) {
  var name = nameForArg(arg).padEnd(spaces);
  return name + "  " + arg.help
}

function ArgumentParser(info, args) {
  var commonArgs = [
    {name: '-h, --help', help: 'Show this help message and exit.'},
    {name: '-v, --version',  help: "Show program's version number and exit."}
  ];
  var spaces = args.concat(commonArgs).reduce((accum, arg) => Math.max(nameForArg(arg).length, accum),0);
  var helpString = 
    "Positional arguments:\n" +
    args.map(arg => "  " + helpForArg(arg, spaces)).join("  \n") + "\n\n" +
    "Optional arguments:\n" +
    commonArgs.map(arg => "  " + helpForArg(arg, spaces)).join("  \n") + "\n";

    function message(message, stream) {
    var out = stream || process.stdout;
    out.write("" + message);
  }

  function showHelp(includeArgs = false) {
    var str = "usage: " + info.prog + " [-h] [-v] " + info.usage + "\n";

    if (includeArgs) {
      str += "\n" + helpString;
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
    var options = args.reduce((accum, arg) => {
      accum[arg.name] = arg.default | null; return accum
    },{});

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

    var len = opts._.length;
    var copyLen = 0;
    // If we've got fewer args than total, kill optional args from the back
    // until we've got the amount we're expecting.
    var argsCopy = args.reverse().filter(arg => {
      var res = !arg.optional || copyLen < len;
      copyLen += res ? 1 : 0; 
      return res;
    }).reverse();

    if (len < argsCopy.length) {
      parseError("too few arguments");
    }
    
    argsCopy.forEach((v, i) => {
      var optVal =opts._[i];
      if (v.values && !v.values.includes(optVal)) {
        parseError(
          'argument "' + v.name + '": Invalid choice: ' +
            optVal + " (choose from [" + v.values.join(", ") + "])"
        );
      }
      options[v.name] = optVal;
    });

    if (len > argsCopy.length) {
      parseError("Unrecognized arguments: " + opts._.slice(argsCopy.length).join(" ") + ".");
    }

    return options;
  };
}

exports.ArgumentParser = ArgumentParser;
