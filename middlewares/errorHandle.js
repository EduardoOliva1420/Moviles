module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.name === 'ValidationError' ? 400 : 500;
  res.status(status).json({ message: err.message || 'Error interno' });
};