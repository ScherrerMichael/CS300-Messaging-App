import React, { useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {auth} from '../firebase';

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    async function signup(email, password, displayName){
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            result.user.updateProfile({
                displayName: displayName
            })
                .then(() =>{
                    auth.updateCurrentUser(result.user)})
                .then(() =>{
                    axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/users/`, {
                        email: result.user.email,
                        uid: result.user.uid,
                        user_name: result.user.displayName
                })
                })
        } catch (error) {
            console.log(error);
        }
    }

    async function login(email, password) {
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.log(error);
        }
    }

    async function logout(){
        await auth.signOut();
    }

    function resetPassword(email){
        return auth.sendPasswordResetEmail(email);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, [])



    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
    }

    return (
        <AuthContext.Provider value ={value}>
            {!loading && children}
        </AuthContext.Provider>

    )
}