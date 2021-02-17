import React from 'react';
import { useSelector } from 'react-redux';

const UsersOnline = () => {

    const {first_name, last_name} = useSelector(state => state.user);

    return (
        <div className="username-onlinestatus">
          <span className="first-lastname">{first_name} {last_name}</span>
          <span className="offline-online"></span>
        </div>
    )
};

export default UsersOnline;