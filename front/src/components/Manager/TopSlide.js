import React from 'react'
import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import axios from 'axios';
import SlideButton from '../../components/elements/Button/SlideButton';

const TopSlide = (props) => {
    const history = useHistory()
    const [category, setCategory] = useState("")
    
    const isAdmin = async () => {
       
        const { data: response0 } = await axios.get('/api/auth')
        if (!response0.first) {
            alert("관리자만 접근 가능합니다.")
            history.push('/')
        }
       
    }
    useEffect(() => {
        isAdmin()
        setCategory(props.category)
       
    }, [])
  
    
    return (
      
            <ContentsWrapper style={{ flexDirection: 'row', flexWrap: 'wrap', boxShadow: 'none', background: '#f1f2f6', justifyContent: "space-between" }}>
                <SlideButton style={{ color: `${category == 'shop' ? 'white' : '#9b59b6'}`, background: `${category == 'shop' ? '#9b59b6' : 'white'}`, width: '23%' }}
                    onClick={() => {
                       history.push('/manager/shoplist')
                    }}>
                    업체관리
                </SlideButton>
                <SlideButton style={{ color: `${category == 'community' ? 'white' : '#9b59b6'}`, background: `${category == 'community' ? '#9b59b6' : 'white'}`, width: '23%' }}
                    onClick={() => {
                        history.push('/manager/communitylist')
                    }}>
                    커뮤니티관리
                </SlideButton>
                <SlideButton style={{ color: `${category == 'user' ? 'white' : '#9b59b6'}`, background: `${category == 'user' ? '#9b59b6' : 'white'}`, width: '23%' }}
                    onClick={() => {
                        history.push('/manager/userlist')
                    }}>
                    회원관리
                </SlideButton>
                <SlideButton style={{ color: `${category == 'ad' ? 'white' : '#9b59b6'}`, background: `${category == 'ad' ? '#9b59b6' : 'white'}`, width: '23%' }}
                    onClick={() => {
                        history.push('/manager/adlist')
                    }}>
                    광고관리
                </SlideButton>

            </ContentsWrapper>

    );
};
export default TopSlide;