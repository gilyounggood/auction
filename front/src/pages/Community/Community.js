import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components'
import Wrapper from '../../components/elements/Wrapper';
import '../../styles/style.css'
import Title from '../../components/elements/Title';
import Button from '../../components/elements/Button';
import Container from '../../components/elements/Container';
import Content from '../../components/elements/Content';
import SubTitle from '../../components/elements/SubTitle';
import Textarea from '../../components/elements/Textarea';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import setLevel from '../../data/Level';
import ReactHtmlParser from 'html-react-parser'
import { setIcon } from '../../data/Icon';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { BsArrowReturnRight } from 'react-icons/bs'
import { IoChatbubbleEllipses } from 'react-icons/io5'
import { GoThumbsup } from 'react-icons/go'
import { GoThumbsdown } from 'react-icons/go'
import $ from 'jquery'

const PostInfo = styled.div`
  font-size: 1.05rem;
  margin-left:0.3rem;
  width:30rem;
  padding: 10px;
  @media screen and (max-width: 500px) {
    width: 20rem;
  }
`

const CommentName = styled.div`
  font-weight: bold;
  color: #0A6EFF;
  font-size: 1.0rem;
  margin-left: 6px;

`

const CommentTime = styled.span`
  font-weight: normal;
  margin-left: 3px;
  color: gray;
  font-size: 0.8rem;
`

const CommentContent = styled.div`
  color: black;
  font-size: 1.0rem;
  margin-left: 10px;
  padding-top: 15px;
  &: last-child {
    padding-bottom: 10px;
  }
`

const Reply = styled.div`
  display: block;
  color: gray;
  cursor: pointer;
  float: right;
  padding-bottom: 3px;
  &:hover{
    color: black;
  }
`

const ReplyWrapper = styled.div`
  display: block;
  width: 100%;
  background-color: #f3f3f3;
  min-height: 60px;
`

const ButtonOutLine = styled.button`
  width: 5.5rem;
  height: 3.5rem;
  background: white;
  font-size: 1.3rem; 
  border: 1px solid #969696;
  border-radius: 5px;
  cursor: pointer;
`

const Community = () => {
  const params = useParams()
  const [auth, setAuth] = useState(false)
  const [myPk, setMyPk] = useState(0);
  const [myNickName, setMyNickName] = useState("")
  const [myReliability, setMyReliability] = useState(0)
  const [myIcon, setMyIcon] = useState("")
  const [data, setData] = useState({})
  const [comment, setComment] = useState("")
  const [commentList, setCommentList] = useState([])
  const [input, setInput] = useState(0)
  const [input2, setInput2] = useState(0)
  const [replyInput, setReplyInput] = useState(0)
  const [commentContent, setCommentContent] = useState({
    comment_content: ""
  })
  const [reply, setReply] = useState("")
  const [replyList, setReplyList] = useState([])
  const [replyContent, setReplyContent] = useState({
    reply_content: ""
  })
  const [upDownList, setUpDownList] = useState([])

  const {comment_content} = commentContent
  const {reply_content} = replyContent

  const history = useHistory();

  async function fetchPosts(){
    const {data: response0} = await axios.get('/api/auth')
    if(!response0.second) {
      setAuth(false)
    } else {
      setAuth(true)
      setMyPk(response0.pk)
      setMyNickName(response0.nick_name)
      setMyReliability(response0.reliability)
      setMyIcon(response0.user_use_icon)
    }
    const {data:response} = await axios.post('/api/community',{pk:params.pk})
    setData(response.data)

    const {data: response2} = await axios.post('/api/comment', {pk:params.pk})
    setCommentList(response2.data)

    const {data: response3} = await axios.post('/api/reply', {pk:params.pk})
    setReplyList(response3.data)

    const {data: response4} = await axios.post('/api/up_down', {community_pk: params.pk})
    setUpDownList(response4.data)
  }

  useEffect(()=>{
    fetchPosts()
  },[])

  const addComment = async () => {
    if(!auth) {
      alert("로그인 후 이용가능합니다")
    } else {
      if(comment==="") {
        alert("댓글 내용을 입력해주세요.")
      } else {
        const {data:response} = await axios.post('/api/addcomment', {
          pk: params.pk,
          user_pk: myPk,
          user_nickname: myNickName,
          comment_content: comment,
          user_reliability: myReliability,
          user_icon: myIcon
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
      alert("댓글 수정이 완료 되었습니다.")
      setInput(0)
    } else {
      alert("서버 에러 발생")
    }
  }

  const addReply = async (pk) => {
    if(!auth) {
      alert("로그인 후 이용가능합니다")
    } else {
      if(reply==="") {
        alert("답글 내용을 입력해주세요.")
      } else {
        const {data:response} = await axios.post('/api/addreply', {
          comment_pk: pk,
          user_pk: myPk,
          user_nickname: myNickName,
          reply_content: reply,
          user_icon: myIcon,
          user_reliability: myReliability,
          community_pk: params.pk
        })
        $('#reply').val("");
        if(response.result<0) {
          alert(response.message)
        } else {
          const {data:response2} = await axios.post('/api/reply', {pk: params.pk})
          setReplyList(response2.data)
          alert("답글을 등록했습니다.")
          setReplyInput(0)
        }
      }
    }
  }

  const replyHandleClick = async (pk) => {
    const {data:response} = await axios.post('/api/replyinfo', {pk: pk})
    setReplyContent(response.data)
    setInput2(pk)
  }

  const replyHandleChange = e => {
    setReplyContent({...replyContent, [e.target.name]: e.target.value})
  } 

  const editReply = async (pk) => {
    const {data:response} = await axios.put('/api/editreply', {
      pk: pk,
      reply_content: reply_content
    })
    if(response.result>0) {
      const {data:response2} = await axios.post('/api/reply', {pk: params.pk})
      if(response2.result>0) {
        setReplyList(response2.data)
      }
      alert("답글이 수정되었습니다.")
      setInput2(0)
    } else {
      alert("서버 에러 발생")
    }
  }

  const deleteReply = async (pk) => {
    const {data:response} = await axios.post('/api/deletereply', {pk: pk})
    if(response.result>0) {
      alert("답글이 삭제되었습니다")
    }
    const {data:response2} = await axios.post('/api/reply', {pk: params.pk})
    if(response2.result>0) {
      setReplyList(response2.data)
    }
  }
  
  const community_upDownList = upDownList.filter(list => list.community_pk !== null && list.comment_pk === null && list.reply_pk === null);
  const comment_upDownList = upDownList.filter(list => list.comment_pk !== null);
  const reply_upDownList = upDownList.filter(list => list.reply_pk !== null);

  const upDownRequest = async (kind, pk, up_down) => {
    if(!auth) {
      alert("로그인 후 이용 가능합니다.")
      return;
    }
    if (kind===1) {
      for (var i = 0; i < community_upDownList.length; i++) {
        if(community_upDownList[i].user_pk === myPk){
          alert("이미 추천 혹은 반대 한 게시글입니다.")
          return;
        } 
      }
    } else if (kind===2) {
      for (var i = 0; i < comment_upDownList.filter(list => list.comment_pk === pk).length; i++) {
        if(comment_upDownList.filter(list => list.comment_pk === pk)[i].user_pk === myPk){
          alert("이미 추천 혹은 반대 한 댓글입니다.")
          return;
        } 
      }
    } else {
      for (var i = 0; i < reply_upDownList.filter(list => list.reply_pk === pk).length; i++) {
        if(reply_upDownList.filter(list => list.reply_pk === pk)[i].user_pk === myPk){
          alert("이미 추천 혹은 반대 한 답글입니다.")
          return;
        } 
      }
    }
    if(kind === 1) {
      await axios.post('/api/addup_down', {
        community_pk: pk,
        user_pk: myPk,
        up_down: up_down
      })
    } else if (kind === 2) {
      await axios.post('/api/addup_down', {
        community_pk: params.pk,
        comment_pk: pk,
        user_pk: myPk,
        up_down: up_down
      })
    } else {
      await axios.post('/api/addup_down', {
        community_pk: params.pk,
        reply_pk: pk,
        user_pk: myPk,
        up_down: up_down
      })
    }
    if(up_down===1) {
      alert("추천 완료")
    } else {
      alert("반대 완료")
    }
    const {data: response} = await axios.post('/api/up_down', {community_pk: params.pk})
    setUpDownList(response.data)
  }

  const community_upList = upDownList.filter(list => list.up_down === 1 && list.community_pk !== null && list.comment_pk === null && list.reply_pk === null);
  const community_downList = upDownList.filter(list => list.up_down === -1 && list.community_pk !== null && list.comment_pk === null && list.reply_pk === null);

  const comment_upList = upDownList.filter(list => list.up_down === 1 && list.comment_pk !== null);
  const comment_downList = upDownList.filter(list => list.up_down === -1 && list.comment_pk !== null);

  const reply_upList = upDownList.filter(list => list.up_down === 1 && list.reply_pk !== null);
  const reply_downList = upDownList.filter(list => list.up_down === -1 && list.reply_pk !== null);

  return (
    <Wrapper>
      <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`
            }}>
                
                <Title>{data.kind===1?'공지사항':'자유게시판'}</Title>
                
                <Container>
                    <Content>
                        <SubTitle style={{fontSize: '1.1rem'}}>제목</SubTitle>
                    </Content>
                    <Content>
                      <PostInfo>
                        {data?.title}
                      </PostInfo>
                    </Content>
                    <Content>
                        <SubTitle style={{fontSize: '1.1rem'}}>조회수</SubTitle>
                    </Content>
                    <Content>
                     <PostInfo
                      style={{marginLeft: '0.4rem'}}
                     >
                        {data?.views}
                      </PostInfo>
                    </Content>
                    <Content>
                        <SubTitle style={{fontSize: '1.1rem'}}>작성자</SubTitle>
                    </Content>
                    <Content>
                      <PostInfo style={{cursor: 'pointer'}} onClick={() => history.push(`/info/${data?.user_pk}`)}>
                        {data?.user_icon && <img width={20} src={setIcon(data?.user_icon)}/>}
                        <img width={20} src={setLevel(data?.user_reliability)}/>{data?.user_nickname}
                      </PostInfo>
                    </Content>
                    <Content>
                        <SubTitle style={{fontSize: '1.1rem'}}>내용</SubTitle>
                    </Content>
                    <Content>
                      <PostInfo style={{minHeight: '15rem', }}>
                        {ReactHtmlParser(`${data?.content}`)}
                      </PostInfo>
                    </Content>
                    <Content style={{justifyContent: 'center' }}>
                      <ButtonOutLine 
                        style={{color: '#B9062F'}}
                        onClick={() => {
                          if (window.confirm("게시글에 추천 하시겠습니까?")) {
                            upDownRequest(1, data?.pk, 1)
                          }
                        }}
                      >
                        <GoThumbsup/> {community_upList.length}
                      </ButtonOutLine>
                      <ButtonOutLine
                        style={{ marginLeft: '1rem', color: '#4169E1' }}
                        onClick={() => {
                          if (window.confirm("게시글에 반대 하시겠습니까?")) {
                            upDownRequest(1, data?.pk, -1)
                          }
                        }}
                      >
                        <GoThumbsdown/> {community_downList.length}
                      </ButtonOutLine>
                    </Content>
                    <Content>
                        <SubTitle style={{fontSize: '1.1rem'}}>
                          <IoChatbubbleEllipses style={{fontSize:'20px'}}/> 댓글 목록 <span style={{color: 'black'}}>({commentList.length+replyList.length})</span>
                        </SubTitle>
                    </Content>
                    <Content style={{flexDirection: "column"}}>
                        {commentList.map(comment => {
                          return( 
                            <React.Fragment key={comment.pk}>
                              <CommentName>
                                {comment.comment_user_icon && <img width={15} src={setIcon(comment.comment_user_icon)} />}
                                <img src={setLevel(comment.comment_user_reliability)}/>
                                {comment.comment_user_nickname}
                                <CommentTime>({comment.create_time})</CommentTime>
                                  <ButtonOutLine
                                    style={{ marginLeft: '0.3rem', color: '#B9062F', width: '2.4rem', height: '1.8rem', fontSize: '0.8rem' }}
                                    onClick={() => {
                                      if (window.confirm("댓글에 추천 하시겠습니까?")) {
                                        upDownRequest(2, comment.pk, 1)
                                      }
                                    }}
                                  >
                                    <GoThumbsup /> {comment_upList.filter(list => list.comment_pk === comment.pk).length}
                                  </ButtonOutLine>
                                  <ButtonOutLine
                                    style={{ marginLeft: '0.3rem', color: '#4169E1', width: '2.4rem', height: '1.8rem', fontSize: '0.8rem' }}
                                    onClick={() => {
                                      if (window.confirm("댓글에 반대 하시겠습니까?")) {
                                        upDownRequest(2, comment.pk, -1)
                                      }
                                    }}
                                  >
                                    <GoThumbsdown /> {comment_downList.filter(list => list.comment_pk === comment.pk).length}
                                  </ButtonOutLine>
                                {comment.comment_user_nickname === myNickName && input !== comment.pk &&
                                  <>
                                    <AiFillEdit
                                      style={{color: '#0A82FF',marginLeft: '10px', cursor: 'pointer' }}
                                      onClick={()=> {handleClick(comment.pk)}}
                                    />
                                    <AiFillDelete 
                                      style={{color: 'red', marginLeft: '5px', cursor: 'pointer' }}
                                      onClick={() => { 
                                          if(window.confirm('댓글을 삭제하시겠습니까?')) {
                                          deleteComment(comment.pk)
                                        }
                                      }}
                                    />
                                  </>
                                }
                              </CommentName>
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
                                : 
                                  <>
                                  <div style={{paddingBottom: '10px', marginLeft: '10px'}}>
                                    {comment.comment_content}

                                  </div>
                                      <Reply
                                        onClick={() => {setReplyInput(comment.pk)}}
                                      >
                                        답글
                                      </Reply>
                                    </>
                                }
                                  {replyList.map(reply => {
                                    return(
                                      <React.Fragment key={reply.pk}>
                                        {reply.community_comment_pk === comment.pk &&
                                          <Content style={{width: '100%'}}>
                                            <BsArrowReturnRight style={{color: 'gray', fontSize:'20px', margin: 'auto 0'}} />
                                            <ReplyWrapper>
                                              <CommentName>
                                                {reply.reply_user_icon && <img width={15} src={setIcon(reply.reply_user_icon)} />}
                                                <img src={setLevel(reply.reply_user_reliability)}/>
                                                {reply.reply_user_nickname}
                                                <CommentTime>({reply.create_time})</CommentTime>
                                                <ButtonOutLine
                                                  style={{ marginLeft: '0.3rem', color: '#B9062F', width: '2.4rem', height: '1.8rem', fontSize: '0.8rem' }}
                                                  onClick={() => {
                                                    if (window.confirm("답글에 추천 하시겠습니까?")) {
                                                      upDownRequest(3, reply.pk, 1)
                                                    }
                                                  }}
                                                >
                                                  <GoThumbsup /> {reply_upList.filter(list => list.reply_pk === reply.pk).length}
                                                </ButtonOutLine>
                                                <ButtonOutLine
                                                  style={{ marginLeft: '0.3rem', color: '#4169E1', width: '2.4rem', height: '1.8rem', fontSize: '0.8rem' }}
                                                  onClick={() => {
                                                    if (window.confirm("답글에 반대 하시겠습니까?")) {
                                                      upDownRequest(3, reply.pk, -1)
                                                    }
                                                  }}
                                                >
                                                  <GoThumbsdown /> {reply_downList.filter(list => list.reply_pk === reply.pk).length}
                                                </ButtonOutLine>
                                                {reply.reply_user_nickname === myNickName && input2 !== reply.pk &&
                                                  <>
                                                    <AiFillEdit
                                                      style={{color: '#0A82FF',marginLeft: '10px', cursor: 'pointer'}}
                                                      onClick={()=> {replyHandleClick(reply.pk)}}
                                                    />
                                                    <AiFillDelete 
                                                      style={{color: 'red', marginLeft: '5px', cursor: 'pointer'}}
                                                      onClick={() => { 
                                                          if(window.confirm('답글을 삭제하시겠습니까?')) {
                                                          deleteReply(reply.pk)
                                                        }
                                                      }}
                                                    />
                                                  </>
                                                }
                                              </CommentName>
                                              <CommentContent>
                                              {input2 === reply.pk ?
                                                <Content>
                                                  <Textarea 
                                                    id="reply"
                                                    name= "reply_content"
                                                    style={{height: "3rem", border: "1px solid gray", margin: '0'}}
                                                    value={reply_content}
                                                    onChange={e => replyHandleChange(e)}
                                                  />
                                                  <Button onClick={()=> {editReply(reply.pk)}} style={{width: "5.5rem", height: "3.5rem", marginLeft: "1px"}} >수정</Button>
                                                  <Button onClick={()=> {setInput2(0)}} style={{width: "5.5rem", height: "3.5rem", marginLeft: "1px"}} >취소</Button>
                                                </Content> 
                                              : 
                                                <span style={{marginLeft: '10px'}}>
                                                  {reply.reply_content}
                                                </span>
                                              }
                                              </CommentContent>
                                            </ReplyWrapper>
                                          </Content>
                                        }
                                      </React.Fragment>
                                    )
                                  })}
                                  {replyInput === comment.pk &&
                                    <Content style={{paddingTop: '15px', width: '100%'}}>
                                      <BsArrowReturnRight style={{color: 'gray', fontSize:'20px', margin: 'auto 0'}} />
                                      <Textarea 
                                        id="reply"
                                        name= "reply_content"
                                        placeholder={auth ? "답글 작성하기" : "로그인 후 이용 가능합니다"}
                                        style={{height: "3rem", border: "1px solid gray", margin: '0'}}
                                        onChange={e => setReply(e.target.value)}
                                      />
                                      <Button onClick={()=> {addReply(comment.pk)}} style={{width: "5.5rem", height: "3.5rem", marginLeft: "1px"}} >답글 등록</Button>
                                      <Button onClick={()=> {setReplyInput(0)}} style={{width: "5.5rem", height: "3.5rem", marginLeft: "1px"}} >취소</Button>
                                    </Content> 
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
                          placeholder={auth ? "댓글 작성하기" : "로그인 후 이용 가능합니다"}
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