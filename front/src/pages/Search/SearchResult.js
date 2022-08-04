import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

import Wrapper from '../../components/elements/Wrapper';
import '../../styles/style.css'
import ContentsWrapper from '../../components/elements/ContentWrapper';
import AuctionComponent from '../../components/AuctionComponent';
import HomeComponent from '../../components/HomeComponent';
import Table from '../../components/elements/Table';
import Tr from '../../components/elements/Tr';
import Td from '../../components/elements/Td';

const SearchResult = () => {
    const location = useLocation();
    const [auctionList, setAuctionList] = useState([])
    
    useEffect(() => {
        async function fetchPosts() {
            const { data: response } = await axios.post('/api/searchauction', { keyword: location.state.keyword ?? '', kind: location.state.kind ?? ''})
            setAuctionList(response.data)
        }
        fetchPosts()
    }, [])
    return (
        <Wrapper>
            <ContentsWrapper style={{ borderRadius: '1rem', fontSize: '1rem', color: '#8e44ad', fontWeight: 'bold' }}>
                검색어: {location.state.keyword}
            </ContentsWrapper>
            {auctionList[0] ?
                location.state.kind==="auction" || location.state.kind==="username" ?
                <ContentsWrapper style={{ flexDirection: 'row', flexWrap: 'wrap', boxShadow: 'none', background: '#f1f2f6' }}>
                    {auctionList.map(post => (
                        <div key={post.pk}>
                            <AuctionComponent pk={post.pk} main_image={post.main_image} name={post.name} buy_count={post.buy_count} seller_reliability={post.seller_reliability}
                                create_time={post.create_time} end_date={post.end_date} seller_nickname={post.seller_nickname} bid_price={post.bid_price} />
                        </div>
                    ))}
                </ContentsWrapper>
                : 
                <ContentsWrapper style={{flexWrap: 'wrap', boxShadow: 'none', background: '#f1f2f6' }}>
                <Table>
                  <thead>
                    <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                        <Td width={100}>번호</Td>
                        <Td width={150}>닉네임</Td>
                        <Td width={300}>제목</Td>
                        <Td width={300}>등록일</Td>
                        <Td width={100}>상세보기</Td>
                    </Tr>
                  </thead>
                  {auctionList.map((post)=>(
                  <tbody key={post.pk}>
                    <HomeComponent pk={post.pk} title={post.title} create_time={post.create_time} user_nickname={post.user_nickname}
                      reliability={post.user_reliability} icon={post.user_icon} views={post.views}   />
                  </tbody>
                  ))}
                </Table>
              </ContentsWrapper>      
            :                 
                <ContentsWrapper style={{ borderRadius: '1rem', fontSize: '1rem', color: 'black', fontWeight: 'bold',}}>
                    <div>
                        <span style={{color: 'red'}}>"{location.state.keyword}"</span>에 대한 검색결과 없습니다.
                    </div>
                    <div style={{fontWeight: 'normal'}}>
                        - 단어를 정확하게 입력했는지 확인해 보세요.<br></br>
                        - 두 단어 이상의 검색어인 경우에는 띄워쓰기가 맞는지 확인해 보세요.<br></br>
                        - 한글을 영어로 또는 영어를 한글로 잘못 입력했는지 확인해 보세요.
                    </div>
                </ContentsWrapper>
            }
        </Wrapper>
    );
};
export default SearchResult;