import styled from "styled-components";

const ButtonContainer = styled.button`
    background-color: transparent;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin: 0;
    padding: 0;
    color: white;
    cursor: pointer;
    
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

export default function NotificationsButton() {
  return(
    <ButtonContainer onClick={() => {
      window.openWindow(
        "Уведомления", 
        <div style={{padding: '20px', textAlign: 'center'}}>
          <i className="far fa-bell" style={{fontSize: '48px', color: '#ccc', marginBottom: '16px'}}></i>
          <p>Нет новых уведомлений</p>
        </div>,
        "fas fa-bell"
      );
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
        <path d="M8,1 C10.2,1 12,2.8 12,5 L12,8 L13,9 L13,10 L3,10 L3,9 L4,8 L4,5 C4,2.8 5.8,1 8,1 Z M8,2 C6.3,2 5,3.3 5,5 L5,8 L11,8 L11,5 C11,3.3 9.7,2 8,2 Z M8,14 C9.1,14 10,13.1 10,12 L6,12 C6,13.1 6.9,14 8,14 Z"/>
      </svg>
    </ButtonContainer>
  );
}