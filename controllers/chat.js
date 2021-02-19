const db = require("../utils/dbConnect");
const format = require('pg-format');

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
            'created_by', u.email,
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
        inner join users as u on chats.created_by = u.user_id
        where chat_id in 
        (select chat_id from chatusers where user_id = $1)
        group by chat_id, chats.type, chats.latest_message, chats.latest_message_from, u.email
        `,
      [req.user.user_id]
    );

    return res.status(200).json(foundChats.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};


exports.getChatMessages = async (req, res, next) => {

  if (!req.isAuth) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  if (!req.query.chatId) {
    return res.status(500).json({ message: "chat id is required" });
  }

  try {
    const pageSize = +req.query.pageSize || 30;
    const currentPage = +req.query.currentPage || 1;

    const getUserChats = await db.query(`
      select user_id, chat_id from chatusers where user_id = $1;
    `, [req.user.user_id]);

    const foundUserInChat = getUserChats.rows.find(p => p.chat_id == +req.query.chatId);
    
    if (!foundUserInChat) {
      return res.status(500).json({message: 'You do not have the right to access this chat or chat has been deleted'});
    }
    
    const foundMsgs = await db.query(`
      select messages.message_id, messages.message, messages.chat_id, users.first_name, messages.type, users.last_name, users.gender, users.avatar, users.email,
      (select count(messages.message_id) as "total_number_of_messages" from messages where chat_id = $1)
      from messages as messages
      inner join users as users using(user_id)
      where chat_id = $1
      order by message_id desc
      offset $2
      limit $3
    `, [
      req.query.chatId,
      pageSize * currentPage - pageSize,
      pageSize
    ]);

    const totalItems = foundMsgs.rows[0] ? foundMsgs.rows[0].total_number_of_messages: 1;

    return res.status(200).json({
      messages: foundMsgs.rows,
      pages: Math.ceil(totalItems / pageSize),
      currentPage: currentPage,
      pageSize: pageSize,
      chat_id: req.query.chatId
    });

  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }

};


exports.sendMessages = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  if (!req.query.chatId) {
    return res.status(500).json({ message: "chat id is required" });
  }

  try {
    const message = req.body.message;
    const messageType = req.body.messageType;
    const getUserChats = await db.query(`
      select user_id, chat_id from chatusers where user_id = $1;
    `, [req.user.user_id]);

    const foundUserInChat = getUserChats.rows.find(p => p.chat_id == req.query.chatId);

    if (!foundUserInChat) {
      return res.status(500).json({message: 'You do not have the right to access this chat or chat has been deleted'});
    }

    const newMsgRows = await db.query(`
      insert into messages (
        user_id,
        chat_id,
        createdat,
        "type",
        message
      ) values (
        $1,
        $2,
        now(),
        $3,
        $4
      )
      RETURNING message_id
    `, [
      req.user.user_id,
      req.query.chatId,
      messageType,
      message
    ]);

    const foundMsg = await db.query(`
      select messages.message_id, messages.message, messages.chat_id, users.first_name, messages.type, users.last_name, users.gender, users.avatar, users.email      from messages as messages
      inner join users as users using(user_id)
      where chat_id = $1 and message_id = $2
      order by message_id asc
    `, [
      req.query.chatId,
      newMsgRows.rows[0].message_id
    ]);

    console.log(newMsgRows.rows[0]);
    console.log(foundMsg.rows[0]);

    return res.status(200).json(foundMsg.rows[0]);

  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};


exports.addChat = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  try {
    const usersToBeAdded = req.body.users;
    if (usersToBeAdded.length <= 0) {
      return res.status(500).json({ message: "No users added!" });
    }

    try {
      const tableType = usersToBeAdded.length > 1 ? 'group': 'dual';

      const offset = 1;
      const selectSQLPlaceholders = usersToBeAdded.map(function(name,i) { 
        return '$'+(i+offset); 
      }).join(',');
  
      const selectSQL = await db.query('select user_id from users where email in (' + selectSQLPlaceholders+')', usersToBeAdded);
      // [{user_id: 1}, {user_id: 2}]

      const toChatstext = 'INSERT INTO chats(type, created_by, createdat) VALUES($1, $2, $3) RETURNING chat_id';
      const toChatsvalues = [tableType, req.user.user_id, new Date()];


      const toChatsTable = await db.query(toChatstext, toChatsvalues);
      // [{chat_id: 1}]

      if (!toChatsTable.rows[0] || !toChatsTable.rows[0].chat_id) {
        return res.status(500).json({ message: "Server Error" });
      }
      const newChatID = toChatsTable.rows[0].chat_id;

      const valuesChatUsers = selectSQL.rows.map(u => [newChatID, +u.user_id, new Date()]);

      const sqlFormat = format('INSERT INTO chatusers (chat_id, user_id, createdat) VALUES %L', valuesChatUsers);

      await db.query(sqlFormat);

      const getNewChatToFront = await db.query(`
        select 
        json_build_object(
            'chat_id', chat_id,
            'chat_type', chats.type,
            'latest_message', chats.latest_message,
            'latest_message_from', chats.latest_message_from,
            'created_by', u.email,
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
        inner join users as u on chats.created_by = u.user_id
        where chat_id = $1
        group by chat_id, chats.type, chats.latest_message, chats.latest_message_from, u.email
      `, [newChatID]);


      return res.status(200).json(getNewChatToFront.rows[0]);
  
      // ['omar@yahoo.com', 'm@m.com']
    } catch(err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    }

  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }

};