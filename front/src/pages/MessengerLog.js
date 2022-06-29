import React, { useEffect, useState } from 'react'
import { useHistory, BrowserRouter as Routes, Link, Router, Route } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

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
  color: #000069;
  box-shadow: 3px 3px 3px grey;
  background-color: white;
  margin-top: 10px;
`;

const LogButton = styled.button`
  border: 1px solid #B21EF1;
  border-radius: 10px;
  padding: 5px;
  text-align: center;
  color: #14148C;
  background-color: white;
  box-shadow: 3px 3px 3px grey;
  cursor: pointer;
  margin-left: 240px;
`;

const Span = styled.span`
  color: gray;
  display: block;
`;

const InputContainer = styled.div`
  border:1px solid blue;
  border-radius:0.6rem;
  align-items:center;
  padding:8px 0;
  display:flex;
  margin:0 auto;
  background:#fff;
  position: fixed; /* 이 부분을 고정 */
  bottom: 170px; /* 하단에 여백 없이 */
  width: 18.5%;
  height: 30px;
`

const MessengerInput = styled.input`
  width: 22rem;
  padding:0 5px 0 5px;
  font-size:1rem;
  outline:none;
  border: none;
  margin-left:1rem;
  color:#2e2e2e;
`
const MessengerButton = styled.button`
	width: 85px;
	height: 40px;
	color:#fff;
	background: #004fff;
	font-size: 16px;
	border:none;
	border-radius: 10px;
	box-shadow: 0 4px 16px rgba(0,79,255,0.3);
	transition:0.3s;
	position: absolute;
	transform: translate(-50%,-50%);
  left: 87%;
	top: 50%;
  &:focus {
    outline:0;
  }
  &:hover{
    background: rgba(0,79,255,0.9);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,79,255,0.6);
  }
`

const MessengerLog = props => {

  const [auth, setAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const [myId, setMyId] = useState('')
  const [myNickName, setMyNickName] = useState('')
  const [myLevel, setMyLevel] = useState(0);
  const [myPk, setMyPk] = useState(0);

  const [messengerList, setMessengerList] = useState([])
  const [userTagInfo, setUserTagInfo] = useState("")

  const [chat, setChat] = useState(false)

  const history = useHistory();

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

      const { data: response2 } = await axios.post('/api/messengerinfo', {
        user_name: response.nick_name
      })
      console.log(response2)
      setMessengerList(response2.data)
    
      try {
        const { data: result } = await axios.post('/api/usertaginfo', {
            user_name: response.nick_name
        })
        if (result.data) {
            setUserTagInfo(result.data.userTag[0].userTag)
        } else {
        }
      } catch {
      }

    setLoading(false)
  }

  useEffect(() => {
    isAdmin()
  }, [])

  function messengerChange() {
    if(chat === true) {
      setChat(false)
    } else {
      setChat(true)
    }
  }

  return (
    <>
    <UserLogStyle
      style={{
          marginBottom: "15px",
          ...{ 
            display: props.userLog ? "block" : "none",
          }
      }}
    >
      <LogButton
        onClick={() => messengerChange()}
      >{chat ? "유저 메신저" : "관리자 1:1 문의"}</LogButton>
      <div className='messenger'
        style={{display: chat ? "none" : "block" }}
      >
        <LogTitle>{myNickName}님의 메신저</LogTitle>
            {messengerList?.map(messenger => {
              return (
                <>
                  {myNickName === messenger.post_name && myNickName !== messenger.user_name ?
                  <StyledLink 
                  to = {`/auction/${messenger.post_id}`}
                  >
                    <span style={{color: "#DC143C"}}>{messenger.user_name}</span>님이
                    <span style={{color: "#FF0000"}}>{messenger.postTitle}</span>게시글에
                    <span style={{color: "#800000"}}>{messenger.chat_message}</span>
                    <Span>{messenger.create_time}</Span>
                  </StyledLink>
                  : null
                  }
                  {messenger.post_id === "0" && myNickName !== messenger.user_name && messenger.chat_message.includes(userTagInfo) ?
                  <StyledLink 
                  to = {{
                    pathname:'/searchresult',
                    state:{...{keyword: messenger.chat_message}}
                  }}
                  >
                    <span style={{color: "#DC143C"}}>{messenger.chat_message}</span>태그의 게시글이 업로드 되었습니다.
                    제목 <span style={{color: "#FF0000"}}>{messenger.postTitle}</span> 작성자 <span style={{color: "#800000"}}>{messenger.user_name}</span>님
                    <Span>{messenger.create_time}</Span>
                  </StyledLink>
                  : null
                  }  
                </>
              )
            })}
        </div>
        <div className='messenger_chat'
          style={{display: chat ? "block" : "none" }}
        >
          <LogTitle>관리자에게 1:1 문의하기</LogTitle>
          <InputContainer>
            <MessengerInput placeholder='문의사항을 적어주세요'/>
            <MessengerButton>전송하기</MessengerButton>
          </InputContainer>
        </div>
    </UserLogStyle>
  </>
  )
}

export default MessengerLog