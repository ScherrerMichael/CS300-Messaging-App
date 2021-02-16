import React, {useState} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import style from './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const Chat = () => {

    const {currentUser, logout} = useAuth();
    const [error, setError] = useState("");
    const history = useHistory();

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
                            <div>menu</div>
                        </Row>

                        <Row className="add-item debug debug">
                            <Col></Col>

                            <Col>
                                <Button className="button">                                
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

                <p className ="status">status</p>

        </Container>
    )
}

export default Chat;