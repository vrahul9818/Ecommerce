module.exports = function(catchAsyncError) {
  return function(req, res, next) {
    Promise.resolve(catchAsyncError(req, res, next)).catch(error => {
      next(error);
    });
  };
};
