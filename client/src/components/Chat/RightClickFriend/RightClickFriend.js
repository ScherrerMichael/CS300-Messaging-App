import React, { Component } from 'react'
import {
    ListGroup,
    OverlayTrigger,
} from 'react-bootstrap'

class RightClickFriend extends Component {
  render() {

      const {
        xPos,
        yPos,
        handleMouseLeave,
        handleDirectMessage,
        setShowRoomToolTip,
        renderInviteToolTip,
        showRoomToolTip,
        handleRemoveFriend,
      } = this.props;

    return (
      <>
        <ListGroup style={
            {
                top: `${yPos - 10}px`,
                left: `${xPos - 10}px`,
                position: 'absolute',
                zIndex: '100',
                paddingRight: 40,
            }}
            onMouseLeave={handleMouseLeave}>
            <div
                onMouseOver={() => setShowRoomToolTip(true)}
                onMouseOut={() => setShowRoomToolTip(false)}
            >
                <OverlayTrigger
                    placement="right-start"
                    delay={{ show: 350, hide: 200 }}
                    overlay={renderInviteToolTip}
                    show={showRoomToolTip}
                >
                    <ListGroup.Item className="list-item-rooms-context">
                        add to room
                </ListGroup.Item>
                </OverlayTrigger>
            </div>
            <ListGroup.Item action className="list-item-rooms-context" onClick={handleRemoveFriend}>
                remove friend
        </ListGroup.Item>
        </ListGroup> 
</>
    )
  }
}

export default RightClickFriend

