import User from "../../models/User";
import * as jwt from "jsonwebtoken";

export default async (req, res, next) => {
  if (req.token) {
    const decoded = jwt.verify(req.token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).send();
    req.user = await User.findOne({ _id: decoded._id });
    if (!req.user) {
      return res.status(401).send();
    }
  }
  next();
};
