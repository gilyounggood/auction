import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ContentsWrapper from '../components/elements/ContentWrapper';
import Wrapper from '../components/elements/Wrapper';
import { AiOutlineSearch } from 'react-icons/ai'
import { GrNext } from 'react-icons/gr'
const SearchContainer = styled.div`

border:1px solid #8e44ad;
border-radius:0.6rem;
align-items:center;
padding:8px 0;
display:flex;
margin:0 auto;
background:#fff;
`
const SelectContainer = styled.div`
width:100%;
display:flex;
margin-bottom:1rem;
`
const SelectMenu = styled.div`
    flex: 1 1;
    text-align: center;
    height: 3.5rem;
    width:33.33333%;
    cursor:pointer;
    font-weight:bold;
    align-items:center;
`
const CityContainer = styled.div`
width: 100%;
    background: #fff;
    display: flex;
    overflow: hidden;
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
  ::placeholder {
    color: #cccccc;
  }
`
const ThemeList = styled.div`
width:80%;
margin:0 auto;
`
const Theme = styled.div`
display:flex;
justify-content:space-between;
align-items:center;
cursor:pointer;
color:#2e2e2e;
border-bottom:1px solid #cccccc;
font-size:1rem;
`
const Search = () => {
    const history = useHistory();
    const [category, setCategory] = useState()
  
    const [keyword, setKeyword] = useState('')
    const [kind, setKind] = useState("auction")
    const themeList = ['의류','뷰티','식품','주방용품','생활용품','가전제품','완구','헬스','음악용품'];
    useEffect(()=>{
        setCategory('search')
    },[])
    const onChangeKeyword = (e) => {
        setKeyword(e.target.value)
    }
   
    async function searchAuction(str, kind){
        history.push({pathname:'/searchresult',state:{keyword:str??'', kind: kind??''}})           
    }
 
    return (
        <Wrapper >
           
             <ContentsWrapper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',minHeight:`${category == 'search' ? '64vh':''}`
            ,borderRadius: `${window.innerWidth >= 950 ? '1rem':'0'}`}}>
                <SelectContainer>
                <SelectMenu onClick={()=>{setCategory('search')}} style={{borderBottom:`${category == 'search' ? '2px solid #8e44ad' : '2px solid #ababab'}`,color:`${category == 'search' ? '#8e44ad' : '#ababab'}`}}>
                        <p>검색</p>
                    </SelectMenu>
                    
                    <SelectMenu onClick={()=>{setCategory('category')}} style={{borderBottom:`${category == 'category' ? '2px solid #8e44ad' : '2px solid #ababab'}`,color:`${category == 'category' ? '#8e44ad' : '#ababab'}`}}>
                        <p>경매 태그</p>
                    </SelectMenu>
                </SelectContainer>
                {category == 'search' ?
                    <div style={{display: 'flex'}}>
                        <select onChange={e => setKind(e.target.value)} style={{marginRight: '5px', borderRadius: '0.5rem', borderColor: 'black', fontSize: '0.9rem', textAlign: 'center'}}>
                            <option value="auction" selected>경매 검색</option>
                            <option value="community">커뮤니티 검색</option>
                            <option value="username">닉네임 검색</option>
                        </select>
                        <SearchContainer>
                            <SearchInput placeholder={kind==="auction" ? '상품명 혹은 태그' : kind==="community" ? "제목 혹은 내용" : "유저 닉네임"} onChange={onChangeKeyword} />
                            <AiOutlineSearch style={{ fontSize: '1.3rem', padding: '0.3rem 1rem 0.3rem 0.3rem', color: '#8e44ad',cursor:'pointer' }} onClick={()=>{searchAuction(keyword, kind)}} />
                        </SearchContainer>
                    </div>
                :
                    <CityContainer>
                        <ThemeList>
                                {themeList.map((theme,index)=>(
                                    <Theme key={theme} onClick={()=>{searchAuction(theme)}}>
                                        <p style={{paddingLeft:'0.4rem',fontSize:'1rem'}}>{theme}</p>
                                        <div style={{display:'flex',alignItems:'center'}}>
                                            <div style={{fontSize:'0.8rem',color:'#9b59b6'}}>자세히보기</div> 
                                            <GrNext style={{height:'0.8rem',color:'#9b59b6'}} />
                                            </div>
                                    </Theme>
                                ))}
                        </ThemeList>
                    </CityContainer>
                }
                
                
            </ContentsWrapper>
        </Wrapper>
    );
};
export default Search;