import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import axios from 'axios';
import '../../styles/style.css'
import ListContainer from '../../components/elements/ListContainer';
import Table from '../../components/elements/Table';
import Tr from '../../components/elements/Tr';
import Td from '../../components/elements/Td';
import { AiFillDelete } from 'react-icons/ai'
import { CgDetailsMore } from 'react-icons/cg'
import { useSelector } from 'react-redux'
import setLevel from '../../data/Level';
import { setIcon } from '../../data/Icon';
import $ from 'jquery'

const Input = styled.input`
    outline: 1px solid #c4c4c4;
    font-size:1rem;
    border:none;
    margin-left:0.3rem;
    width:25rem;
    height: 2rem;
    padding-bottom:0.2rem;
    ::placeholder {
        color: #cccccc;
    }
    @media screen and (max-width: 790px) {
        width: 285px;
    }
    &:focus {
        outline: 1px solid #0078FF;
        box-shadow: 0px 0px 2px black;
    }
`

const Button = styled.button`
width:12.2rem;
height:3rem;
border-radius:0.5rem;
border:none;
background:#8e44ad;
color:white;
box-shadow: 2px 1px 4px #00000029;
font-size:0.85rem;
cursor:pointer;
margin-left:0.3rem;
`
const Title = styled.h3`
font-size:2rem;
color:#8e44ad;
font-weight:bold;
`
const Container = styled.div`
width:80%;
padding:1rem;
display:flex;
min-height:24rem;
flex-direction:column;
text-align:left;
margin-bottom:2rem;
@media screen and (max-width:600px) {
    padding:0.5rem;
  }
`
const Content = styled.div`
display:flex;
margin-bottom:1rem;
`
const Div = styled.div`
outline:none;
font-size:0.9rem;
border:none;
border-bottom:1px solid black;
margin-left:0.3rem;
width:12rem;
padding-bottom:0.2rem;
`

const Check = styled.div`
width:21.5rem;
text-align:left;
color:red;
font-size:0.6rem;
margin-bottom:0.5rem;
margin-left:0.3rem;
height:0.6rem;
@media screen and (max-width:600px) {
    width: 15.5rem;
  }
`
const Info = () => {
    const history = useHistory()
    const params = useParams();
    const [myPk, setMyPk] = useState(0)
    const [myLevel, setMyLevel] = useState(0)
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordCheck, setNewPasswordCheck] = useState('')
    const [check, setCheck] = useState(true)
    const [buyList, setBuyList] = useState([])
    const [sellList, setSellList] = useState([])
    const [pk, setPk] = useState(0)
    const [reliability, setReliability] = useState(0)
    const [myIcon, setMyIcon] = useState("")
    const [phoneNumber, setPhoneNumber] = useState('')
    const [point, setPoint] = useState(0)
    const [communityList, setCommunityList] = useState([])
    const [userTagInfo, setUserTagInfo] = useState("")

    const level = useSelector((state) => state.level.value)

    const isAdmin = async () => {

        const { data: response } = await axios.get('/api/auth')
        if (!response.second) {
        } else {
            setMyPk(response.pk)
        }

        const { data: response2 } = await axios.post('/api/info', {
            pk: params.pk
        })
        try {
            const { data: result } = await axios.post('/api/usertaginfo', {
                user_name: response2.data.info[0].nick_name
            })
            if (result.data) {
                setUserTagInfo(result.data.userTag)
            } else {
            }
        } catch {
        }

        if (response2.data) {
            setPk(response2.data.info[0].pk)
            setReliability(response2.data.info[0].reliability)
            setNickname(response2.data.info[0].nick_name)
            setPoint(response2.data.info[0].user_point)
            setPhoneNumber(response2.data.info[0].phone_number)
            setMyIcon(response2.data.info[0].user_use_icon)
            let sell_list = []
            let buy_list = []
            for (var i = 0; i < response2?.data?.auction?.length ?? 0; i++) {
                if (response2?.data?.auction[i].buyer_pk == params.pk) {
                    buy_list.push(response2?.data?.auction[i])
                } 
                if (response2?.data?.auction[i].seller_pk == params.pk){
                    sell_list.push(response2?.data?.auction[i])
                }
            }
            setCommunityList(response2?.data?.community)
            setSellList(sell_list)
            setBuyList(buy_list)
        } else {

        }
    }

    useEffect(() => {
        isAdmin()
    }, [])

    async function deleteAuction(num) {
        const { data: response } = await axios.post('/api/delete', { tableName: 'item', pk: num })
        if(response.result>0){
            alert('삭제되었습니다.')
            window.location.reload()
        }
    }
    async function deleteCommunity(num) {
        const { data: response } = await axios.post('/api/delete', { tableName: 'community', pk: num })
        if(response.result>0){
            alert('삭제되었습니다.')
            window.location.reload()
        }
    }

    return (
        <Wrapper >
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
            }}>


                <Container>
                    <Title>Profile</Title>

                    <Content style={{ marginBottom: '1rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#1E90FF', fontSize: '1rem', fontWeight: 'bold' }}>닉네임</div>
                        <Div style={{ fontSize: '1rem', border: 'none' ,marginLeft: '3.4rem', fontWeight: 'bold', color: '#1E90FF' }}>{nickname}</Div>
                    </Content>
                    <Content style={{ marginBottom: '1rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#483D8B', fontSize: '1rem', fontWeight: 'bold' }}>전화번호</div>
                        <Div style={{ fontSize: '1rem', border: 'none' ,marginLeft: '2.5rem', fontWeight: 'bold', color: '#483D8B' }}>{phoneNumber}</Div>
                    </Content>
                    <Content style={{ marginBottom: '1rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '1rem', fontWeight: 'bold' }}>레벨</div>
                        <Div style={{ fontSize: '1rem', border: 'none' ,marginLeft: '4.4rem', fontWeight: 'bold', color: '#483D8B' }}><img width={25} src={setLevel(reliability)}/></Div>
                    </Content>
                    <Content style={{ marginBottom: '1rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#FF5675', fontSize: '1rem', fontWeight: 'bold' }}>아이콘</div>
                        <Div style={{ fontSize: '1rem', border: 'none' ,marginLeft: '3.4rem', fontWeight: 'bold', color: '#483D8B' }}>{myIcon ? <img width={25} src={setIcon(myIcon)} /> : "없음" }</Div>
                    </Content>
                    <Content style={{ marginBottom: '1rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#AE5E1A', fontSize: '1rem', fontWeight: 'bold' }}>신뢰도</div>
                        <Div style={{ fontSize: '1rem', border: 'none' ,marginLeft: '3.4rem', fontWeight: 'bold', color: '#AE5E1A' }}>{reliability}</Div>
                    </Content>
                    <Content style={{ marginBottom: '1rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#FF8200', fontSize: '1rem', fontWeight: 'bold' }}>포인트</div>
                        <Div style={{ fontSize: '1rem', border: 'none' ,marginLeft: '3.4rem', fontWeight: 'bold', color: '#FF8200' }}>{point}</Div>
                    </Content>
                    <Content style={{ marginBottom: '1rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#006400', fontSize: '1rem', fontWeight: 'bold' }}>관심 태그</div>
                        <Div style={{ fontSize: '1rem', border: 'none' ,marginLeft: '2rem', fontWeight: 'bold', color: '#006400' }}>{userTagInfo ? userTagInfo : "없음"}</Div>
                    </Content>
                </Container>

            </ContentsWrapper>
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
            }}>
                <Container>
                    <Title>판매 내역</Title>
                    <ListContainer>
                        <Table>
                            <thead>
                            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                                <Td>상품명</Td>
                                <Td>낙찰일</Td>
                                <Td>구매자</Td>
                                <Td>상태</Td>
                                <Td>상세보기</Td>
                                <Td>가격</Td>
                                <Td>비고</Td>
                            </Tr>
                            </thead>
                            <tbody>
                            {sellList && sellList.map(post => (
                                <Tr key={post.pk}>
                                    <Td>{post.name}</Td>
                                    <Td>{post.end_date}</Td>
                                    <Td>{post.buyer_nickname??'----'}</Td>
                                    <Td>{post.buy_count==0?'경매중':'경매완료'}</Td>
                                    <Td><CgDetailsMore style={{ color: '#cd84f1', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => { history.push(`/auction/${post.pk}`) }} /></Td>
                                    <Td>{post.bid_price}원</Td>
                                    <Td>
                                        {post.seller_pk==myPk?
                                        <>
                                        <AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                                                        onClick={() => {
                                                            if (window.confirm("정말로 삭제하시겠습니까?")) {
                                                                deleteAuction(post.pk)
                                                            }
                                                        }} />
                                        </>
                                        :
                                        <>
                                        ---
                                        </>}
                                    </Td>
                                </Tr>
                            ))}
                            </tbody>
                        </Table>
                    </ListContainer>
                </Container>
            </ContentsWrapper>
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
            }}>
                <Container>
                    <Title>구매 내역</Title>
                    <ListContainer>
                        <Table>
                            <thead>
                            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                                <Td>상품명</Td>
                                <Td>낙찰일</Td>
                                <Td>판매자</Td>
                                <Td>상태</Td>
                                <Td>상세보기</Td>
                                <Td>가격</Td>
                            </Tr>
                            </thead>
                            <tbody>
                            {buyList && buyList.map(post => (
                                <Tr key={post.pk}>
                                    <Td>{post.name}</Td>
                                    <Td>{post.end_date}</Td>
                                    <Td>{post.seller_nickname??'---'}</Td>
                                    <Td>{post.buy_count==0?'경매중':'경매완료'}</Td>
                                    <Td><CgDetailsMore style={{ color: '#cd84f1', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => { history.push(`/auction/${post.pk}`) }} /></Td>
                                    <Td>{post.bid_price}원</Td>
                                </Tr>
                            ))}
                            </tbody>
                        </Table>
                    </ListContainer>
                </Container>
            </ContentsWrapper>
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
            }}>
                <Container>
                    <Title>커뮤니티</Title>
                    <ListContainer>
                        <Table>
                            <thead>
                            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                                <Td>제목</Td>
                                <Td>분류</Td>
                                <Td>상세보기</Td>
                                <Td>등록일</Td>
                                <Td>비고</Td>
                            </Tr>
                            </thead>
                            <tbody>
                            {communityList && communityList.map(post => (
                                <Tr key={post.pk}>
                                    <Td>{post.title}</Td>
                                    <Td>{post.kind==1?'공지사항':'자유게시판'}</Td>
                                    <Td><CgDetailsMore style={{ color: '#cd84f1', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => { history.push(`/community/${post.pk}`) }} /></Td>
                                    <Td>{post.create_time}</Td>
                                    <Td>{post.user_pk==myPk?
                                        <>
                                        <AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                                                        onClick={() => {
                                                            if (window.confirm("정말로 삭제하시겠습니까?")) {
                                                                deleteCommunity(post.pk)
                                                            }
                                                        }} />
                                        </>
                                        :
                                        <>
                                        ---
                                        </>}</Td>
                                </Tr>
                            ))}
                            </tbody>
                        </Table>
                    </ListContainer>
                </Container>
            </ContentsWrapper>
        </Wrapper>
    );
};
export default Info;