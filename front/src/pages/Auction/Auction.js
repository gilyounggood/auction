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
import {AiFillStar} from 'react-icons/ai'
import setLevel from '../../data/Level';
import { setIcon } from '../../data/Icon';
import ReactHtmlParser from 'html-react-parser'
import TimeLeft from '../../data/TimeLeft';
import AutoBuyingModal from '../../components/modals/AutoBuyingModal';

const Input = styled.input`
  margin-top: 5px;
  outline: 1px solid #c4c4c4;
  font-size:1rem;
  border:none;
  margin-right:0.3rem;
  width:21rem;
  height: 2.5rem;
  ::placeholder {
      color: #cccccc;
  }
  @media screen and (max-width: 790px) {
      width: 15rem;
      margin-right:0rem;
  }
  &:focus {
      outline: 1px solid #0078FF;
      box-shadow: 0px 0px 2px black;
  }
`

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
  const [favoriteList, setFavoriteList] = useState(0)

  const [modal, setModal] = useState(false)
  const [systemInfo, setSystemInfo] = useState({})

  async function fetchPosts() {
    const { data: response } = await axios.get('/api/auth')
    setAuth(response)
    const { data: response2 } = await axios.post('/api/item', { pk: params.pk })
    if (response2.data) {
      setItem(response2?.data?.item)
      let arr = []
      arr = JSON.parse(response2?.data?.item?.category_list ?? "")
      if(arr.length>0){
        arr = arr?.split(",");
      } else {
        arr = [];
      }
      setTagList(arr)
      for(var i =0;i<response2?.data?.favorite?.length;i++){
        if(response2?.data?.favorite[i].user_pk==response.pk){
          setFavorite(true)
          setFavoriteList(response2?.data?.favorite)
        }
      }

      const { data: response3 } = await axios.post('/api/autosysteminfo', {
        auction_pk: params.pk,
        user_pk: response.pk,
      })
      if (response3.data) {
        setSystemInfo(response3.data)
        console.log(response3.data)
      }
    } else {
      history.push('/')
    }

    const { data: response3 } = await axios.post('/api/chat', { itemPk: params.pk })
    setChatList(response3.data)
    $("#chating").scrollTop($("#chating")[0]?.scrollHeight);
  }
  useEffect(() => {
    fetchPosts()
  }, [])
  const addChat = async (e) => {
    if ($('#chat').val()==="") {
      alert("내용을 입력해주세요")
      return;
    }
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
      alert('숫자만 입력해 주세요.')
      return;
    } else if (parseInt($('#request-down-price').val()) >= item.min_price) {
      alert('시작가보다 작게 설정해 주세요.')
      return;
    } else {
      const { data: response } = await axios.post('/api/addchat', {
        nickname: auth.nick_name,
        userPk: auth.pk,
        reliability: auth.reliability,
        icon: auth.user_use_icon,
        content: `${auth.nick_name}님이 ${$('#request-down-price').val()}원으로 시작가 낮추기 요청을 하셨습니다.`,
        itemPk: params.pk,
        post_id: item?.pk,
        post_name: item?.seller_nickname,
        post_title: item?.name,
      })
      $('#request-down-price').val("");
      if (response.result > 0) {
        const { data: response3 } = await axios.post('/api/chat', { itemPk: params.pk })
        setChatList(response3.data)
        alert("흥정 신청 성공")
      }
  
      $("#chating").scrollTop($("#chating")[0]?.scrollHeight);

    }
  }
  const upPrice = async (e) => {
    if (isNaN(parseInt($('#up-price').val()))) {
      alert('숫자만 입력해 주세요.')
      return;
    } else if (parseInt($('#up-price').val()) <= item.bid_price) {
      alert('현재가보다 크게 설정해 주세요.')
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
        alert('가격 올리기 성공')
        window.location.reload();
      }
    }
  }
  const updateminPrice = async (e) => {
    if (isNaN(parseInt($('#down-price').val()))) {
      alert('숫자만 입력해 주세요.')
      return;
    } else if (parseInt($('#down-price').val()) >= item.min_price) {
      alert('시작가보다 작게 설정해 주세요.')
      return;
    } else {
      const {data:response} = axios.post('/api/changebid',{
        itemPk:params.pk,
        price:parseInt($('#down-price').val()) 
      })
      alert('시작가 낮추기 성공')
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
      alert('낙찰 완료')
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
      alert('서버 에러 발생')
    }
  }

  const openModal = () => {
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
  }

  return (
    <>
    <AutoBuyingModal open={modal} close={closeModal} auction_pk={params.pk} fetchPosts={() => fetchPosts()}
      user_pk={auth.pk} bid_price={item?.bid_price} max_price={systemInfo.max_price} purchase_price={systemInfo.purchase_price}
    />
    <Wrapper>
      <ContentsWrapper style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
      }}>
        <Container2>
          <Title style={{textAlign: 'center', color: '#A52A2A'}}>{item?.name}</Title>
          <Title>상품정보</Title>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#464646', fontSize: '1rem', paddingBottom: '10px' }}>조회: {item?.views}</LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#008080', fontSize: '1rem', paddingBottom: '10px' }}>관심등록 <AiFillStar style={{fontSize:'2rem',cursor:'pointer',color:`${favorite?'#FFDC3C':'#c8c8c8'}`, marginLeft: '5px'}} 
          onClick={() => {
            if(!auth.pk) {
              alert("로그인 후 이용 가능합니다")
              return;
            }
            if(favorite){
              if (window.confirm("즐겨찾기를 취소 하시겠습니까?")) {
                updateFavorite(-1)
              }
            } else {
              if (window.confirm("즐겨찾기 하시겠습니까?")) {
                updateFavorite(1)
              }
            }
          }} /> ({favoriteList.length ?? 0})</LeftTextBox>
          
          <LeftTextBox style={{ fontWeight: 'bold', color: '#0064CD', fontSize: '1rem', paddingBottom: '10px', borderTop: '1px solid gray', paddingTop: '20px'}}>상품 메인 이미지</LeftTextBox>
          <LeftTextBox style={{borderBottom: '1px solid gray', paddingBottom: '20px'}}>
            <img src={`${ServerLink}` + item.main_image ?? ''} style={{ width: '80%', maxWidth: '360px' }} />
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#0064CD', fontSize: '1rem', paddingBottom: '10px'}}>상품설명</LeftTextBox>
          <LeftTextBox style={{minHeight: '10rem', borderBottom: '1px solid gray', paddingBottom: '20px'}}>
            {ReactHtmlParser(item?.content ?? '')}
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#cd84f1', fontSize: '1rem', paddingBottom: '10px' }}>태그</LeftTextBox>
          <LeftTextBox style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid gray', paddingBottom: '20px' }}>
            {tagList.map((item, index) => (
              <div key={index} style={{ background: '#cd84f1', color: 'white', fontWeight: 'bold', cursor: 'pointer', borderRadius: '0.2rem', padding: '0 0.2rem', marginRight: '0.2rem', marginBottom: '0.2rem' }}
                onClick={() => { history.push({ pathname: '/searchresult', state: { keyword: item, kind: "auction" } }) }}>
                {'#' + item}
              </div>
            ))}
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#228B22', fontSize: '1rem', paddingBottom: '10px' }}>상태 :</LeftTextBox>
          <LeftTextBox style={{fontWeight: 'bold', borderBottom: '1px solid gray', paddingBottom: '20px', color: item?.buy_count === 0 ? '#228B22' : "#CD2E57"}}>
            {item?.buy_count == 0 ? '경매중' : '경매마감'}
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#CD2E57', fontSize: '1rem', paddingBottom: '10px' }}>시작가 :</LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', borderBottom: '1px solid gray', paddingBottom: '20px'}}>
            {item?.min_price ?? ''} 원
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#CD2E57', fontSize: '1rem', paddingBottom: '10px' }}>{item?.buy_count===0 ? "현재가 :" : "마감가 :"}</LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', borderBottom: '1px solid gray', paddingBottom: '20px'}}>
            {item?.bid_price ?? ''} 원
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#FF8200', fontSize: '1rem', paddingBottom: '10px' }}>입찰기간</LeftTextBox>
          <LeftTextBox style={{ color: '#FF8200', borderBottom: '1px solid gray', paddingBottom: '20px'}}>
            <strong>남은시간: {item?.buy_count===0 ? TimeLeft(item?.end_date) : '마감'}</strong><br/>
            {item?.create_time} ~<br/>{item?.end_date ?? ''}
          </LeftTextBox>
          <LeftTextBox style={{ fontWeight: 'bold', color: '#8B4513', fontSize: '1rem', paddingBottom: '10px' }}>판매자 :</LeftTextBox>
          <LeftTextBox onClick={() => { history.push(`/info/${item?.seller_pk}`) }} style={{ cursor: 'pointer', borderBottom: '1px solid gray', paddingBottom: '20px', fontWeight: 'bold' }}>
            {item?.seller_icon &&
            <img width={15} src={setIcon(item?.seller_icon)}/>
            }
            <img src={setLevel(item?.seller_reliability)}/>{item?.seller_nickname ?? ''}
          </LeftTextBox>
          {item?.buy_count == 1 ?
            <>
              <LeftTextBox style={{ fontWeight: 'bold', color: '#8B4513', fontSize: '1rem', paddingBottom: '10px' }}>낙찰자 :</LeftTextBox>
              <LeftTextBox style={{ borderBottom: '1px solid gray', paddingBottom: '20px', fontWeight: 'bold'}}>
                {item?.buyer_nickname ?? '없음'}
              </LeftTextBox>
            </>
            :
            <>
            {item.buyer_nickname?
            <>
            <LeftTextBox style={{ fontWeight: 'bold', color: '#8B4513', fontSize: '1rem', paddingBottom: '10px' }}>현재 낙찰자 :</LeftTextBox>
              <LeftTextBox style={{ borderBottom: '1px solid gray', paddingBottom: '20px', fontWeight: 'bold'}}>
                {item?.buyer_nickname ?? ''}
              </LeftTextBox>
            </>
            :
            <></>}
            {auth.pk && auth.pk !== item.seller_pk ?
            <>
              {item.bid_price == item.min_price ?
                <>
                  <LeftTextBox style={{ fontWeight: 'bold', color: '#CD0000', fontSize: '1rem', paddingBottom: '10px' }}>경매신청</LeftTextBox>
                  <LeftTextBox style={{ fontWeight: 'bold', color: '#B93232', fontSize: '1rem' }}>시작가 낮추기 신청</LeftTextBox>
                  <LeftTextBox>
                    <InputAndButton>
                      <Input placeholder='숫자를 입력하세요.' id='request-down-price' />
                      <Button 
                        style={{width: '4.5rem', height: '2.5rem', marginTop: '5px'}}
                        onClick={() => {
                        if (window.confirm("시작가 낮추기 요청을 하겠습니까?")) {
                          requestDownPrice()
                        }
                      }}>신청하기</Button>
                    </InputAndButton>
                  </LeftTextBox>
                </>
                :
                <>
                </>
              }

              <LeftTextBox style={{ fontWeight: 'bold', color: '#B93232', fontSize: '1rem' }}>경매가 올리기</LeftTextBox>
              <LeftTextBox>
                <InputAndButton>
                  <Input placeholder='숫자를 입력하세요.' id='up-price' />
                  <Button 
                    style={{width: '6.8rem', height: '2.5rem', marginTop: '5px'}}
                    onClick={() => {
                    if (window.confirm("경매가를 올리시겠습니까?")) {
                      upPrice()
                    }
                  }}>경매가 올리기</Button>
                </InputAndButton>
              </LeftTextBox>
              <LeftTextBox style={{ fontWeight: 'bold', color: '#B93232', fontSize: '1rem' }}>자동 경매 시스템</LeftTextBox>
              <LeftTextBox>
                <InputAndButton>
                  <Button 
                    style={{width: '9.8rem', height: '2.5rem', marginTop: '5px', background: '#0064FF'}}
                    onClick={() => {
                    if (window.confirm("경매 자동 관리 시스템을 사용하시겠습니까? \n설정된 상한가보다 가격이 낮을 시 계속해서 자동으로 매수합니다")) {
                      openModal();
                    }
                  }}>자동 매수 시스템 관리</Button>
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
              <LeftTextBox style={{ fontWeight: 'bold', color: '#CD0000', fontSize: '1rem', paddingBottom: '10px' }}>경매관리</LeftTextBox>
              {item.bid_price == item.min_price ?
                <>
                  <LeftTextBox style={{ fontWeight: 'bold', color: '#B93232', fontSize: '1rem' }}>시작가 낮추기</LeftTextBox>
                  <LeftTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '1rem' }}>
                    <InputAndButton>
                      <Input placeholder='숫자를 입력하세요.' id='down-price' />
                      <Button 
                        style={{width: '6rem', height: '2.5rem', marginTop: '5px'}}
                        onClick={() => {
                          if (window.confirm("시작가를 낮추시겠습니까?")) {
                            updateminPrice();
                          }
                      }}>시작가 조정</Button>
                    </InputAndButton>
                  </LeftTextBox>
                </>
                : <></>}

              <LeftTextBox style={{ fontWeight: 'bold', color: '#B93232', fontSize: '1rem' }}>낙찰하기</LeftTextBox>
              <LeftTextBox style={{ fontWeight: 'bold', color: '#ababab', fontSize: '1rem' }}>
                <Button
                  style={{width: '5rem', height: '2.5rem'}} 
                  onClick={() => {
                  if (window.confirm("낙찰 하시겠습니까?")) {
                    successfulAuction()
                  }
              }}>경매마감</Button></LeftTextBox>

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
            <Title>경매 로그</Title>
            <Container id="chating">
              {chatList?.map((post) => (
                <div key={post.pk} style={{ width: '100%', textAlign: 'end', alignItems: `${auth.pk == post.user_pk ? 'end' : 'flex-start'}`, display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    padding: '1rem', minHeight: '3rem', background: `${auth.pk == post.user_pk ? '#8e44ad' : '$fff'}`, border: '1px solid #8e44ad', width: '9rem', margin: '0.5rem 0', borderRadius: '1rem',
                    color: `${auth.pk == post.user_pk ? '#fff' : '#8e44ad'}`
                  }}>
                    <div style={{ textAlign: 'left', fontWeight: 'bold' }}>
                      {post.user_icon &&
                      <img width={15} src={setIcon(post.user_icon)} />
                      }
                      <img src={setLevel(post.user_reliability)}/>{post.user_nickname}
                    </div>
                    <div style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{post.content}</div>
                    <div style={{ fontSize: '0.7rem' }}>{post.create_time}</div>
                  </div>
                </div>
              ))}
            </Container>
            {auth.pk?<>
              <Textarea id='chat' />
            <Button style={{ width: '80%' }} onClick={addChat}>입력</Button>
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
    </>
  );
};
export default Auction;