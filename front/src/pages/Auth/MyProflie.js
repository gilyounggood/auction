import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import axios from 'axios';
import setLevel from '../../data/Level';
import { setIcon } from '../../data/Icon';

const Input = styled.input`
width:20.5rem;
padding:0.75rem;
border-radius:0.5rem;
font-size:1rem;
outline:none;
border:none;
border:1px solid #8e44ad;
color:#2e2e2e;
margin-bottom:1rem;
@media screen and (max-width:600px) {
    width: 14.5rem;
    font-size:0.8rem;
  }
  ::placeholder {
    color: #cccccc;
  }
  &:focus {
    border: 1px solid #0078FF;
}
`
const Button = styled.button`
width:22rem;
height:3rem;
border-radius:0.5rem;
border:none;
background:#8e44ad;
color:white;
box-shadow: 2px 1px 4px #00000029;
font-size:0.85rem;
cursor:pointer;
@media screen and (max-width:600px) {
    width: 16rem;
  }
`
const Title = styled.h3`
font-size:2.5rem;
color:#8e44ad;
font-weight:bold;
`
const SubTitle = styled.div`
width:21.5rem;
text-align:left;
color:black;
font-weight:bold;
font-size:1rem;
margin-bottom:0.5rem;
@media screen and (max-width:600px) {
    width: 15.5rem;
  }
`

const MyProfile = () => {
    const history = useHistory()
    const params = useParams();
    const [userInfo, setUserInfo] = useState({
      id: '',
      user_email: '',
      nick_name: '',
      reliability: 0,
      user_use_icon: '',
      user_name: '',
      user_point: 0,
      phone_number: 0,
    })

    const { id, user_email, nick_name, reliability, user_use_icon, user_name, user_point, phone_number } = userInfo;

    async function fetchInfo(){
      const { data: response } = await axios.get('/api/auth')
      if(!response.second) {
        history.push('/profile')
      } else {
        const { data: response2 } = await axios.post('/api/userinfo/user', {pk: params.pk})
        setUserInfo(response2.data)
      }
    }

    useEffect(() => {
      fetchInfo();
    }, [])

    function changeUserInfo(e){
      setUserInfo({...userInfo, [e.target.name]: e.target.value})
    }

    const changeInfo = async () => {
      if(!user_name || !phone_number) {
        alert("모든 정보를 입력해주세요.")
        return;
      } else {
        const {data: response} = await axios.post('/api/useredit', {
          pk: params.pk,
          user_name: user_name,
          phone_number: phone_number
        })
        if (response.result > 0) {
          alert("유저 정보가 변경되었습니다")
          const {data: response2} = await axios.post('/api/userinfo/user', {pk: params.pk})
          setUserInfo(response2.data)
      } else {
          alert('서버 에러 발생')
      }
      }
    }

    return (
        <Wrapper >
            <ContentsWrapper style={{ borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid #d2d2d2', borderRadius: '0.5rem',padding: '15px'}}>
                <Title>내정보</Title>
                <SubTitle style={{marginBottom: '15px'}}>아이디: {id}</SubTitle>
                <SubTitle style={{marginBottom: '15px'}}>이메일 주소: {user_email}</SubTitle>
                <SubTitle style={{marginBottom: '15px'}}>닉네임: {nick_name}</SubTitle>
                <SubTitle style={{marginBottom: '15px'}}>포인트: {user_point}</SubTitle>
                <SubTitle style={{marginBottom: '15px'}}>레벨: <img src={setLevel(reliability)}/></SubTitle>
                <SubTitle style={{marginBottom: '15px'}}>사용중인 아이콘: {user_use_icon ? <img width={15} src={setIcon(user_use_icon)}/> : '없음'}</SubTitle>
                <SubTitle>이름</SubTitle>
                <Input style={{marginBottom:'15px'}} type='text' value={user_name} name='user_name' onChange={e => changeUserInfo(e)} />
                <SubTitle>전화번호</SubTitle>
                <Input style={{marginBottom:'2.5rem'}} type='text' value={phone_number} name='phone_number' onChange={e => changeUserInfo(e)} />
                <Button style={{marginBottom:'2rem'}} 
                onClick={() => {
                  if(window.confirm("계정 정보를 변경 하시겠습니까?")) {
                    changeInfo()
                  }
                }}>정보 변경</Button>
                <div style={{color: '#5a5a5a', fontSize: '0.9rem'}}>
                  <span style={{cursor: 'pointer'}} onClick={() => history.push('/findid')}>보안 설정</span> |
                  <span style={{marginLeft: '5px', cursor: 'pointer'}} onClick={() => history.push('/login')}>이력 관리</span> |
                  <span style={{marginLeft: '5px', cursor: 'pointer'}} onClick={() => history.push('/signup')}>회원 탈퇴</span>  
                </div>
              </div> 
            </ContentsWrapper>
        </Wrapper>
    );
};
export default MyProfile;