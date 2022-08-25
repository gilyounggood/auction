import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components'
import Wrapper from '../components/elements/Wrapper';
import '../styles/style.css'
import Table from '../components/elements/Table';
import Tr from '../components/elements/Tr';
import Td from '../components/elements/Td';
import axios from 'axios';
import ContentsWrapper from '../components/elements/ContentWrapper';
import ListContainer from '../components/elements/ListContainer';
import { AiFillEdit } from 'react-icons/ai'
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

const UserInput = styled.input`
    width: 100px;
    font-weight:bold;
`

const UserManage = () => {
    const history = useHistory()
    const [userList, setUserList] = useState([])
    const [auth, setAuth] = useState({})

    const [user, setUser] = useState(false)
    const [userInfo, setUserInfo] = useState({
        pk: "",
        id: "",
        nick_name: "",
        phone_number: "",
        reliability: 0,
        user_point: 0,
    })

    const { pk, id, nick_name, phone_number, reliability, user_point } = userInfo

    const isAdmin = async () => {
        const { data: response } = await axios.get('/api/auth')
        if (!response.second) {
            history.push('/profile')
        } else {
            setAuth(response)
            const {data:response2} = await axios.get('/api/userinfo')
            setUserList(response2.data)
        }
    }
    useEffect(() => {
        isAdmin()
    }, [])

    const changeUserInfo = e => {
        setUserInfo({...userInfo, [e.target.name]: e.target.value})
    }

    async function editUser() {
        const { data: response } = await axios.post('/api/useredit', {
            pk: pk,
            nick_name: nick_name,
            phone_number: phone_number,
            reliability: reliability,
            user_point: user_point,
        })
        if (response.result > 0) {
            alert("유저 정보가 변경되었습니다")
            window.location.reload()
        } else {
            alert('서버 에러 발생')
        }
    }

    const userChange = async (num) => {
        if(user===false) {
            setUser(true)
        } else {
            setUser(false)
        }
        try {
            const { data: response } = await axios.post("/api/userinfo/user", {
                pk: num,
            })
            setUserInfo(response.data)
        } catch {

        }
    } 

    return (
        <Wrapper>
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
            }}>
                <Container>
                    <Title>유저 관리</Title>
                    <ListContainer>
                        <Table>
                            <thead>
                            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                                <Td>번호</Td>
                                <Td>아이디</Td>
                                <Td>닉네임</Td>
                                <Td>연락처</Td>
                                <Td>신뢰도</Td>
                                <Td>포인트</Td>
                                <Td
                                    style={{
                                        color: user ? "#cd84f1" : "",
                                        cursor: user ? "pointer" : "",
                                    }}
                                    onClick={user ? userChange : undefined}
                                >{user ? "목록으로" : "자세히"}</Td>
                            </Tr>
                            </thead>
                            {user === false && userList.map(user => (
                                <tbody key={user.pk}>
                                <Tr>
                                    <Td>{user.pk}</Td>
                                    <Td>{user.id}</Td>
                                    <Td>{user.nick_name}</Td>
                                    <Td>{user.phone_number}</Td>
                                    <Td>{user.reliability}</Td>
                                    <Td>{user.user_point}</Td>
                                    <Td><CgDetailsMore style={{color: '#cd84f1', fontSize: '1.3rem', cursor: 'pointer' }}
                                        onClick={() => {userChange(user.pk)}} /></Td>
                                </Tr>
                                </tbody>
                            ))}
                            {user === true && 
                                <tbody>
                                <Tr>
                                    <Td>{pk}</Td>
                                    <Td>{id}</Td>
                                    <Td>
                                        <UserInput
                                            name='nick_name'
                                            value={nick_name}
                                            onChange={e => changeUserInfo(e)}
                                        />
                                    </Td>
                                    <Td>
                                        <UserInput
                                            name='phone_number'
                                            value={phone_number}
                                            onChange={e=> changeUserInfo(e)}
                                        />
                                    </Td>
                                    <Td>
                                        <UserInput
                                            name='reliability'
                                            value={reliability}
                                            onChange={e=> changeUserInfo(e)}
                                        />
                                    </Td>
                                    <Td>
                                        <UserInput
                                            name='user_point'
                                            value={user_point}
                                            onChange={e=> changeUserInfo(e)}
                                        />
                                    </Td>
                                    <Td><AiFillEdit style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                                        onClick={(e) => {
                                                if(window.confirm("유저 정보를 변경하시겠습니까?")) {
                                                editUser()} 
                                            }
                                        }
                                        />
                                    </Td>
                                </Tr>
                                </tbody>
                            }
                        </Table>
                    </ListContainer>
                </Container>
            </ContentsWrapper>
        </Wrapper>
    );
};
export default UserManage;