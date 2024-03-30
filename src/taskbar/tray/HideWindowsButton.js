import styled from "styled-components";

const ButtonContainer = styled.button`
    background-color: transparent;
    border: 0;
    display: block;
    width: 4px;
    height: 40px;
    border-left: 1px solid rgba(255, 255, 255, 20%);
\    margin: 0;
    padding: 0;
`;

export default function HideWindowsButton() {
  return(
    <ButtonContainer />
  );
}