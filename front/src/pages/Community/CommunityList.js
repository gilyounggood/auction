import React from 'react'
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import PageContainer from '../../components/elements/PageContainer';
import PageButton from '../../components/elements/PageButton';
import SlideButton from '../../components/elements/SlideButton';
import Table from '../../components/elements/Table';
import Tr from '../../components/elements/Tr';
import Td from '../../components/elements/Td';
import Date from '../../components/elements/Date';
import ListContainer from '../../components/elements/ListContainer';
import ScaleLoader from "react-spinners/ScaleLoader";
import axios from 'axios';
import { CgDetailsMore } from 'react-icons/cg'
import Button from '../../components/elements/Button';
import RightButtonContainer from '../../components/elements/RightButtonContainer';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
const P = styled.td`
padding-left 0.2rem;
font-size: 0.9rem; 
font-weight: bold; 
color: #5a5a5a;
padding:0.7rem 0;
@media screen and (max-width:500px) {
    font-size: 0.7rem; 
  }
`
const CommunityList = () => {
    const history = useHistory()
    const params = useParams()
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
    async function deleteArticle(num) {
        const { data: response } = await axios.post('/api/delete', { tableName: 'community', pk: num })
        if(response.result>0){
            changePage(page)
        }
    }
    return (
        <Wrapper style={{ minHeight: '70.8vh' }}>
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
                                                <Td>작성자</Td>
                                                <Td>제목</Td>
                                                <Td>상세보기</Td>
                                                <Date style={{ marginRight: '5.4rem' }}>등록일</Date>
                                                <Td>수정</Td>
                                                <Td>삭제</Td>
                                            </>
                                            :
                                            <>
                                            </>

                                    }

                                    {
                                        slide == 3 ?
                                            <>
                                                <Td>상품명</Td>
                                                <Td>구매자</Td>
                                                <Td>판매자</Td>
                                                <Date style={{ marginRight: '5.4rem' }}>낙찰일</Date>
                                                {myLevel >= 40 ? <Td>삭제</Td> : <></>}
                                            </>
                                            :
                                            <>
                                            </>

                                    }


                                </Tr>
                                </thead>
                                <tbody>
                                {posts && posts.map((post, index) => (
                                    <Tr key={post.pk}>
                                        {
                                            slide == 1 || slide == 2 ?
                                                <>
                                                    <Td>{post.user_nickname}</Td>
                                                    <Td>{post.title}</Td>
                                                    <Td><CgDetailsMore style={{ color: '#cd84f1', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => { history.push(`/community/${post.pk}`) }} /></Td>
                                                    <Date style={{ marginRight: '5.4rem' }}>{post.create_time}</Date>
                                                    {myLevel >= 40 || post.user_pk === myPk ? <P><AiFillEdit style={{ color: '289AFF', fontSize: '1.3rem', cursor: 'pointer' }}
                                                        onClick={() => {
                                                            history.push(`/editcommunity/${post.pk}`)
                                                        }} /></P> : <></>}
                                                    {myLevel >= 40 || post.user_pk === myPk ? <P><AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                                                        onClick={() => {
                                                            if (window.confirm("정말로 삭제하시겠습니까?")) {
                                                                deleteArticle(post.pk)
                                                            }
                                                        }} /></P> : <></>}
                                                </>
                                                :
                                                <>
                                                </>

                                        }
                                        {
                                            slide == 3 ?
                                                <>
                                                    <Td>{post.name}</Td>
                                                    <Td>{post.buyer_nickname ?? '---'}</Td>
                                                    <Td>{post.seller_nickname ?? '---'}</Td>
                                                    <Date style={{ marginRight: '5.4rem' }}>{post.end_date}</Date>
                                                    {myLevel >= 40 ? <P><AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                                                        onClick={() => {
                                                            if (window.confirm("정말로 삭제하시겠습니까?")) {
                                                                deleteArticle(post.pk)
                                                            }
                                                        }} /></P> : <></>}
                                                </>
                                                :
                                                <>
                                                </>

                                        }


                                    </Tr>
                                ))}
                                </tbody>
                            </Table>
                        </ListContainer>

                    </>
                }

                {slide == 1 && myLevel >= 40 ?
                    <>
                        <RightButtonContainer>
                            <Button onClick={() => { history.push('/addcommunity/1') }}>추가하기</Button>
                        </RightButtonContainer>
                    </>
                    : <>
                    </>
                }
                {slide == 2 && myLevel >= 0 ?
                    <>
                        <RightButtonContainer>
                            <Button onClick={() => { history.push('/addcommunity/2') }}>추가하기</Button>
                        </RightButtonContainer>
                    </>
                    :
                    <>
                    </>
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
    );
};
export default CommunityList;