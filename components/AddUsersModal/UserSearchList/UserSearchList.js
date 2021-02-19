import React from "react";

const UserSearchList = ({ users, addUserToAddedList }) => {
  const renderSearchUsers = users.map((user) => {
    return (
      <div className="user" key={user.email}>
        <span>{user.first_name} {user.last_name}</span>
        <button onClick={() => addUserToAddedList(user)}>Add</button>
      </div>
    );
  });

  return <div className="users">{renderSearchUsers}</div>;
};

export default UserSearchList;
