import React, { useEffect, useState } from 'react'
import { BrowserRouter as Routes, Link, Router, Route } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import $ from 'jquery'

const UserLogStyle = styled.div`
  width: 350px;
  height: 500px;
  border: 1px solid #8A2BE2;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  color: Lightseagreen;
  background-color: white;
  box-shadow: 3px 3px 3px grey;
  margin-left: 80px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #ccc;
  }
`;

const StyledLink = styled(Link)`
	box-sizing: border-box;
	display: block;
	padding: 4px 8px;
	margin: 0 auto;
	text-align: center;
  text-decoration: none;
  color: black;
  border-bottom: 1px solid gray;
`;

const LogTitle = styled.h3`
  border: 1px solid blue;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  color: #006400;
  background-color: wihte;
  box-shadow: 3px 3px 3px grey;
  background-color: #FFFFF0;
`;

const Span = styled.span`
  color: gray;
  display: block;
`;

const MessengerLog = props => {

  const [auth, setAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const [myId, setMyId] = useState('')
  const [myNickName, setMyNickName] = useState('')
  const [myLevel, setMyLevel] = useState(0);
  const [myPk, setMyPk] = useState(0);

  const [messengerList, setMessengerList] = useState([])

  const isAdmin = async () => {
      setLoading(true)
      
      const { data: response } = await axios.get('/api/auth')
      if (!response.second) {
          setAuth(false)

      }
      else{
          setAuth(true)
          setMyId(response.id)
          setMyNickName(response.nick_name)
          setMyLevel(response.level)
          setMyPk(response.pk)
          console.log(response)
      }   

      setLoading(false)
  }

  const fetchMessengers = async () => {
    const {data:response} = await axios.post('/api/messengerinfo', {
    })
    console.log(response)
    setMessengerList(response.data)
  } 

  useEffect(() => {
    isAdmin()
    fetchMessengers()
  }, [])

  return (
    <UserLogStyle
        style={{
            marginBottom: "15px",
            ...{ display: props.userLog ? "block" : "none" }
        }}
    >
      <LogTitle>{myNickName}님의 메신저</LogTitle>
          {messengerList?.map(messenger => {
            return (
              <>
                {myNickName === messenger.post_name && myNickName !== messenger.user_name ?
                <StyledLink 
                to = {`/auction/${messenger.post_id}`}
                >
                      "{messenger.user_name}"님이 "{messenger.postTitle}"게시글에 "{messenger.chat_message}"
                      <Span>{messenger.create_time}</Span>
                </StyledLink>
                : null
                } 
              </>
            )
          })}
    </UserLogStyle>
  )
}

export default MessengerLog