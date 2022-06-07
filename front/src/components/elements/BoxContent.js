import styled from 'styled-components'

const BoxContent = styled.div`
width:17rem;
min-height:20.4rem;
margin: 1rem 1.1rem;
border-radius:0.5rem;
display:flex;
flex-direction:column;
@media screen and (max-width:1230px) {
    width: 30vw;
    min-height: 36vw;
    margin: 1rem auto;
  }
  @media screen and (max-width:800px) {
    width: 45vw;
    min-height: 54vw;
    margin: 1rem auto;
  }
  @media screen and (max-width:500px) {
    width: 80vw;
    min-height:96vw;
    margin: 1rem auto;
  }
  box-shadow: 2px 1px 4px #00000029;
  background:#fff;
  cursor:pointer;
`

export default BoxContent