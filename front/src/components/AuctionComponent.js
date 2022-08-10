import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import ServerLink from '../data/ServerLink'
import BoxContent from './elements/BoxContent';
import setLevel from '../data/Level';
import { setIcon } from '../data/Icon';
import axios from 'axios';
const BoxImage = styled.div`
width:100%;
height:10.2rem;
border-top-right-radius:0.5rem;
border-top-left-radius:0.5rem;
@media screen and (max-width:1230px) {
    height: 18vw;
  }
  @media screen and (max-width:800px) { 
    height: 27vw;
  }
  @media screen and (max-width:500px) {
    height:48vw;
  }
    
    background-size: cover;
`


const LeftTextBox = styled.div`
text-align:left;
width:90%;
margin:0.5rem auto;
color:#2e2e2e;
`
const RightTextBox = styled.div`
text-align:right;
width:90%;
margin:0.3rem auto;
color:#2e2e2e;
`

const AuctionComponent = (props) => {
  const [chatList, setChatList] = useState([])
  const history = useHistory();

  useEffect(()=> {
    async function fetchChats(){
      const {data:response} = await axios.post('/api/chat', {itemPk: props.pk})
      setChatList(response.data)
    }
    fetchChats()
  }, [])
 
  return (
    <div key={props.pk}>
      <BoxContent onClick={() => { history.push(`/auction/${props.pk}`) }}>
        <BoxImage style={{ backgroundImage: `url(${`${ServerLink}${props?.main_image}`})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', position: 'relative' }} />
        <LeftTextBox style={{ fontSize: '1rem', fontWeight: 'bold' }}>{props.name} {chatList.length>0 && <strong style={{ fontSize: '1rem', color: '#e84118' }}>[{chatList.length}]</strong>}</LeftTextBox>
        <RightTextBox style={{ fontSize: '0.8rem', color: '#5a5a5a' }}>경매가 | <strong style={{ fontSize: '1rem', color: '#e84118' }}>{props.bid_price}</strong> 원</RightTextBox>
        <RightTextBox style={{ fontSize: '0.8rem', color: '#5a5a5a' }}>등록인 | <strong style={{ fontSize: '0.9rem', color: '#FF8200' }}>
          {props.seller_icon &&
          <img width={15} src={setIcon(props.seller_icon)}/>
          }
          <img src={setLevel(props.seller_reliability)}/>{props.seller_nickname}</strong></RightTextBox>
        <RightTextBox style={{ fontSize: '0.8rem', color: '#5a5a5a' }}>상태 | {props?.buy_count == 0 ? '경매중' : '경매완료'} | 조회수 | {props.views}</RightTextBox>

        <RightTextBox style={{ fontSize: '0.8rem', color: '#5a5a5a' }}>마감일자 | {props.end_date}</RightTextBox>
      </BoxContent>
    </div>
  )
}

export default AuctionComponent