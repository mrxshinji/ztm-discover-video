import { mAdmin } from "../../utils/magicServer";

import { removeTokenCookie } from "../../utils/cookie";

import jwt from 'jsonwebtoken'

export default async function logout(req, res) {
  if (req.method === "POST") {
    try {
      if (!req.cookies.token)
        return res.status(401).json({ message: "User is not logged in" });

      const token = req.cookies.token ? req.cookies.token : null;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.issuer;
      removeTokenCookie(res);
      try {
        await mAdmin.users.logoutByIssuer(userId);
      } catch (error) {
        console.error("Error occurred while logging out magic user", error);
      }
      //redirects user to login page
      res.writeHead(302, { Location: "/login" });
      res.end();
    } catch (error) {
      console.error({ error });
      res.status(401).json({ message: "User is not logged in" });
    }
  } else {
    res.status(404).json({message: "Error, wrong link"})
  }
}
