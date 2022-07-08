import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components'

import Wrapper from '../components/elements/Wrapper';
import MemberComponent from '../components/MemberComponent';
import '../styles/style.css'
import ranking1 from '../assets/images/ranking/1.png'
import ranking2 from '../assets/images/ranking/2.png'
import ranking3 from '../assets/images/ranking/3.png'
import ranking4 from '../assets/images/ranking/4.png'
import ranking5 from '../assets/images/ranking/5.png'
import ranking6 from '../assets/images/ranking/6.png'
import ranking7 from '../assets/images/ranking/7.png'
import ranking8 from '../assets/images/ranking/8.png'
import ranking9 from '../assets/images/ranking/9.png'
import ranking10 from '../assets/images/ranking/10.png'

import setLevel from '../data/Level';

const Ranking = () => {
  const [memberList, setMemberList] = useState([])
  const ranking = {
    ranking1:ranking1,
    ranking2:ranking2,
    ranking3:ranking3,
    ranking4:ranking4,
    ranking5:ranking5,
    ranking6:ranking6,
    ranking7:ranking7,
    ranking8:ranking8,
    ranking9:ranking9,
    ranking10:ranking10
    
  }
  useEffect(()=>{
    async function fetchPosts(){
      const {data:response} = await axios.get('/api/ranking')
      setMemberList(response.data)
    }
    fetchPosts()
  },[])
  return (
    <Wrapper>
      {memberList.map((post,index)=>(
        <MemberComponent  key={post.pk} 
        ranking={ranking[`ranking${index+1}`]} nick_name={post.nick_name} phone_number={post.phone_number} level={setLevel(post.reliability)} reliability={post.reliability} pk={post.pk} point={post.user_point}
        />
      ))}

    </Wrapper>
  );
};
export default Ranking;