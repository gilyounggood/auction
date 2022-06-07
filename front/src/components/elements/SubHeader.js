import styled from 'styled-components'

const SubHeader = styled.div`
box-shadow: 2px 1px 4px #00000029;
  max-width: 76.8rem;
  display: flex;
  margin: 1rem auto;
  flex-direction:column;
  align-items:center;
  padding:18px 0;
  border-radius: 1rem; 
  font-size: 1.2rem;
  color: #fff; 
  text-shadow: 2px 2px 2px gray;
  font-weight: bold;
  background-size:100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-color:#718093;
  background-blend-mode:multiply;
  
  @media screen and (max-width:600px) {
    border-radius: 0.4rem;
}
`
export default SubHeader