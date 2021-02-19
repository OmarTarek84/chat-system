import React, { useEffect, useState } from "react";
import UserSearchList from "./UserSearchList/UserSearchList";
import axios from '../../axios/axios';
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import UsersAddedList from "./UsersAddedList/UsersAddedList";

const AddUsersModal = ({closeModal, addNewChat}) => {
  const [users, setUsers] = useState([]);
  const [usersAdded, setUsersAdded] = useState([]);
  const router = useRouter();

  const {token} = useSelector(state => state.user);

  const searchUsersReq = async (val) => {
    const {data} = await axios.get(`/user/search?searchKey=${val}&usersFilter=${usersAdded.map(us => us.email).join(',')}&chatId=${addNewChat ? '': router.query.chatId}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    setUsers(data);
  };

  useEffect(() => {
    searchUsersReq('');
  }, []);

  const addUserToAddedList = user => {
    setUsersAdded([
      ...usersAdded,
      user
    ]);
    setUsers(users.filter(u => u.email !== user.email));
  };

  const removeAddedUser = email => {
    setUsersAdded(usersAdded.filter(u => u.email !== email));
  };

  const addChatReq = () => {
    console.log();
  };

  return (
    <div className="backdrop-addusers">
      <div className="card">
        <div className="title">
          <h3>{addNewChat ? 'Add New Chat': 'Add User/s to your chat'}</h3>
        </div>
        <div className="card-det">
          <p className="p">Search for users you want to add by typing their names below</p>
          <div className="users-added">
            <UsersAddedList removeAddedUser={removeAddedUser} usersAdded={usersAdded} />
          </div>
          <input type="text" onChange={e => searchUsersReq(e.target.value)} name="users-search" placeholder="Search Here..." />
          <UserSearchList users={users} addUserToAddedList={addUserToAddedList} />
          <div className="btn-actions">
              <button onClick={closeModal}>Close</button>
              <button onClick={addChatReq}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUsersModal;