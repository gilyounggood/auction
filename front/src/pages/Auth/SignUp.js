import React from 'react'
import styled from 'styled-components'
import {  useState } from 'react';
import { useHistory} from 'react-router-dom';
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
const Check = styled.div`
width:21.5rem;
text-align:left;
color:red;
font-size:0.6rem;
height:0.6rem;
margin-bottom:0.2rem;
@media screen and (max-width:600px) {
    width: 15.5rem;
  }
`
const SignUp = () => {
    const history = useHistory()
    const [id, setId] = useState('')
    const [pw, setPw] = useState('')
    const [nickName, setNickName] = useState('')
    const [pwCheck, setPwCheck] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [chack, setCheck] = useState(true)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!id || !pw || !nickName || !phoneNumber) {
          alert("필요값이 비어있습니다.");
          
        }
        else if(!chack){
          alert("비밀번호가 일치하지 않습니다.")
        }
        else {
            
                const { data: response } = await axios.post('/api/signup', {
                    id: id,
                    pw: pw,
                    nickName: nickName,
                    phoneNumber: phoneNumber,
                    userLevel:0,
                    userPoint:0,
                  })
                  if (response.result < 0) {
                    alert(response.message)
                   
                  }
                  else if (response.result > 0) {
                    alert('회원가입이 완료 되었습니다.')
                    history.push('/profile')
                  }
            
        }
      }
    const onChangeId = (e) =>{
        setId(e.target.value)
    }
    const onChangeNickName = (e) =>{
        setNickName(e.target.value)
    }
    const onChangePw = (e) =>{
        setPw(e.target.value)
        if(e.target.value != pwCheck){
            setCheck(false)
        }
        else{
            setCheck(true)
        }
    }
    const onChangePwCheck = (e) =>{
        setPwCheck(e.target.value)
        if(e.target.value != pw){
            setCheck(false)
        }
        else{
            setCheck(true)
        }
    }
    const onChangePhoneNumber = (e) =>{
        setPhoneNumber(e.target.value)
    }
    return (
        <Wrapper style={{paddingBottom: '0.1rem'}}>
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`,minHeight:'28rem'
            }}>
                
                <Title>Sign Up</Title>
                <SubTitle>ID</SubTitle>
                <Input placeholder='아이디를 입력해주세요.' type='text' onChange={onChangeId} />
                <SubTitle>Nick Name</SubTitle>
                <Input placeholder='닉네임을 입력해주세요.'type='text' onChange={onChangeNickName} />
                <SubTitle>Password</SubTitle>
                <Input placeholder='비밀번호를 입력해주세요.' type='password' onChange={onChangePw} />
                <SubTitle>Password Check</SubTitle>
                <Input style={{marginBottom:'0.2rem'}} placeholder='비밀번호를 한번 더 입력해주세요.' type='password' onChange={onChangePwCheck} />
                <Check>{chack ? '' : '비밀번호가 일치하지 않습니다.'}</Check>
                <SubTitle>Phone Number</SubTitle>
                <Input style={{marginBottom:'2rem'}} placeholder='010-XXXX-XXXX' type='text' onChange={onChangePhoneNumber} />
                <Button style={{marginBottom:'2rem'}} onClick={handleSubmit}>회원가입</Button>
                
                
                
            </ContentsWrapper>
        </Wrapper>
    );
};
export default SignUp;