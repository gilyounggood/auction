import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import axios from 'axios';
import { BsArrowClockwise } from 'react-icons/bs'

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
    color: gray;
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

const SignOut = () => {
    const history = useHistory()
    const params = useParams();

    const [pw, setPw] = useState(0)
    const [confirm, setConfirm] = useState('')
    const [userConfirm, setUserConfirm] = useState('')
    const [number, setNumber] = useState(0);
    const [userNumber, setUserNumber] = useState(0)

    async function fetchInfo(){
      const { data: response } = await axios.get('/api/auth')
      if(!response.second || params.pk != response.pk) {
        alert("접근 권한이 없습니다.")
        history.push('/profile')
        return;
      } 
      const message = `사용중인 아이디(${response.id})의 회원탈퇴를 동의합니다`
      setConfirm(message)
    }

    function randomNumber(){
      let number = Math.floor(Math.random() * 1000000)+100000; 
      if(number>1000000){                                      
         number = number - 100000;                            
      }
      setNumber(number);
    }

    useEffect(() => {
      fetchInfo();
      randomNumber();
    }, [])

    const onLogout = async () => {
      await axios.post('/api/logout')
      history.push('/profile')
      window.location.reload()
  }

    const singOut = async () => {
      if(!pw || !userConfirm || !userNumber) {
        alert('모든 정보를 입력해주세요')
        return;
      } else if (confirm !== userConfirm) {
        alert('확인 문구가 일치하지 않습니다.')
      } else if (number != userNumber) {
        alert('자동입력 방지숫자가 일치하지 않습니다.')
      } else {
        const { data: response } = await axios.post('/api/singout', {
          pk: params.pk,
          pw: pw
        })
        if (response.result < 0) {
          alert(response.message)
        } else {
          alert("회원 탈퇴가 완료 되었습니다.")
          onLogout();
        }
      }
    }

    return (
        <Wrapper >
            <ContentsWrapper style={{ borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid #d2d2d2', borderRadius: '0.5rem',padding: '15px'}}>
                <Title>회원 탈퇴</Title>
                <SubTitle style={{ marginBottom:'25px', fontSize: '0.8rem', textAlign: 'center', color: 'red' }}>회월 탈퇴 시 계정 정보는 되돌릴 수 없습니다</SubTitle>
                <SubTitle>비밀번호 입력</SubTitle>
                <Input style={{marginBottom:'15px'}} type='password' placeholder='현재 비밀번호' onChange={e => setPw(e.target.value)} />
                <SubTitle style={{marginBottom: '15px'}}>회원 탈퇴 확인 문구 입력</SubTitle>
                <SubTitle style={{ marginBottom:'15px', fontSize: '0.8rem', color: '#FF0000' }}>아래 문장을 띄어쓰기까지 정확히 따라 입력해주세요</SubTitle>
                <SubTitle style={{ marginBottom:'25px', fontSize: '1rem', color: '#14148C', border: '1px solid gray', padding: '10px' }}>{confirm}</SubTitle>
                <Input style={{marginBottom:'30px'}} type='text' placeholder="확인 문구 입력" onChange={e => setUserConfirm(e.target.value)} />

                <SubTitle style={{ marginBottom:'15px', fontSize: '0.8rem' }}>아래 숫자를 보이는 대로 입력해주세요</SubTitle>
                <div style={{border: '1px solid black', padding: '1.5rem', marginBottom: '15px', color: '#464646', fontSize: '1.8rem'}}>
                  <span style={{}}>{number}</span>
                  <span 
                    style={{ color: '#828282', fontSize: '1rem', fontWeight: 'bold', marginLeft: '10px', cursor: 'pointer' }}
                    onClick={() => {randomNumber()}}
                  ><BsArrowClockwise/>새로고침</span>
                </div>
                <Input style={{marginBottom:'15px'}} type='text' placeholder='자동입력 방지숫자' onChange={e => setUserNumber(e.target.value)}/>

                <Button style={{marginBottom:'2rem'}}
                onClick={() => {
                  if(window.confirm('정말 회원 탈퇴를 하시겠습니까? \n회원 탈퇴 시 계정 정보들은 되돌릴 수 없습니다.')) {
                    singOut()
                  }
                }}>회원 탈퇴</Button>
                <div style={{color: '#5a5a5a', fontSize: '0.9rem'}}>
                  <span style={{cursor: 'pointer'}} onClick={() => history.push(`/myprofile/${params.pk}`)}>내정보</span> |
                  <span style={{marginLeft: '5px', cursor: 'pointer'}} onClick={() => history.push(`/mylog/${params.pk}`)}>이력 관리</span> |
                  <span style={{marginLeft: '5px', cursor: 'pointer'}} onClick={() => history.push(`/changepw/${params.pk}`)}>보안 설정</span>  
                </div>
              </div> 
            </ContentsWrapper>
        </Wrapper>
    );
};
export default SignOut;