module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = [];
  }
  config.plugins.map(console.log);
  return config;
};
