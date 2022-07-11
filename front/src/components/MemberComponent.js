import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import ServerLink from '../data/ServerLink'
import SmallBoxContainer from './elements/Board/SmallContainer';
import SmallContent from './elements/Board/SmallContent';
import SmallSubContainer from './elements/Board/SmallSubContainer';
import SmallTitle1 from './elements/Board/SmallTitle1';
import SmallTitle2 from './elements/Board/SmallTitle2';
import SmallImg from './elements/Board/SmallImg';
const Button = styled.div`
background:#8e44ad;
color:white;
padding:0.1rem;
margin-right:0.2rem;
margin-bottom:0.1rem;
font-weight:bold;
border-radius:0.2rem;
font-size:0.65rem;
  @media screen and (max-width:550px) {
    padding:0.06rem;
    margin-right:0.1rem;
    font-size:0.6rem;
  }
`
const MemberComponent = (props) => {
    const history = useHistory();
    return (
        <div key={props.pk}>
            <SmallBoxContainer onClick={()=>{history.push(`/info/${props.pk}`)}}>
              <SmallImg src={props.ranking} />
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', margin: '1rem auto', width: '50%' }}>
                <SmallTitle1>{props.nick_name}</SmallTitle1>
                
                
                <div style={{ display: 'flex', margin: 'auto' }}>
                  <SmallSubContainer style={{paddingRight:'1rem',borderRight:'1px solid #cccccc'}}>
                    <SmallTitle2>전화번호</SmallTitle2>
                    <SmallContent>{props.phone_number}</SmallContent>
                  </SmallSubContainer>
                  <SmallSubContainer style={{paddingLeft:'1rem', paddingRight:'1rem',borderRight:'1px solid #cccccc'}}>
                    <SmallTitle2>레벨</SmallTitle2>
                    <img style={{marginTop: "9px"}} src={props.level}/>
                  </SmallSubContainer>
                  {props.icon &&
                  <SmallSubContainer style={{paddingLeft:'1rem', paddingRight:'1rem',borderRight:'1px solid #cccccc'}}>
                    <SmallTitle2>아이콘</SmallTitle2>
                    <img width={30} style={{marginLeft: "9px"}} src={props.icon}/>
                  </SmallSubContainer>
                  }
                  <SmallSubContainer style={{paddingLeft:'1rem', paddingRight:'1rem'}}>
                    <SmallTitle2>신뢰도</SmallTitle2>
                    <SmallContent style={{color:'#e84118'}}>{props.reliability}</SmallContent>
                  </SmallSubContainer>
                  <SmallSubContainer style={{paddingLeft:'1rem', borderLeft:'1px solid #cccccc'}}>
                    <SmallTitle2>포인트</SmallTitle2>
                    <SmallContent style={{color:'#e84118'}}>{props.point}</SmallContent>
                  </SmallSubContainer>
                </div>
              </div>
            </SmallBoxContainer>
        </div>
    )
}

export default MemberComponent