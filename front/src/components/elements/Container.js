import styled from "styled-components";

const Container = styled.div`
width:80%;
border-radius:1rem;
border:1px solid #8e44ad;
padding:1rem;
display:flex;
min-height:24rem;
flex-direction:column;
text-align:left;
margin-bottom:2rem;
@media screen and (max-width:600px) {
    padding:0.5rem;
  }
`
export default Container