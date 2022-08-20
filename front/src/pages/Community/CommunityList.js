import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import Wrapper from '../../components/elements/Wrapper'
import ContentsWrapper from '../../components/elements/ContentWrapper'
import SlideButton from '../../components/elements/SlideButton'
import ListComponent from '../../components/ListComponent'
import PageContainer from '../../components/elements/PageContainer'
import PageButton from '../../components/elements/PageButton'
import ScaleLoader from "react-spinners/ScaleLoader";
import Table from '../../components/elements/Table'
import Tr from '../../components/elements/Tr'
import Td from '../../components/elements/Td'
import Date from '../../components/elements/Date'
import ListContainer from '../../components/elements/ListContainer'
import Button from '../../components/elements/Button'
import RightButtonContainer from '../../components/elements/RightButtonContainer'

function CommunityList() {
    const history = useHistory();
    const params = useParams();
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const [pageList, setPageList] = useState([])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(0)
    const [slide, setSlide] = useState(0)
    const [posts, setPosts] = useState([])
    const [myLevel, setMyLevel] = useState(0);
    const [myPk, setMyPk] = useState(0)
    useEffect(() => {
        async function fetchPosts() {
            setLoading(true)
            const { data: response0 } = await axios.get('/api/auth')
            setMyLevel(response0?.level ?? -100)
            setMyPk(response0?.pk ?? -100)
            let url = '';
            let obj = {};
            if (params.pk == 1 || params.pk == 2) {
                url = '/api/communitylist'
                obj = {
                    page: 1,
                    kind: params.pk
                }
            } else if (params.pk == 3) {
                url = '/api/endauctionlist'
                obj = {
                    page: 1
                }
            } else {
                history.push('/selectcommunity')
            }
            const { data: response } = await axios.post(url, obj)
            setSlide(params.pk)
            setPosts(response.data.result)
            setMaxPage(response.data.maxPage)
            let arr = [];
            for (var i = 1; i <= response.data.maxPage; i++) {
                arr.push({
                    num: i
                })
            }
            setPageList(arr)
            setLoading(false)
            
        }
        fetchPosts()
    }, [location.pathname])
    async function changePage(num) {
        setLoading(true)
        setPage(num)
        let url = '';
        let obj = {};
        if (params.pk == 1 || params.pk == 2) {
            url = '/api/communitylist'
            obj = {
                page: num,
                kind: params.pk
            }
        } else if (params.pk == 3) {
            url = '/api/endauctionlist'
            obj = {
                page: num
            }
        } else {
            history.push('/selectcommunity')
        }
        const { data: response } = await axios.post(url, obj)
        setPosts(response.data.result)
        setMaxPage(response.data.maxPage)
        let arr = [];
        for (var i = 1; i <= response.data.maxPage; i++) {
            arr.push({
                num: i
            })
        }
        setPageList(arr)
        setLoading(false)
    }

  return (
    <Wrapper style={{ minHeight: '70.8vh'} }>
        <ContentsWrapper style={{ flexDirection: 'row', flexWrap: 'wrap', boxShadow: 'none', background: '#f1f2f6', justifyContent: "space-between" }}>
            <SlideButton style={{ color: `${slide == 1 ? 'white' : '#9b59b6'}`, background: `${slide == 1 ? '#9b59b6' : 'white'}`, width: '30%' }}
                onClick={() => {
                history.push('/communitylist/1')
                }}>
                공지사항
            </SlideButton>
            <SlideButton style={{ color: `${slide == 2 ? 'white' : '#9b59b6'}`, background: `${slide == 2 ? '#9b59b6' : 'white'}`, width: '30%' }}
                onClick={() => {
                history.push('/communitylist/2')
                }}>
                자유게시판
            </SlideButton>
            <SlideButton style={{ color: `${slide == 3 ? 'white' : '#9b59b6'}`, background: `${slide == 3 ? '#9b59b6' : 'white'}`, width: '30%' }}
                onClick={() => {
                history.push('/communitylist/3')
                }}>
                낙찰된 상품
            </SlideButton>
        </ContentsWrapper>
        <ContentsWrapper style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
            , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`
        }}>
            {loading ?
                <>
                    <ScaleLoader height="80" width="16" color="#8e44ad" radius="8" />
                </>
                :
                <>
                    <ListContainer style={{ marginTop: '1rem' }}>
                        <Table>
                            <thead>
                            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                                {
                                    slide == 1 || slide == 2 ?
                                        <>
                                            <Td>번호</Td>
                                            <Td>작성자</Td>
                                            <Td>제목</Td>
                                            <Td>상세보기</Td>
                                            <Td>등록일</Td>
                                            <Td>조회</Td>
                                            <Td>추천</Td>
                                            <Td>수정</Td>
                                            <Td>삭제</Td>
                                        </>
                                        : null
                                }
                                {
                                    slide == 3 ?
                                        <>
                                            <Td>번호</Td>
                                            <Td>상품명</Td>
                                            <Td>구매자</Td>
                                            <Td>판매자</Td>
                                            <Td>상세보기</Td>
                                            <Date style={{ color: 'black' }}>낙찰일</Date>
                                            {myLevel >= 40 ? <Td>삭제</Td> : <></>}
                                        </>
                                        : null
                                }
                            </Tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <ListComponent key={post.pk} pk={post.pk} title={post.title} create_time={post.create_time} user_nickname={post.user_nickname} 
                                        views={post.views} user_reliability={post.user_reliability} user_icon={post.user_icon} user_pk={post.user_pk}
                                        name={post.name} buyer_nickname={post.buyer_nickname} seller_nickname={post.seller_nickname} end_date={post.end_date}
                                        slide={slide} myPk={myPk} myLevel={myLevel} changePage={changePage} page={page}
                                    />
                                ))
                                }
                            </tbody>
                            </Table>
                    </ListContainer>
                </>
            }
            {slide == 1 && myLevel >= 40 ?
                <>
                    <RightButtonContainer>
                        <Button style={{width: '6rem', height: '2.5rem'}} onClick={() => { history.push('/addcommunity/1') }}>글쓰기</Button>
                    </RightButtonContainer>
                </>
                : null
            }
            {slide == 2 && myLevel >= 0 ?
                <>
                    <RightButtonContainer>
                        <Button style={{width: '6rem', height: '2.5rem'}} onClick={() => { history.push('/addcommunity/2') }}>글쓰기</Button>
                    </RightButtonContainer>
                </>
                : null
            }
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
  )
}

export default CommunityList
