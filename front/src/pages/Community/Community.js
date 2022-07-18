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
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import $ from 'jquery'

const CommentName = styled.div`
  color: #0A6EFF;
  font-size: 0.9rem;
  margin-left: 6px;
}
`

const CommentTime = styled.span`
  margin-left: 3px;
  color: gray;
  font-size: 0.8rem;
`

const CommentContent = styled.div`
  color: black;
  font-size: 0.9rem;
  margin-left: 6px;
  padding-top: 5px;
  padding-bottom: 25px;
  &: last-child {
    padding-bottom: 10px;
  }
`

const Community = () => {
  const params = useParams()
  const [myPk, setMyPk] = useState(0);
  const [myNickName, setMyNickName] = useState("")
  const [data, setData] = useState({})
  const [comment, setComment] = useState("")
  const [commentList, setCommentList] = useState([])
  const [input, setInput] = useState(0)
  const [commentContent, setCommentContent] = useState({
    comment_content: ""
  })

  const {comment_content} = commentContent

  async function fetchPosts(){
    const {data: response0} = await axios.get('/api/auth')
    setMyPk(response0.pk)
    setMyNickName(response0.nick_name)

    const {data:response} = await axios.post('/api/community',{pk:params.pk})
    setData(response.data)

    const {data: response2} = await axios.post('/api/comment', {pk:params.pk})
    setCommentList(response2.data)
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
      $('#comment').val("");
      if(response.result<0) {
        alert(response.message)
      } else {
        const {data:response2} = await axios.post('/api/comment', {pk: params.pk})
        setCommentList(response2.data)
        alert("댓글을 등록했습니다.")
      }
    }
  }

  const deleteComment = async (pk) => {
    const {data: response0} = await axios.post('/api/deletecomment', {pk: pk})
    if(response0.result>0) {
      alert("댓글이 삭제되었습니다.")
    }
    const {data:response} = await axios.post('/api/comment', {pk: params.pk})
    if(response.result>0) {
      setCommentList(response.data)
    }
  }

  const handleClick = async (pk) => {
    const {data: response} = await axios.post('/api/commentinfo', {pk: pk})
    setCommentContent(response.data)
    setInput(pk)
  }

  const handleChange = (e) => {
    setCommentContent({...comment_content, [e.target.name]: e.target.value})
  }

  const editComment = async (pk) => {
    const {data:response0} = await axios.put('/api/commentedit', {
      pk: pk,
      comment_content: comment_content
    })
    if(response0.result>0) {
      const {data:response} = await axios.post('/api/comment', {pk: params.pk})
      if(response.result>0) {
        setCommentList(response.data)
      }
      alert("댓글 수정이 되었습니다.")
      setInput(0)
    } else {
      alert("서버 에러 발생")
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
                      <Input type={'text'} disabled={true} defaultValue={data?.user_nickname} style={{backgroundColor: 'white'}}/>
                    </Content>
                    <Content>
                        <SubTitle>제목</SubTitle>
                    </Content>
                    <Content>
                      <Input type={'text'} disabled={true} defaultValue={data?.title} style={{backgroundColor: 'white'}}/>
                    </Content>
                    <Content>
                        <SubTitle>설명</SubTitle>
                    </Content>
                    <Content>
                        <Textarea disabled={true}  defaultValue={data?.content} style={{backgroundColor: 'white'}}/>
                    </Content>
                    <Content>
                        <SubTitle>댓글 목록</SubTitle>
                    </Content>
                    <Content style={{flexDirection: "column"}}>
                        {commentList.map(comment => {
                          return( 
                            <React.Fragment key={comment.pk}>
                              <CommentName>{comment.comment_user_nickname}<CommentTime>({comment.create_time})</CommentTime></CommentName>
                              <CommentContent>
                                {input === comment.pk ?
                                  <Content>
                                    <Textarea 
                                      id="comment"
                                      name= "comment_content"
                                      style={{height: "3rem", border: "1px solid gray", margin: '0'}}
                                      value={comment_content}
                                      onChange={e => handleChange(e)}
                                    />
                                    <Button onClick={()=> {editComment(comment.pk)}} style={{width: "5.5rem", height: "3.5rem", marginLeft: "1px"}} >수정</Button>
                                    <Button onClick={()=> {setInput(0)}} style={{width: "5.5rem", height: "3.5rem", marginLeft: "1px"}} >취소</Button>
                                  </Content> 
                                : comment.comment_content
                                }
                                {comment.comment_user_nickname === myNickName && input !== comment.pk &&
                                  <>
                                    <AiFillEdit
                                      style={{color: '#0A82FF',marginLeft: '50px', cursor: 'pointer'}}
                                      onClick={()=> {handleClick(comment.pk)}}
                                    />
                                    <AiFillDelete 
                                      style={{color: 'red', marginLeft: '5px', cursor: 'pointer'}}
                                      onClick={() => { 
                                          if(window.confirm('댓글을 삭제하시겠습니까?')) {
                                          deleteComment(comment.pk)
                                        }
                                      }}
                                    />
                                  </>
                                }
                              </CommentContent>

                            </React.Fragment>
                          )
                        })}
                    </Content>
                    <Content>
                        <Textarea 
                          id="comment"
                          style={{height: "3rem", border: "1px solid gray"}}
                          placeholder="댓글 작성하기"
                          onChange={e => setComment(e.target.value)}
                        />
                        <Button onClick={addComment} style={{width: "6.5rem", height: "3.5rem", marginLeft: "1px"}} >댓글 등록</Button>
                    </Content>
                </Container>

            </ContentsWrapper>

    </Wrapper>
  );
};
export default Community;