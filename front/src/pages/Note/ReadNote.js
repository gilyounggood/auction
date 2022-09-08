import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import axios from 'axios';
import Title from '../../components/elements/Title';
import Container from '../../components/elements/Container';
import Content from '../../components/elements/Content';
import SubTitle from '../../components/elements/SubTitle';

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

const ReadNote = () => {
    const history = useHistory()
    const params = useParams();
    const location = useLocation();

    const [noteInfo, setNoteInfo] = useState({})
    const [myPk, setMyPk] = useState(0)
    const isAdmin = async () => {
        const { data: response0 } = await axios.get('/api/auth')
            if(!response0.pk){
            alert("접근 권한이 없습니다.")
            history.push('/')
        }
        setMyPk(response0.pk)

        const { data: response2 } = await axios.post('/api/readnote', {pk: location.pk})
        setNoteInfo(response2.data)
    }
    useEffect(() => {
        isAdmin()
    }, [])

    return (
        <Wrapper >
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`
            }}>
                
                <Title>쪽지 보기</Title>
                
                <Container style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Content>
                        <SubTitle>제목</SubTitle>
                    </Content>
                    <Content>
                        <Input 
                            style={{background: 'white', textAlign: 'center'}}
                            disabled={true} 
                            value={noteInfo.title}
                            type={'text'}
                        />
                    </Content>
                    <Content>
                        <SubTitle>{params.pk == 1 ? '보낸유저' : '받은유저'}</SubTitle>
                    </Content>
                    <Content>
                        <Input 
                            style={{ background: 'white', textAlign: 'center', fontWeight: 'bold' }}
                            disabled={true}
                            value={params.pk == 1 ? noteInfo.send_user : noteInfo.receive_user}
                            type={'text'} 
                        />
                    </Content>
                    <Content>
                        <SubTitle>내용</SubTitle>
                    </Content>
                    <Content>
                        <Textarea 
                            style={{ background: 'white', textAlign: 'center', fontWeight: 'bold' }}
                            disabled={true}
                            value={noteInfo.content}
                            type={'text'} 
                        />
                    </Content>
                </Container>
            </ContentsWrapper>
        </Wrapper>
    );
};
export default ReadNote;