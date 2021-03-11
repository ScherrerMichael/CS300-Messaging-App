import React, {useState} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import style from './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Menu from './Menu';

const Chat = () => {

    const {currentUser, logout, postNewRoomFromUser} = useAuth();
    const [error, setError] = useState("");
    const history = useHistory();

    async function handleAddRoom(){

        try{
            await postNewRoomFromUser();
        } catch {
            console.log("error with post room");
        }
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
                            {/* <Menu></Menu>  TODO: work on populating the left menu with rooms that contain the current user */}
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