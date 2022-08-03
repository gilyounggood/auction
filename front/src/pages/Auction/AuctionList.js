import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Wrapper from '../../components/elements/Wrapper';
import '../../styles/style.css'
import ContentsWrapper from '../../components/elements/ContentWrapper';
import AuctionComponent from '../../components/AuctionComponent';
import PageContainer from '../../components/elements/PageContainer';
import PageButton from '../../components/elements/PageButton';

const AuctionList = () => {
    const [auctionList, setAuctionList] = useState([])
    const [pageList, setPageList] = useState([])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(0)

    useEffect(() => {
        async function fetchPosts() {
            const { data: response } = await axios.post('/api/auctionlist', {page: 1})
            setAuctionList(response.data.result)
            setMaxPage(response.data.maxPage)
            let arr = [];
            for (var i = 1; i <= response.data.maxPage; i++) {
                arr.push({
                    num: i
                })
            }
            setPageList(arr)
        }
        fetchPosts()
    }, [])

    async function changePage(num) {
        setPage(num)
        const { data: response } = await axios.post('/api/auctionlist', {page: num})
        setAuctionList(response.data.result)
        setMaxPage(response.data.maxPage)
        let arr = [];
        for (var i = 1; i <= response.data.maxPage; i++) {
            arr.push({
                num: i
            })
        }
        setPageList(arr)
    }

    return (
        <Wrapper>
            <ContentsWrapper style={{ borderRadius: '1rem', fontSize: '1.3rem', color: '#8e44ad', fontWeight: 'bold' }}>
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
            <ContentsWrapper style={{padding: 0, backgroundColor: '#f1f2f6', boxShadow: 'none'}}>
                <PageContainer>
                        <PageButton onClick={() => { changePage(1) }} style={{
                            color: '#5a5a5a', background: 'white', border: '1px solid #ababab'
                            , borderTopLeftRadius: '0.2rem', borderBottomLeftRadius: '0.2rem', display: `${maxPage ? '' : 'none'}`
                        }}>
                            First
                        </PageButton>
                        {pageList.map((num, index) => (
                            <PageButton key={index} style={{
                                display: `${Math.abs(page - num.num) < 4 ? '' : 'none'}`, fontSize: `${num.num >= 10 ? num.num >= 100 ? '0.6rem' : '0.75rem' : '0.9rem'}`
                                , color: `${num.num == page ? 'white' : '#ababab'}`, background: `${num.num == page ? '#8e44ad' : 'white'}`, border: `${num.num == page ? 'none' : '1px solid #ababab'}`
                            }}
                                onClick={() => { changePage(num.num) }}>
                                {num.num}
                            </PageButton>
                        ))}
                        <PageButton onClick={() => { changePage(maxPage) }} style={{
                            color: '#5a5a5a', background: 'white', border: '1px solid #ababab'
                            , borderTopRightRadius: '0.2rem', borderBottomRightRadius: '0.2rem', display: `${maxPage ? '' : 'none'}`
                        }}>
                            Last
                        </PageButton>
                </PageContainer>
            </ContentsWrapper>
        </Wrapper>
    );
};
export default AuctionList;