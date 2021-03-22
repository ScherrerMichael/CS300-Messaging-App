import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import style from './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
    Tab, 
    Tabs, 
    ListGroup, 
    Container, 
    Row, 
    Col, 
    Button, 
    Form, 
    Modal, 
    Card, 
    ListGroupItem,
} from 'react-bootstrap'
import ScrollToBottom from 'react-scroll-to-bottom';
import axios from 'axios';
import io from 'socket.io-client'

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
        rooms: [null]
    });
    const [friendsList, setFriends] = useState({
        friends: []
    });
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState('');
    const [roomName, setRoomName] = useState('');
    const [currentRoomName, setCurrentRoomname] = useState('');
    const modalRef = useRef();
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
                    setRooms({ rooms: res.data });
                }
            })
            .catch(err => {
                //console.log(err);
            })
        return () => mounted = false;

    }, [room, modalRef, tab])


    useEffect(() => { // getting all rooms that the user is in
        let mounted = true;

                    //update friends //this is ugly...
                    axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/${currentUser.uid}`)
                    .then(res => {
                        if(mounted)
                        {
                            setFriends({friends: res.data})
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                

        return () => mounted = false;

    }, [tab])


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

                     socket.emit('sendMessage', currentUser, room, messageToSend,({ callback }) => {
                         setMessages([...messages, callback.message]);
                         console.log(messages);

                        axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${room}/messages`, messageToSend)
                        .catch(err => {
                            console.log(err);
                        });

                     });

            handleReset();
        } else {
            console.log('empty input');
            return null;
        }

    }

    async function handleAddRoom() { //TODO switch chat and change element of selected element

        setRoomName(modalRef.current.value);

        try {
            await postNewRoomFromUser(modalRef.current.value);

            //update for all rooms
            axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/rooms/${currentUser.uid}`)
                .then(res => {
                    //console.log(res)//
                    setRooms({ rooms: res.data });
                    setRoom(roomList.rooms.result[0]._id)
                })
                .catch(err => {
                    console.log(err);
                });
                    handleClose();

        } catch {
            console.log("error with post room");
        }

        setRoomName('');
    }

    function handleSwitchRoom(roomId) {
        //console.log(`room ${roomId} clicked`);
        setRoom(roomId);

        let r = roomList.rooms.result.find( a => a._id === roomId)

        if(r)
        {
            setCurrentRoomname(r.topic);
            socket.emit('join', currentUser.displayName, r,({ message }) => {
            console.log(message);
        });
        }
    }

    useEffect(() => {
        //update the room info (send get request and load messages of that room)
        axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${room}`)
            .then(res => {
                setMessages(res.data.messages);
            })
            .catch(err => {
                //console.log(err);
            });
    }, [room, 0])


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

    function handleAddUser(){

        axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/users/${currentUser.uid}/add-friend`, {
            user_name: modalRef.current.value
        })
            .then(() => {
                    axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/${currentUser.uid}/friends`)
                    .then(res => {
                        //console.log(res)
                        //setFriends({friendsList: res.data})
                    })
                    .catch(err => {
                        console.log(err);
                    });
                setFriends()
                handleClose();
            })
            .catch(err => {
                console.log(err);
            });
    }

    function handleInviteToRoom(userId){

        console.log('room clicked')

        if(room)
        {
                   axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${room}/add-user`,{
                       uid: userId
                   })
                   .then(res => {
                       console.log(res)
                   })
                   .catch(err => {
                       console.log(err);
                   });
        } else {
            console.log('You need to be in a room!');
        }
    }

    //similar to componentdidmount
    useEffect(() => {
        socket = io(`${process.env.REACT_APP_MONGO_DB_PORT}`);

        return () => {

            socket.off();
        }

    }, [`${process.env.REACT_APP_MONGO_DB_PORT}`]);

    useEffect(() => {

        socket.on(`welcome`, (messageBody) =>{
            console.log(messageBody);
        })

        socket.on('re', (result) =>{
            setMessages( prevMessages => ([...prevMessages, result.message]));
        })

    }, []);

    return (
        <Container fluid className="main">
            <Row>
                <Col md="6" className="user-header-back">
                    <strong className="user-header">{currentUser.displayName}</strong>
                    <Button variant="link" onClick={handleLogout}>Log out</Button>
                </Col>
                <Col>
                    <Card className="chat-info">
                        <Card.Body>
                            <h1 className="small-font">
                            {currentRoomName}
                            </h1>
                            {/* <Button className="invite-chat" onClick={handleInviteToRoom}>invite</Button> */}
                            </Card.Body>
                            </Card>
                </Col>
                <Col>
                {/*  */}
                </Col>
            </Row>
            <Row className="main-row">
                <Col xs="3" className="contacts debug">
                    <Row className="tab-row">
                        <Tabs onSelect={handleTabChange}>
                            <Tab eventKey={'home'} title="Home">

                            </Tab>
                            <Tab eventKey={'people'} title="People">
                                <Row className="menu">
                                    <Tab.Container>
                                        <ListGroup className="w-100 list-group-menu">
                                            {
                                                     friendsList.friends.friends?
                                                     friendsList.friends.friends.map(friend =>
                                                         <ListGroup.Item action
                                                             className="list-item-rooms"
                                                             onClick={() => handleInviteToRoom(friend.uid)}
                                                             key={room._id}>{friend.user_name}
                                                         </ListGroup.Item>) 
                                                         :
                                                     <div>nothing</div>
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
                        <ScrollToBottom className="w-100" debug={true}>
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
                        </ScrollToBottom>
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
                    {
                        (tab === 'rooms')?
                        <Modal.Title>Create new Room</Modal.Title>:
                        <Modal.Title>Add User</Modal.Title>
                    }
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleSubmit} className="text-box">
                        <Form.Group id="Message">
                            <Form.Control className="w-100 message-field" type="text" ref={modalRef} />
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                        </Button>
                    <Button variant="primary" type="submit" onClick={
                        (tab === 'rooms')?
                        handleAddRoom:
                        handleAddUser
                    }>
                        Save Changes
                        </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    )
}

export default Chat;