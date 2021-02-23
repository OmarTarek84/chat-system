const db = require("../utils/dbConnect");
const AWS = require("aws-sdk");
const { validationResult } = require("express-validator");

const s3 = new AWS.S3({
  signatureVersion: "v4",
  accessKeyId: process.env.AWSS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWSS_SECRET_KEY,
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

exports.searchUsers = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  const chatId = +req.query.chatId || null;
  const searchKey = req.query.searchKey || '';
  const filterUsers = req.query.usersFilter || '';

  let params = [];
  for(let i = 1; i <= filterUsers.split(',').length; i++) {
    params.push('$' + (i + 2));
  }
  let response;

  try {
    if (chatId === null) {
      // add chat
      response = await db.query(`
        select first_name, last_name, email, gender, avatar
        from users
        where 
          user_id != $1
          and (
              first_name ilike $2 or last_name ilike $2
          )
          and users.email not in (${params.join(',')})
      `, [
        req.user.user_id,
        '%' + searchKey + '%',
        ...filterUsers.split(',')
      ]);
    } else {
      // add user to existing chat
      response = await db.query(`
          select distinct on (users.email) chat_id, users.first_name, users.last_name, users.email, users.gender, users.avatar
          from users as users
          left join chatusers as chatusers using(user_id)
          where 
          users.user_id not in (select user_id from chatusers where chat_id = $1) and users.email not in (${params.join(',')})
          and (chatusers.chat_id != $1 or chatusers.chat_id is null)
          and (
              users.first_name ilike $2 or users.last_name ilike $2
          )
      `, [
        chatId,
        '%' + searchKey + '%',
        ...filterUsers.split(',')
      ]);
    }
    return res.status(200).json(response.rows);
  } catch(err) {
    console.log(err);
    return res.status(500).json(err);
  }


};