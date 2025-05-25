module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  verbose: true,
  // globals: { // ts-jest の設定は transform に移動したためコメントアウトまたは削除
  //   'ts-jest': {
  //     tsconfig: {
  //       jsx: 'react-jsx',
  //     },
  //   },
  // },
};
