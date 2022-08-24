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
  &:focus {
    border: 1px solid #0078FF;
}
`
const Input2 = styled.input`
    outline: 1px solid black;
    font-size:1rem;
    border:none;
    margin-right:0.3rem;
    width:15rem;
    height: 2rem;
    ::placeholder {
        color: #cccccc;
    }
    @media screen and (max-width: 790px) {
        width: 150px;
        font-size:0.8rem;
    }
    &:focus {
        outline: 1px solid #0078FF;
        box-shadow: 0px 0px 2px black;
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
    const [name, setName] = useState('')
    const [nickName, setNickName] = useState('')
    const [email, setEmail] = useState('')
    const [pwCheck, setPwCheck] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [check, setCheck] = useState(true)
    const [number, setNumber] = useState(0);  
    const [userNumber, setUserNumber] = useState(0);  
    const [input, setInput] = useState(false)
    const [isEmail, setIsEmail] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!id || !pw || !nickName || !phoneNumber || !isEmail || !name) {
          alert("빈 칸 없이 모두 작성해주세요.");
          
        }
        else if(!check){
          alert("비밀번호가 일치하지 않습니다.")
        }
        else {
                const { data: response } = await axios.post('/api/signup', {
                    id: id,
                    pw: pw,
                    user_name: name,
                    nickName: nickName,
                    phoneNumber: phoneNumber,
                    userLevel:0,
                    userPoint:0,
                    user_email: email
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

    const checkEmail = async () => {
      if(isEmail) {
        alert("이메일 인증이 완료되었습니다")
        return;
      }
      if(input) {
        setInput(false)
        setIsEmail(false)
        return;
      }
      var pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@naver.com$/
      if (pattern.test(email)===false) {
        alert("네이버 메일주소(naver.com)만 허용됩니다.")
        return;
      }
      const { data: response } = await axios.post('/api/checkemail', {user_email: email})
      if (response.data === 300) {
        alert("중복되는 이메일 입니다.")
      } else {
        alert("작성하신 이메일로 인증번호가 발송되었습니다.")
        setInput(true)
        setNumber(response.data)
      }
    }

    const checkNumber = () => {
      if(number != userNumber) {
       alert("인증 번호가 일치하지 않습니다")
      } else {
        alert("이메일 인증이 완료되었습니다.")
        setIsEmail(true);
        setInput(false)
      }
    }

    return (
        <Wrapper style={{paddingBottom: '0.1rem'}}>
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`,minHeight:'28rem'
            }}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid #d2d2d2', borderRadius: '0.5rem',padding: '15px'}}>
                <Title>Sign Up</Title>
                <SubTitle>아이디</SubTitle>
                <Input placeholder='아이디를 입력해주세요.' type='text' onChange={onChangeId} />
                <SubTitle>이름</SubTitle>
                <Input placeholder='계정 정보 찾기에 사용됩니다.' type='text' onChange={e => setName(e.target.value)} />
                <SubTitle>닉네임</SubTitle>
                <Input placeholder='닉네임을 입력해주세요.'type='text' onChange={onChangeNickName} />
                <SubTitle>이메일</SubTitle>
                <Input placeholder='네이버 메일주소만 이용 가능합니다.'type='text' onChange={e => setEmail(e.target.value)} disabled= {isEmail? true : false} style={{background: isEmail ? '#dcdcdc' : "white"}} />
                  <div style={{marginBottom: '10px'}}>
                    {input &&
                    <>
                      <Input2 placeholder='인증번호 6자리 입력.'type='text' onChange={e => setUserNumber(e.target.value)} />
                      <Button style={{width: '2.7rem', height: '2rem', background: '#2C952C', marginRight: '5px'}} onClick={checkNumber}>인증</Button>
                    </>
                    }
                    <Button style={{width: input ? '2.7rem' : '6rem', height: input? '2rem' : '2.5rem', background: input? '#EB3232' : '#3c8dbc'}} onClick={checkEmail}>{input ? '취소' : '이메일 인증'}</Button>
                  </div>
                <SubTitle>비밀번호</SubTitle>
                <Input placeholder='비밀번호를 입력해주세요.' type='password' onChange={onChangePw} />
                <SubTitle>비밀번호 확인</SubTitle>
                <Input style={{marginBottom:'0.2rem'}} placeholder='비밀번호를 한번 더 입력해주세요.' type='password' onChange={onChangePwCheck} />
                <Check>{check ? '' : '비밀번호가 일치하지 않습니다.'}</Check>
                <SubTitle>핸드폰 번호</SubTitle>
                <Input style={{marginBottom:'2rem'}} placeholder='010-XXXX-XXXX' type='text' onChange={onChangePhoneNumber} />
                <Button style={{marginBottom:'2rem'}} onClick={handleSubmit}>회원가입</Button>
                <div style={{color: '#5a5a5a', fontSize: '0.9rem'}}>
                  <span style={{cursor: 'pointer'}} onClick={() => history.push('/findpw')}>비밀번호 찾기</span> |
                  <span style={{marginLeft: '5px', cursor: 'pointer'}} onClick={() => history.push('/findid')}>아이디 찾기</span> |
                  <span style={{marginLeft: '5px', cursor: 'pointer'}} onClick={() => history.push('/login')}>로그인</span>  
                </div>
              </div>
            </ContentsWrapper>
        </Wrapper>
    );
};
export default SignUp;