import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import MessengerImage from '../assets/images/메신저이미지.png'
import axios from 'axios';

const UserImageStyle = styled.img`
    width: 100px;
    height: 100px; 
    border-radius: 70%;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 5px 5px 5px grey;
    float: right;
    background-color: white;
    @media screen and (max-width:950px) {
        margin-bottom: 10px;
        width: 50px;
        height: 50px; 
        margin-left: 195px;
        display: none;
      }
`;

const UserNameStyle = styled.h4`
    padding: 10px;
    border-radius: 20px;
    color: black;
    background-color: #FFF0F5;
    box-shadow: 3px 3px 3px grey;
    text-align: center;
    justify-content: center;
    align-items: center;
    @media screen and (max-width:950px) {
        margin-bottom: 15px;
      }
`;

const UserNotice = styled.div`
    position: relative; 
    z-index: 1;
    float: right;
    color: white;
    background-color: red;
    border: 2px solid black;
    border-radius: 15px;
    width: 23px;
    text-align: center;
    font-weight: bold;

    @media screen and (max-width:950px) {
        margin-bottom: 15px;
        display: none;
      }
`;

const Messenger = props => {

    const [hovered, setHovered] = useState(false);

    const [auth, setAuth] = useState(false)
    const [loading, setLoading] = useState(false)
    const [myId, setMyId] = useState('')
    const [myNickName, setMyNickName] = useState('')
    const [myLevel, setMyLevel] = useState(0);
    const [myPk, setMyPk] = useState(0);
    const [myReliability, setMyReliability] = useState(0);
    const [myIcon, setMyIcon] = useState("")
    const [messengerList, setMessengerList] = useState([])
    const [autoNoticeList, setAutoNoticeList] = useState([]);

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

        try {
            const { data: result } = await axios.post('/api/usertaginfo', {
                user_name: response.nick_name
            })
            const { data: response2 } = await axios.post('/api/messengernotice', {
                user_name: response.nick_name,
                user_tag: result.data.userTag
            })
            setMessengerList(response2.data)

            const { data: response3 } = await axios.post('/api/autosystem/notice', {
                user_pk: response.pk
            })
            setAutoNoticeList(response3.data);
          } catch {
          }

        setLoading(false)
    }

    useEffect(() => {
        isAdmin()
    }, [])

    const noticeList = messengerList.filter(message => message.notice === 1 && message.post_id !== '0' && message.user_name !== myNickName)
    const noticeList2 = messengerList.filter(message => message.notice === 1 && message.post_id === '0' && message.user_name !== myNickName)
    const noticeList3 = autoNoticeList.filter(list => list.notice === 1);

  return (
    <div>
        {auth ? (
                <div>
                    {/* <UserNameStyle
                        style={{
                            ...{ display: hovered ? "block" : "none" }
                        }}
                    >
                        <img src={setLevel(myReliability)}/>{myNickName}님의 메신저</UserNameStyle> */}
                    {noticeList.length + noticeList2.length + noticeList3.length > 0 &&
                    <UserNotice style={{marginLeft: '-20px'}} >{noticeList.length + noticeList2.length + noticeList3.length}</UserNotice>
                    }
                    <UserImageStyle 
                        onMouseEnter={() => {setHovered(true)}}
                        onMouseLeave={() => {setHovered(false)}}
                        onClick={() => props.onClick && props.onClick()}
                        style={{
                            ...{ border: hovered ? "3px solid yellow" : "3px solid gray" }
                    }}
                    src={MessengerImage}
                    ></UserImageStyle>
                </div>
            ) 
            : ( <></> )
        }
    </div>
  )
}

export default Messenger