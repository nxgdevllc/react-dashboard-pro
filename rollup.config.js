import path from "path";
import commonjs from "rollup-plugin-commonjs"; // commonjs模块转换插件
import { eslint } from "rollup-plugin-eslint"; // eslint插件
import resolve from "rollup-plugin-node-resolve"; // 依赖引用插件
import postcss from "rollup-plugin-postcss";
import ts from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";
import packageJSON from "./package.json";
const getPath = (_path) => path.resolve(__dirname, _path);

const extensions = [".js", ".ts", ".tsx"];

// ts
const tsPlugin = ts({
  tsconfig: getPath("./tsconfig.json"), // 导入本地ts配置
  extensions,
});

// eslint
const esPlugin = eslint({
  throwOnError: true,
  include: ["src/**/*.ts"],
  exclude: ["node_modules/**", "lib/**"],
});

// 基础配置
const commonConf = {
  input: getPath("./doc/src/package/index.tsx"),
  external: ["react","react-dom","antd","@ant-design/icons","react-grid-layout"],
  plugins: [
    uglify(),
    postcss(),
    resolve(extensions),
    // babel({
    //   exclude: 'node_modules/**' // 仅仅转译我们的源码
    // }),
    commonjs(),
    esPlugin,
    tsPlugin,
    
  ],
};

export default [
  {
    ...commonConf,
    output: {
      name: packageJSON.name,
      file: packageJSON.main, // 通用模块
      format: "umd",
    },
  },
  {
    ...commonConf,
    output: {
      name: packageJSON.name,
      file: packageJSON.module, // es6模块
      format: "es",
    },
  }
];
