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
        name:'inkbox',
        input: './src/inkbox/main.ts',
        output:"ink/inkbox.js"
    },
    {
        name:'iDolphin',
        input: './src/iDolphin/Ink.ts',
        output:"ink/iDolphin.js"
    },
    {
        name:'iLog',
        input: './src/iLog/Ink.ts',
        output:"ink/iLog.js"
    },
    {
        name:'iClock',
        input: './src/iClock/Ink.ts',
        output:"ink/iClock.js"
    },
    {
        name:'iService',
        input: './src/iService/Ink.ts',
        output:"ink/iService.js"
    },
    {
        name:'iHttp',
        input: './src/iHttp/Ink.ts',
        output:"ink/iHttp.js"
    },
    {
        name:'iMongo',
        input: './src/iMongo/Ink.ts',
        output:"ink/iMongo.js"
    }
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
            terser(),
            // incremental.fixSNE()
        ]
    };
    confs.push(conf);
}
export default confs;