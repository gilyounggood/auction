import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import axios from 'axios';
import ListContainer from '../../components/elements/ListContainer';
import Table from '../../components/elements/Table';
import Td from '../../components/elements/Td';
import Tr from '../../components/elements/Tr';
import { AiFillDelete } from 'react-icons/ai'
import { CgDetailsMore } from 'react-icons/cg'

const Title = styled.h3`
font-size:2.5rem;
color:#8e44ad;
font-weight:bold;
`

const Container = styled.div`
width:80%;
padding:1rem;
display:flex;
flex-direction:column;
text-align:left;
margin-bottom:2rem;
@media screen and (max-width:600px) {
    padding:0.5rem;
  }
`

const MyLog = () => {
    const history = useHistory()
    const params = useParams();
    const [buyList, setBuyList] = useState([])
    const [sellList, setSellList] = useState([])
    const [communityList, setCommunityList] = useState([])

    async function fetchInfo(){
      const { data: response } = await axios.get('/api/auth')
      if(!response.second || params.pk != response.pk) {
        alert("접근 권한이 없습니다.")
        history.push('/profile')
      } else {
        const { data: response2 } = await axios.post('/api/info', {
          pk: params.pk
      })
          if (response2.data) {
            let sell_list = []
            let buy_list = []
            for (var i = 0; i < response2?.data?.auction?.length ?? 0; i++) {
              if (response2?.data?.auction[i].buyer_pk == params.pk) {
                buy_list.push(response2?.data?.auction[i])
              }
              if (response2?.data?.auction[i].seller_pk == params.pk) {
                sell_list.push(response2?.data?.auction[i])
              }
            }
            setCommunityList(response2?.data?.community)
            setSellList(sell_list)
            setBuyList(buy_list)
          } else {
          }
        }
      }

    async function deleteAuction(num) {
      const { data: response } = await axios.post('/api/delete', { tableName: 'item', pk: num })
      if(response.result>0){
          alert('삭제되었습니다.')
          const filter = sellList.filter(list => list.pk !== num);
          setSellList(filter);
      }
    }
      async function deleteCommunity(num) {
          const { data: response } = await axios.post('/api/delete', { tableName: 'community', pk: num })
          if(response.result>0){
              alert('삭제되었습니다.')
              const filter = communityList.filter(list => list.pk !==num)
              setCommunityList(filter);
          }
      }

    useEffect(() => {
      fetchInfo();
    }, [])

    return (
        <Wrapper >
          <ContentsWrapper style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
            , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`
          }}>
            <Title>나의 활동내역</Title>
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
                        <Td>{post.buyer_nickname ?? '----'}</Td>
                        <Td>{post.buy_count == 0 ? '경매중' : '경매완료'}</Td>
                        <Td><CgDetailsMore style={{ color: '#cd84f1', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => { history.push(`/auction/${post.pk}`) }} /></Td>
                        <Td>{post.bid_price}원</Td>
                        <Td>
                          <AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                            onClick={() => {
                              if (window.confirm("정말로 삭제하시겠습니까?")) {
                                deleteAuction(post.pk)
                              }
                            }} />
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
            , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`
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
                        <Td>{post.seller_nickname ?? '---'}</Td>
                        <Td>{post.buy_count == 0 ? '경매중' : '경매완료'}</Td>
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
            , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`
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
                        <Td>{post.kind == 1 ? '공지사항' : '자유게시판'}</Td>
                        <Td><CgDetailsMore style={{ color: '#cd84f1', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => { history.push(`/community/${post.pk}`) }} /></Td>
                        <Td>{post.create_time}</Td>
                        <Td>
                          <AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                            onClick={() => {
                              if (window.confirm("정말로 삭제하시겠습니까?")) {
                                deleteCommunity(post.pk)
                              }
                            }} />
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </ListContainer>
            </Container>
            <div style={{ color: '#5a5a5a', fontSize: '0.9rem', marginTop: '25px' }}>
              <span style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => history.push(`/myprofile/${params.pk}`)}>내정보</span> |
              <span style={{ cursor: 'pointer' }} onClick={() => history.push(`/changepw/${params.pk}`)}> 보안 설정</span> |
              <span style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => history.push(`/singout/${params.pk}`)}>회원 탈퇴</span>
            </div>
          </ContentsWrapper>
        </Wrapper>
    );
};
export default MyLog;