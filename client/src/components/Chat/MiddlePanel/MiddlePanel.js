import React, { Component } from 'react'
import { ArrowRightCircle} from 'react-bootstrap-icons';
import {
    ListGroup,
    Row,
    Col,
    Button,
    Form,
    Card,
    ListGroupItem,
} from 'react-bootstrap'
import ScrollToBottom from 'react-scroll-to-bottom';

class MiddlePanel extends Component {
  render() {
      const {room, messages, handleSubmit, formRef, messageRef} = this.props
    return (
      <>
                <Col className="chat debug">
                    <Row>
                        <Col className="line"></Col>
                        <Card className="chat-info">
                            <Card.Body>
                                <h1 className="small-font">
                                    {room.topic}
                                </h1>
                            </Card.Body>
                        </Card>
                        <Col className="line"></Col>
                    </Row>
                    <Row className="messages">
                        {/* scroll to bottom will be fixed soon i guess, it will debug in console */}
                        <ScrollToBottom className="w-100" debug={false}>
                            <ListGroup className="w-100">
                                {
                                    messages ?
                                        messages.map((message, index) =>
                                            <ListGroupItem header="yo" className="w-100 message" key={index + 'message'}>
                                                <div className="message-author">{message.user.user_name}</div>
                                                <p>{message.message_body}</p>
                                            </ListGroupItem>) :
                                        <div>...</div>
                                }
                            </ListGroup>
                        </ScrollToBottom>
                    </Row>

                    <Row className="text-field-row">
                        <Form ref={formRef} onSubmit={handleSubmit} className="text-box">
                            <Form.Row>
                                <Col className="form-text-field">
                                    <Form.Group id="Message" className="send-message">
                                        <Form.Control className="w-100 message-field" type="text" ref={messageRef} />
                                    </Form.Group>
                                </Col>
                                <Col xs='1' className="form-button-submit w-100">
                                    <Button className="w-100 send-message-button" type="submit">
                                        <ArrowRightCircle></ArrowRightCircle>
                                    </Button>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Row>
                </Col>
      </>
    )
  }
}

export default MiddlePanel
