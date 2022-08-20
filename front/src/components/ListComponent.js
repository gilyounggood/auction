import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Tr from './elements/Tr';
import Td from './elements/Td';
import Date from './elements/Date';
import axios from 'axios';
import { CgDetailsMore } from 'react-icons/cg'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import setLevel from '../data/Level';
import { setIcon } from '../data/Icon';

const ListComponent = (props) => {
    const history = useHistory();
    const [comment, setComment] = useState([]);
    const [reply, setReply] = useState([])
    const [upDown, setUpDown] = useState([])

    const fetchList = async () =>{
        const { data: response } = await axios.post('/api/comment', {pk: props.pk})
        if(response.result>0){
            setComment(response.data)
        }
        const { data: response2 } = await axios.post('/api/reply', {pk: props.pk})
        if(response2.result>0){
            setReply(response2.data)
        }
        const { data: response3 } = await axios.post('/api/up_down', {community_pk: props.pk})
        if(response3.result>0){
            setUpDown(response3.data)
        }
    }
    useEffect(() => {
        fetchList();
    }, [])

    async function deleteArticle(num) {
        const { data: response } = await axios.post('/api/delete', { tableName: 'community', pk: num })
        if(response.result>0){
            props.changePage(props.page)
        }
    }

    const UpList = upDown.filter(list => list.comment_pk === null && list.reply_pk === null && list.up_down === 1)

    return (
        <Tr key={props.pk}>
            {
                props.slide == 1 || props.slide == 2 ?
                    <>
                        <Td>{props.pk}</Td>
                        <Td>{props.user_icon && <img width={15} src={setIcon(props.user_icon)}/>}
                            <img src={setLevel(props.user_reliability)}/>{props.user_nickname}
                        </Td>
                        <Td>
                            {props.title}
                            {comment.length > 0 &&
                            <span style={{color: '#EB0000', marginLeft: '3px'}}>
                                {`[${comment.length + reply.length}]`}
                            </span>
                            }
                                
                        </Td>
                        <Td><CgDetailsMore style={{ color: '#cd84f1', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => { history.push(`/community/${props.pk}`) }} /></Td>
                        <Td>{props.create_time}</Td>
                        <Td>{props.views}</Td>
                        <Td>{UpList.length}</Td>
                        <Td>
                        {
                            props.user_pk === props.myPk ? 
                                <AiFillEdit style={{ color: '289AFF', fontSize: '1.3rem', cursor: 'pointer' }}
                                    onClick={() => {
                                        history.push(`/editcommunity/${props.pk}`)
                                    }} 
                                />
                                : '--'
                        }
                        </Td>
                        <Td>
                        {
                            props.myLevel >= 40 || props.user_pk === props.myPk ? 
                                <AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                                    onClick={() => {
                                        if (window.confirm("정말로 삭제하시겠습니까?")) {
                                            deleteArticle(props.pk)
                                        }
                                    }}
                                />
                                : '--'
                        }
                        </Td>
                    </>
                    : null
            }
            {
                props.slide == 3 ?
                    <>
                        <Td>{props.pk}</Td>
                        <Td>{props.name}</Td>
                        <Td>{props.buyer_nickname ?? '---'}</Td>
                        <Td>{props.seller_nickname ?? '---'}</Td>
                        <Td><CgDetailsMore style={{ color: '#cd84f1', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => { history.push(`/auction/${props.pk}`) }} /></Td>
                        <Date style={{ marginRight: '5.4rem' }}>{props.end_date}</Date>
                        <Td>
                        {
                            props.myLevel >= 40 || props.user_pk === props.myPk ? 
                                <AiFillDelete style={{ color: 'red', fontSize: '1.3rem', cursor: 'pointer' }}
                                    onClick={() => {
                                        if (window.confirm("정말로 삭제하시겠습니까?")) {
                                            deleteArticle(props.pk)
                                        }
                                    }}
                                />
                                : '--'
                        }
                        </Td>
                    </>
                    : null
            }
        </Tr>
    );
};
export default ListComponent;