import { Router, Request } from "express";
import { isNullOrUndefined } from "util";
import User from "../../../models/User";
import * as jwt from "jsonwebtoken";
const router = Router();

router.get("/validate-email", async (req: Request, res) => {
  if (req.query.token) {
    try {
      const decoded = jwt.decode(req.query.token);
      if (decoded) {
        const foundUser = await User.findOne({ _id: decoded._id });
        if (isNullOrUndefined(foundUser)) throw 404;
        await foundUser.update({ isEmailActivated: true });
        res.status(201).redirect("http://app.thank-you.club/auth/login");
      } else res.status(401).send();
    } catch {
      res.status(400).send();
    }
  } else res.status(401).send();
});

export default router;
