const envs = {
  next: {
    presets: ["next/babel"]
  },
  test: {
    presets: ["next/babel"]
  }
};

module.exports = envs[process.env.NODE_ENV] || {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
};
