// middlewares/validateZod.js
const validateZod = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Validación fallida',
      errors: parsed.error.issues
    });
  }
  req.validated = parsed.data;
  next();
};

export default validateZod;
