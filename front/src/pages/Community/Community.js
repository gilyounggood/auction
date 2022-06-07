import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components'
import Wrapper from '../../components/elements/Wrapper';
import '../../styles/style.css'
import Title from '../../components/elements/Title';
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import Container from '../../components/elements/Container';
import Content from '../../components/elements/Content';
import SubTitle from '../../components/elements/SubTitle';
import Textarea from '../../components/elements/Textarea';
import ContentsWrapper from '../../components/elements/ContentWrapper';
const Community = () => {
  const params = useParams()
  const [data, setData] = useState({})
  useEffect(()=>{
    async function fetchPosts(){
      const {data:response} = await axios.post('/api/community',{pk:params.pk})
      setData(response.data)
    }
    fetchPosts()
  },[])
  return (
    <Wrapper>
      
      <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`
            }}>
                
                <Title>{params.pk==1?'공지사항':'자유게시판'}</Title>
                
                <Container>
                <Content>
                        <SubTitle>작성자</SubTitle>
                    </Content>
                    <Content>
                      <Input type={'text'} disabled={true} defaultValue={data?.user_nickname} />
                    </Content>
                    <Content>
                        <SubTitle>제목</SubTitle>
                    </Content>
                    <Content>
                      <Input type={'text'} disabled={true} defaultValue={data?.title} />
                    </Content>
                    <Content>
                        <SubTitle>설명</SubTitle>
                    </Content>
                    <Content>
                        <Textarea disabled={true}  defaultValue={data?.content}/>
                    </Content>
                </Container>
                
            </ContentsWrapper>

    </Wrapper>
  );
};
export default Community;