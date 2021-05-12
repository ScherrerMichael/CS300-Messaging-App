import React, { Component } from 'react'
import { PlusSquare, PersonLinesFill, HouseFill, ChatLeftTextFill, Check, X } from 'react-bootstrap-icons';
import {
    Container,
    Tab,
    Tabs,
    ListGroup,
    Row,
    Col,
    Button,
} from 'react-bootstrap'

class PendingListGroup extends Component {

    render() {
        const {
            friendsList,
            handleRemoveFriend,
            handleAcceptPending,
        } = this.props
        return (
            <>
                <ListGroup className="w-100 list-group-menu">
                    <div className="friends-divider">Pending</div>

                    {// freind request that have been received
                        friendsList.received ?
                            friendsList.received.map(friend =>
                                <ListGroup.Item
                                    className="list-item-rooms"
                                    key={friend.uid + 'friends-pending'}>
                                    {/* TODO: add image of person here */}
                                    <div>
                                        <Row>

                                            <span className="tab-item-name">{friend.user_name}</span>
                                            <div className="tab-item-buttons">
                                                <Button className="tab-item-button"
                                                    onClick={() => handleAcceptPending(friend.uid)}
                                                    variant="success">
                                                    <Check></Check>
                                                </Button>

                                                <Button className="tab-item-button"
                                                    onClick={(e) => handleRemoveFriend(e, friend.uid)}
                                                    variant="danger" >
                                                    <X></X>
                                                </Button>
                                            </div>
                                        </Row>
                                    </div>
                                </ListGroup.Item>)
                            :
                            <div></div>
                    }

                    {// freind request that have been sent
                        friendsList.sent ?
                            friendsList.sent.map(friend =>
                                <ListGroup.Item
                                    className="list-item-rooms"
                                    key={friend.uid + 'friends-pending'}>
                                    {/* TODO: add image of person here */}
                                    <div>
                                        <Row>
                                            <span className="tab-item-name">{friend.user_name}</span>
                                            <div className="tab-item-buttons">
                                                <Button className="tab-item-button"
                                                    onClick={(e) => handleRemoveFriend(e, friend.uid)}
                                                    variant="danger" >
                                                    <X></X>
                                                </Button>
                                            </div>
                                        </Row>
                                    </div>
                                </ListGroup.Item>)
                            :
                            <div></div>
                    }
                </ListGroup>
            </>
        )
    }
}

export default PendingListGroup
