import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const input = './lib/index.js';
const name = 'Remarkable';

export default [
  {
    input,
    output: { file: 'dist/remarkable.js', format: 'umd', name },
    plugins: [
      nodeResolve(),
      commonjs(),
    ]
  },
  {
    input,
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
