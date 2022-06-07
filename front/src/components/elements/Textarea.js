import styled from "styled-components";

const Textarea = styled.textarea`
outline:none;
font-size:0.9rem;
border:none;
border-bottom:1px solid black;
margin-left:0.3rem;
width:90%;
height:6rem;
padding-bottom:0.2rem;
::placeholder {
    color: #cccccc;
  }
`
export default Textarea