import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Title from '../../components/elements/Title';
import Button from '../../components/elements/Button';
import Container from '../../components/elements/Container';
import Content from '../../components/elements/Content';
import SubTitle from '../../components/elements/SubTitle';
import RightButtonContainer from '../../components/elements/RightButtonContainer';
import Textarea from '../../components/elements/Textarea';
import CenterButtonContainer from '../../components/elements/CenterButtonContainer';
import '../../styles/style.css'

const Input = styled.input`
    outline: 1px solid #c4c4c4;
    font-size:1rem;
    border:none;
    margin-left:0.3rem;
    width:39.2rem;
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

const AddCommunity = () => {
    //----------------------------------------공통
    const history = useHistory()
    const params = useParams()

    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [note, setNote] = useState('')
    const [myPk, setMyPk] = useState(0)
    const [myNickname, setMyNickname] = useState('')
    const [myReliability, setMyReliability] = useState(0)
    const [myIcon, setMyIcon] = useState("")
    const isAdmin = async () => {
        setLoading(true)
        const { data: response0 } = await axios.get('/api/auth')
        if (!response0.first && params.pk==1) {
            alert("관리자만 접근 가능합니다.")
            history.push('/')
        } else if(!response0.pk){
            alert("로그인 후 이용해 주세요.")
            history.push('/')
        }
        setMyPk(response0.pk)
        setMyNickname(response0.nick_name)
        setMyReliability(response0.reliability)
        setMyIcon(response0.user_use_icon)
        setLoading(false)
    }
    useEffect(() => {
        isAdmin()
    }, [])
    const onChangeTitle= (e) =>{
        setTitle(e.target.value)
    }
    const onChangeNote = (data) =>{
        setNote(data)
    }
    const upLoad = async (e) =>{
        if(title==="" || note==="") {
            alert("제목과 내용을 입력해주세요")
        } else {
            const {data:response} = await axios.post('/api/addCommunity',{
                title:title,
                content:note,
                kind:params.pk,
                userPk:myPk,
                nickname:myNickname,
                user_reliability:myReliability,
                user_icon:myIcon
            })
            if(response.result<0){
                alert(response.message)
            }
            else{
                alert('성공적으로 등록되었습니다')
                history.goBack()
            }
        }
    }

    return (
        <Wrapper >
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`
            }}>
                
                <Title>{params.pk==1?'공지사항 추가':'자유게시판 추가'}</Title>
                
                <Container style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Content>
                        <SubTitle>제목</SubTitle>
                    </Content>
                    <Content>
                        <Input 
                            type={'text'} 
                            onChange={onChangeTitle} 
                        />
                    </Content>
                    <Content>
                        <SubTitle>내용</SubTitle>
                    </Content>
                    <CKEditor
                        editor={ ClassicEditor }
                        data=""
                        onReady={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            console.log( { event, editor, data } );
                            onChangeNote(data)
                        } }
                        onBlur={ ( event, editor ) => {
                            console.log( 'Blur.', editor );
                        } }
                        onFocus={ ( event, editor ) => {
                            console.log( 'Focus.', editor );
                        } }
                    />
                    {/* <Content>
                        <Textarea onChange={onChangeNote} />
                    </Content> */}
                </Container>
                <CenterButtonContainer>
                <Button onClick={()=>{history.goBack()}}>
                        뒤로가기
                    </Button>
                    <Button onClick={upLoad}>
                        업로드
                    </Button>
                </CenterButtonContainer>
            </ContentsWrapper>
            {

            }
        </Wrapper>
    );
};
export default AddCommunity;