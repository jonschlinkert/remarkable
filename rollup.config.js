import path from 'path';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const name = 'Remarkable';
const external = id => !id.startsWith('.') && !path.isAbsolute(id);

export default [
  {
    input: ['./lib/index.js', './lib/linkify.js'],
    output: { dir: 'dist/cjs', format: 'cjs' },
    external,
    plugins: [
      commonjs(),
    ]
  },

  {
    input: ['./lib/index.js', './lib/linkify.js'],
    output: { dir: 'dist/esm', format: 'esm' },
    external,
    plugins: [
      commonjs(),
    ]
  },

  {
    input: './lib/umd.js',
    output: { file: 'dist/remarkable.js', format: 'umd', name },
    plugins: [
      nodeResolve(),
      commonjs(),
    ]
  },

  {
    input: './lib/umd.js',
    output: { file: 'dist/remarkable.min.js', format: 'umd', name },
    plugins: [
      nodeResolve(),
      commonjs(),
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
