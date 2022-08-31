import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ContentsWrapper from '../components/elements/ContentWrapper';
import Wrapper from '../components/elements/Wrapper';
import { GrNext } from 'react-icons/gr'
import axios from 'axios';
import { MdOutlineAccountBox } from 'react-icons/md'
import { BiSmile } from 'react-icons/bi'
import ScaleLoader from "react-spinners/ScaleLoader";
import setLevel from '../data/Level';
import { setIcon } from '../data/Icon';
const ThemeList = styled.div`
width:22rem;
margin:0 auto;
margin-bottom:2rem;
@media screen and (max-width:550px) {
    width: 18rem;
  }
  @media screen and (max-width:450px) {
    width: 16rem;
  }
  @media screen and (max-width:350px) {
    width: 14rem;
  }
`
const Theme = styled.div`
display:flex;
justify-content:space-between;
align-items:center;
cursor:pointer;
color:#2e2e2e;
border-bottom:1px solid #cccccc;
font-size:1rem;
`
const Button = styled.button`
width: 10.3rem;
height:3rem;
border-radius:0.5rem;
border:none;
background:#8e44ad;
color:white;
box-shadow: 2px 1px 4px #00000029;
font-size:0.85rem;
cursor:pointer;
@media screen and (max-width:600px) {
    width: 7.5rem;
  }
`
const Button2 = styled.button`
width:22rem;
height:3rem;
border-radius:0.5rem;
border:none;
background:#8e44ad;
color:white;
box-shadow: 2px 1px 4px #00000029;
font-size:0.85rem;
cursor:pointer;
@media screen and (max-width:550px) {
    width: 18rem;
  }
  @media screen and (max-width:450px) {
    width: 16rem;
  }
  @media screen and (max-width:350px) {
    width: 14rem;
  }
`
const ButtonContainer = styled.div`
width:22rem;
display:flex;
justify-content:space-between;
@media screen and (max-width:600px) {
    width: 16rem;
  }
`
const DottedLineContainer = styled.div`
border-radius:1rem;
border: 2px dashed #8e44ad;
width:22rem;

margin: 2rem;
align-items:center;
text-align:center;
@media screen and (max-width:600px) {
    width: 16rem;
    
  }
`
const CongText = styled.div`
font-size: 0.8rem; 
color: #5a5a5a;
font-weight: bold;
@media screen and (max-width:400px) {
    font-size: 0.7rem; 
  }
`
const Profile = () => {
    const history = useHistory()
    const [auth, setAuth] = useState(false)
    const [loading, setLoading] = useState(false)
    const [myId, setMyId] = useState('')
    const [myNickName, setMyNickName] = useState('')
    const [myLevel, setMyLevel] = useState(0);
    const [myPk, setMyPk] = useState(0);
    const [myReliability, setMyReliability] = useState(0)
    const [myIcon, setMyIcon] = useState("")
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
            console.log(response)
        }
        
        setLoading(false)
    }

    useEffect(() => {
        isAdmin()
    }, [])
    const onLogout = async () => {
        await axios.post('/api/logout')
        history.push('/profile')
        window.location.reload()
    }
    return (
        <Wrapper >
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
            }}>
                {loading ?
                <>
                <ScaleLoader height="80" width="16" color="#8e44ad" radius="8" />
                </>
                :
                <>
                {auth ?
                    <>
                        
                        <DottedLineContainer style={{border:'none'}}>
                            <div style={{ padding: '1rem 0',display:'flex',justifyContent:'space-around',alignItems:'center' }}>
                                <BiSmile style={{ fontSize: '2rem', color: '#8e44ad' }} />
                                <CongText>
                                    {myIcon &&
                                    <img width={20} src={setIcon(myIcon)} />
                                    }
                                    <img src={setLevel(myReliability)}/>{myNickName}({myId})님, 안녕하세요!</CongText>
                                <BiSmile style={{ fontSize: '2rem', color: '#8e44ad' }}/>
                            </div>
                        </DottedLineContainer>
                            <ThemeList>
                                
                                    <Theme onClick={() => { history.push(`/myprofile/${myPk}`) }}>
                                        <p style={{ paddingLeft: '0.4rem', fontSize: '1rem' }}>내 정보</p>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#9b59b6' }}>자세히보기</div>
                                            <GrNext style={{ height: '0.8rem', color: '#9b59b6' }} />
                                        </div>
                                    </Theme>
                                    <Theme onClick={() => { history.push(`/addauction`) }}>
                                        <p style={{ paddingLeft: '0.4rem', fontSize: '1rem' }}>경매등록</p>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#9b59b6' }}>자세히보기</div>
                                            <GrNext style={{ height: '0.8rem', color: '#9b59b6' }} />
                                        </div>
                                    </Theme>
                                    <Theme onClick={() => { history.push(`/note`) }}>
                                        <p style={{ paddingLeft: '0.4rem', fontSize: '1rem' }}>우편함</p>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#9b59b6' }}>자세히보기</div>
                                            <GrNext style={{ height: '0.8rem', color: '#9b59b6' }} />
                                        </div>
                                    </Theme>
                                    <Theme onClick={() => { history.push(`/favorite`) }}>
                                        <p style={{ paddingLeft: '0.4rem', fontSize: '1rem' }}>즐겨찾기</p>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#9b59b6' }}>자세히보기</div>
                                            <GrNext style={{ height: '0.8rem', color: '#9b59b6' }} />
                                        </div>
                                    </Theme>
                                    {myNickName === "관리자" &&
                                    <Theme onClick={() => { history.push(`/usermanage`) }}>
                                        <p style={{ paddingLeft: '0.4rem', fontSize: '1rem' }}>유저관리</p>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#9b59b6' }}>자세히보기</div>
                                            <GrNext style={{ height: '0.8rem', color: '#9b59b6' }} />
                                        </div>
                                    </Theme>
                                    }
                            </ThemeList>
                        
                        
                        <Button2 onClick={onLogout}>로그아웃</Button2>
                    </>
                    :
                    <>
                        <DottedLineContainer>
                            <div style={{ padding: '3.5rem 0' }}>
                                <MdOutlineAccountBox style={{ fontSize: '5rem', color: '#8e44ad' }} />
                                <div style={{ fontSize: '1rem', color: '#5a5a5a', fontWeight: 'bold' }}>경매 등록 및 구매는<br /> 로그인이 필요합니다.</div>
                            </div>
                        </DottedLineContainer>
                        <ButtonContainer>
                            <Button onClick={() => { history.push('/signup') }}>회원가입</Button>
                            <Button onClick={() => { history.push('/login') }}>로그인</Button>
                        </ButtonContainer>
                    </>
                }
                </>
                }
                
            </ContentsWrapper>
        </Wrapper>
    );
};
export default Profile;