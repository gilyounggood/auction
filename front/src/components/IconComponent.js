import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import ContentsWrapper from '../components/elements/ContentWrapper';
const BoxContent = styled.div`
width:15rem;
min-height:19.4rem;
margin: 1rem 1.1rem;
border-radius:0.5rem;
display:flex;
flex-direction:column;
@media screen and (max-width:1230px) {
    width: 30vw;
    min-height: 36vw;
    margin: 1rem auto;
  }
  @media screen and (max-width:800px) {
    width: 45vw;
    min-height: 54vw;
    margin: 1rem auto;
  }
  @media screen and (max-width:500px) {
    width: 80vw;
    min-height:96vw;
    margin: 1rem auto;
  }
  box-shadow: 2px 1px 4px #00000029;
  background:#fff;
`
const BoxImage = styled.div`
width:100%;
height:10.2rem;
text-align: center;
border-bottom: 1px solid gray;
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

const CenterTextBox = styled.div`
text-align:center;
width:90%;
margin:auto;
color:#2e2e2e;
font-weight:bold;
`

const IconImage = styled.img`
  margin-top: 3.5rem;
`

const AuctionComponent = (props) => {
  const history = useHistory();
  
  return (
    <>
      <BoxContent>
        <BoxImage>
        <IconImage width={60} src={props.image} />
        </BoxImage>
        <LeftTextBox style={{ fontSize: '1rem', fontWeight: 'bold' }}>{props.name}</LeftTextBox>
        <RightTextBox style={{ fontSize: '0.8rem', color: '#5a5a5a' }}>가격 | <strong style={{ fontSize: '1rem', color: '#e84118' }}>{props.point} Point</strong></RightTextBox>
        <RightTextBox style={{ fontSize: '0.8rem', color: '#5a5a5a' }}>상태 | 판매중</RightTextBox>
        <CenterTextBox style={{ fontSize: '1rem', color: '#5a5a5a' }}>구매하기</CenterTextBox>
      </BoxContent>
    </>
  )
}

export default AuctionComponent