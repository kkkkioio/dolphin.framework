import path from 'path'
import resolve from 'rollup-plugin-node-resolve' // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs' // commonjs模块转换插件
import { eslint } from 'rollup-plugin-eslint' // eslint插件
import cleanup from 'rollup-plugin-cleanup' //清理插件
import { terser } from 'rollup-plugin-terser' // 压缩插件
import incremental from '@mprt/rollup-plugin-incremental' //改变编译
import ts from 'rollup-plugin-typescript2'
const getPath = _path => path.resolve(__dirname, _path)
const extensions = [
  '.js',
  '.ts',
  '.tsx'
]
const tsPlugin = ts({
  tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
  extensions
})
// eslint
const esPlugin = eslint({
  throwOnError: true,
  include: ['src/**/*.ts'],
  exclude: ['node_modules/**', 'lib/**','ink/**']
})

let confs = [];

let envs = [
    {
      name:'dpCore',
      input: './src/dpCore/Ink.ts',
      output:"ink/dpCore.js"
    },
    {
        name:'dpWeb',
        input: './src/dpWeb/Ink.ts',
        output:"ink/dpWeb.js"
    },
    {
      name:'dpLogin',
      input: './src/dpLogin/Ink.ts',
      output:"ink/dpLogin.js"
    },
    {
      name:'dpServer',
      input: './src/dpServer/Ink.ts',
      output:"ink/dpServer.js"
    },
    {
      name:'dpChara',
      input: './src/dpChara/Ink.ts',
      output:"ink/dpChara.js"
    },
]

for (const env of envs) {
    let conf = {
        input: getPath(env.input),
        output:{
            name: env.name,
            file: env.output, 
            format: 'umd',
        },
        plugins:[
          // incremental(),
          resolve(extensions),
          commonjs(),
          esPlugin,
          tsPlugin,
          cleanup(),
          // terser(),
          // incremental.fixSNE()
        ]
    };
    confs.push(conf);
}
export default confs;