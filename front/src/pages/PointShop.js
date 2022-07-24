import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components'
import ContentsWrapper from '../components/elements/ContentWrapper';
import Wrapper from '../components/elements/Wrapper';
import IconComponent from '../components/IconComponent';
import IconList from '../data/Icon';
import ScaleLoader from "react-spinners/ScaleLoader";
import Button from '../components/elements/Button';
import '../styles/style.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/style.css'
import PointModal from '../components/modals/PointModal';
const PointShop = () => {
    const [auth, setAuth] = useState(false)
    const [loading, setLoading] = useState(false)
    const [myNickName, setMyNickName] = useState("")
    const[myPoint, setMyPoint] = useState(0)
    const [modal, setModal] = useState(false)

    const history = useHistory()

    async function fecthUser() {
      setLoading(true)
      const {data:response} = await axios.get('/api/auth')
      if(!response.second) {
        setAuth(false)
        setLoading(false)
      } else {
        setAuth(true)
        try {
          const { data: response2 } = await axios.post('api/info', {
            pk: response.pk
          })
          setMyNickName(response2.data.info[0].nick_name)
          setMyPoint(response2.data.info[0].user_point)
        } catch {}
          setLoading(false)
      }
  }

    useEffect (() => {
        fecthUser()
    }, [])

    const openModal = () => {
      setModal(true)
    }

    const closeModal = () => {
      setModal(false)
    }

  return (
    <>
      <PointModal open={modal} close={closeModal}/>
      <Wrapper> 
        {loading ? 
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
          , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`,
        }}>
          <ScaleLoader height="80" width="16" color="#8e44ad" radius="8" />
        </div> 
        :
        <>
          <ContentsWrapper style={{
          borderRadius: '1rem', fontSize: '1rem', color: '#8e44ad', fontWeight: 'bold', borderRadius: '0.5rem'
          , alignItems: 'center', fontSize: '1.3rem', display:'flex', justifyContent: 'center', flexDirection: 'row'
        }}>
          {auth? 
          <>
            {myNickName}님의 포인트: {myPoint} Point
            <Button
              style={{width: '6rem', height: '2rem', marginLeft: '10px'}}
              onClick={openModal}
            >
              충전하기
            </Button>
          </> 
          :
          <>
            로그인 후 이용하실 수 있습니다
          </> 
          }
        </ContentsWrapper>
        </>
        }
        <ContentsWrapper style={{ 
          justifyContent: "center",
          alignItems: "center",
          flexDirection: 'row', 
          flexWrap: 'wrap',
          borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`,
          minHeight:'28rem'}}>
            {IconList.map((icon)=>(
              <div key={icon.pk}>
              <IconComponent pk={icon.pk} image={icon.image} name={icon.name} point={icon.point} />
              </div>
            ))}
        </ContentsWrapper>
      </Wrapper>
    </>
  );
};
export default PointShop;