import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components'
import ContentsWrapper from '../components/elements/ContentWrapper';
import Wrapper from '../components/elements/Wrapper';
import AuctionComponent from '../components/AuctionComponent';
import '../styles/style.css'
import slide1 from '../assets/images/slide/123.jpg'
import slide2 from '../assets/images/slide/456.jpeg'
import slide3 from '../assets/images/slide/789.jpg'
import ServerLink from '../data/ServerLink';
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/style.css'
import { RiAuctionLine, RiAuctionFill } from 'react-icons/ri'
import { GrNotes } from 'react-icons/gr'
import { AiOutlinePlus } from 'react-icons/ai'
import { HiSpeakerphone } from 'react-icons/hi'

const Link = styled.div`
  color: gray;
  font-size: 1rem;
  cursor: pointer;
`

const Home = () => {
  const [auctionList, setAuctionList] = useState([])
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
          fontSize: '1.1rem'
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

      <ContentsWrapper
        style={{
          borderRadius: '1rem',
          fontWeight: 'bold',
          flexDirection: 'row',
          justifyContent: 'space-between',
          fontSize: '1.1rem'
        }}
      >
        <div/>
        <div style={{marginLeft: '75px'}}>
          <RiAuctionLine style={{marginRight: '5px'}} />진행중인 경매 목록
        </div>
        <Link onClick={()=> history.push('/communitylist/2')}>
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
          fontSize: '1.1rem'
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

      <ContentsWrapper
        style={{
          borderRadius: '1rem',
          fontWeight: 'bold',
          flexDirection: 'row',
          justifyContent: 'space-between',
          fontSize: '1.1rem'
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
    </Wrapper>
  );
};
export default Home;