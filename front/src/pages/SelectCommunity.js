import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import ContentsWrapper from '../components/elements/ContentWrapper';
import Wrapper from '../components/elements/Wrapper';
import { GrNext } from 'react-icons/gr'
import axios from 'axios';

const CityContainer = styled.div`
width: 100%;
    background: #fff;
    display: flex;
    overflow: hidden;
`
const ThemeList = styled.div`
width:80%;
margin:0 auto;
`
const Theme = styled.div`
display:flex;
justify-content:space-between;
align-items:center;
cursor:pointer;
color:#2e2e2e;
border-bottom:1px solid #cccccc;
font-size:1rem;
`
const SelectCommunity = () => {
    const history = useHistory()
    const themeList = ['공지사항',1,'자유게시판',2,'낙찰된 상품',3];

    useEffect(() => {
    }, [])

    async function goToPage(num){
        
            history.push(`/communitylist/${themeList[num]}`)
        
    }
    return (
        <Wrapper >
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`,minHeight:'28rem'
            }}>
                <CityContainer>
                    <ThemeList>
                            <Theme onClick={() => history.push('/auctionlist')}>
                                <p style={{ paddingLeft: '0.4rem', fontSize: '1rem' }}>진행중인 경매 목록</p>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#9b59b6' }}>자세히보기</div>
                                    <GrNext style={{ height: '0.8rem', color: '#9b59b6' }} />
                                </div>
                            </Theme>
                        {themeList.map((theme, index) => (
                            <Theme key={theme} onClick={() => { goToPage(index+1)}} style={{display:`${index%2==0?'':'none'}`}}>
                                <p style={{ paddingLeft: '0.4rem', fontSize: '1rem' }}>{theme}</p>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#9b59b6' }}>자세히보기</div>
                                    <GrNext style={{ height: '0.8rem', color: '#9b59b6' }} />
                                </div>
                            </Theme>
                        ))}
                    </ThemeList>
                </CityContainer>
            </ContentsWrapper>
        </Wrapper>
    );
};
export default SelectCommunity;