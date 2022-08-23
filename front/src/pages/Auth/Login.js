import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import {  useHistory } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import axios from 'axios';

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

const Login = () => {
    const history = useHistory()
    const [id, setId] = useState('')
    const [pw, setPw] = useState('')

    const isAdmin = async () => {
     
      const { data: response } = await axios.get('/api/auth')
      if (response.pk) {
        history.push('/profile')
      }
     
  }

  useEffect(() => {
      isAdmin()
  }, [])
    const onLogin = async (e) => {
      e.preventDefault()
      const { data: response } = await axios.post('/api/login', {
          id: id,
          pw: pw
      })
      if(response.result<0){
        alert(response.message)
      }
      else{
        alert(response.message)
        history.push('/profile')
        window.location.reload()
      }
  };
    const onChangeId = (e) =>{
        setId(e.target.value)
    }
    
    const onChangePw = (e) =>{
        setPw(e.target.value)
       
    }
   
    return (
        <Wrapper >
            <ContentsWrapper style={{ borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid #d2d2d2', borderRadius: '0.5rem',padding: '15px'}}>
                <Title>Login</Title>
                <SubTitle>아이디</SubTitle>
                <Input placeholder='아이디를 입력해주세요.' type='text' onChange={onChangeId} />
                <SubTitle>비밀번호</SubTitle>
                <Input style={{marginBottom:'2.5rem'}} placeholder='비밀번호를 입력해주세요.' type='password' onChange={onChangePw} />
                <Button style={{marginBottom:'2rem'}} onClick={onLogin}>로그인</Button>
                <div style={{color: '#5a5a5a', fontSize: '0.9rem'}}>
                  <span style={{cursor: 'pointer'}} onClick={() => history.push('/findpw')}>비밀번호 찾기</span> |
                  <span style={{marginLeft: '5px', cursor: 'pointer'}} onClick={() => history.push('/findid')}>아이디 찾기</span> |
                  <span style={{marginLeft: '5px', cursor: 'pointer'}} onClick={() => history.push('/signup')}>회원가입</span>  
                </div>
              </div> 
            </ContentsWrapper> 
        </Wrapper>
    );
};
export default Login;