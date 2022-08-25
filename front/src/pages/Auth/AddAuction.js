import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ContentsWrapper from '../../components/elements/ContentWrapper';
import Wrapper from '../../components/elements/Wrapper';
import axios from 'axios';
import Container from '../../components/elements/Container';
import Content from '../../components/elements/Content';
import Title from '../../components/elements/Title';
import { AiFillFileImage } from 'react-icons/ai'
import SubTitle from '../../components/elements/SubTitle';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '../../styles/style.css'
import $ from 'jquery'

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
    const [myIcon, setMyIcon] = useState("")
    const [content, setContent] = useState(undefined)
    const [price, setPrice] = useState(10000);
    const [name, setName] = useState('')
    const [time, setTime] = useState('')
    const [date, setDate] = useState('')
    const [url, setUrl] = useState('')
    const [formData] = useState(new FormData())
    const [tagList, setTagList] = useState([])
    const [note, setNote] = useState("")
    const isAdmin = async () => {

        const { data: response } = await axios.get('/api/auth')
        if (response.pk) {
            setMyId(response.id)
            setMyPk(response.pk)
            setMyNickname(response.nick_name)
            setMyReliability(response.reliability)
            setMyIcon(response.user_use_icon)
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
        formData.append("sellerIcon",myIcon)
        formData.append("endDate",date+' '+time+':00')
        formData.append("categoryList",arr)
        formData.append("image", content)
        formData.append("content", note)
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

    const imgLink = "http://localhost:8001/image/ad"

    const customUploadAdapter = (loader) => { // (2)
        return {
            upload(){
                return new Promise ((resolve, reject) => {
                    const data = new FormData();
                     loader.file.then( (file) => {
                            data.append("name", file.name);
                            data.append("image", file);

                            axios.post('/api/upload', data)
                                .then((res) => {
                                    resolve({
                                        default: `${imgLink}/${res.data.filename}`
                                    });
                                })
                                .catch((err)=>reject(err));
                        })
                })
            }
        }
    }

    function uploadPlugin (editor){ // (3)
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return customUploadAdapter(loader);
        }
    }

    return (
        <Wrapper >
            <ContentsWrapper style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                , borderRadius: `${window.innerWidth >= 950 ? '1rem' : '0'}`, minHeight: '28rem'
            }}>

                <Title>경매등록</Title>


                <Container style={{alignItems: 'center'}}>
                    <Content style={{ marginBottom: '0.9rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold'}}>상품명</div>
                    </Content>
                    <Content>
                        <Input type='text' placeholder='상품명을 입력해 주세요.' onChange={onChangeName} />
                    </Content>
                    <Content style={{ marginBottom: '0.9rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold'}}>최소금액</div>
                    </Content>
                    <Content>
                        <Input type='text' placeholder='금액을 입력해 주세요.' onChange={onChangePrice} defaultValue={10000} />
                    </Content>
                    <Content style={{ marginBottom: '0.9rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold'}}>마감일자</div>
                    </Content>
                    <Content>
                        <Input type='date' onChange={onChangeDate} />
                    </Content>
                    <Content style={{ marginBottom: '0.9rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold'}}>마감시간</div>
                    </Content>
                    <Content>
                        <Input type='time' onChange={onChangeTime} />
                    </Content>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <SubTitle style={{marginBottom:'1rem'}}><Button style={{width:'5.5rem',height:'2rem'}}
                        onClick={()=>{
                            if(tagList.length>9) {
                                alert("태그는 최대 10개까지 입력 가능합니다")
                                return;
                            }
                            let arr = []
                            for(var i = 0;i<tagList.length;i++){
                                arr[i] = tagList[i]
                            }
                            arr[tagList.length] = {
                                title:'',
                                price:0
                            }
                            setTagList(arr)
                        }}>+ 태그 추가</Button></SubTitle>
                    </Content>
                    <Content style={{ marginBottom: '0.3rem',flexDirection:'column' }}>
                    {tagList.map((post,index)=>(
                         <div key={index} style={{border:'1px solid #5a5a5a',width:'90%',padding:'0.5rem'}}>
                         <input style={{width:'90%',margin:'auto',outline:'none',border:'none',maxWidth:'120px'}} id={`tag${index}`} placeholder="태그 입력" />
                     </div>
                    
                    ))}
                    
                    </Content>
                    <Content style={{ marginBottom: '0.3rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold' }}>상품이미지</div>
                    </Content>
                    <Content style={{width: '60%'}}>
                        <ImageContainer htmlFor="file">

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
                                    <AiFillFileImage style={{ margin: '4rem', fontSize: '4rem', color: '#8e44ad'}} />
                                </>}
                        </ImageContainer>
                        <div>
                            <input type="file" id="file" onChange={addFile} style={{ display: 'none' }} />
                        </div>
                    </Content>
                    <Content style={{ marginBottom: '0.9rem' }}>
                        <div style={{ marginLeft: '0.3rem', color: '#cd84f1', fontSize: '0.9rem', fontWeight: 'bold'}}>상품설명</div>
                    </Content>
                    <CKEditor
                        editor={ ClassicEditor }
                        config= {{
                            extraPlugins: [uploadPlugin],
                            mediaEmbed: {
                                previewsInData : true,
                            },
                            heading: {
                            options: [
                                {
                                model: "paragraph",
                                view: "p",
                                title: "본문",
                                class: "ck-heading_paragraph",
                                },
                                {
                                model: "heading1",
                                view: "h1",
                                title: "헤더1",
                                class: "ck-heading_heading1",
                                },
                                {
                                model: "heading2",
                                view: "h2",
                                title: "헤더2",
                                class: "ck-heading_heading2",
                                },
                                {
                                model: "heading3",
                                view: "h3",
                                title: "헤더3",
                                class: "ck-heading_heading3",
                                },
                            ],
                            },
                        }}
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            setNote(data)
                        } }
                    />                
                </Container>

                <Button style={{ marginBottom: '2rem' }}
                    onClick={onRequest}>등록하기</Button>
            </ContentsWrapper>
        </Wrapper>
    );
};
export default AddAuction;