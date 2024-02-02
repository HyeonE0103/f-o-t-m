const CracoAlias = require('craco-alias')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProduction = process.env.NODE_ENV === 'production'
//프로덕션 모드로 빌드가 되고 있니?

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        tsConfigPath: 'tsconfig.paths.json',
      },
    },
  ],
  babel: {
    presets: [
      [
        '@babel/preset-react', //JSX 문법으로 해석
        { runtime: 'automatic', importSource: '@emotion/react' },
        //emotion의 JSX사용
      ],
    ],
    plugins: ['@emotion/babel-plugin'],
  },
  webpack: {
    plugins: isProduction ? [] : [new BundleAnalyzerPlugin()],
    //isProduction일때는 빈배열을 개발모드일때는 번들을 사용
  },
}
