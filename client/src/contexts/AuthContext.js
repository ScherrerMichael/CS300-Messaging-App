import React, { useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {auth} from '../firebase';

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState();

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

    const tempRoom = {
        owner: '',
        topic: '',
        users: '',
    }

    function signup(email, password){
        return auth.createUserWithEmailAndPassword(email, password);
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    function logout(){
        return auth.signOut();
    }

    function resetPassword(email){
        return auth.sendPasswordResetEmail(email);
    }

    async function postNewUser(){
        var user = auth.currentUser;
        var name, email, uid;

        if(user != null)
        {
            name = user.displayName;
            email = user.email;
            uid = user.uid;
        }
        
        tempUser.name = name;
        tempUser.email = email;
        tempUser.uid = uid;

        console.log("uid: " + uid);
        
        axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/users/`, tempUser)
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err);
        });

        return 1;
    }

    async function postNewRoomFromUser(){

        var currentUserId = currentUser.uid;

        axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${currentUserId}`)
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err);
        });

    }

    async function getRoomsWithUser(){

        var doc;

        axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/rooms/${currentUser.uid}`)
        .then(res => {
            //console.log(res)
            return res;
        })
        .catch(err => {
            console.log(err);
        });

    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });
        return unsubscribe;
    }, [])



    const value = {
        currentUser,
        signup,
        login,
        postNewUser,
        postNewRoomFromUser,
        getRoomsWithUser,
        logout,
        resetPassword,
    }

    return (
        <AuthContext.Provider value ={value}>
            {children}
        </AuthContext.Provider>

    )
}