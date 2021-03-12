import React, {useState, useEffect} from 'react';
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
import axios from 'axios';

const Chat = () => {

    const {currentUser, logout, postNewRoomFromUser, getRoomsWithUser} = useAuth();
    const [error, setError] = useState("");
    const history = useHistory();
    const [roomList, setRooms] = useState({
        rooms: []
    });

    async function handleAddRoom(){ //TODO switch chat and change element of selected element

        try{
            await postNewRoomFromUser();
        } catch {
            console.log("error with post room");
        }
    }

    function handleSwitchRoom(id){
        console.log(`room ${id} clicked`);
    }

    async function handleLogout(){
        setError('');

        try{
            await logout();
            history.push('/login');
        } catch {
            setError('Failed to logout');
        }
    }

    //similar to componentdidmount
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/rooms/${currentUser.uid}`)
        .then(res => {
            //console.log(res)//
            setRooms({rooms: res.data});
            console.log(roomList.rooms.result[0].topic);
        })
        .catch(err => {
            console.log(err);
        });
    }, [])

    return (
        <Container fluid className="main">
            <strong>{currentUser.email}</strong>
            <Button variant="link" onClick={handleLogout}>Log out</Button>
            <Row className="main-row">
                <Col xs="3" className="contacts debug">
                        <Row classname="tab-row">
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
                            <ListGroup>
                                your rooms
                                {
                                    roomList.rooms.result?
                                    roomList.rooms.result.map((room, index) => 
                                    <ListGroup.Item action 
                                        onClick={ () => handleSwitchRoom(index)} 
                                        key={index}>{room.topic}
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
                        <div> chat </div>
                    </Row>

                    <Row className="text-box">

                    </Row>
                </Col>
            </Row>

                {/* <p className ="status">status</p> */}

        </Container>
    )
}

export default Chat;