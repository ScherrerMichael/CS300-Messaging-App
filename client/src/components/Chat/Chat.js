import React, { useState, useEffect, useRef } from 'react';
import UserHeader from './UserHeader/UserHeader'
import LeftPanel from './LeftPanel/LeftPanel'
import { PlusSquare, PersonLinesFill, HouseFill, ChatLeftTextFill } from 'react-bootstrap-icons';
import { useAuth, AuthProvider } from '../../contexts/AuthContext';
import { useRequest } from '../../contexts/HttpRequestContext';
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
    OverlayTrigger,
    Tooltip,
} from 'react-bootstrap'
import ScrollToBottom from 'react-scroll-to-bottom';
import axios from 'axios';
import io from 'socket.io-client'

let socket;

const Chat = () => {
    const { currentUser, logout } = useAuth();
    const { postNewRoomFromUser,
        getRoomsWithUser,
        getRoomMessages,
        postMessageToRoom,
        getUserFromId,
    } = useRequest();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [error, setError] = useState(""); // TODO: shoul use this more often
    const history = useHistory();
    const [tab, setTab] = useState('');
    const [rooms, setRooms] = useState([]);
    const [friendsList, setFriends] = useState({
        friends: []
    });
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState({});
    // const [roomName, setRoomName] = useState('');
    const [currentRoomName, setCurrentRoomname] = useState('');
    const modalRef = useRef();
    const formRef = useRef();
    const messageRef = useRef();
    // const [message, setMessage] = useState({});
    const [xPos, setXPos] = useState('0px');
    const [yPos, setYPos] = useState('0px');
    const [showFriendOptions, setShowFriendOptions] = useState(false);
    const [currentFriend, setCurrentFriend] = useState('');

    const handleTabChange = (tab) => {
        setTab(tab);
    }

    function updateAllRooms() {
        getRoomsWithUser
            .then(data => {
                if (data)
                    setRooms([...data.result]);
                // console.log(...data.result)
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => { // getting all rooms that the user is in
        let mounted = true;

        if (mounted) {
        }
        updateAllRooms();
        return () => mounted = false;

    }, [show])

    useEffect(() => { // getting all rooms that the user is in
        let mounted = true;

        //update friends //this is ugly...
        axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/${currentUser.uid}`)
            .then(res => {
                if (mounted) {
                    setFriends({ friends: res.data })
                }
            })
            .catch(err => {
                console.log(err);
            });

        return () => mounted = false;

    }, [tab])

    function handleReset() {
        formRef.current.reset(); //reset the value of the form stuff
        // setMessage({});
    }

    async function handleSubmit(e) { //post a message to the room
        e.preventDefault();

        postMessageToRoom(room._id, messageRef.current.value)
            .then(message => {
                socket.emit('send-message', currentUser, room._id, message, ({ callback }) => {
                    setMessages([...messages, message]);
                });
                handleReset();
            })
            .catch()
    }

    async function handleAddRoom(e) { //TODO switch chat and change element of selected element
        e.preventDefault();

        postNewRoomFromUser(modalRef.current.value)
            .then(res => {
                socket.emit('create-room', currentUser, modalRef.current.value, ({ callback }) => {
                    setRooms([...rooms, res.data.createdRoom])
                });
                handleClose();
            }).catch(err => {
                console.log("error with post room");
            })
    }

    function handleAddPrivateRoom() { //TODO: create room with topic name of messagee/messager
        console.log('to be implmented')
        setShowFriendOptions(false);
    }

    function handleSwitchRoom(roomId) {
        let r = rooms.find(a => a._id === roomId)

        if (r !== null) {
            getRoomMessages(roomId)
                .then(messages => {
                    // console.log(messages[0].user.user_name)
                    setMessages(messages)
                    setRoom(r);
                })
                .then(() => {
                    setCurrentRoomname(r.topic);
                    socket.emit('join', currentUser.displayName, r._id, ({ message }) => {
                        console.log(message);
                    });
                })
        }
    }

    function handleLogout() {
        setError('');

        try {
            logout();
            socket.disconnect();
            history.push('/login');
        } catch {
            setError('Failed to logout');
        }
    }

    function handleAddUser() {
        axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/users/${currentUser.uid}/add-friend`, {
            user_name: modalRef.current.value
        })
            .then(() => {
                axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/${currentUser.uid}/friends`) // TODO: test this
                    .then(res => {
                        console.log(res)
                        setFriends({ friendsList: res.data })
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

    function handleInviteToRoom() {
        if (room) {
            axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${room._id}/add-user`, {
                uid: currentFriend
            })
                .then(res => {
                    console.log(res)
                    setShowFriendOptions(false);
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            console.log('You need to be in a room!');
        }
        setCurrentFriend('');
    }

    //similar to componentdidmount
    useEffect(() => {
        socket = io(`${process.env.REACT_APP_MONGO_DB_PORT}`);

        return () => {
            socket.off();
        }
    }, [`${process.env.REACT_APP_MONGO_DB_PORT}`]);

    useEffect(() => {

        socket.on(`welcome`, (messageBody) => {
            console.log(messageBody);
        })

        socket.on('message-recieved', (result) => {
            console.log(result)
            setMessages(prevMessages => ([...prevMessages, result.message]));
        })

    }, []);


    function handleRightClick(e, uid) // TODO: how can I make these call in order?
    {
        //TODO: if user is already in room, do not show 'invite to room on menu'
        e.preventDefault();

        setCurrentFriend(uid);
        setXPos(e.pageX);
        setYPos(e.pageY);
        setCurrentFriend(uid);
        setShowFriendOptions(true);
    }

    function handleMouseLeave() {
        setShowFriendOptions(false);
    }

    const renderInviteToolTip = (props) => (
        <Tooltip id="invite-tooltip" {...props}>
            hi!
        </Tooltip>
    );


    return (
        <Container fluid className="main">
            <UserHeader currentUser={currentUser} handleLogout={handleLogout}></UserHeader>
            <Row className="main-row">
                <LeftPanel
                    handleTabChange={handleTabChange}
                    friendsList={friendsList}
                    handleRightClick={handleRightClick}
                    rooms={rooms}
                    handleSwitchRoom={handleSwitchRoom}
                    handleShow={handleShow}
                    tab={tab}
                ></LeftPanel>
                <Col className="chat debug">
                    <Row>
                        <Col className="line"></Col>
                        <Card className="chat-info">
                            <Card.Body>
                                <h1 className="small-font">
                                    {currentRoomName}
                                </h1>
                                {/* <Button className="invite-chat" onClick={handleInviteToRoom}>invite</Button> */}
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
            </Row>

            {
                showFriendOptions ?
                    <ListGroup style={
                        {
                            top: `${yPos - 10}px`,
                            left: `${xPos - 10}px`,
                            position: 'absolute',
                            zIndex: '100',
                        }} onMouseLeave={handleMouseLeave}>
                        <ListGroup.Item action onClick={handleAddPrivateRoom}>
                            message
                    </ListGroup.Item>
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 200 }}
                            overlay={renderInviteToolTip}>
                            <ListGroup.Item action onClick={handleInviteToRoom}>
                                add to room
                            </ListGroup.Item>
                        </OverlayTrigger>
                        <ListGroup.Item action>
                            remove friend
                    </ListGroup.Item>
                    </ListGroup> : null
            }


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    {
                        (tab === 'rooms') ?
                            <Modal.Title>Create new Room</Modal.Title> :
                            <Modal.Title>Add User</Modal.Title>
                    }
                </Modal.Header>
                <Modal.Body>

                    <Form className="text-box" onSubmit={
                        (tab === 'rooms') ?
                            handleAddRoom :
                            handleAddUser
                    }>
                        <Form.Group id="Message">
                            <Form.Control className="w-100 message-field" type="text" ref={modalRef} />
                        </Form.Group>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="secondary" onClick={handleClose}>
                        Close
                        </Button>
                    <Button variant="primary" type="submit" onClick={
                        (tab === 'rooms') ?
                            handleAddRoom :
                            handleAddUser
                    }>
                        Save Changes
                        </Button> */}
                </Modal.Footer>
            </Modal>

        </Container>
    )
}

export default Chat;