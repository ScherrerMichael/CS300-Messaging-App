import React, {useRef, useState} from 'react';
import {Form, Button, Card, Container, Alert} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {useAuth, AuthProvider} from '../../contexts/AuthContext';
import axios from 'axios';

const state = {
    user_name: '',
    avatar: 'cool picture',
    email: '',
    password: 'not tellling',
    friends: [],
    is_active: true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
}

const Signup = () => {

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const {signup} = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();


    async function handleSubmit(e) {
        e.preventDefault();


        if(passwordRef.current.value !==
            passwordConfirmRef.current.value)
            {
                return setError('Passwords do not match');
            }
            
        try{
            setError("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);

            //
            axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/users/`, state)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err);
            });
            //

            history.push("/");
            } catch {
            setError("Failed to create and account");
        }

        setLoading(false);

    }

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