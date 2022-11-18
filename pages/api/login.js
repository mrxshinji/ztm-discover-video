// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jwt from "jsonwebtoken";

import { mAdmin } from "../../utils/magicServer";
import { isNewUser, createNewUser } from "../../utils/hasura";
import { setTokenCookie } from "../../utils/cookie";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth : "";
      //magic
      const metadata = await mAdmin.users.getMetadataByToken(didToken)
      // return { metadata: {issuer, publicAddress, email}}
      //get magicData and turn into jwt
      const token = jwt.sign(
        JSON.stringify({
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        }),
        process.env.JWT_SECRET
      );
      // return string of token obj
      const isNewUserQuery = await isNewUser(metadata.issuer, token);
      isNewUserQuery && (await createNewUser(metadata, token.toString()));

      setTokenCookie(token.toString(), res);
      res.send({ done: true });
    } catch (err) {
      console.error("Login went wrong.....", err);
      res.status(500).json({ message: "Login went wrong.....", err });
    }
  } else {
    res.status(404).json({ message: "wrong link" });
  }
}
