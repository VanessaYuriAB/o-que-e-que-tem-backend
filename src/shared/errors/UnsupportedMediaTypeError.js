class UnsupportedMediaTypeError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 415;
    this.name = 'UnsupportedMediaType';
  }
}

export default UnsupportedMediaTypeError;
