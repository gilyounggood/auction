import styled from 'styled-components'

const BoxContent2 = styled.div`
width:13rem;
min-height:18rem;
margin: 1rem 1.1rem;
border-radius:0.5rem;
display:flex;
flex-direction:column;
@media screen and (max-width:1230px) {
    width: 23vw;
    min-height: 30vw;
    margin: 1rem auto;
  }
  @media screen and (max-width:800px) {
    width: 30vw;
    min-height: 44vw;
    margin: 1rem auto;
  }
  @media screen and (max-width:500px) {
    width: 60vw;
    min-height:86vw;
    margin: 1rem auto;
  }
  box-shadow: 2px 1px 4px #00000029;
  background:#fff;
  cursor:pointer;
`

export default BoxContent2