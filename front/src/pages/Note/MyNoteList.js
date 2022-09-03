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
const MyNoteList = () => {
    const params= useParams();
    const history = useHistory()
    const [noteList, setNoteList] = useState([])
    const [auth, setAuth] = useState({})
    const isAdmin = async () => {
        const { data: response } = await axios.get('/api/auth')
        if (!response.second) {
            history.push('/profile')
        } else {
            setAuth(response)
            const { data: response2 } = await axios.post('/api/note', {user_nickname: response.nick_name})
            setNoteList(response2.data)
        }
    }
    useEffect(() => {
        isAdmin()
    }, [])
    async function updateNote(num) {
        const { data: response } = await axios.post('/api/updatenote', {
            pk: num,
            user_kind: params.pk == 1 ? 'receive_user' : 'send_user'
        })
        if (response.result > 0) {
            alert('삭제되었습니다')
            const newNoteList = noteList.filter(list => list.pk !== num);
            setNoteList(newNoteList);
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
                    <Title>{params.pk==1 ? '받은 쪽지함' : '보낸 쪽지함'}</Title>
                    <ListContainer>
                        <Table>
                            <thead>
                            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                                <Td>상세보기</Td>
                                <Td>제목</Td>
                                <Td>{params.pk==1 ? '보낸유저' : '받은유저'}</Td>
                                <Td>날짜</Td>
                                <Td>삭제</Td>
                            </Tr>
                            </thead>
                            <tbody>
                            {params.pk == 1 && noteList.map(note => (
                                note.receive_user === auth.nick_name &&
                                    <Tr key={note.pk}>
                                    <Td><CgDetailsMore style={{ color: '#cd84f1', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => { history.push(`/readnote/${note.pk}`) }} /></Td>
                                    <Td>{note.title}</Td>
                                    <Td>{note.receive_user}</Td>
                                    <Td>{note.create_time}</Td>
                                    <Td><AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                                        onClick={() => {
                                            if (window.confirm("정말로 삭제하시겠습니까?")) {
                                                updateNote(note.pk)
                                            }
                                        }} /></Td>
                                    </Tr>
                            ))}
                            </tbody>
                            <tbody>
                            {params.pk == 2 && noteList.map(note => (
                                note.send_user === auth.nick_name &&
                                    <Tr key={note.pk}>
                                        <Td><CgDetailsMore style={{ color: '#cd84f1', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => { history.push(`/readnote/${note.pk}`) }} /></Td>
                                        <Td>{note.title}</Td>
                                        <Td>{note.send_user}</Td>
                                        <Td>{note.create_time}</Td>
                                        <Td><AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                                            onClick={() => {
                                                if (window.confirm("정말로 삭제하시겠습니까?")) {
                                                    updateNote(note.pk)
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
export default MyNoteList;