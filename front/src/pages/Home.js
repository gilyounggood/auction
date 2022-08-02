import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import styled from 'styled-components'
import ContentsWrapper from '../components/elements/ContentWrapper';
import Wrapper from '../components/elements/Wrapper';
import AuctionComponent from '../components/AuctionComponent';
import HomeComponent from '../components/HomeComponent';
import '../styles/style.css'
import slide1 from '../assets/images/slide/123.jpg'
import slide2 from '../assets/images/slide/456.jpeg'
import slide3 from '../assets/images/slide/789.jpg'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/style.css'
import Table from '../components/elements/Table';
import Tr from '../components/elements/Tr';
import Td from '../components/elements/Td';
import { RiAuctionLine, RiAuctionFill } from 'react-icons/ri'
import { GrNotes } from 'react-icons/gr'
import { AiOutlinePlus } from 'react-icons/ai'
import { HiSpeakerphone } from 'react-icons/hi'

const Link = styled.div`
  color: gray;
  font-size: 0.9rem;
  cursor: pointer;
`

const Home = () => {
  const [auctionList, setAuctionList] = useState([])
  const [noticeList, setNoticeList] = useState([])
  const [communityList, setCommunityList] = useState([])
  const [endAuctionList, setEndAuctionList] = useState([])
  const history = useHistory();
  const slideList = [slide1,slide2,slide3]
  let settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  useEffect(()=>{
    async function fetchPosts(){
      const {data:response} = await axios.post('/api/home')
      setAuctionList(response.data)

      const {data:response2} = await axios.post('/api/home2', {params:1})
      setNoticeList(response2.data)

      const {data:response3} = await axios.post('/api/home2', {params:2})
      setCommunityList(response3.data)

      const {data:response4} = await axios.post('/api/home2', {params:3})
      setEndAuctionList(response4.data)
    }
    fetchPosts()
  },[])
  
  return (
    <Wrapper>
      <Slider {...settings} className='board-container'>
        {slideList.map((item, index) => (
          <img key={index} src={item} />
        ))}
      </Slider>

      <ContentsWrapper
        style={{
          borderRadius: '1rem',
          fontWeight: 'bold',
          flexDirection: 'row',
          justifyContent: 'space-between',
          fontSize: '1.1rem',
          width: '80%',
          maxWidth: '65rem'
        }}
      >
        <div/>
        <div style={{marginLeft: '80px'}}>
          <HiSpeakerphone style={{marginRight: '5px'}} />공지사항
        </div>
        <Link onClick={()=> history.push('/communitylist/1')}>
          더보기<AiOutlinePlus/>
        </Link>
      </ContentsWrapper>
      <ContentsWrapper style={{flexWrap: 'wrap', boxShadow: 'none', background: '#f1f2f6' }}>
        <Table>
          <thead>
            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                <Td width={100}>번호</Td>
                <Td width={150}>닉네임</Td>
                <Td width={300}>제목</Td>
                <Td width={300}>등록일</Td>
                <Td width={100}>상세보기</Td>
            </Tr>
          </thead>
          {noticeList.map((post)=>(
          <tbody key={post.pk}>
            <HomeComponent pk={post.pk} title={post.title} create_time={post.create_time} user_nickname={post.user_nickname}
              reliability={post.user_reliability} icon={post.user_icon} views={post.views}   />
          </tbody>
          ))}
        </Table>
      </ContentsWrapper>

      <ContentsWrapper
        style={{
          borderRadius: '1rem',
          fontWeight: 'bold',
          flexDirection: 'row',
          justifyContent: 'space-between',
          fontSize: '1.1rem',
          width: '80%',
          maxWidth: '65rem'
        }}
      >
        <div/>
        <div style={{marginLeft: '75px'}}>
          <RiAuctionLine style={{marginRight: '5px'}} />진행중인 경매 목록
        </div>
        <Link onClick={()=> history.push('/auctionlist')}>
          더보기<AiOutlinePlus/>
        </Link>
      </ContentsWrapper>
      <ContentsWrapper style={{ flexDirection: 'row', flexWrap: 'wrap', boxShadow: 'none', background: '#f1f2f6' }}>
          {auctionList.map((post)=>(
            <div key={post.pk}>
            <AuctionComponent pk={post.pk} main_image={post.main_image} name={post.name} buy_count={post.buy_count} 
                              create_time={post.create_time} end_date={post.end_date} seller_nickname={post.seller_nickname} seller_reliability={post.seller_reliability} bid_price={post.bid_price}  
                              seller_icon={post.seller_icon} views={post.views}   />
            </div>
          ))}
      </ContentsWrapper>
      <ContentsWrapper
        style={{
          borderRadius: '1rem',
          fontWeight: 'bold',
          flexDirection: 'row',
          justifyContent: 'space-between',
          fontSize: '1.1rem',
          width: '80%',
          maxWidth: '65rem'
        }}
      >
        <div/>
        <div style={{marginLeft: '80px'}}>
          <GrNotes style={{marginRight: '5px'}} />커뮤니티 목록
        </div>
        <Link onClick={()=> history.push('/communitylist/2')}>
          더보기<AiOutlinePlus/>
        </Link>
      </ContentsWrapper>
      <ContentsWrapper style={{flexWrap: 'wrap', boxShadow: 'none', background: '#f1f2f6' }}>
        <Table>
          <thead>
            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                <Td width={100}>번호</Td>
                <Td width={150}>닉네임</Td>
                <Td width={300}>제목</Td>
                <Td width={300}>등록일</Td>
                <Td width={100}>상세보기</Td>
            </Tr>
          </thead>
          {communityList.map((post)=>(
          <tbody key={post.pk}>
            <HomeComponent pk={post.pk} title={post.title} create_time={post.create_time} user_nickname={post.user_nickname}
              reliability={post.user_reliability} icon={post.user_icon} views={post.views}   />
          </tbody>
          ))}
        </Table>
      </ContentsWrapper>

      <ContentsWrapper
        style={{
          borderRadius: '1rem',
          fontWeight: 'bold',
          flexDirection: 'row',
          justifyContent: 'space-between',
          fontSize: '1.1rem',
          width: '80%',
          maxWidth: '65rem'
        }}
      >
        <div/>
        <div style={{marginLeft: '80px'}}>
          <RiAuctionFill style={{marginRight: '5px'}} />낙찰 된 상품 목록
        </div>
        <Link onClick={()=> history.push('/communitylist/3')}>
          더보기<AiOutlinePlus/>
        </Link>
      </ContentsWrapper>
      <ContentsWrapper style={{flexWrap: 'wrap', boxShadow: 'none', background: '#f1f2f6' }}>
        <Table>
          <thead>
            <Tr style={{ borderTop: '1px solid #cccccc', background: '#f8fafd' }}>
                <Td width={100}>번호</Td>
                <Td width={150}>판매자</Td>
                <Td width={300}>제목</Td>
                <Td width={300}>마감일</Td>
                <Td width={100}>상세보기</Td>
            </Tr>
          </thead>
          {endAuctionList.map((post)=>(
          <tbody key={post.pk}>
            <HomeComponent pk={post.pk} title={post.name} create_time={post.end_date} user_nickname={post.seller_nickname}
              reliability={post.seller_reliability} icon={post.seller_icon} views={post.views} auction={1}  />
          </tbody>
          ))}
        </Table>
      </ContentsWrapper>
    </Wrapper>
  );
};
export default Home;