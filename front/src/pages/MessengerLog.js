import React, { useEffect, useState } from 'react'
import { useHistory, BrowserRouter as Routes, Link, Router, Route } from 'react-router-dom';
import styled from 'styled-components';
import setLevel from '../data/Level';
import { setIcon } from '../data/Icon';
import $ from 'jquery'
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
  margin-left: 130px;
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
  border: 1px solid #0064FF;
  border-radius:0.5rem;
  align-items:center;
  padding:8px 0;
  display:flex;
  margin:0 auto;
  background:#fff;
  position: fixed; /* 이 부분을 고정 */
  bottom: 98px; /* 하단에 여백 없이 */
  height: 30px;
  width: 250px;
`

const MessengerInput = styled.input`
  width: 14rem;
  padding:0 5px 0 5px;
  font-size:1rem;
  outline:none;
  border: none;
  margin-top: 5px;
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
	box-shadow: 0 1px 2px rgba(0,79,255,0.3);
	transition:0.3s;
	position: absolute;
	transform: translate(-50%,-50%);
  left: 88%;
	top: 85%;
  &:focus {
    outline:0;
  }
  &:hover{
    background: rgba(0,79,255,0.9);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,79,255,0.6);
  }
`
const ChatMessage = styled.div`
  border:1px solid none;
  border-radius:0.6rem;
  padding:8px 0;
  margin-bottom: 15px;
  width: 51%;
`

const UserInfoList = styled.button`
  border:1px solid #bc3cbc;
  border-radius:0.6rem;
  padding:8px 0;
  margin-bottom: 15px;
  width: 100%;
  cursor: pointer;
`

const MessengerLog = props => {

  const [auth, setAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const [myId, setMyId] = useState('')
  const [myNickName, setMyNickName] = useState('')
  const [myLevel, setMyLevel] = useState(0);
  const [myPk, setMyPk] = useState(0);
  const [myReliability, setMyReliability] = useState(0)
  const [myIcon, setMyIcon] = useState("")

  const [messengerList, setMessengerList] = useState([])
  const [userTagInfo, setUserTagInfo] = useState("")

  const [chat, setChat] = useState(false)

  const [adminChat, setAdminChat] = useState("")
  const [adminChatList, setAdminChatList] = useState([])
  const [userList, setUserList] = useState([])
  const [userChatInfo, setUserChatInfo] = useState(false)
  const [adminUserChatList, setAdminUserChatList] = useState([])

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
          setMyReliability(response.reliability)
          setMyIcon(response.user_use_icon)
      }   

      const { data: response2 } = await axios.post('/api/messengerinfo', {
        user_name: response.nick_name
      })
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

      const { data: result2 } = await axios.get('/api/adminchatinfo')
      setAdminChatList(result2.data)

      const { data: result3 } = await axios.get('/api/userinfo')
      setUserList(result3.data)

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
    if (userChatInfo === true) {
      setUserChatInfo(false)
      setChat(true)
    } else {
    }
  }

  const addAdminChat = async () => {
    if(adminChat === "") {
      alert("문의사항을 입력해주세요")
    } else {
      const { data: response } = await axios.get('/api/auth')
        await axios.post("/api/addadminchat", {
          chat_name: response.nick_name,
          chat_id: response.nick_name,
          chat_message: adminChat,
      }) 
      alert("문의사항이 등록 되었습니다")
      $("#chat").val("");
      const { data: result2 } = await axios.get('/api/adminchatinfo')
      setAdminChatList(result2.data)
      $("#chating").scrollTop($("#chating")[0]?.scrollHeight);
    }
  }

  const addAdminChat2 = async (chat_id, e) => {
    e.preventDefault();
    if(adminChat === "") {
      alert("답변을 입력해주세요")
    } else {
      const { data: response } = await axios.get('/api/auth')
        await axios.post("/api/addadminchat", {
          chat_name: response.nick_name,
          chat_id: chat_id,
          chat_message: adminChat,
      }) 
      alert("답변이 등록 되었습니다")
      $("#chat2").val("");
      const { data: response2 } = await axios.post('/api/adminchatinfo/user', {
        chat_name: chat_id,
      })
      setAdminUserChatList(response2.data)
      $("#chating").scrollTop($("#chating")[0]?.scrollHeight);
    }
  }

  const userChatList = async (user_name, e) => {
    e.preventDefault();
    if(userChatInfo === false) {
      setUserChatInfo(true)
    } else {
      setUserChatInfo(false)
    }
    const { data: response } = await axios.post('/api/adminchatinfo/user', {
      chat_name: user_name,
    })
    setAdminUserChatList(response.data)
  }

  const deleteNotice = async (pk, e) => {
    await axios.post('/api/deletenotice', {
      pk: pk
    })
    window.location.reload()
  }

  return (
    <>
    <UserLogStyle
      id="chating"
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
        <LogTitle>
          {myIcon &&
          <img width={25} src={setIcon(myIcon)}/>
          }
          <img width={25} src={setLevel(myReliability)}/>{myNickName}님의 메신저</LogTitle>
            {messengerList?.map(messenger => {
              return (
                <div key={messenger.pk}>
                  {myNickName === messenger.post_name && myNickName !== messenger.user_name ?
                  <StyledLink 
                    to = {`/auction/${messenger.post_id}`}
                    onClick={e => deleteNotice(messenger.pk)}
                    style={{ color: messenger.notice === 0 ? 'gray' : null}}
                  >
                    <span style={{color: messenger.notice === 0 ? 'gray' : "#DC143C"}}>{messenger.user_name}</span>님이
                    <span style={{color: messenger.notice === 0 ? 'gray' : "#FF0000"}}>{messenger.postTitle}</span>게시글에
                    <span style={{color: messenger.notice === 0 ? 'gray' : "#800000"}}>{messenger.chat_message}</span>
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
                    onClick={e => deleteNotice(messenger.pk)}
                    style={{color: messenger.notice === 0 ? 'gray' : null}}
                  >
                    <span style={{color: messenger.notice === 0 ? 'gray' : "#DC143C"}}>{messenger.chat_message}</span>태그의 게시글이 업로드 되었습니다.
                    제목 <span style={{color: messenger.notice === 0 ? 'gray' : "#FF0000"}}>{messenger.postTitle}</span> 작성자 <span style={{color: messenger.notice === 0 ? 'gray' : "#800000"}}>{messenger.user_name}</span>님
                    <Span>{messenger.create_time}</Span>
                  </StyledLink>
                  : null
                  }  
                </div>
              )
            })}
        </div>
        <div 
          className='messenger_chat'
          style={{display: chat ? "block" : "none" }}
        >
          <LogTitle>{myNickName !== "관리자" ? "관리자에게 1:1 문의하기" : "유저 문의 관리하기"}</LogTitle>
            {myNickName !=="관리자" && adminChatList?.map((adchat, index) => {
              return (
                <div key={adchat.pk}>
                  {myNickName === adchat.chat_id &&
                    <ChatMessage style={{
                      backgroundColor:  adchat.chat_name === myNickName ? "#FFF978" : "#AFFFEE",
                      float:  adchat.chat_name === myNickName ? "right" : "left",
                      textAlign:  adchat.chat_name === myNickName ? "right" : "left",
                    }}>
                      <span style={{color: "#0000CD"}}>{adchat.chat_name}:</span> <span style={{color: "black"}}>{adchat.chat_message}</span>
                      <Span>{adchat.create_time}</Span>
                    </ChatMessage>
                  }
                  <InputContainer>
                  <MessengerInput
                      id="adchat" 
                      placeholder= {'문의사항을 적어주세요'}
                      onChange={e=> setAdminChat(e.target.value)}
                    />
                  </InputContainer>
                  <MessengerButton
                    onClick={addAdminChat}
                  >
                    전송하기
                  </MessengerButton>
                </div>
              )
            })}
              {userChatInfo === false && myNickName ==="관리자" && userList?.map((userlist, index) => {
              return (
                <div key={userlist.pk}>
                  <UserInfoList style={{
                    display: adminChatList.findIndex(n => n.chat_name === userlist.nick_name) === -1 || userlist.nick_name === "관리자" ? "none" : "block",
                  }}
                    onClick= {e => {userChatList(userlist.nick_name, e)}}
                  >
                    <span style={{color: "#B90000"}}>{userlist.nick_name}</span><span style={{color: "black"}}>님의 문의 목록</span>
                  </UserInfoList>
                </div>
              )
              })}
              {userChatInfo === true && adminUserChatList?.map((userchat, index) => {
                return (
                  <div key={userchat.pk}>
                    <ChatMessage style={{
                      backgroundColor:  userchat.chat_name === myNickName ? "#FFF978" : "#AFFFEE",
                      float:  userchat.chat_name === myNickName ? "right" : "left",
                      textAlign:  userchat.chat_name === myNickName ? "right" : "left",
                    }}>
                      <span style={{color: "#0000CD"}}>{userchat.chat_name}:</span> <span style={{color: "black"}}>{userchat.chat_message}</span>
                      <Span>{userchat.create_time}</Span>
                    </ChatMessage>
                    <>
                      <InputContainer>
                      <MessengerInput 
                          id="adchat2"
                          placeholder= {"유저에게 답변하기"}
                          onChange={e=> setAdminChat(e.target.value)}
                        />
                      </InputContainer>
                      <MessengerButton
                        onClick={e => {addAdminChat2(userchat.chat_id, e)}}
                      >
                        전송하기
                      </MessengerButton>
                    </>
                  </div>
                )
              })
              }

        </div>
    </UserLogStyle>
  </>
  )
}

export default MessengerLog