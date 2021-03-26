import React, { useContext, useEffect, useState} from 'react';
import { useAuth , AuthProvider} from './AuthContext';
import axios from 'axios';

const HttpRequestContext = React.createContext();


export function useRequest(){
    return useContext(HttpRequestContext);
}

export function RequestProvider({children}) {

const { currentUser, signup} = useAuth();

    function postNewUser(email, password, userName){

        signup(email, password, userName)
        .then((userCredential) => {
            var user = userCredential.user;
            console.log(user)
            .then(res => {
                console.log(res)
                return res;
            })
            .catch(err => {
                console.log(err);
                return err;
            });
        })
        .catch(err => {
            return err;
        })

    }

    let getUserFromId = function(userId){
        return new Promise(function(resolve, reject){

            axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/${currentUser.uid}`)
            .then(res => {
                resolve(res.data)
            }).catch(err => {
                console.log(err)
            })

        })
    }

    let postNewRoomFromUser = function(roomName)
    {
        return new Promise(function(resolve, reject){

            axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${currentUser.uid}`, {topic: roomName})
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
        })
    }
    


    let getRoomsWithUser = new Promise(function(resolve, reject){

        if(currentUser !== null)
        {
            axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/rooms/${currentUser.uid}`)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.log(err)
            });

        } else {
            reject('user not logged in')
        }
    }).catch(error => { //ust catch rejections
        console.log(error);
    })

    let getRoomMessages = function(roomId){
        
        return new Promise(function(resolve, reject){

            axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${roomId}`)
                .then(res => {
                    resolve(res.data.messages)
                })
                .catch(err => {
                    console.log(err);
                });
        })
    }

    let postMessageToRoom = function(room, message) {

            const messageToSend = {
                uid: currentUser.uid,
                message_body: message,
            }

        return new Promise(function(resolve, reject){

            if(message === null)
            reject(Error('message is undefined'));

            axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${room}/messages`, messageToSend)
            .then(res => {
                resolve(res.data.result);
            })
            .catch(err => {
                reject(err);
            });

        })
    }

    const value = {
        postNewUser,
        postNewRoomFromUser,
        getRoomsWithUser,
        getRoomMessages,
        postMessageToRoom,
        getUserFromId,
    }

    return (
        <HttpRequestContext.Provider value ={value}>
            {children}
        </HttpRequestContext.Provider>

    )
}