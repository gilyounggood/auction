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
const Input = styled.input`
outline:none;
font-size:0.9rem;
border:none;
border-bottom:1px solid black;
margin-left:0.3rem;
width:12rem;
padding-bottom:0.2rem;
::placeholder {
    color: #cccccc;
  }

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
    const [userTag, setUserTag] = useState("")
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
                setUserTagInfo(result.data.userTag[0].userTag)
            } else {
            }
        } catch {
        }

        console.log(response2)
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
        console.log(response2)
    }

    useEffect(() => {
        isAdmin()
    }, [])

    const handleChangePassword = async () => {
        if (!password || !check) {
            alert('??????????????? ?????? ????????? ?????????.')
        }
        else {
            const { data: response } = await axios.post('/api/changepassword', {
                pk: myPk,
                pw: password,
                newPw: newPassword
            })
            if (response.result < 0) {
                alert(response.message)
            }
            else {
                alert('???????????? ????????? ?????????????????????.\n?????? ????????? ????????????.')
                onLogout()
            }
        }

    }
    const onLogout = async () => {
        await axios.post('/api/logout')
        history.push('/')
        history.push('/profile')
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const onChangeNewPassword = (e) => {
        setNewPassword(e.target.value)
        if (e.target.value != newPasswordCheck) {
            setCheck(false)
        }
        else {
            setCheck(true)
        }
    }
    const onChangeNewPasswordCheck = (e) => {
        setNewPasswordCheck(e.target.value)
        if (e.target.value != newPassword) {
            setCheck(false)
        }
        else {
            setCheck(true)
        }
    }
    async function deleteAuction(num) {
        const { data: response } = await axios.post('/api/delete', { tableName: 'item', pk: num })
        if(response.result>0){
            alert('?????????????????????.')
            window.location.reload()
        }
    }
    async function deleteCommunity(num) {
        const { data: response } = await axios.post('/api/delete', { tableName: 'community', pk: num })
        if(response.result>0){
            alert('?????????????????????.')
            window.location.reload()
        }
    }

    const onChangeTag = (e) => {
        setUserTag(e.target.value)
    }

    const addTag = async (e) => {
        if(userTag==="") {
            alert("????????? ??????????????????")
        } else {
            const {data:response} = axios.post('/api/addusertag',{
                nickname: nickname,
                userTag: userTag,
            })
                alert('????????? ?????????????????????')
                $("$tag").val("");
                const { data: response2 } = await axios.post('/api/info', {
                    pk: params.pk
                })
                try {
                    const { data: result } = await axios.post('/api/usertaginfo', {
                        user_name: response2.data.info[0].nick_name
                    })
                    if (result.data) {
                        setUserTagInfo(result.data.userTag[0].userTag)
                    } else {
                    }
                } catch {
                }
        }
    }

    const editTag = async (e) => {
        if(userTag==="") {
            alert("????????? ??????????????????")
        } else {
            const {data:response} = axios.post('/api/editusertag',{
                nickname: nickname,
                userTag: userTag,
            })
                alert('????????? ?????????????????????')
                $("#tag2").val("");
                const { data: response2 } = await axios.post('/api/info', {
                    pk: params.pk
                })
                try {
                    const { data: result } = await axios.post('/api/usertaginfo', {
                        user_name: response2.data.info[0].nick_name
                    })
                    if (result.data) {
                        setUserTagInfo(result.data.userTag[0].userTag)
                    } else {
                    }
                } catch {
                }
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

                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>?????????</div>
                    </Content>
                    <Content>
                        <Div>{nickname}</Div>
                    </Content>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>????????????</div>
                    </Content>
                    <Content>
                        <Div>{phoneNumber}</Div>
                    </Content>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>??????</div>
                    </Content>
                    <Content>
                        <Div><img width={25} src={setLevel(reliability)}/></Div>
                    </Content>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>?????????</div>
                    </Content>
                    <Content>
                        {myIcon ?
                            <>
                            <Div><img width={30} src={setIcon(myIcon)}/></Div>
                            </> :
                            <>
                            <Div>??????</Div>
                            </>
                        }
                    </Content>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>?????????</div>
                    </Content>
                    <Content>
                        <Div>{reliability}</Div>
                    </Content>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>?????????</div>
                    </Content>
                    <Content>
                        <Div>{point}</Div>
                    </Content>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>?????? ??????</div>
                    </Content>
                    <Content>
                        {userTagInfo ?
                            <>
                            <Div>{userTagInfo}</Div>
                            </> :
                            <>
                            <Div>??????</Div>
                            </>
                        }
                    </Content>
                    {myPk == params.pk &&
                    <>
                        {userTagInfo ? ( 
                        <>
                            <Content>
                                <Input id="tag2" type='text' onChange={onChangeTag} />
                            </Content>
                            <Button style={{ marginBottom: '2rem' }}
                                onClick={editTag}>?????? ????????????</Button>
                        </>
                        ) :
                        (
                        <>
                            <Content>
                                <Input id="tag" type='text' onChange={onChangeTag} />
                            </Content>
                            <Button style={{ marginBottom: '2rem' }}
                                onClick={addTag}>?????? ????????????</Button> 
                        </>
                        )
                        }
                    </>
                    }
                    {myPk == params.pk ?
                        <>
                            <Title>???????????? ??????</Title>
                            <Content style={{ marginBottom: '0.3rem' }}>
                                <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>?????? ????????????</div>
                            </Content>
                            <Content>
                                <Input type='password' placeholder='****' onChange={onChangePassword} />
                            </Content>
                            <Content style={{ marginBottom: '0.3rem' }}>
                                <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>??? ????????????</div>
                            </Content>
                            <Content>
                                <Input type='password' placeholder='****' onChange={onChangeNewPassword} />
                            </Content>
                            <Content style={{ marginBottom: '0.3rem' }}>
                                <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>???????????? ??????</div>
                            </Content>
                            <Content style={{ marginBottom: '0' }}>
                                <Input style={{ marginBottom: '0.2rem' }} type='password' placeholder='****' onChange={onChangeNewPasswordCheck} />
                            </Content>
                            <Check>{check ? '' : '??????????????? ???????????? ????????????.'}</Check>
                            <Button style={{ marginBottom: '2rem' }}
                                onClick={handleChangePassword}>????????????</Button>
                        </>
                        :
                        <>
                        </>
                    }

                </Container>

            </ContentsWrapper>
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
            }}>
                <Container>
                    <Title>?????? ??????</Title>
                    <ListContainer>
                        <Table>
                            <thead>
                            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                                <Td>?????????</Td>
                                <Td>?????????</Td>
                                <Td>?????????</Td>
                                <Td>??????</Td>
                                <Td>??????</Td>
                                <Td>??????</Td>
                            </Tr>
                            </thead>
                            <tbody>
                            {sellList && sellList.map(post => (
                                <Tr key={post.pk}>
                                    <Td>{post.name}</Td>
                                    <Td>{post.end_date}</Td>
                                    <Td>{post.buyer_nickname??'----'}</Td>
                                    <Td>{post.buy_count==0?'?????????':'????????????'}</Td>
                                    <Td>{post.bid_price}???</Td>
                                    <Td>
                                        {post.seller_pk==myPk?
                                        <>
                                        <AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                                                        onClick={() => {
                                                            if (window.confirm("????????? ?????????????????????????")) {
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
                    <Title>?????? ??????</Title>
                    <ListContainer>
                        <Table>
                            <thead>
                            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                                <Td>?????????</Td>
                                <Td>?????????</Td>
                                <Td>?????????</Td>
                                <Td>??????</Td>
                                <Td>??????</Td>
                            </Tr>
                            </thead>
                            <tbody>
                            {buyList && buyList.map(post => (
                                <Tr key={post.pk}>
                                    <Td>{post.name}</Td>
                                    <Td>{post.end_date}</Td>
                                    <Td>{post.seller_nickname??'---'}</Td>
                                    <Td>{post.buy_count==0?'?????????':'????????????'}</Td>
                                    <Td>{post.bid_price}???</Td>
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
                    <Title>????????????</Title>
                    <ListContainer>
                        <Table>
                            <thead>
                            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                                <Td>??????</Td>
                                <Td>??????</Td>
                                <Td>????????????</Td>
                                <Td>?????????</Td>
                                <Td>??????</Td>
                            </Tr>
                            </thead>
                            <tbody>
                            {communityList && communityList.map(post => (
                                <Tr key={post.pk}>
                                    <Td>{post.title}</Td>
                                    <Td>{post.kind==1?'????????????':'???????????????'}</Td>
                                    <Td><CgDetailsMore style={{ color: '#cd84f1', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => { history.push(`/community/${post.pk}`) }} /></Td>
                                    <Td>{post.create_time}</Td>
                                    <Td>{post.user_pk==myPk?
                                        <>
                                        <AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                                                        onClick={() => {
                                                            if (window.confirm("????????? ?????????????????????????")) {
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