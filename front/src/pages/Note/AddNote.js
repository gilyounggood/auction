import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import axios from 'axios';
import Title from '../../components/elements/Title';
import Button from '../../components/elements/Button';
import Container from '../../components/elements/Container';
import Content from '../../components/elements/Content';
import SubTitle from '../../components/elements/SubTitle';
import CenterButtonContainer from '../../components/elements/CenterButtonContainer';

const Input = styled.input`
    outline: 1px solid #c4c4c4;
    font-size:1rem;
    border:none;
    margin-left:0.3rem;
    width:39.2rem;
    height: 2rem;
    padding-bottom:0.2rem;
    ::placeholder {
        color: #cccccc;
    }
    @media screen and (max-width: 790px) {
        width: 285px;
    }
    &:focus {
        outline: 1px solid #0078FF;
        box-shadow: 0px 0px 2px black;
    }
`

const Textarea = styled.textarea`
outline: 1px solid #c4c4c4;
font-size:1rem;
border:none;
margin-left:0.3rem;
width:39.2rem;
height: 12rem;
padding-bottom:0.2rem;
::placeholder {
    color: #c4c4c4;
}
@media screen and (max-width: 790px) {
    width: 285px;
}
&:focus {
    outline: 1px solid #0078FF;
    box-shadow: 0px 0px 2px black;
}
`

const AddNote = () => {
    const history = useHistory()

    const [title, setTitle] = useState('')
    const [note, setNote] = useState('')
    const [receiveUser, setReceiveUser] = useState('')
    const [myPk, setMyPk] = useState(0)
    const [myNickname, setMyNickname] = useState('')
    const isAdmin = async () => {
        const { data: response0 } = await axios.get('/api/auth')
            if(!response0.pk){
            alert("접근 권한이 없습니다.")
            history.push('/')
        }
        setMyPk(response0.pk)
        setMyNickname(response0.nick_name)
    }
    useEffect(() => {
        isAdmin()
    }, [])
    const onChangeTitle= (e) =>{
        setTitle(e.target.value)
    }
    const onChangeNote = (e) =>{
        setNote(e.target.value)
    }
    const onChangeReceiveUser = (e) =>{
        setReceiveUser(e.target.value)
    }
    const upLoad = async () =>{
        if(title==="" || note==="" || receiveUser==="") {
            alert("빈 칸 없이 모두 작성해주세요.")
        } else {
            const {data:response} = await axios.post('/api/addnote', {
                send_user: myNickname,
                receive_user: receiveUser,
                title: title,
                content: note,
            })
            if(response.result<0){
                alert(response.message)
            }
            else{
                alert('쪽지를 성공적으로 보냈습니다')
                history.goBack()
            }
        }
    }

    return (
        <Wrapper >
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`
            }}>
                
                <Title>쪽지 보내기</Title>
                
                <Container style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Content>
                        <SubTitle>제목</SubTitle>
                    </Content>
                    <Content>
                        <Input 
                            type={'text'} 
                            onChange={onChangeTitle} 
                            placeholder="최대 20자"
                        />
                    </Content>
                    <Content>
                        <SubTitle>닉네임</SubTitle>
                    </Content>
                    <Content>
                        <Input 
                            type={'text'} 
                            onChange={onChangeReceiveUser} 
                        />
                    </Content>
                    <Content>
                        <SubTitle>내용</SubTitle>
                    </Content>
                    <Content>
                        <Textarea onChange={onChangeNote} placeholder='최대 150자' />
                    </Content>
                <CenterButtonContainer>
                <Button style={{width: '8rem', height: '2.5rem', background: '#CD2E57'}} onClick={()=>{history.goBack()}}>
                        취소
                    </Button>
                    <Button style={{width: '8rem', height: '2.5rem', background: '#228B22'}} onClick={upLoad}>
                        보내기
                    </Button>
                </CenterButtonContainer>
                </Container>
            </ContentsWrapper>
        </Wrapper>
    );
};
export default AddNote;