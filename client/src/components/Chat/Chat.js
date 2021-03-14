import React, {useState, useEffect, useRef} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import style from './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Tab from 'react-bootstrap/Tab'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import io from 'socket.io-client'

let  socket;

const Chat = () => {
    const {currentUser, logout, postNewRoomFromUser, getRoomsWithUser} = useAuth();
    const [error, setError] = useState("");
    const history = useHistory();
    const [roomList, setRooms] = useState({
        rooms: []
    });
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState('');
    const formRef = useRef();
    const messageRef = useRef();
    const [message, setMessage] = useState({});

    useEffect(() =>{ // getting all rooms that the user is in
        axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/rooms/${currentUser.uid}`)
        .then(res => {
            //console.log(res)//
            setRooms({rooms: res.data});
        })
        .catch(err => {
            console.log(err);
        });
    }, [])


    function handleReset(){
        formRef.current.reset(); //reset the value of the form stuff
        setMessage({});
    }

    async function handleSubmit(e) { //post a message to the room
        e.preventDefault();

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

        socket.emit('sendMessage', {message}, ({callback}) => {
            //console.log(callback);
        });

        handleReset();
        console.log(messages);
    }

    async function handleAddRoom(){ //TODO switch chat and change element of selected element

        try{
            await postNewRoomFromUser();
        } catch {
            console.log("error with post room");
        }

        axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/rooms/${currentUser.uid}`)
        .then(res => {
            //console.log(res)//
            setRooms({rooms: res.data});
        })
        .catch(err => {
            console.log(err);
        });
    }

    function handleSwitchRoom(roomId){
        //console.log(`room ${roomId} clicked`);
        setRoom(roomId);

        //tell io that we are in a new 'room'
    }

    useEffect(() => {
        //update the room info (send get request and load messages of that room)
        axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${room}`)
        .then(res => {
            //console.log(res.data.messages);
            setMessages(res.data.messages);
        })
        .catch(err => {
            console.log(err);
        });
    }, [message, room])


    async function handleLogout(){
        setError('');

        try{
            await logout();
            socket.off();
            history.push('/login');
        } catch {
            setError('Failed to logout');
        }
    }

    //similar to componentdidmount
    useEffect(() => {
        socket = io(`${process.env.REACT_APP_MONGO_DB_PORT}`);

        socket.emit('join', currentUser.email, ({message}) => {
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
                            <Col xs="4" className="tab">
                                Home
                            </Col>

                            <Col xs="4" className="tab">
                                People
                            </Col>

                            <Col xs="4" className="tab">
                                Groups
                            </Col>
                        </Row>

                        <Row className="menu debug">
                            <Tab.Container>
                            <ListGroup className="w-100">
                                {
                                    roomList.rooms.result?
                                    roomList.rooms.result.map(room => 
                                    <ListGroup.Item action 
                                        onClick={ () => handleSwitchRoom(room._id)} 
                                        key={room._id}>{room.topic}
                                        </ListGroup.Item>) :
                                    <div>no rooms</div>
                                }
                            </ListGroup>
                        </Tab.Container>
                        </Row>

                        <Row className="add-item debug debug">
                            <Col></Col>

                            <Col>
                                <Button onClick={handleAddRoom}className="button">                                
                                    Add
                                </Button>
                            </Col>

                            <Col></Col>
                        </Row>
                </Col>

                <Col className="chat debug">

                    <Row className="messages">
                            <ListGroup className="w-100">
                                {
                                    messages?
                                    messages.map(message => 
                                    <div className="w-100 message" key={message._id}>{message.message_body}</div>):
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
                        <Col xs='1'className="form-button-submit">
                            <Button className="w-100" type="submit">Send</Button>
                        </Col>
                    </Form.Row>
                </Form>
                    </Row>
                </Col>
            </Row>

                {/* <p className ="status">status</p> */}

        </Container>
    )
}

export default Chat;