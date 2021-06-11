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

class FriendsListGroup extends Component {
  render() {
    const {
      friendsList,
      handleRightClickFriend,
    } = this.props
    return (
      <>
        <ListGroup className="w-100 list-group-menu">
          {
            friendsList.friends ?
              friendsList.friends.map(friend =>
                <ListGroup.Item action
                  className="list-item-rooms"
                  onContextMenu={(e) => handleRightClickFriend(e, friend)}
                  key={friend.uid + 'friends'}>
                  {/* TODO: add image of person here */}
                  {friend.user_name}
                  {/* the friends status should be 2 */}
                </ListGroup.Item>)
              :
              <div></div>
          }
        </ListGroup>
      </>
    )
  }
}

export default FriendsListGroup
