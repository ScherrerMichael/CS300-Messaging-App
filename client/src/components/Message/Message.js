import React, {Component} from 'react';

export class Message extends Component {

render(){
        return(
            <div className="w-100 message" key={message._id}>{message.message_body}</div>
        )
    }
}

