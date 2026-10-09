class RateLimitError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 429;
    this.name = 'RateLimitError';
  }
}

export default RateLimitError;
