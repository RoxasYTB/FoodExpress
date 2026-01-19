const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: 'Erreur de validation',
      erreurs: error.details.map((d) => d.message),
    });
  }

  req.validatedBody = value;
  next();
};

module.exports = validate;

