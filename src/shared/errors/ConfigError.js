class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.name = 'ConfigError';
  }
}

export default ConfigError;
