import React from 'react'
import styled from 'styled-components'
import { useState } from 'react';
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

const FindPw = () => {
    const history = useHistory()
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isId, setIsId] = useState(false)

    const checkId= async () => {
      if(!name || !email || !id) {
        alert("모든 정보를 입력해주세요.")
        return;
      }
      const { data: response } = await axios.post('/api/findpw', {
        id: id,
        user_name: name,
        user_email: email
      })
      if (response.data===300) {
        alert("등록된 계정 정보가 없습니다.")
      } else {
        setIsId(true)
      }
    }

    return (
        <Wrapper >
            <ContentsWrapper style={{ borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid #d2d2d2', borderRadius: '0.5rem',padding: '15px'}}>
                <Title>비밀번호 찾기</Title>
                <SubTitle>아이디</SubTitle>
                <Input placeholder='아이디를 입력해주세요.' type='text' onChange={e => setId(e.target.value)} />
                <SubTitle>이름</SubTitle>
                <Input placeholder='이름을 입력해주세요.' type='text' onChange={e => setName(e.target.value)} />
                <SubTitle>이메일 주소</SubTitle>
                <Input style={{marginBottom:'2.5rem'}} placeholder='이메일 주소를 입력해주세요.' type='text' onChange={e => setEmail(e.target.value)} />
                {isId &&
                <div style={{marginBottom: '30px'}}>
                  <SubTitle>
                    입력하신 계정 정보의 임시 비밀번호 6자리가 <span style={{color: '#CD0000'}}>"{email}"</span>로 전송되었습니다.<br/>
                    내정보에서 반드시 비밀번호를 변경해주세요.
                  </SubTitle> 
                  <Button style={{width: '2.7rem', height: '2rem', background: '#2C952C'}} onClick={() => setIsId(false)}>확인</Button>
                </div>
                }
                <Button style={{marginBottom:'2rem'}} 
                onClick={() => {
                  if(window.confirm("입력하신 계정 정보의 비밀번호를 임시 변경 하시겠습니까?")) {
                    checkId()
                  }
                }}>비밀번호 초기화</Button>
                <div style={{color: '#5a5a5a', fontSize: '0.9rem'}}>
                  <span style={{cursor: 'pointer'}} onClick={() => history.push('/findid')}>아이디 찾기</span> |
                  <span style={{marginLeft: '5px', cursor: 'pointer'}} onClick={() => history.push('/login')}>로그인</span> |
                  <span style={{marginLeft: '5px', cursor: 'pointer'}} onClick={() => history.push('/signup')}>회원가입</span>  
                </div>
              </div> 
            </ContentsWrapper>
        </Wrapper>
    );
};
export default FindPw;