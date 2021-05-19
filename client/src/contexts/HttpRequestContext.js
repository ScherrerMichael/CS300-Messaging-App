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

    let acceptRequest = function(to)
    {
        return new Promise(function(resolve, reject){
            axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/users/accept-friend`, {
                from_uid: currentUser.uid,
                to_uid: to,
            })
            .then(res => {
                resolve(res.data)
            }).catch(err => {
                console.log(err)
            })
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

    let postNewRoomFromUser = function(roomName, roomDescription = "")
    {
        return new Promise(function(resolve, reject){

            axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${currentUser.uid}`, {topic: roomName, description: roomDescription,})
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
        })
    }
    
    let addFriend = function(userName)
    {
        return new Promise(function(resolve, reject){

            axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/users/${currentUser.uid}/add-friend`, {
                user_name: userName,
            })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err);
            })

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

    let deleteFriend = function(friendId)
    {
        const friendToRemove = {
            friend_uid: friendId,
        }

        return new Promise(function(resolve, reject){

            axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/users/${currentUser.uid}/friends`, friendToRemove)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
        })
    }

    let deleteRoom = function(room_id)
    {
        return new Promise(function(resolve, reject){

            const headers = {
                'Content-Type': 'text/plain'
            }

            axios.post(`${process.env.REACT_APP_MONGO_DB_PORT}/rooms/${room_id}/remove`, {headers})
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
        })
    }

    const value = {
        postNewUser,
        acceptRequest,
        postNewRoomFromUser,
        getRoomsWithUser,
        getRoomMessages,
        postMessageToRoom,
        getUserFromId,
        deleteFriend,
        deleteRoom,
        addFriend,
    }

    return (
        <HttpRequestContext.Provider value ={value}>
            {children}
        </HttpRequestContext.Provider>

    )
}