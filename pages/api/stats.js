import jwt from "jsonwebtoken";

import {
  findVideoIdByUser,
  updateStatsByVideoId,
  insertStatsByVideoId,
} from "../../utils/hasura";

export default async function stats(req, res) {
  const token = req.cookies.token;
  const { favourited, watched = true } = req.body;
  const { videoId } = req.method === "POST" ? req.body : req.query;
  try {
    if (!token) {
      res.status(403).json({ msg: "Unauthorized " });
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const response = await findVideoIdByUser(decoded.issuer, videoId, token);
      
      const findVideo = response.data.stats;
      const doesVideoExistInDb = findVideo?.length > 0;
      // POST METHOD
      if (req.method === "POST") {
        if (doesVideoExistInDb) {
          // update stats
          const response = await updateStatsByVideoId(
            {
              favourited,
              userId: decoded.issuer,
              watched,
              videoId: videoId,
            },
            token
          );
          res.json({ msg: "stats updated", response });
        } else {
          // insert video into db
          const response = await insertStatsByVideoId(
            {
              favourited,
              userId: decoded.issuer,
              watched,
              videoId,
            },
            token
          );
          res.status(200).json({ msg: "stats inserted into db", response });
        }
      } else {
        // GET METHOD
        if (doesVideoExistInDb) {
          // send Video

          res.json(findVideo);
        } else {
          // error
          res.status(404).res.json({ user: null, msg: "User/Video not found" });
        }
      }
    }
  } catch (err) {
    console.error({ statsError: err });
    res.status(500).json({ done: false, error: err?.message });
  }
}
