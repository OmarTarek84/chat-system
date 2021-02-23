import React from 'react';

const MessageItem = ({message}) => {
    return (
        <div className="messageitem" style={{
            justifyContent: message.type === 'adminMsg' ? 'center': message.email === localStorage.getItem('email') ? 'flex-end': 'flex-start'
        }}>
            <div className="message" style={{
                backgroundColor: message.type === 'adminMsg' ? 'transparent': message.email === localStorage.getItem('email') ? '#142B6F': '#E1DEE6',
                color: message.type === 'adminMsg' ? 'darkgrey': message.email === localStorage.getItem('email') ? 'white': 'black',
                maxWidth: message.type === 'adminMsg' ? '100%': '60%'
            }}>
                {
                    message.type !== 'adminMsg' && message.email !== localStorage.getItem('email') &&
                    <span className="firstlastname">{message.first_name} {message.last_name}</span>
                }

                <p className="msg" style={{
                    color: message.type === 'adminMsg' ? 'darkgrey': message.email === localStorage.getItem('email') ? 'white': 'black',
                    marginTop: message.email === localStorage.getItem('email') ? '0': '3px',
                    fontSize: message.type === 'adminMsg' ? '17px': '14px'
                }}>{message.message}</p>

            </div>
        </div>
    )
};

export default MessageItem;