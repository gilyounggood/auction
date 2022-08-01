import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import setLevel from '../data/Level';
import { setIcon } from '../data/Icon';
import Tr from './elements/Tr';
import Td from './elements/Td';
import { CgDetailsMore } from 'react-icons/cg'

const HomeComponent = (props) => {
    const [commentList, setCommentList] = useState([]);
    const [replyList, setReplyList] = useState([])

    async function fetchPosts(){
        const {data: response2} = await axios.post('/api/comment', {pk:props.pk})
        setCommentList(response2.data)

        const {data: response3} = await axios.post('/api/reply', {pk:props.pk})
        setReplyList(response3.data)
      }
    
      useEffect(()=>{
        fetchPosts()
      },[])

    const history = useHistory()

    return (
        <Tr style={{backgroundColor: 'white'}}>
            <Td>{props.pk}</Td>
            <Td>{props.icon && <img width={15} src={setIcon(props.icon)}/>}<img src={setLevel(props.reliability)}/>{props.user_nickname}</Td>
            <Td>{props.title} {commentList.length+replyList.length>0 && <strong style={{ fontSize: '0.95rem', color: '#e84118' }}>[{commentList.length+replyList.length}]</strong>}</Td>
            <Td>{props.create_time}</Td>
            <Td><CgDetailsMore 
                style={{color: '#cd84f1', fontSize: '1.3rem', cursor: 'pointer' }}
                onClick={() => {props.auction===1 ? history.push(`/auction/${props.pk}`) : history.push(`/community/${props.pk}`)}}
            /></Td>
        </Tr>
    );
};
export default HomeComponent;