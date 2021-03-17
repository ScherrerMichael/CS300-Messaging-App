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

    function signup(email, password, displayName){
        return auth.createUserWithEmailAndPassword(email, password)
        .then(function(result) {
            return result.user.updateProfile({
                displayName: displayName
            })
        }).catch((error) =>{
            console.log(error);
        });
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password).then((email) =>{
            let now = new Date();
            now.setMonth(now.getMonth() + 1);
            setCookie('name', email, {expires: now});
        }).catch((error) =>{
            console.log(error);
        });
    }

    function logout(){
        return auth.signOut().then(() =>{
            removeCookie('name');
        });
    }

    function resetPassword(email){
        return auth.sendPasswordResetEmail(email);
    }

    async function postNewUser(displayName){
        var user = auth.currentUser;

        if(user !== null)
        {
            axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/users/`, {
                email: user.email,
                uid: user.uid,
                user_name: user.displayName
            })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err);
            });
        }


        return 1;
    }

    async function postNewRoomFromUser(roomName){

        var currentUserId = currentUser.uid;


        axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${currentUserId}`, {topic: roomName})
        .then(res => {
            //console.log(res)
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
            setLoading(false);
        });
        return unsubscribe;
    }, [])



    const value = {
        currentUser,
        cookies,
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
            {!loading && children}
        </AuthContext.Provider>

    )
}