import React, { useState,  useEffect } from 'react'
import styled from 'styled-components'
import {useHistory,useRouteMatch,useLocation } from "react-router-dom"
import '../styles/style.css'
import {AiOutlineSearch} from 'react-icons/ai'
import {MdHome} from 'react-icons/md'
import { IoLocationSharp } from "react-icons/io5"
import {BsCalendar,BsFillPersonFill} from 'react-icons/bs'
import {AiFillTrophy} from 'react-icons/ai'
const Container = styled.aside`
    background: #fff;
    border-top: 0.1rem solid #e6e6e6;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    display:none;
    @media screen and (max-width:950px) {
        display:flex;
      }
`
const MenuContainer = styled.nav`
width: 100%;
max-width: 76.8rem;
height: 5rem;
display: -webkit-flex;
display: flex;
margin: 0 auto;

`
const OneMenuContainer = styled.div`
    color: inherit;
    text-decoration: none;
    width: 20%;
    min-width: 20%;
    height: 100%;
    display: flex;
    flex-direction:column;
    padding: 0.3rem 0 0.2rem;
    position: relative;
    text-align: center;
    cursor:pointer;
`
const OneMenuName = styled.span`
color: #ababab;
font-size:0.8rem;
font-weight:bold;
`
// 회색 글씨 #ababab
// 진한글씨 #1a1a1a
// 진한 보라색 #8e44ad
// 연한 보라색 #9b59b6
// 제일 연한 보라 #cd84f1
const BottomMenu = () => {
    const history = useHistory();
    const location = useLocation();
    const match = useRouteMatch();
    const [display, setDisplay] = useState("none");
    const [modal, setModal] = useState("none");
    
    const [beforeCount, setBeforeCount] = useState(0)
    const [colorList, setColorList] = useState([])
    
    useEffect(()=>{
        let arr = ['#ababab','#ababab','#ababab','#ababab','#ababab']
        if(location.pathname == '/search'){
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
        else if(location.pathname == '/selectcommunity' || location.pathname.substring(0,10) == '/community'){
            arr[3] = '#9b59b6'
            setBeforeCount(3)
        }
        else if(location.pathname == '/profile'|| location.pathname == '/signup'||location.pathname == '/login'){
            arr[4] = '#9b59b6'
            setBeforeCount(4)
        }
        else{
            arr[beforeCount] = '#9b59b6'
        }
        setColorList(arr)
    },[location])

    return (

        <Container>
            <MenuContainer>
                <OneMenuContainer onClick={()=>{history.push('/search')}}> 
                    <AiOutlineSearch className='menu-icon' style={{color:`${colorList[0]}`}} />
                    <OneMenuName style={{color:`${colorList[0]}`}}>
                        검색
                    </OneMenuName>
                </OneMenuContainer>
                <OneMenuContainer onClick={()=>{history.push('/ranking')}}>
                    <AiFillTrophy className='menu-icon' style={{color:`${colorList[1]}`}} />
                    <OneMenuName style={{color:`${colorList[1]}`}}>
                        랭킹
                    </OneMenuName>
                </OneMenuContainer>
                <OneMenuContainer onClick={()=>{history.push('/')}}>
                    <MdHome className='menu-icon' style={{color:`${colorList[2]}`}} />
                    <OneMenuName style={{color:`${colorList[2]}`}}>
                        홈
                    </OneMenuName>
                </OneMenuContainer>
                <OneMenuContainer onClick={()=>{history.push('/selectcommunity')}}>
                    <BsCalendar className='menu-icon' style={{color:`${colorList[3]}`}} />
                    <OneMenuName style={{color:`${colorList[3]}`}}>
                        커뮤니티
                    </OneMenuName>
                </OneMenuContainer>
                <OneMenuContainer onClick={()=>{history.push('/profile')}}>
                    <BsFillPersonFill className='menu-icon' style={{color:`${colorList[4]}`}} />
                    <OneMenuName style={{color:`${colorList[4]}`}}>
                        MY
                    </OneMenuName>
                </OneMenuContainer>
            </MenuContainer>
        </Container>

    )
}

export default BottomMenu
