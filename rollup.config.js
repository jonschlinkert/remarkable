import path from 'path';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';

const name = 'Remarkable';
const external = id => !id.startsWith('.') && !path.isAbsolute(id);

export default [
  {
    input: ['./lib/cli.js', './lib/index.js', './lib/linkify.js'],
    output: { dir: 'dist/cjs', format: 'cjs' },
    external,
    plugins: [json()]
  },

  {
    input: './lib/index.js',
    output: { file: 'dist/cjs/index.browser.js', format: 'cjs' },
    external,
    plugins: [
      nodeResolve({ extensions: ['.browser.js', '.js'] })
    ]
  },

  {
    input: ['./lib/index.js', './lib/linkify.js'],
    output: { dir: 'dist/esm', format: 'esm' },
    external
  },

  {
    input: './lib/index.js',
    output: { file: 'dist/esm/index.browser.js', format: 'esm' },
    external,
    plugins: [
      nodeResolve({ extensions: ['.browser.js', '.js'] })
    ]
  },

  {
    input: './lib/umd.js',
    output: { file: 'dist/remarkable.js', format: 'umd', name },
    plugins: [
      nodeResolve(),
    ]
  },

  {
    input: './lib/umd.js',
    output: { file: 'dist/remarkable.min.js', format: 'umd', name },
    plugins: [
      nodeResolve(),
      terser({
        output: {
          comments(node, comment) {
            // multiline comment
            if (comment.type == "comment2") {
              return /@preserve|@license|@cc_on/i.test(comment.value);
            }
          }
        }
      })
    ]
  }
];
