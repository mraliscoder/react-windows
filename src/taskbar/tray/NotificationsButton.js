import styled from "styled-components";

const ButtonContainer = styled.button`
    background-color: transparent;
    border: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin: 0;
    padding: 0;
`;

export default function NotificationsButton() {
  return(
    <ButtonContainer onClick={() => {
      window.openWindow("Test", "TESTTESTTEST");
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M0 0H16V13H11L8 16L5 13H0V0ZM15 12V1H1V12H5.41406L8 14.5859L10.5859 12H15Z" fill="white"/>
      </svg>
    </ButtonContainer>
  );
}