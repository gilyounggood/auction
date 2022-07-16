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
import { IoCompassOutline } from 'react-icons/io5';
const Community = () => {
  const params = useParams()
  const [myPk, setMyPk] = useState(0);
  const [myNickName, setMyNickName] = useState("")
  const [data, setData] = useState({})
  const [comment, setComment] = useState("")

  async function fetchPosts(){
    const {data: response0} = await axios.get('/api/auth')
    setMyPk(response0.pk)
    setMyNickName(response0.nick_name)

    const {data:response} = await axios.post('/api/community',{pk:params.pk})
    setData(response.data)
  }

  useEffect(()=>{
    fetchPosts()
  },[])

  const addComment = async () => { 
    if(comment==="") {
      alert("댓글 내용을 입력해주세요.")
    } else {
      const {data:response} = await axios.post('/api/addcomment', {
        pk: params.pk,
        user_pk: myPk,
        user_nickname: myNickName,
        comment_content: comment,
      })
      if(response.result<0) {
        alert(response.message)
      } else {
        alert("댓글이 등록되었습니다.")
        window.location.reload()
      }
    }
  }

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
                    <Content>
                        <SubTitle>댓글 목록</SubTitle>
                    </Content>
                    <Content>
                        <SubTitle>댓글 작성하기</SubTitle>
                    </Content>
                    <Content>
                        <Textarea 
                          style={{height: "3rem", border: "1px solid gray"}}
                          placeholder="댓글 작성하기"
                          onChange={e => setComment(e.target.value)}
                        />
                        <Button onClick={addComment} style={{width: "6.5rem", height: "3.5rem"}} >댓글 등록</Button>
                    </Content>
                </Container>

            </ContentsWrapper>

    </Wrapper>
  );
};
export default Community;