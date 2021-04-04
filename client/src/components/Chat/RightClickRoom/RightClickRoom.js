import React, { Component } from 'react' //TODO: working on this
import {
    ListGroup,
    OverlayTrigger,
} from 'react-bootstrap'

class RightClickRoom extends Component {
    render() {

        const {
            xPos,
            yPos,
            handleMouseLeave,
            setShowRoomToolTip,
            handleRemoveRoom,
        } = this.props;

        return (
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
                <ListGroup.Item action className="list-item-rooms-context">
                        edit room
                </ListGroup.Item>
                </div>
                <ListGroup.Item action className="list-item-rooms-context" onClick={handleRemoveRoom}>
                    delete room
        </ListGroup.Item>
            </ListGroup>
        )
    }
}

export default RightClickRoom
