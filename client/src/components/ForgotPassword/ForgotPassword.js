import React, {useRef, useState} from 'react';
import {Form, Button, Card, Container, Alert} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {useAuth, AuthProvider} from '../../contexts/AuthContext'

const ForgotPassword = () => {

    const emailRef = useRef();
    const {resetPassword} = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
            
        try{
            setMessage("");
            setError("");
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage('Check your inbox for further instructions')
            } catch {
            setError("Failed to reset password");
        }

        setLoading(false);

    }

    return (
        <AuthProvider>

        <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
            <div className="w-100" style={{maxWidth: '400px'}}>

        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Password Reset</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Button disabled={loading} className="w-100" 
                    type="submit">Reset Password</Button>
                </Form>
        <div className="w-100 text-center mt-2">
            <Link to="/login">Log In</Link>
        </div>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Need an Account? <Link to="/signup">Sign Up</Link>
        </div>
            </div>
        </Container>
        </AuthProvider>
    )
}

export default ForgotPassword;