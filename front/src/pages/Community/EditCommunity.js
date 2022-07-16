import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import axios from 'axios';
import Title from '../../components/elements/Title';
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import Container from '../../components/elements/Container';
import Content from '../../components/elements/Content';
import SubTitle from '../../components/elements/SubTitle';
import RightButtonContainer from '../../components/elements/RightButtonContainer';
import Textarea from '../../components/elements/Textarea';
import CenterButtonContainer from '../../components/elements/CenterButtonContainer';
const EditCommunity = () => {
    //----------------------------------------공통
    const history = useHistory()
    const params = useParams()

    const [loading, setLoading] = useState(false)
    const [myPk, setMyPk] = useState(0)
    const [myNickname, setMyNickname] = useState('')
    const [community, setCommunity] = useState({
        title: "",
        content: "",
    });

    const { title, content } = community

    const isAdmin = async () => {
        setLoading(true)
        const { data: response0 } = await axios.get('/api/auth')
            if(!response0.pk){
            alert("로그인 후 이용해 주세요.")
            history.push('/')
        }
        setMyPk(response0.pk)
        setMyNickname(response0.nick_name)
        setLoading(false)
        const { data: response } = await axios.post('/api/community', {pk: params.pk})
        setCommunity(response.data)
    }
    useEffect(() => {
        isAdmin()
    }, [])

    const onChangeCommunity= (e) =>{
        setCommunity({...community, [e.target.name]: e.target.value})
    }

    const Edit = async (e) =>{
        if(title==="" || content==="") {
            alert("제목과 내용을 작성해주세요.")
        } else {
            const {data:response} = await axios.post('/api/editcommunity',{
                pk:params.pk,
                title: title,
                content: content,
                userPk:myPk,
                nickname:myNickname
            })
            if(response.result<0){
                alert(response.message)
            }
            else{
                alert('게시글이 수정되었습니다')
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
                
                <Title>게시판 수정</Title>
                
                <Container>
                    <Content>
                        <SubTitle>제목</SubTitle>
                    </Content>
                    <Content>
                        <Input type={'text'} value={title} name="title" onChange={e => onChangeCommunity(e)} />
                    </Content>
                    <Content>
                        <SubTitle>설명</SubTitle>
                    </Content>
                    <Content>
                        <Textarea value={content} name="content" onChange={e => onChangeCommunity(e)} />
                    </Content>
                </Container>
                <CenterButtonContainer>
                <Button onClick={()=>{history.goBack()}}>
                        뒤로가기
                    </Button>
                    <Button onClick={Edit}>
                        수정
                    </Button>
                </CenterButtonContainer>
            </ContentsWrapper>
        </Wrapper>
    );
};
export default EditCommunity;