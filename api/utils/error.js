export const errorHandler = (statusCode, messge) => {
  const error = new Error(messge);
  error.statusCode = statusCode;
  return error;
};
