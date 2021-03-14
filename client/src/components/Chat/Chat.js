import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import style from './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import io from 'socket.io-client'
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';

let socket;

const Chat = () => {
    const { currentUser, logout, postNewRoomFromUser, cookies} = useAuth();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [error, setError] = useState("");
    const history = useHistory();
    const [tab, setTab] = useState('');
    const [roomList, setRooms] = useState({
        rooms: []
    });
    const [friends, setFriends] = useState({
        freinds: []
    })
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState('');
    const [roomName, setRoomName] = useState('');
    const roomNameRef = useRef();
    const formRef = useRef();
    const messageRef = useRef();
    const [message, setMessage] = useState({});

    const handleTabChange=(tab)=>{
        setTab(tab);
    }

    useEffect(() => { // getting all rooms that the user is in
        let mounted = true;

        axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/rooms/${currentUser.uid}`)
            .then(res => {
                if (mounted) {
                    //console.log(res)//
                    setRooms({ rooms: res.data });
                }
            })
            .catch(err => {
                console.log(err);
            });

        return () => mounted = false;

    }, [room, roomNameRef, friends])



    function handleReset() {
        formRef.current.reset(); //reset the value of the form stuff
        setMessage({});
    }

    async function handleSubmit(e) { //post a message to the room
        e.preventDefault();

        if (messageRef.current.value !== '') {

            const messageToSend = {
                uid: currentUser.uid,
                message_body: messageRef.current.value,
            }

            axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${room}/messages`, messageToSend)
                .then(res => {
                    setMessage(res.data.result);
                })
                .catch(err => {
                    console.log(err);
                });

            socket.emit('sendMessage', { message }, ({ callback }) => {
                //console.log(callback);
            });

            handleReset();
        } else {
            console.log('empty input');
            return null;
        }

    }

    async function handleAddRoom() { //TODO switch chat and change element of selected element

        setRoomName(roomNameRef.current.value);

        try {
            await postNewRoomFromUser(roomNameRef.current.value);
        } catch {
            console.log("error with post room");
        }


        //update for all rooms
        axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/rooms/${currentUser.uid}`)
            .then(res => {
                //console.log(res)//
                setRooms({ rooms: res.data });
                setRoom(roomList.rooms.result[0]._id)
                handleClose();
            })
            .catch(err => {
                console.log(err);
            });

        setRoomName('');
    }

    function handleSwitchRoom(roomId) {
        //console.log(`room ${roomId} clicked`);
        setRoom(roomId);

        //tell io that we are in a new 'room'
    }

    useEffect(() => {
        //update the room info (send get request and load messages of that room)
        axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${room}`)
            .then(res => {
                setMessages(res.data.messages);
            })
            .catch(err => {
                console.log(err);
            });
    }, [message, room])


    async function handleLogout() {
        setError('');

        try {
            await logout();
            socket.disconnect();
            history.push('/login');
        } catch {
            setError('Failed to logout');
        }
    }

    //similar to componentdidmount
    useEffect(() => {
        socket = io(`${process.env.REACT_APP_MONGO_DB_PORT}`);

        socket.emit('join', currentUser.email, ({ message }) => {
            console.log(message);
        });

        return () => {

            socket.off();
        }

    }, [`${process.env.REACT_APP_MONGO_DB_PORT}`])


    return (
        <Container fluid className="main">
            <strong>{currentUser.email}</strong>
            <Button variant="link" onClick={handleLogout}>Log out</Button>
            <Row className="main-row">
                <Col xs="3" className="contacts debug">
                    <Row>
                        <Tabs onSelect={handleTabChange}>
                            <Tab eventKey={'home'} title="Home">

                            </Tab>
                            <Tab eventKey={'people'} title="People">
                                <Row className="menu">
                                    <Tab.Container>
                                        <ListGroup className="w-100 list-group-menu">
                                            {
                                                roomList.rooms.result ?
                                                    roomList.rooms.result.map(room =>
                                                        <ListGroup.Item action
                                                            className="list-item-rooms"
                                                            onClick={() => handleSwitchRoom(room._id)}
                                                            key={room._id}>{room.topic}
                                                        </ListGroup.Item>) :
                                                    <div></div>
                                            }
                                        </ListGroup>
                                    </Tab.Container>
                                </Row>
                            </Tab>
                            <Tab eventKey={'rooms'} title="Rooms">
                                <Row className="menu">
                                    <Tab.Container>
                                        <ListGroup className="w-100 list-group-menu">
                                            {
                                                roomList.rooms.result ?
                                                    roomList.rooms.result.map(room =>
                                                        <ListGroup.Item action
                                                            className="list-item-rooms"
                                                            onClick={() => handleSwitchRoom(room._id)}
                                                            key={room._id}>{room.topic}
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
                        <Col className="line"></Col>
                        <Col className="line">
                            {
                                (tab === 'rooms' || tab === 'people')?
                                <Button onClick={handleShow} className="add-room-btn">
                                    Add
                                    </Button>:
                                    <div></div>
                            }
                        </Col>
                        <Col className="line"></Col>
                    </Row>
                </Col>

                <Col className="chat debug">

                    <Row className="messages">
                        <ListGroup className="w-100">
                            {
                                messages ?
                                    messages.map(message =>

                                        <ListGroupItem header="yo" className="w-100 message" key={message._id}>
                                            {/* <div>{message.uid}</div> TODO maybe include user in message  */}
                                            {message.message_body}
                                        </ListGroupItem>) :
                                    <div>no messages</div>
                            }
                        </ListGroup>
                    </Row>

                    <Row>
                        <Form ref={formRef} onSubmit={handleSubmit} className="text-box">
                            <Form.Row>
                                <Col className="form-text-field">
                                    <Form.Group id="Message">
                                        <Form.Control className="w-100 message-field" type="text" ref={messageRef} />
                                    </Form.Group>
                                </Col>
                                <Col xs='1' className="form-button-submit">
                                    <Button className="w-100" type="submit">Send</Button>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Row>
                </Col>
            </Row>

            {/* <p className ="status">status</p> */}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleSubmit} className="text-box">
                        <Form.Group id="Message">
                            <Form.Control className="w-100 message-field" type="text" ref={roomNameRef} />
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                        </Button>
                    <Button variant="primary" type="submit" onClick={handleAddRoom}>
                        Save Changes
                        </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    )
}

export default Chat;