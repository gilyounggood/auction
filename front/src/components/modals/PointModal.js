import React, { useState } from 'react'
import styled from 'styled-components'
import ContentsWrapper from '../elements/ContentWrapper'
import Button from '../elements/Button'
import Payment from '../../payment/Payment'

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
    font-size: 1.6rem;
    color: #8e44ad;
    border-bottom: 1px solid gray;
    padding: 20px;
    transform: translate(0%, -210%);
`

const ModalBody = styled.div`
    width: 100%;
    font-weight: bold;
    text-align: center;
    font-size: 1.2rem;
`

const ModalBottom = styled.div`
    top: 100%;
    left: 100%;
    transform: translate(60%, 500%);
`

const ModalInput = styled.input`
    width: 50%;
    height: 27px;
    font-size: 1.0rem
`

const PointModal = (props) => {

    const {open ,close} = props;

    const pay = () => {
        close()
        Payment()
    }

  return (
    <Modal style={{display: open ? "block" : "none"}}>
        <ContentsWrapper style={{ 
          justifyContent: "center",
          alignItems: "center",
          borderRadius: '1rem',
          minHeight:'30rem',
          minWidth: '30rem',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        >
            <ModalBody>
                <Modaltitle>포인트 충전하기</Modaltitle>
                    충전금액: <ModalInput placeholder= '1원당 1포인트' />
            </ModalBody>
            <ModalBottom>
                <Button
                style={{width: '6rem', height: '2rem'}}
                onClick={pay}
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
