import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import axios from 'axios';
import Select from '../../components/elements/Select';
import Option from '../../components/elements/Option';
import Container from '../../components/elements/Container';
import Content from '../../components/elements/Content';
import Input from '../../components/elements/Input';
import Textarea from '../../components/elements/Textarea';
import Title from '../../components/elements/Title';
import { AiFillFileImage } from 'react-icons/ai'
import SubTitle from '../../components/elements/SubTitle';
import '../../styles/style.css'
import $ from 'jquery'
const Button = styled.button`
width:22rem;
height:3rem;
border-radius:0.5rem;
border:none;
background:#8e44ad;
color:white;
box-shadow: 2px 1px 4px #00000029;
font-size:0.85rem;
cursor:pointer;
@media screen and (max-width:600px) {
    width: 16rem;
  }
`
const ImageContainer = styled.label`
border: 2px dashed #8e44ad;
width:98%;
margin: 1rem auto;
height:12rem;
border-radius:2rem;
text-align:center;
`
const AddAuction = () => {
    const history = useHistory()
    const [myPk, setMyPk] = useState(0)
    const [myId, setMyId] = useState('')
    const [myNickname, setMyNickname] = useState('')
    const [myReliability, setMyReliability] = useState(0)
    const [content, setContent] = useState(undefined)
    const [price, setPrice] = useState(10000);
    const [name, setName] = useState('')
    const [time, setTime] = useState('')
    const [date, setDate] = useState('')
    const [url, setUrl] = useState('')
    const [formData] = useState(new FormData())
    const [tagList, setTagList] = useState([])
    const isAdmin = async () => {

        const { data: response } = await axios.get('/api/auth')
        if (response.pk) {
            setMyId(response.id)
            setMyPk(response.pk)
            setMyNickname(response.nick_name)
            setMyReliability(response.reliability)
        } else {
            history.push('/')
        }

    }
    useEffect(() => {
        isAdmin()
    }, [])


    const onRequest = async (e) => {
        let url = ''
        let object = {}
        if (!name || !date || !time || !content) {
            alert('필요값이 비어있습니다.')
            return;
        }
        let arr = [];
        for(var i = 0;i<tagList.length;i++){
            if($(`#tag${i}`).val()){
           
                arr.push($(`#tag${i}`).val())
            }
        }
        formData.append("name", name)
        formData.append("minPrice",price)
        formData.append("sellerPk",myPk)
        formData.append("sellerNickname",myNickname)
        formData.append("sellerReliability",myReliability)
        formData.append("endDate",date+' '+time+':00')
        formData.append("categoryList",arr)
        formData.append("image", content)
        url = '/api/addauction'
        const {data:response} = await axios.post(url,formData)
        console.log(response)
        if(response.result>0){
            alert('경매등록이 완료되었습니다.')
            history.push('/')
        } else {
            alert('서버 에러 발생')
        }
    }




    const onChangeDate = (e) => {
        setDate(e.target.value)
    }
    const onChangeTime = (e) => {
        setTime(e.target.value)
    }
    const onChangePrice = (e) => {
        setPrice(e.target.value)
    }
    const onChangeName = (e) => {
        setName(e.target.value)
    }

    const addFile = (e) => {
        if (e.target.files[0]) {
            setContent(e.target.files[0]);
            setUrl(URL.createObjectURL(e.target.files[0]))
        }
    };
    return (
        <Wrapper >
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
            }}>

                <Title>경매등록</Title>


                <Container>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>상품명</div>
                    </Content>
                    <Content>
                        <Input type='text' placeholder='상품명을 입력해 주세요.' onChange={onChangeName} />
                    </Content>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>최소금액</div>
                    </Content>
                    <Content>
                        <Input type='text' placeholder='금액을 입력해 주세요.' onChange={onChangePrice} defaultValue={10000} />
                    </Content>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>마감일자 및 시간</div>
                    </Content>
                    <Content>
                        <Input type='date' onChange={onChangeDate} />
                    </Content>
                    <Content>
                        <Input type='time' onChange={onChangeTime} />
                    </Content>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>태그</div>
                        <SubTitle style={{marginBottom:'1rem'}}><Button style={{width:'5rem',height:'2rem'}}
                        onClick={()=>{
                            let arr = []
                            for(var i = 0;i<tagList.length;i++){
                                arr[i] = tagList[i]
                            }
                            arr[tagList.length] = {
                                title:'',
                                price:0
                            }
                            setTagList(arr)
                        }}>+ 추가</Button></SubTitle>
                    </Content>
                    <Content style={{ marginBottom: '0.3rem',flexDirection:'column' }}>
                    {tagList.map((post,index)=>(
                         <div style={{border:'1px solid #5a5a5a',width:'50%',padding:'0.5rem'}}>
                         <input style={{width:'90%',margin:'auto',outline:'none',border:'none',maxWidth:'120px'}} id={`tag${index}`}  />
                     </div>
                    
                    ))}
                    
                    </Content>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>상품이미지</div>
                    </Content>
                    <Content>
                        <ImageContainer for="file">

                            {url ?
                                <>
                                    <img src={url} alt="#"
                                        style={{
                                            width: '60%', height: '10rem',
                                            margin: '1rem'
                                        }} />
                                </>
                                :
                                <>
                                    <AiFillFileImage style={{ margin: '4rem', fontSize: '4rem', color: '#8e44ad' }} />
                                </>}
                        </ImageContainer>
                        <div>
                            <input type="file" id="file" onChange={addFile} style={{ display: 'none' }} />
                        </div>
                    </Content>
                    
                </Container>

                <Button style={{ marginBottom: '2rem' }}
                    onClick={onRequest}>등록하기</Button>
            </ContentsWrapper>
        </Wrapper>
    );
};
export default AddAuction;