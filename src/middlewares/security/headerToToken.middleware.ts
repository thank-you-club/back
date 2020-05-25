export default (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (token) req.token = token;
  }
  next();
};
