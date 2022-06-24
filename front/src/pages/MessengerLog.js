import React, { useEffect, useState } from 'react'
import { BrowserRouter as Routes, Link, Router, Route } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const UserLogStyle = styled.div`
  width: 300px;
  height: 400px;
  border: 1px solid #8A2BE2;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  color: Lightseagreen;
  background-color: white;
  box-shadow: 3px 3px 3px grey;
  margin-left: 80px;
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
  color: Lightseagreen;
  background-color: wihte;
  box-shadow: 3px 3px 3px grey;
`;

const MessengerLog = props => {

  const [auth, setAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const [myId, setMyId] = useState('')
  const [myNickName, setMyNickName] = useState('')
  const [myLevel, setMyLevel] = useState(0);
  const [myPk, setMyPk] = useState(0);
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

  useEffect(() => {
      isAdmin()
  }, [])

  return (
    <UserLogStyle
        style={{
            marginBottom: "15px",
            ...{ opacity: props.userLog ? "1" : "0" }
        }}
    >
      <LogTitle>{myNickName}님의 알림창</LogTitle>
      {/* {listOfMessage.map((value, key) => {
        return ( */}
          <>
            {/* {authState.userid !== value.userid && authState.id == value.postUserid ?  */}
              <StyledLink 
                // to={`/post/${value.PostId}`}
                to = "" 
                // key={key}
              >
                {}님이 "{}"에 댓글을 남겼습니다.
              </StyledLink>
              :null
            {/* } */}
          </>
        {/* )
      })} */}
    </UserLogStyle>
  )
}

export default MessengerLog