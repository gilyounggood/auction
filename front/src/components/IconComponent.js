import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import ContentsWrapper from '../components/elements/ContentWrapper';
import axios from 'axios';
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

const IconComponent = (props) => {

  const[auth, setAuth] = useState({})
  const [myPoint, setMyPoint] = useState(0)
  const [userIcon, setUserIcon] = useState(null)
  const [usingIcon, setUsingIcon] = useState("")

  async function fecthUser() {
    const {data:response} = await axios.get('/api/auth')
    setAuth(response)
  try {
    const {data:response2} = await axios.post('/api/info', {
      pk: response.pk
    })
    setMyPoint(response2.data.info[0].user_point)
    setUserIcon(response2.data.info[0].user_icon)
    setUsingIcon(response2.data.info[0].user_use_icon)
  } catch {}
  }

  useEffect (() => {
      fecthUser()
  }, [])

  const buyIcon = async (name, point) => {
    if(!auth?.pk) {
      alert("????????? ??? ?????? ???????????????.")
    } else if(myPoint < point) {
      alert(`???????????? ???????????????. ?????? ?????????: ${point - myPoint}`)
    } else {
      await axios.post('/api/buyicon', {
        pk: auth?.pk,
        name: name,
        point: point,
      })
      alert(`${name}???????????? ??????????????????.`)
      window.location.reload()
    }
  }

  const applyIcon = async (name) => {
    if(usingIcon === name) {
      alert("?????? ???????????? ??????????????????.")
    } else {
      await axios.post('/api/applyicon', {
        pk: auth?.pk,
        name: name,
      })
      alert(`${name}???????????? ??????????????????. ???????????? ??? ???????????? ???????????????.`)
      window.location.reload()
    }
  }

  return (
    <>
      <BoxContent>
        <BoxImage>
        <IconImage width={60} src={props.image} />
        </BoxImage>
        <LeftTextBox style={{ fontSize: '1rem', fontWeight: 'bold' }}>{props.name}</LeftTextBox>
        <RightTextBox style={{ fontSize: '0.8rem', color: '#5a5a5a' }}>?????? | <strong style={{ fontSize: '1rem', color: '#e84118' }}>{props.point} Point</strong></RightTextBox>
        <RightTextBox style={{ 
          fontSize: '0.8rem', 
          color: userIcon && userIcon.indexOf(props.name) === -1 || userIcon === null ? '#006400' : "#800080"
        }}>
          ?????? | {userIcon && userIcon.indexOf(props.name) === -1 || userIcon === null ? "?????????" : "????????????"}
        </RightTextBox>
        {userIcon && userIcon.indexOf(props.name) === -1  || userIcon === null ?
        <>
        <CenterTextBox 
          style={{ fontSize: '1rem', color: '#0000CD', cursor: "pointer" }}
          onClick={() => {
              if(window.confirm(`${props.name} ???????????? ?????????????????????????`)) {
                buyIcon(props.name, props.point)
              }
            }
          }
        >
          ????????????
        </CenterTextBox>
        </>
        :
        <>
        <CenterTextBox 
          style={{ 
            fontSize: '1rem', 
            color: usingIcon === props.name ? '#D65BC1' : "#C71585", 
            cursor: "pointer" }}
          onClick={() => {
              if(window.confirm(`${props.name} ???????????? ?????????????????????????`)) {
                applyIcon(props.name)
              }
            }
          }
        >
          {usingIcon === props.name ? "?????????" : "????????????"}
        </CenterTextBox> 
        </>
        }
      </BoxContent>
    </>
  )
}

export default IconComponent