import React, { Component } from 'react'
import {
    Row,
    Col,
    Button,
} from 'react-bootstrap'

class UserHeader extends Component {
  render() {

    const {currentUser, handleLogout} = this.props;

    return (
      <>
            <Row className="top-row">
                <Col md="6" className="user-header-back">
                    <strong className="user-header">{currentUser.displayName}</strong>
                    <Button variant="link" onClick={handleLogout}>Log out</Button>
                </Col>
            </Row>
      </>
    )
  }
}

export default UserHeader
