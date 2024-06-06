// module.exports = {
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//   };


module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};