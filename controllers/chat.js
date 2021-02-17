const db = require("../utils/dbConnect");

exports.fetchChats = async (req, res) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: "Server Error" });
  }

  try {
    const foundChats = await db.query(
      `
      select 
      json_build_object(
          'chat_id', chat_id,
          'chat_type', chats.type,
          'latest_message', chats.latest_message,
          'latest_message_from', chats.latest_message_from,
          'users', array_agg(
              json_build_object(
                  'full_name', concat(users.first_name, ' ', users.last_name),
                  'email', users.email,
                  'avatar', users.avatar,
                  'gender', users.gender
              )
          )
      ) as chatdetails
      from chatusers as chatusers
      inner join users as users using(user_id)
      inner join chats as chats using(chat_id)
      where chat_id in 
      (select chat_id from chatusers where user_id = $1)
      group by chat_id, chats.type, chats.latest_message, chats.latest_message_from
        `,
      [req.user.user_id]
    );

    return res.status(200).json(foundChats.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};
