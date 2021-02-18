import React from 'react';

const MessageItem = ({message}) => {
    return (
        <div className="messageitem" style={{
            justifyContent: message.email === localStorage.getItem('email') ? 'flex-end': 'flex-start'
        }}>
            <div className="message" style={{
                backgroundColor: message.email === localStorage.getItem('email') ? '#142B6F': '#E1DEE6',
                color: message.email === localStorage.getItem('email') ? 'white': 'black'
            }}>
                {
                    message.email !== localStorage.getItem('email') &&
                    <span className="firstlastname">{message.first_name} {message.last_name}</span>
                }

                <p className="msg" style={{
                    color: message.email === localStorage.getItem('email') ? 'white': 'black',
                    marginTop: message.email === localStorage.getItem('email') ? '0': '3px'
                }}>{message.message}</p>

            </div>
        </div>
    )
};

export default MessageItem;