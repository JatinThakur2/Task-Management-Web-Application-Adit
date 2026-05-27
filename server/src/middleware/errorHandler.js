// Central error handler. Controllers call next(err) and end up here so we have a
// single place that shapes error responses.
function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, _next) {
  // Duplicate key (e.g. email already registered).
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  // Mongoose cast error -> the id in the URL was not a valid ObjectId.
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource id' });
  }

  const status = err.status || 500;
  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    message: status === 500 ? 'Something went wrong' : err.message,
  });
}

module.exports = { notFound, errorHandler };
