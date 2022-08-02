import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components'
import Wrapper from '../../components/elements/Wrapper';
import '../../styles/style.css'
import ContentsWrapper from '../../components/elements/ContentWrapper';
import AuctionComponent from '../../components/AuctionComponent';

const AuctionList = () => {
    const location = useLocation();
    const [auctionList, setAuctionList] = useState([])
    
    useEffect(() => {
        async function fetchPosts() {
            
            const { data: response } = await axios.post('/api/home')
            setAuctionList(response.data)
        }
        fetchPosts()
    }, [])
    return (
        <Wrapper>
            <ContentsWrapper style={{ borderRadius: '1rem', fontSize: '1rem', color: '#8e44ad', fontWeight: 'bold' }}>
                진행중인 경매 목록
            </ContentsWrapper>
            <ContentsWrapper style={{ flexDirection: 'row', flexWrap: 'wrap', boxShadow: 'none', background: '#f1f2f6' }}>
                {auctionList.map(post => (
                    <div key={post.pk}>
                        <AuctionComponent pk={post.pk} main_image={post.main_image} name={post.name} buy_count={post.buy_count} seller_reliability={post.seller_reliability}
                            create_time={post.create_time} end_date={post.end_date} seller_nickname={post.seller_nickname} bid_price={post.bid_price} />
                    </div>
                ))}
            </ContentsWrapper>

        </Wrapper>
    );
};
export default AuctionList;