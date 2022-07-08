import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components'
import ContentsWrapper from '../components/elements/ContentWrapper';
import Wrapper from '../components/elements/Wrapper';
import IconComponent from '../components/IconComponent';
import IconList from '../data/Icon';
import '../styles/style.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/style.css'
const PointShop = () => {
    const[auth, setAuth] = useState({})

    useEffect (() => {
        async function fecthUser() {
        const {data:response} = await axios.get('/api/auth')
        setAuth(response)
        console.log(response)
        }
        fecthUser()
    }, [])

  return (
    <Wrapper> 
      {auth &&
        <ContentsWrapper style={{
        borderRadius: '1rem', fontSize: '1rem', color: '#8e44ad', fontWeight: 'bold', borderRadius: '0.5rem'
        , alignItems: 'center', fontSize: '1.3rem'
      }}>
        {auth.nick_name}님의 포인트: {auth.user_point} Point
        </ContentsWrapper>
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
  );
};
export default PointShop;