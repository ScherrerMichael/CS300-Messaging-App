import React, { Component, useState} from 'react'
import axios from 'axios'


class RoomList extends Component {
    constructor(props) {
        super(props)


        this.state = {
            rooms: [],
            user: {}
        }
    }

    componentDidMount(){

       // axios.get(`${process.env.REACT_APP_MONGO_DB_PORT}/users/rooms/${currentUser.uid}`)
       // .then(res => {
       //     console.log(res)
       //     let posts = res;
       // })
       // .catch(err => {
       //     console.log(err);
       // });
    }

  render() {
    const { posts } = this.state;
    return (
      <div>
        List of Rooms
        {
            posts.length ?
            posts.map(post => <div key ={post.id}>{post.title}</div>):
            null
        }
      </div>
    )
  }
}

export default RoomList
