import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    let IsUserNameAvailable = function(displayName) {

        return new Promise(function(resolve, reject) {
            axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/${displayName}`)
            .then(res  =>{
                console.log('user name is not available.')
                reject()
            })
            .catch(res => {
                resolve(displayName);
            })
        })
    }

    async function signup(email, password, displayName) {
        auth.createUserWithEmailAndPassword(email, password)
            .then((result) => {
                result.user.updateProfile({
                    displayName: displayName
                })
                    .then(() => {
                        setCurrentUser({ displayName: displayName })
                    })
                    .then(() => {
                        axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/users/`, {
                            email: result.user.email,
                            uid: result.user.uid,
                            user_name: result.user.displayName
                        })
                    })
            })
    }

    useEffect(() => { //need this for forcing update on currentUser

        console.log('current user changed')

    }, [currentUser])

    async function login(email, password) {
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.log(error);
        }
    }

    // async function logout() {
    //     await auth.signOut();
    // }

    let logout = function(){
        return new Promise(function(resolve, reject) {
            auth.signOut()
            .then(() => {
                resolve('user signed out');
            })
            .catch(e => {
                reject(e);
            })
        })
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, [currentUser])



    const value = {
        currentUser,
        IsUserNameAvailable,
        signup,
        login,
        logout,
        resetPassword,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>

    )
}