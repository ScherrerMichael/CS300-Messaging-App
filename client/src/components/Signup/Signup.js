import React, {useEffect, useRef, useState} from 'react';
import {Form, Button, Card, Container, Alert} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {useAuth, AuthProvider} from '../../contexts/AuthContext';
import {useRequest, RequestProvider} from '../../contexts/HttpRequestContext'
import axios from 'axios';


const Signup = () => {

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const userNameRef = useRef();
    const {currentUser, signup, IsUserNameAvailable} = useAuth();
    const {postNewUser} = useRequest();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();


        if (passwordRef.current.value !==
            passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }

            setError("");
            setLoading(true);
            IsUserNameAvailable(userNameRef.current.value)
            .then(name => {
                signup(emailRef.current.value, passwordRef.current.value, name)
                    .then(() => {
                        return (history.push("/"));
                    })
            })
            .catch(() => {
                return(setError('error creating account'));
            })
            .finally(() => {
                return (setLoading(false))
            })
        }

    useEffect(() =>{

    }, [loading])

    return (
        <AuthProvider>

        <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
            <div className="w-100" style={{maxWidth: '400px'}}>

        <Card>
            <Card.Body>
                <h2 className="text-center mb-4"> Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id="user-name">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control type="text" ref={userNameRef} required />
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                    <Form.Group id="password-confirm">
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required />
                    </Form.Group>
                    <Button disabled={loading} className="w-100" type="submit">Sign Up</Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center my-2">
            already have an account? <Link to="login">Login</Link>
        </div>
            </div>
        </Container>
        </AuthProvider>
    )
}

export default Signup;