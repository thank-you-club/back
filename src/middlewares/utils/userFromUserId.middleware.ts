import User from "../../models/User";

export default async (req, res, next) => {
  if (!req.params.userId) return res.status(400).send();
  req.user = await User.findOne({ _id: req.params.userId });
  next();
};
