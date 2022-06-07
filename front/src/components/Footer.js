import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
display: flex;
flex-direction: column;
  background: #9b59b6;
  @media screen and (max-width:700px) {
    background:none;
  }
`
const TextTitle = styled.div`
padding: 2rem 0 1rem 1rem;
font-size:0.9rem;
color: white;
@media screen and (max-width:700px) {
  font-size:0.8rem;
  padding: 1rem 0 0.5rem 0.5rem;
  color: #718093;
}
`
const Text = styled.div`
padding: 1rem 0 0 1rem;
font-size:0.9rem;
color: white;
@media screen and (max-width:700px) {
  font-size:0.7rem;
  padding: 0.5rem 0.5rem 0 0.5rem;
  color: #718093;
}
`
const Border = styled.div`
@media screen and (max-width:700px) {
  margin: 0 0.5rem 0 0.5rem;
  border-top:1px solid #cccccc;
}
`

const Footer = () => {
  return (

    <Container>
      <Border/>
      <TextTitle>개인정보처리방침 | 사용약관</TextTitle>
      <Text>Auction | 사업자번호 : 111-11-111111  </Text>
      <Text style={{paddingBottom:'2rem'}}>본 사이트의 컨텐츠는 저작권법의 보호를 받는 바 무단 전재, 복사, 배포 등을 금합니다.
      </Text>
    </Container>



  )
}

export default Footer