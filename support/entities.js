#!/usr/bin/env node -r esm

//
// Markdown entities generator (from html5 entities)
//

/*eslint no-console:0*/
import https from 'https';

function codeToUni(code) {
  var result = code.toString(16).toUpperCase();
  while (result.length < 4) { result = '0' + result; }
  return '\\u' + result;
}

function strToUni(str) {
  var result = codeToUni(str.charCodeAt(0));
  if (str.length > 1) {
    result += codeToUni(str.charCodeAt(1));
  }
  return result;
}

https.get('https://html.spec.whatwg.org/entities.json', function (res) {
  var body = '';
  res.on('data', function(chunk) {
    body += chunk;
  });
  res.on('end', function() {
    var entities = JSON.parse(body);
    var out = {};

    Object.keys(entities).forEach(function (entity) {
      // Skip legacy - not allosed in markdown
      if (entity[entity.length - 1] !== ';') { return; }

      out[entity.slice(1, -1)] = strToUni(entities[entity].characters);
    });

    var result = [];

    Object.keys(out).forEach(function (key) {
      result.push('  "' + key + '": "' + out[key] + '"');
    });

    console.log('{\n' + result.join(',\n') + '\n}');
  });
});
