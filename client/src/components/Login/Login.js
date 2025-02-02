import React, {useRef, useState} from 'react';
import {Form, Button, Card, Container, Alert} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {useAuth, AuthProvider} from '../../contexts/AuthContext'

const Login = () => {

    const emailRef = useRef();
    const passwordRef = useRef();
    const {login} = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
            
        try{
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            history.push("/");
            } catch {
            setError("Failed to Log In");
        }

        setLoading(false);

    }

    return (
        <AuthProvider>

        <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
            <div className="w-100" style={{maxWidth: '400px'}}>

        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Log In</h2>
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
                    <Button disabled={loading} className="w-100" type="submit">Log In</Button>
                </Form>
        <div className="w-100 text-center mt-2">
            <Link to="/forgot-password">Forgot Password?</Link>
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

export default Login;