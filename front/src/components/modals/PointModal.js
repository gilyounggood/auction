import React, { useState } from 'react'
import styled from 'styled-components'
import ContentsWrapper from '../elements/ContentWrapper'
import Button from '../elements/Button'
import Payment from '../../payment/Payment'
import $ from 'jquery'

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
    margin-bottom: 5px;
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

const ModalSelect = styled.select`
    width: 52%;
    height: 33px;
    font-size: 1.0rem;
    margin-bottom: 10px;
`

const PointModal = (props) => {

    const {open ,close} = props;

    const [payName, setPayName] = useState("")
    const [payPhone, setPayPhone] = useState("")
    const [payEmail, setPayEmail] = useState("")
    const [payAmount, setPayAmount] = useState("")
    const [payMethod, setPayMethod] = useState("")

    const pay = (username, phone, email, amount, method) => {
        if(username===""||phone===""||email===""||amount===""||method==="") {
            alert("필요값을 전부 입력해주세요.")
        } else {
            if(isNaN(parseInt($('#pay_amount').val()))) {
                alert("결제 금액은 숫자만 입력해주세요.")
            } else {
                close()
                Payment(username, phone, email ,amount, method)
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
                <Modaltitle>포인트 충전하기</Modaltitle>
                <ModalSubTitle>
                        구매자 이름:
                </ModalSubTitle>
                <ModalInput 
                    placeholder= '홍길동'
                    onChange={e => {setPayName(e.target.value)}}
                />
                <ModalSubTitle>
                        구매자 전화번호:
                </ModalSubTitle>
                <ModalInput 
                    placeholder= '01012345678'
                    onChange={e => {setPayPhone(e.target.value)}} 
                />
                <ModalSubTitle>
                        구매자 이메일:
                </ModalSubTitle>
                <ModalInput 
                    placeholder= 'xxx@xxx.com'
                    onChange={e => {setPayEmail(e.target.value)}}
                />
                <ModalSubTitle>
                        충전 금액:
                </ModalSubTitle>
                <ModalInput 
                    id="pay_amount"
                    placeholder= '1원당 1포인트'
                    onChange={e => {setPayAmount(e.target.value)}}
                />
                <ModalSubTitle>
                        결제 수단:
                </ModalSubTitle>
                <ModalSelect
                    onChange={e => {setPayMethod(e.target.value)}}
                >
                    <option value="" selected>결제 수단 선택</option>
                    <option value="card">카드</option>
                    <option value="vbank">계좌이체</option>
                </ModalSelect>
            </ModalBody>
            <ModalBottom>
                <Button
                style={{width: '6rem', height: '2rem'}}
                onClick={()=> {pay(payName, payPhone, payEmail, payAmount, payMethod)}}
                >
                  충전하기
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

export default PointModal
