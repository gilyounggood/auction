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
    margin-left: 5px;
    @media screen and (max-width:950px) {
        margin-bottom: 65px
      }
`;

const UserNameStyle = styled.h4`
    padding: 10px;
    margin-left: 195px;
    border-radius: 20px;
    color: black;
    background-color: #FFF0F5;
    box-shadow: 3px 3px 3px grey;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width:950px) {
        margin-bottom: 65px
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
    <div>
        {auth ? (
                <div style={{
                    display: "flex"
                }}>
                    <UserNameStyle
                        style={{
                            ...{ opacity: hovered ? "1" : "0" }
                        }}
                    >{myNickName}님의 메신저</UserNameStyle>
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