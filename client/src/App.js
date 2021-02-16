import React from 'react';

import {BrowserRouter as Router, Route} from 'react-router-dom';

import Signup from './components/Signup/Signup'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import Chat from './components/Chat/Chat'
import Login from './components/Login/Login'
import ForgotPassword from './components/ForgotPassword/ForgotPassword'
import { AuthProvider } from './contexts/AuthContext';
//import { Switch } from 'react-router-dom';

const App = () => (
    <AuthProvider>
        <Router>
            <PrivateRoute path="/" exact component = {Chat} />
            <Route path="/login" component = {Login} />
            <Route path="/signup" component = {Signup} />
            <Route path="/forgot-password" component = {ForgotPassword} />
        </Router>
    </AuthProvider>
);

export default App;