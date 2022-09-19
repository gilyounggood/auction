import React, { useState, useEffcet, useEffect } from 'react'
import styled from 'styled-components'
import ContentsWrapper from '../elements/ContentWrapper'
import Button from '../elements/Button'
import $ from 'jquery'
import axios from 'axios'

const Modal = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`

const Modaltitle = styled.div`
    width: 100%;
    text-align: center;
    font-size: 1.6rem;
    color: #8e44ad;
    border-bottom: 1px solid gray;
    padding: 15px;
    transform: translate(0%, -70%);
`

const ModalBody = styled.div`
    width: 100%;
    font-weight: bold;
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column
`

const ModalSubTitle = styled.div`
    width: 15rem;
    text-align: left;
    margin-bottom: 10px;
`

const ModalBottom = styled.div`
    top: 100%;
    left: 100%;
    transform: translate(60%, 130%);
`

const ModalInput = styled.input`
    width: 50%;
    height: 27px;
    font-size: 1.0rem;
    margin-bottom: 10px;
`

const Explan = styled.div`
    font-size: 0.9rem;
    color: #3232FF;
    margin-top: 5px;
`

const Price = styled.div`
    font-size: 1.1rem;
    color: #CD1039;
    margin-top: 10px;
`

const AutoBuyingModal = (props) => {

    const {open ,close} = props;

    const [maxPrice, setMaxPrice] = useState(0)
    const [purchasePrice, setPurchasePrice] = useState(0)

    const autoSystem = async () => {
        if(maxPrice===0||purchasePrice===0) {
            alert("필요값을 전부 입력해주세요.")
        } else {
            if(isNaN(parseInt($('#max_price').val())) || isNaN(parseInt($('#purchase_price').val()))) {
                alert("가격은 숫자만 입력해주세요.")
            } else if(maxPrice<=props.bid_price) {
                alert(`상한가는 현재 매수가보다 높게 설정 해주세요.\n현재 매수가:${props.bid_price}`)
            } else if(purchasePrice<10000) {
                alert("매수가는 최소 10,000원보다 높아야 합니다.")
            } else {
                const {data: response} = await axios.post('/api/autosystem', {
                    auction_pk: props.auction_pk,
                    user_pk: props.user_pk,
                    max_price: maxPrice,
                    purchase_price: purchasePrice,
                    kind: props.max_price ? 'update' : 'add'
                })
                if(response.result > 0) {
                    close()
                    $("#max_price").val("")
                    $("#purchase_price").val("")
                    alert("자동 매수 시스템 설정을 완료 했습니다.")
                    props.fetchPosts();
                } else {
                    alert("서버 에러 발생")
                }
            }
        }
    }

  return (
    <Modal style={{display: open ? "block" : "none"}}>
        <ContentsWrapper style={{ 
          justifyContent: "center",
          alignItems: "center",
          borderRadius: '1rem',
          minHeight:'35rem',
          minWidth: '30rem',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        >
            <ModalBody>
                <Modaltitle>자동 매수 시스템 관리</Modaltitle>
                <ModalSubTitle>
                    상한가 설정하기
                    <Explan>
                        최대 매수 가격을 설정해주세요.
                    </Explan>
                </ModalSubTitle>
                <ModalInput 
                    id='max_price'
                    placeholder='목표가 설정'
                    onChange={e => {setMaxPrice(e.target.value)}}
                />
                <ModalSubTitle>
                    현재 설정 된 상한가
                    <Price>
                        {props.max_price ? props.max_price+'원' : '없음'}
                    </Price>
                </ModalSubTitle>
                <ModalSubTitle>
                    매수 가격 설정하기
                    <Explan>
                        매수 가격을 설정해주세요.<br/>
                        최소 단위는 10,000원입니다.
                    </Explan>
                </ModalSubTitle>
                <ModalInput 
                    id='purchase_price'
                    placeholder='상한가 설정'
                    onChange={e => {setPurchasePrice(e.target.value)}} 
                />
                <ModalSubTitle>
                    현재 설정 된 매수가
                    <Price>
                        {props.purchase_price ? props.purchase_price+'원' : "없음"}
                    </Price>
                </ModalSubTitle>
            </ModalBody>
            <ModalBottom>
                <Button
                    style={{width: '6rem', height: '2rem'}}
                    onClick={()=> {autoSystem()}}
                >
                  설정하기
                </Button>
                <Button
                    style={{width: '6rem', height: '2rem', marginLeft: '10px'}}
                    onClick={close}
                >
                  취소
                </Button>
            </ModalBottom>
        </ContentsWrapper>
    </Modal>
  )
}

export default AutoBuyingModal
