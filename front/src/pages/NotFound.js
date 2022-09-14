import React from 'react'
import { useHistory } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import Wrapper from '../components/elements/Wrapper'
import ContentsWrapper from '../components/elements/ContentWrapper'

function NotFound() {
    const history = useHistory();

  return (
    <Wrapper>
        <ContentsWrapper style={{borderRadius: '0.9rem', fontSize: '1.3rem'}}>
            <div style={{width:'100%',textAlign:'center'}} onClick={()=>{history.push('/')}}>
                <img src={logo} style={{ margin: '0 auto', height: '5rem',zIndex:'1999' }} />
            </div>
            <span style={{fontWeight: 'bold', marginTop: '10px'}}>
                요청하신 페이지를 찾을 수 없습니다.
            </span>
            <div style={{borderRadius: '0.9rem', fontSize: '1.0rem', marginTop: '30px'}}>
                방문하시려는 페이지의 주소가 잘못 입력되었거나,
                <br/><br/>
                페이지의 주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
                <br/><br/>
                입력하신 주소가 정확한지 다시 한번 확인해 주시기 바랍니다.
                <br/><br/><br/>
                <span 
                    style={{display: 'flex', justifyContent: 'center', marginBottom: '30px', color: 'blue', fontWeight: 'bold', cursor: 'pointer'}}
                    onClick={() => {history.push('/')}}
                >
                  홈으로 바로가기
                </span>
            </div>
        </ContentsWrapper>
    </Wrapper>
  )
}

export default NotFound
