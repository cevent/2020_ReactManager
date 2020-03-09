/**
 * 针对ant-d实现按需打包
 * 根据import打包
 */
/*const {override,fixBabelImports}=require('customize-cra');

module.exports=override(
  fixBabelImports('import',{ //使用babel-plugin-import包
    libraryName:'antd',
    libraryDirectory:'es',
    style:true //自动打包css相关样式，组件对应样式
  })
);*/

const {override,fixBabelImports,addLessLoader}=require('customize-cra');

module.exports=override(
  fixBabelImports('import',{ //使用babel-plugin-import包
    libraryName:'antd',
    libraryDirectory:'es',
    style:true //自动打包css相关样式，组件对应样式
  }),
  //使用less-loader对源码中的less变量进行覆盖
  addLessLoader({
    javascriptEnabled:true,
    modifyVars:{'@primary-color':'#1DA57A'},
    //modifyVars:{'@primary-color':'#ff504a'},
  })
);

