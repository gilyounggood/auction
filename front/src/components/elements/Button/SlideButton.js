import styled from "styled-components"

const SlideButton = styled.button`
width: 30%;
height: 2.5rem;
border:none;
box-shadow: 2px 1px 4px #00000029;
border-radius:0.5rem;
font-size:0.9rem;
cursor:pointer;
border: 1px solid #9b59b6;
@media screen and (max-width:600px) {
    margin:0 auto;
    font-size:0.65rem;
  }
`

export default SlideButton