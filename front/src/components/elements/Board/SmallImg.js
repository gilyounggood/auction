import styled from "styled-components"
const SmallImg = styled.img`
width:40%;
height:10rem;
margin:1rem auto;
@media screen and (max-width:1000px) {
  width:45%;
}
@media screen and (max-width:500px) {
  width:45%;
  height:8rem;
}
`
export default SmallImg