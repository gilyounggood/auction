import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components'

import Wrapper from '../../components/elements/Wrapper';
import '../../styles/style.css'
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Title from '../../components/elements/Title';
import axios from 'axios';
import ServerLink from '../../data/ServerLink';
import Button from '../../components/elements/Button';
import $ from 'jquery'
import Input from '../../components/elements/Input';
import {AiFillStar} from 'react-icons/ai'
import setLevel from '../../data/Level';
import { setIcon } from '../../data/Icon';
const Container2 = styled.div`
width:80%;
padding:1rem;
display:flex;
min-height:24rem;
flex-direction:column;
text-align:left;
margin-bottom:2rem;
@media screen and (max-width:600px) {
    padding:0.5rem;
  }
`
const LeftTextBox = styled.div`
text-align:left;
align-items:center;
width:90%;
margin:0.5rem auto;
color:#2e2e2e;
`
const RightTextBox = styled.div`
text-align:end;
width:90%;
margin:0.3rem auto;
color:#2e2e2e;
display:flex;
flex-direction:column;
align-items:end;
`
const Lines2 = styled.hr`
margin-top:0.5rem;
margin-bottom:1rem;
background-color: #8e44ad;
height:1px;
width:90%;
`
const Textarea = styled.textarea`
width: 80%;
border-radius: 0.3rem;
border: 1px solid #8e44ad;
padding: 1rem;
display: -webkit-box;
display: -webkit-flex;
display: -ms-flexbox;
display: flex;
min-height: 4rem;
-webkit-flex-direction: column;
-ms-flex-direction: column;
flex-direction: column;
text-align: left;
margin-bottom: 2rem;
outline:none;
`
const Container = styled.div`
width:80%;
border-radius:1rem;
border:1px solid #8e44ad;
padding:1rem;
display:flex;
min-height:24rem;
max-height:24rem;
flex-direction:column;
margin-bottom:2rem;
@media screen and (max-width:600px) {
    padding:0.5rem;
  }
overflow-y:auto;
`
const InputAndButton = styled.div`
display:flex;
@media screen and (max-width:600px) {
  flex-direction:column;
  align-items:center;
}
`

const Auction = () => {
  const params = useParams()
  const history = useHistory()

  const [item, setItem] = useState({})
  const [auth, setAuth] = useState({})
  const [tagList, setTagList] = useState([])

  const [chatList, setChatList] = useState([])
  const [favorite, setFavorite] = useState(false)
  useEffect(() => {
    async function fetchPosts() {
      const { data: response } = await axios.get('/api/auth')
      setAuth(response)
      const { data: response2 } = await axios.post('/api/item', { pk: params.pk })
      if (response2.data) {
        setItem(response2?.data?.item)
        let arr = []
        arr = JSON.parse(response2?.data?.item?.category_list ?? "")
        console.log(arr)
        if(arr.length>0){
          arr = arr?.split(",");
        } else {
          arr = [];
        }
        setTagList(arr)
        for(var i =0;i<response2?.data?.favorite?.length;i++){
          if(response2?.data?.favorite[i].user_pk==response.pk){
            setFavorite(true)
          }
        }
      } else {
        history.push('/')
      }

      const { data: response3 } = await axios.post('/api/chat', { itemPk: params.pk })
      setChatList(response3.data)
      $("#chating").scrollTop($("#chating")[0]?.scrollHeight);

    }
    fetchPosts()
  }, [])
  const addChat = async (e) => {
    const { data: response } = await axios.post('/api/addchat', {
      nickname: auth.nick_name,
      userPk: auth.pk,
      reliability: auth.reliability,
      icon: auth.user_use_icon,
      content: $('#chat').val(),
      itemPk: params.pk,
      post_id: item?.pk,
      post_name: item?.seller_nickname,
      post_title: item?.name,
    })
    $('#chat').val("");
    if (response.result > 0) {
      const { data: response3 } = await axios.post('/api/chat', { itemPk: params.pk })
      setChatList(response3.data)
    }

    $("#chating").scrollTop($("#chating")[0]?.scrollHeight);
  }
  const requestDownPrice = async (e) => {
    if (isNaN(parseInt($('#request-down-price').val()))) {
      alert('????????? ????????? ?????????.')
      return;
    } else if (parseInt($('#request-down-price').val()) >= item.min_price) {
      alert('??????????????? ?????? ????????? ?????????.')
      return;
    } else {
      const { data: response } = await axios.post('/api/addchat', {
        nickname: auth.nick_name,
        userPk: auth.pk,
        reliability: auth.reliability,
        icon: auth.user_use_icon,
        content: `${auth.nick_name}?????? ${$('#request-down-price').val()}????????? ????????? ????????? ????????? ???????????????.`,
        itemPk: params.pk,
        post_id: item?.pk,
        post_name: item?.seller_nickname,
        post_title: item?.name,
      })
      $('#request-down-price').val("");
      if (response.result > 0) {
        const { data: response3 } = await axios.post('/api/chat', { itemPk: params.pk })
        setChatList(response3.data)
        alert("?????? ?????? ??????")
      }
  
      $("#chating").scrollTop($("#chating")[0]?.scrollHeight);

    }
  }
  const upPrice = async (e) => {
    if (isNaN(parseInt($('#up-price').val()))) {
      alert('????????? ????????? ?????????.')
      return;
    } else if (parseInt($('#up-price').val()) <= item.bid_price) {
      alert('??????????????? ?????? ????????? ?????????.')
      return;
    } else {
      const {data:response} = await axios.post('/api/upbid',{
        price:parseInt($('#up-price').val()),
        itemPk:params.pk,
        nickname:auth.nick_name,
        reliability: auth.reliability,
        icon: auth.user_use_icon,
        userPk:auth.pk,
        post_id: item?.pk,
        post_name: item?.seller_nickname,
        post_title: item?.name,
      })
      if(response.result>0){
        alert('?????? ????????? ??????')
        window.location.reload();
      }
    }
  }
  const updateminPrice = async (e) => {
    if (isNaN(parseInt($('#down-price').val()))) {
      alert('????????? ????????? ?????????.')
      return;
    } else if (parseInt($('#down-price').val()) >= item.min_price) {
      alert('??????????????? ?????? ????????? ?????????.')
      return;
    } else {
      const {data:response} = axios.post('/api/changebid',{
        itemPk:params.pk,
        price:parseInt($('#down-price').val()) 
      })
      alert('????????? ????????? ??????')
      window.location.reload();
    }
  }
  const successfulAuction = async (e) => {
    const {data:response} = await axios.post('/api/successfulbid',{
      itemPk:params.pk,
      sellerPk:item.seller_pk,
      buyerPk:item.buyer_pk
    })
    if(response.result>0){
      alert('?????? ??????')
      history.push('/profile')
    }
  }
  async function updateFavorite(num){
    const {data: response} = await axios.post('/api/updatefavorite',{
      status:num,
      userPk:auth.pk,
      itemPk:params.pk
    })
    if(response.result>0){
      window.location.reload()
    } else {
      alert('?????? ?????? ??????')
    }
  }

  return (
    <Wrapper>
      <ContentsWrapper style={{
        borderRadius: '1rem', fontSize: '1rem', color: '#8e44ad', fontWeight: 'bold', borderRadius: '0.5rem'
        , alignItems: 'center', fontSize: '1.3rem'
      }}>
        {item?.name}
      </ContentsWrapper>
      <ContentsWrapper style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
      }}>
        <Container2>
          <Title>????????????</Title>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#464646', fontSize: '1rem' }}>??????: {item?.views}</LeftTextBox>
          {auth.pk?
          <>
          <LeftTextBox><AiFillStar style={{fontSize:'2rem',cursor:'pointer',color:`${favorite?'yellow':'#f1f2f6'}`}} 
          onClick={() => {
            if(favorite){
              if (window.confirm("??????????????? ?????? ???????????????????")) {
                updateFavorite(-1)
              }
            } else {
              if (window.confirm("???????????? ???????????????????")) {
                updateFavorite(1)
              }
            }
            
        }} /></LeftTextBox>
          </>
          :
          <>
          </>}
          
          <LeftTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>???????????????</LeftTextBox>
          <LeftTextBox>
            <img src={`${ServerLink}` + item.main_image ?? ''} style={{ width: '80%', maxWidth: '360px' }} />
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>??????</LeftTextBox>
          <LeftTextBox style={{ display: 'flex', flexWrap: 'wrap' }}>
            {tagList.map((item, index) => (
              <div key={index} style={{ background: '#cd84f1', color: 'white', fontWeight: 'bold', cursor: 'pointer', borderRadius: '0.2rem', padding: '0 0.2rem', marginRight: '0.2rem', marginBottom: '0.2rem' }}
                onClick={() => { history.push({ pathname: '/searchresult', state: { keyword: item } }) }}>
                {'#' + item}
              </div>
            ))}
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>?????????</LeftTextBox>
          <LeftTextBox>
            {item?.min_price ?? ''} ???
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>?????????</LeftTextBox>
          <LeftTextBox>
            {item?.bid_price ?? ''} ???
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>?????????</LeftTextBox>
          <LeftTextBox>
            {item?.end_date ?? ''}
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>?????????</LeftTextBox>
          <LeftTextBox onClick={() => { history.push(`/info/${item?.seller_pk}`) }} style={{ cursor: 'pointer' }}>
            {item?.seller_icon &&
            <img width={25} src={setIcon(item?.seller_icon)}/>
            }
            <img width={25} src={setLevel(item?.seller_reliability)}/>{item?.seller_nickname ?? ''}
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>??????</LeftTextBox>
          <LeftTextBox>
            {item?.buy_count == 0 ? '?????????' : '????????????'}
          </LeftTextBox>
          {item?.buy_count == 1 ?
            <>
              


            </>
            :
            <>
            {item.buyer_nickname?
            <>
            <LeftTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>?????????</LeftTextBox>
              <LeftTextBox>
                {item?.buyer_nickname ?? ''}
              </LeftTextBox>
            </>
            :
            <></>}
            {auth.pk?
            <>
 {item.bid_price == item.min_price ?
                <>

                  <LeftTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>????????? ????????? ??????</LeftTextBox>
                  <LeftTextBox>
                    <InputAndButton>
                      <Input style={{ marginBottom: '0.3rem' }} placeholder='????????? ???????????????.' id='request-down-price' />
                      <Button onClick={() => {
                        if (window.confirm("????????? ????????? ????????? ????????????????")) {
                          requestDownPrice()
                        }
                      }}>??????</Button>
                    </InputAndButton>
                  </LeftTextBox>
                </>
                :
                <>
                </>
              }

              <LeftTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>????????? ?????????</LeftTextBox>
              <LeftTextBox>
                <InputAndButton>
                  <Input style={{ marginBottom: '0.3rem' }} placeholder='????????? ???????????????.' id='up-price' />
                  <Button onClick={() => {
                    if (window.confirm("???????????? ??????????????????????")) {
                      upPrice()
                    }
                  }}>?????????</Button>
                </InputAndButton>
              </LeftTextBox>
            </>
            :
            <>
            </>}

             

            </>
          }
          {auth.pk ?
          <>
          {item.seller_pk == auth.pk && item.buy_count == 0 ?
            <>
              {item.bid_price == item.min_price ?
                <>
                  <RightTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>????????? ?????????</RightTextBox>
                  <RightTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>
                    <InputAndButton>
                      <Input style={{ marginBottom: '0.3rem' }} placeholder='????????? ???????????????.' id='down-price' />
                      <Button onClick={() => {
                        if (window.confirm("???????????? ??????????????????????")) {
                          updateminPrice();
                        }
                      }}>?????????</Button>
                    </InputAndButton>
                  </RightTextBox>
                </>
                : <></>}

              <RightTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}>????????????</RightTextBox>
              <RightTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '0.8rem' }}><Button onClick={() => {
                if (window.confirm("?????? ???????????????????")) {
                  successfulAuction()
                }
              }}>??????</Button></RightTextBox>

            </>
            :
            <>
            </>
          }
          </>
          :
          <>
          </>
          }
          
        </Container2>
      </ContentsWrapper>
      {item?.buy_count == 0 ?
        <>
          <ContentsWrapper style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center'
            , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
          }}>
            <Title>?????? ??????</Title>
            <Container id="chating">
              {chatList?.map((post) => (
                <div key={post.pk} style={{ width: '100%', textAlign: 'end', alignItems: `${auth.pk == post.user_pk ? 'end' : 'flex-start'}`, display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    padding: '1rem', minHeight: '3rem', background: `${auth.pk == post.user_pk ? '#8e44ad' : '$fff'}`, border: '1px solid #8e44ad', width: '9rem', margin: '0.5rem 0', borderRadius: '1rem',
                    color: `${auth.pk == post.user_pk ? '#fff' : '#8e44ad'}`
                  }}>
                    <div style={{ textAlign: 'left', fontWeight: 'bold' }}>
                      {post.user_icon &&
                      <img width={25} src={setIcon(post.user_icon)} />
                      }
                      <img width={25} src={setLevel(post.user_reliability)}/>{post.user_nickname}
                    </div>
                    <div style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{post.content}</div>
                    <div style={{ fontSize: '0.7rem' }}>{post.create_time}</div>
                  </div>
                </div>
              ))}
            </Container>
            {auth.pk?<>
              <Textarea id='chat' />
            <Button style={{ width: '80%' }} onClick={addChat}>??????</Button>
            </>
            :
            <>
            </>}
            
          </ContentsWrapper>
        </>
        :
        <>
        </>
      }


    </Wrapper>
  );
};
export default Auction;