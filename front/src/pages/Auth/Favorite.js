import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components'
import Wrapper from '../../components/elements/Wrapper';
import '../../styles/style.css'
import Table from '../../components/elements/Table';
import Tr from '../../components/elements/Tr';
import Td from '../../components/elements/Td';
import axios from 'axios';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import ListContainer from '../../components/elements/ListContainer';
import { AiFillDelete } from 'react-icons/ai'
import { CgDetailsMore } from 'react-icons/cg'
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
const Title = styled.h3`
font-size:2rem;
color:#8e44ad;
font-weight:bold;
`
const Favorite = () => {
    const history = useHistory()
    const [favoriteList, setFavoriteList] = useState([])
    const [auth, setAuth] = useState({})
    const isAdmin = async () => {
        const { data: response } = await axios.get('/api/auth')
        if (!response.second) {
            history.push('/profile')
        } else {
            setAuth(response)
            const {data:response2} = await axios.post('/api/myfavorite',{
                pk:response.pk
            })
            setFavoriteList(response2?.data ?? [])
        }
    }
    useEffect(() => {
        isAdmin()
    }, [])
    async function updateFavorite(num) {
        const { data: response } = await axios.post('/api/updatefavorite', {
            status: -1,
            userPk: auth.pk,
            itemPk: num
        })
        if (response.result > 0) {
            window.location.reload()
        } else {
            alert('서버 에러 발생')
        }
    }
    return (
        <Wrapper>
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
            }}>
                <Container>
                    <Title>즐겨찾기</Title>
                    <ListContainer>
                        <Table>
                            <thead>
                            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                                <Td>상품명</Td>
                                <Td>마감일</Td>
                                <Td>상태</Td>
                                <Td>판매자</Td>
                                <Td>상세보기</Td>
                                <Td>삭제</Td>
                            </Tr>
                            </thead>
                            <tbody>
                            {favoriteList && favoriteList.map(post => (
                                <Tr>
                                    <Td>{post.name}</Td>
                                    <Td>{post.end_date}</Td>
                                    <Td>{post.buy_count == 0 ? '경매중' : '경매완료'}</Td>
                                    <Td>{post.seller_nickname}</Td>
                                    <Td><CgDetailsMore style={{ color: '#cd84f1', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => { history.push(`/auction/${post.pk}`) }} /></Td>
                                    <Td><AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                                        onClick={() => {
                                            if (window.confirm("정말로 삭제하시겠습니까?")) {
                                                updateFavorite(post.pk)
                                            }
                                        }} /></Td>
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
export default Favorite;