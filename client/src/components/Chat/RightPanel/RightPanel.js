import React, { Component } from 'react'
import {
    ListGroup,
    Container,
    Row,
    Col,
    Button,
    Form,
    Modal,
    Popover
} from 'react-bootstrap'

class RightPanel extends Component {
    render() {
        const {
            room,
        } = this.props
        return (
            <Col lg="2" className="members">
                <Row className="room-details">
                    <div className="details">{
                        room ?
                            <div>
                                {/* room info will go here! */}
                                {room.topic}
                            </div> :
                            <di></di>
                    }</div>
                </Row>
                <Row className="member-details">
                    <ListGroup className="w-100 list-members">
                        Members
                            {
                            room.owner && room.owner[0] ?
                                <ListGroup.Item action
                                    className="list-item-rooms"
                                    key={'owner' + `member-list`}>
                                    {room.owner[0].user_name}
                                </ListGroup.Item> :
                                null
                        }

                        {
                            room.users ?
                                room.users.map((u, index) =>
                                    <ListGroup.Item action
                                        className="list-item-rooms"
                                        key={index + `member-list`}>
                                        {u.user_name}
                                    </ListGroup.Item>) :
                                <div></div>
                        }
                    </ListGroup>
                </Row>
            </Col>
        )
    }
}

export default RightPanel
