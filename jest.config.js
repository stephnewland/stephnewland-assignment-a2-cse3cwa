/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest", // TypeScript support
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },

  globals: {
    BABEL_JEST_CONFIG: "./babel.config.test.js", // Babel config for Jest
  },

  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/components/$1",
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg|mp4|mp3|wav|ogg)$":
      "<rootDir>/__mocks__/fileMock.js",
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: ["/node_modules/(?!(@?lucide-react)/)"],
  roots: ["<rootDir>/app", "<rootDir>/components"],
  testMatch: [
    "<rootDir>/app/tests/**/*.test.(ts|tsx)",
    "<rootDir>/components/**/*.test.(ts|tsx)",
  ],
};
