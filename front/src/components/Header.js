import React, { useState,  useEffect } from 'react'
import styled from 'styled-components'
import {  useHistory,  useLocation } from "react-router-dom"
import { AiOutlineSearch } from 'react-icons/ai'
import { IoMdArrowBack } from "react-icons/io";
import '../styles/style.css'
import logo from '../assets/images/logo.png'
import '../styles/style.css'
const Container = styled.header`
    background: #fff;
    border-bottom: 0.1rem solid #e6e6e6;
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    z-index: 999;
`
const MenuContainer = styled.nav`
width: 100%;
max-width: 76.8rem;
height: 3.5rem;
display: none;
justify-content:space-between;
margin: 0 auto;
align-items:center;
@media screen and (max-width:950px) {
    display:flex;
  }
`

const MenuContainer2 = styled.nav`
width: 100%;
max-width: 76.8rem;
height: 5rem;
display: flex;
justify-content:space-between;
margin: 0 auto;
align-items:center;
@media screen and (max-width:950px) {
    display: none;
  }
`
const OneMenuContainer = styled.div`
    color: inherit;
    text-decoration: none;
    width: 10%;
    text-align: center;
    cursor:pointer;
    align-items:center;
    &:hover {
        background-color: white;
        color: black;
    }
`
const OneMenuName = styled.div`
color: #ababab;
font-size:1.2rem;
font-weight:bold;
`
const Header = () => {
    const history = useHistory();
    const location = useLocation();

    const [backDisplay, setBackDisplay] = useState(false);
    const [beforeCount, setBeforeCount] = useState(0)
    const [colorList, setColorList] = useState([])
    useEffect(()=>{
        let arr = ['#ababab','#ababab','#ababab','#ababab','#ababab', '#ababab']
        if(location.pathname == '/search'||location.pathname.substring(0,11)=='/shopofcity'||location.pathname.substring(0,14)=='/shopofkeyword'){
            arr[0] = '#9b59b6'
            setBeforeCount(0)
        }
        else if(location.pathname == '/ranking'){
            arr[1] = '#9b59b6'
            setBeforeCount(1)
        }
        else if(location.pathname == '/'){
            arr[2] = '#9b59b6'
            setBeforeCount(2)
        }
        else if(location.pathname == '/selectcommunity'||location.pathname.substring(0,14)=='/communitylist'||location.pathname.substring(0,10)=='/community'){
            arr[3] = '#9b59b6'
            setBeforeCount(3)
        }
        else if(location.pathname == '/pointshop'){
            arr[4] = '#9b59b6'
            setBeforeCount(4)
        }
        else if(location.pathname == '/profile'|| location.pathname == '/signup'||location.pathname == '/login'){
            arr[5] = '#9b59b6'
            setBeforeCount(5)
        }
        else{
            arr[beforeCount] = '#9b59b6'
        }
        setColorList(arr)
    },[location])
    useEffect(() => {

        if (location.pathname == '/search' || location.pathname == '/ranking' || location.pathname == '/' ||
            location.pathname == '/selectcommunity' || location.pathname == '/pointshop' || location.pathname == '/profile') {
            setBackDisplay(false)
        }
        else {
            setBackDisplay(true)
        }
    }, [location])
    useEffect(()=>{

    })
    return (

        <Container>
            <MenuContainer>
                {
                    backDisplay ?
                        <>
                            <IoMdArrowBack className='menu-icon' style={{ cursor: 'pointer', color: '#8e44ad' }} onClick={()=>{
                                    history.goBack()
                            }} />
                        </>
                        :
                        <>
                            <div className='menu-icon' />
                        </>
                }
                <div style={{fontWeight: "bold", padding: "5px", border: "1px solid #8e44ad", borderRadius: "8px", fontSize: "13px", cursor: 'pointer', color: '#8e44ad'}}
                    onClick={() => { history.push('/pointshop') }}>
                        상점
                </div>
                <div className='menu-icon' />
                <img src={logo} className='blink' style={{marginTop:'0.2rem'}} />
                <div className='menu-icon' />
                <AiOutlineSearch className='menu-icon' style={{ cursor: 'pointer', color: '#8e44ad' }}
                    onClick={() => { history.push('/search') }} />
            </MenuContainer>
            <MenuContainer2>
               
               <div style={{width:'15%',textAlign:'center'}} onClick={()=>{history.push('/')}}>
                <img src={logo} style={{ margin: '0 auto', height: '4.5rem',zIndex:'1999' }} />
                </div>
                <OneMenuContainer onClick={()=>{history.push('/search')}}> 
                    <OneMenuName style={{color:`${colorList[0]}`}}>
                        검색
                    </OneMenuName>
                </OneMenuContainer>
                <OneMenuContainer onClick={()=>{history.push('/ranking')}}>
                   
                    <OneMenuName style={{color:`${colorList[1]}`}}>
                        랭킹
                    </OneMenuName>
                </OneMenuContainer>
                <OneMenuContainer onClick={()=>{history.push('/selectcommunity')}}>
                    <OneMenuName style={{color:`${colorList[3]}`}}>
                        커뮤니티
                    </OneMenuName>
                </OneMenuContainer>
                <OneMenuContainer onClick={()=>{history.push('/pointshop')}}>
                    <OneMenuName style={{color:`${colorList[4]}`}}>
                        상점
                    </OneMenuName>
                </OneMenuContainer>
                <OneMenuContainer onClick={()=>{history.push('/profile')}}>
                    <OneMenuName style={{color:`${colorList[5]}`}}>
                        MY
                    </OneMenuName>
                </OneMenuContainer>
                <div style={{width:'45%'}} />
                
            </MenuContainer2>
            
        
        </Container>

    )
}

export default Header
