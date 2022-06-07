import styled from "styled-components"
const SmallBoxContainer = styled.div`
width:46%;
display:flex;
margin:1rem auto;
background:white;
box-shadow:2px 1px 4px #00000029;
justify-content:space-between;
cursor:pointer;
@media screen and (max-width:900px) {
  width:80%;
  margin:0.7rem auto;
}
@media screen and (max-width:700px) {
  width:90%;
  margin:0.5rem auto;
}
@media screen and (max-width:500px) {
  width:100%;
  margin:0.3rem auto;
}
`
export default SmallBoxContainer

