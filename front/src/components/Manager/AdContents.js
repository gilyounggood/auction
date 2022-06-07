import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import { GrNext } from 'react-icons/gr'
import axios from 'axios';
import ScaleLoader from "react-spinners/ScaleLoader";
import { AiOutlineSearch } from 'react-icons/ai'
import PageContainer from '../../components/elements/PageContainer';
import PageButton from '../../components/elements/PageButton';

const Title = styled.h3`
font-size:2.5rem;
color:#8e44ad;
font-weight:bold;
`
const SubTitle = styled.div`
width:21.5rem;
text-align:left;
color:#9b59b6;
font-weight:bold;
font-size:1rem;
margin-bottom:0.5rem;
@media screen and (max-width:600px) {
    width: 15.5rem;
  }
`
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
color:#2e2e2e;
border-bottom:1px solid #cccccc;
font-size:1rem;
`
const SearchContainer = styled.div`

border:1px solid #8e44ad;
border-radius:0.6rem;
align-items:center;
padding:8px 0;
display:flex;
margin:0 auto;
background:#fff;
`
const SearchInput = styled.input`
width:22rem;
padding:0 5px 0 5px;
font-size:1rem;
outline:none;
border:none;
margin-left:1rem;
color:#2e2e2e;
@media screen and (max-width:1050px) {
    width: 19rem;
  }
  @media screen and (max-width:900px) {
    width: 16rem;
  }
  @media screen and (max-width:750px) {
    width: 13rem;
  }
  @media screen and (max-width:600px) {
    width: 10rem;
  }
`
const Date = styled.div`
fontSize: 0.9rem;
fontWeight: bold;
color: #cccccc;
@media screen and (max-width:500px) {
    display:none;
  }
`
const RadioContainer = styled.div`
margin:1rem auto;
max-width:24rem;
display:flex;
justify-content:space-around;
`
const RadioContent = styled.div`
display:flex;
align-items:center;

`
const Label = styled.label`
font-size:0.8rem;
margin: 0 0.5rem 0 0.2rem;
`
const Radio = styled.input`
margin:0;
`
const Manager = () => {
    //----------------------------------------공통
    const history = useHistory()
    const params = useParams()

    const [loading, setLoading] = useState(false)
    const [keyword, setKeyword] = useState("")
    const [category, setCategory] = useState("")
    const [posts, setPosts] = useState([])
    const [pageList, setPageList] = useState([])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(0)

    const themeList = ['커뮤니티관리', '업체관리', '회원관리', '광고관리'];

    const isAdmin = async () => {
        setLoading(true)
        const { data: response0 } = await axios.get('/api/auth')
        if (!response0.first) {
            alert("관리자만 접근 가능합니다.")
            history.push('/')
        }
        setLoading(false)
    }
    useEffect(() => {
        isAdmin()
        async function fetchPosts() {
            setLoading(true)
            let arr = [];
            for (var i = 1; i <= 75; i++) {
                arr.push({
                    num: i
                })
            }
            setMaxPage(75)
            setPageList(arr)
            setLoading(false)
        }
        fetchPosts()
    }, [])
    async function changePage(num) {
        setPage(num)
    }
    const onChangeKeyword = (e) => {
        setKeyword(e.target.value)
    }
    return (
        <Wrapper >
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
                        <Title>Manager<br/>{params.category}</Title>
                        <SearchContainer>
                            <SearchInput onChange={onChangeKeyword} />
                            <AiOutlineSearch style={{ fontSize: '1.3rem', padding: '0.3rem 1rem 0.3rem 0.3rem', color: '#8e44ad', cursor: 'pointer' }} />
                        </SearchContainer>
                        <RadioContainer>
                            <RadioContent>
                                <Radio type='radio' name='article' id='all' onChange={(e) => { setCategory("") }} /><Label for='all'>전체</Label>
                            </RadioContent>
                            <RadioContent>
                                <Radio type='radio' name='article' id='notice' onChange={(e) => { setCategory("공지사항") }} /><Label for='notice'>공지사항</Label>
                            </RadioContent>
                            <RadioContent>
                                <Radio type='radio' name='article' id='review' onChange={(e) => { setCategory("방문후기") }} /><Label for='review'>방문후기</Label>
                            </RadioContent>
                            <RadioContent>
                                <Radio type='radio' name='article' id='joboffer' onChange={(e) => { setCategory("구인구직") }} /><Label for='joboffer'>구인구직</Label>
                            </RadioContent>
                            <RadioContent>
                                <Radio type='radio' name='article' id='event' onChange={(e) => { setCategory("이벤트") }} /><Label for='event' style={{ marginRight: '0' }}>이벤트</Label>
                            </RadioContent>
                        </RadioContainer>
                        <CityContainer>

                            <ThemeList>
                                <Theme style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                                    <p style={{ paddingLeft: '0.4rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#cccccc' }}>제목</p>
                                    <Date style={{ marginRight: '5.4rem' }}>작성일</Date>
                                </Theme>
                                {themeList.map((theme, index) => (
                                    <Theme>
                                        <p style={{ paddingLeft: '0.4rem', fontSize: '1rem' }}>{theme}</p>
                                        <Date style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#cccccc' }}>2021-11-02 20:10:07</Date>
                                    </Theme>
                                ))}
                            </ThemeList>
                        </CityContainer>
                        <PageContainer>
                            <PageButton onClick={() => { changePage(1) }} style={{
                                color: '#5a5a5a', background: 'white', border: '1px solid #ababab'
                                , borderTopLeftRadius: '0.2rem', borderBottomLeftRadius: '0.2rem'
                            }}>
                                First
                            </PageButton>
                            {pageList.map(num => (
                                <PageButton style={{
                                    display: `${Math.abs(page - num.num) < 4 ? '' : 'none'}`, fontSize: `${num.num >= 10 ? num.num >= 100 ? '0.6rem' : '0.75rem' : '0.9rem'}`
                                    , color: `${num.num == page ? 'white' : '#ababab'}`, background: `${num.num == page ? '#8e44ad' : 'white'}`, border: `${num.num == page ? 'none' : '1px solid #ababab'}`
                                }}
                                    onClick={() => { changePage(num.num) }}>
                                    {num.num}
                                </PageButton>
                            ))}
                            <PageButton onClick={() => { changePage(maxPage) }} style={{
                                color: '#5a5a5a', background: 'white', border: '1px solid #ababab'
                                , borderTopRightRadius: '0.2rem', borderBottomRightRadius: '0.2rem'
                            }}>
                                Last
                            </PageButton>
                        </PageContainer>
                    </>
                }
            </ContentsWrapper>
        </Wrapper>
    );
};
export default Manager;