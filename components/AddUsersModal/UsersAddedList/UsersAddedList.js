import React from 'react';

const UsersAddedList = ({usersAdded, removeAddedUser}) => {

    const users = usersAdded.map((user) => {
        return (
            <div className="user-added" key={user.email}>
                <span className="names">{user.first_name} {user.last_name}</span>
                <span className="close" onClick={() => removeAddedUser(user.email)}>X</span>
            </div>
        )
    });
    
    return (
        <>
        {users}
        </>
    );
};

export default UsersAddedList;