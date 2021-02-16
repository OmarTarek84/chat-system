const db = require("../utils/dbConnect");
const AWS = require("aws-sdk");
const { validationResult } = require("express-validator");

const s3 = new AWS.S3({
  signatureVersion: "v4",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "us-east-2",
});

exports.getUser = async (req, res) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  const foundUser = await db.query('select * from users where user_id = $1', [req.user.user_id]);

  if (!foundUser.rows[0]) {
      return res.status(500).json({message: 'No User found!'});
  }

  const { user_id, createdat, password, ...restUser } = foundUser.rows[0];
  return res.status(200).json(restUser);
};

exports.updateProfile = async (req, res) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {

    const foundUser = await db.query('select * from users where user_id = $1', [req.user.user_id]);
    if (!foundUser.rows[0]) {
        return res.status(500).json({message: 'No User Found'});
    }
    const response = await db.query('update users set first_name=$1, last_name=$2, email=$3, gender=$4, avatar=$5 WHERE user_id=$6 RETURNING *', [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.gender,
        req.body.avatar || foundUser.rows[0].avatar,
        req.user.user_id
    ]);

    const {password, user_id, createdat, ...user} = response.rows[0];

    return res.status(200).json(user);

  } catch(err) {
      return res.status(500).json({message: 'Server Error'});
  }

};

exports.getSignedUrl = (req, res) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  try {
    const key = `chatSystem/${req.user.first_name}-${req.user.last_name}${req.user.user_id}.png`;

    s3.getSignedUrl(
      "putObject",
      {
        Bucket: process.env.BUCKET_NAME,
        ContentType: "image/png",
        Key: key,
      },
      (err, url) =>
        res.json({
          url: url,
          imagePath: process.env.BEGINNING_BUCKETNAME_URL + key,
        })
    );
  } catch (err) {
    return res.status(500).json(err);
  }
};
