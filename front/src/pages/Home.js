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
const Home = () => {
  const [auctionList, setAuctionList] = useState([])
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
      console.log(response.data)
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
      <ContentsWrapper style={{ flexDirection: 'row', flexWrap: 'wrap', boxShadow: 'none', background: '#f1f2f6' }}>
          {auctionList.map((post)=>(
            <div key={post.pk}>
            <AuctionComponent pk={post.pk} main_image={post.main_image} name={post.name} buy_count={post.buy_count} 
                              create_time={post.create_time} end_date={post.end_date} seller_nickname={post.seller_nickname} seller_reliability={post.seller_reliability} bid_price={post.bid_price}  
                              seller_icon={post.seller_icon} views={post.views}   />
            </div>
          ))}
      </ContentsWrapper>

    </Wrapper>
  );
};
export default Home;