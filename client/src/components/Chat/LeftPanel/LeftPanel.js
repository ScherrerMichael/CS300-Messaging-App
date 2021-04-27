import React, { Component } from 'react'
import { PlusSquare, PersonLinesFill, HouseFill, ChatLeftTextFill } from 'react-bootstrap-icons';
import {
    Tab,
    Tabs,
    ListGroup,
    Row,
    Col,
    Button,
} from 'react-bootstrap'

class LeftPanel extends Component {
  render() {
      const {
        handleTabChange, 
        friendsList, 
        handleRightClickFriend, 
        handleRightClickRoom, 
        handleRemoveFriend,
        handleAcceptPending,
        rooms, 
        handleSwitchRoom, 
        handleShow,
        tab,
    } = this.props
    return (
      <>
                <Col xs="3" className="contacts debug">
                    <Row className="tab-row">
                        <Tabs onSelect={handleTabChange} className="tab-container">
                            <Tab eventKey={'home'} title={<span><HouseFill className="tab-icon" /> home</span>} className="filled-tab">
                                {/* home stuff */}
                            </Tab>
                            <Tab eventKey={'people'} title={<span><PersonLinesFill className="tab-icon" /> people</span>} className="filled-tab">
                                <Row className="menu">
                                    <Tab.Container>
                                        <ListGroup className="w-100 list-group-menu">
                                            {
                                                friendsList.friends ?
                                                    friendsList.friends.map(friend =>
                                                        <ListGroup.Item action
                                                            className="list-item-rooms"
                                                            onContextMenu={(e) => handleRightClickFriend(e, friend)}
                                                            key={friend.uid + 'friends'}>
                                                            {/* TODO: add image of person here */}
                                                            {friend.user_name + ', status: ' + friend.status}
                                                        </ListGroup.Item>)
                                                    :
                                                    <div></div>
                                            }

                                            <div className="friends-divider">Pending</div>

                                            {//friends with status 0
                                                friendsList.pending ?
                                                    friendsList.pending.map(friend =>
                                                        <ListGroup.Item
                                                            className="list-item-rooms"
                                                            key={friend.uid + 'friends-pending'}>
                                                            {/* TODO: add image of person here */}
                                                            <div>
                                                                <span className="tab-item-name">{friend.user_name}</span>
                                                                <Button className="tab-item-button" 
                                                                onClick={() => handleAcceptPending(friend.uid)}
                                                                variant="success">
                                                                    Accept
                                                                </Button>

                                                                <Button className="tab-item-button" 
                                                                onClick={(e) => handleRemoveFriend(e, friend.uid)}
                                                                variant="danger" >
                                                                    Decline
                                                                </Button>
                                                            </div>
                                                        </ListGroup.Item>)
                                                    :
                                                    <div></div>
                                            }
                                        </ListGroup>
                                    </Tab.Container>
                                </Row>
                            </Tab>
                            <Tab eventKey={'rooms'} title={<span><ChatLeftTextFill className="tab-icon" /> rooms</span>} className="filled-tab">
                                <Row className="menu">
                                    <Tab.Container>
                                        <ListGroup className="w-100 list-group-menu">
                                            {
                                                rooms ?
                                                    rooms.map(room =>
                                                        <ListGroup.Item action
                                                            className="list-item-rooms"
                                                            onClick={() => handleSwitchRoom(room._id)}
                                                            onContextMenu={(e) => handleRightClickRoom(e, room)}
                                                            key={room._id + 'rooms'}>{room.topic}
                                                        </ListGroup.Item>) :
                                                    <div></div>
                                            }
                                        </ListGroup>
                                    </Tab.Container>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Row>


                    <Row className="add-item">
                        <Col className="add-item">
                            {
                                (tab === 'rooms' || tab === 'people') ?
                                    <Button onClick={handleShow} className="add-room-btn">
                                        <PlusSquare />
                                    </Button> :
                                    <div></div>
                            }
                        </Col>
                    </Row>
                </Col>
      </>
    )
  }
}

export default LeftPanel
