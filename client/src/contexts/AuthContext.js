import React, { useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {auth} from '../firebase';
import {useCookies} from 'react-cookie';

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState();
    const [cookies, setCookie, removeCookie] = useCookies(['name']);
    const [loading, setLoading] = useState(true);

    let axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }

    const tempUser = {
        uid: '',
        user_name: '',
        avatar: '',
        email: '',
        friends: [],
        is_active: true,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
    }

    async function signup(email, password, displayName){
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            return await result.user.updateProfile({
                displayName: displayName
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function login(email, password) {
        try {
            const email_2 = await auth.signInWithEmailAndPassword(email, password);
            let now = new Date();
            now.setMonth(now.getMonth() + 1);
            setCookie('name', email_2, { expires: now });
        } catch (error) {
            console.log(error);
        }
    }

    async function logout(){
        await auth.signOut();
        removeCookie('name');
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
        cookies,
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