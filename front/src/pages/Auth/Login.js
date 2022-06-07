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
color:#9b59b6;
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
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`,minHeight:'28rem'
            }}>
                
                <Title>Login</Title>
                <SubTitle>ID</SubTitle>
                <Input placeholder='아이디를 입력해주세요.' type='text' onChange={onChangeId} />
                <SubTitle>Password</SubTitle>
                <Input style={{marginBottom:'2.5rem'}} placeholder='비밀번호를 입력해주세요.' type='password' onChange={onChangePw} />
                
                <Button style={{marginBottom:'2rem'}} onClick={onLogin}>로그인</Button>
                
                
                
            </ContentsWrapper>
        </Wrapper>
    );
};
export default Login;