import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

const Messages = () => (
    <ScrollToBottom>
        {Messages.map((message,i) => <div key ={i}><Message message = {message} name={name}/></div>)}
    </ScrollToBottom>
)

export default Messages;