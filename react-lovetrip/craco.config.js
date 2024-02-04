const CracoAlias = require('craco-alias')

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
}
