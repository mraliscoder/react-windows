import styled, {css} from "styled-components";

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px;
    user-select: none;
    background: ${props => props.dragging ? '#0078d7' : '#f0f0f0'};
    color: ${props => props.dragging ? 'white' : 'black'};
    border-bottom: 1px solid #ddd;
    
    ${props => props.dragging && css`
        cursor: grabbing;
    `}
`;

const Title = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
`;

const Icon = styled.img`
    width: 16px;
    height: 16px;
    border-radius: 2px;
`;

const WindowControls = styled.div`
    display: flex;
    gap: 1px;
`;

const ControlButton = styled.button`
    width: 28px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: ${props => props.dragging ? 'white' : '#333'};
    
    &:hover {
        background: ${props => props.close ? '#e81123' : (props.dragging ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')};
        color: ${props => props.close ? 'white' : (props.dragging ? 'white' : '#333')};
    }
`;

export default function WindowHeading({ 
  title, 
  dragging, 
  icon, 
  onClose, 
  onMinimize, 
  onMaximize,
  isMaximized 
}) {
  return(
    <Header className={`heading`} dragging={dragging}>
      <Title>
        {icon && <Icon alt={title} src={icon} />}
        {title}
      </Title>
      <WindowControls>
        <ControlButton 
          dragging={dragging} 
          onClick={onMinimize}
          title="Свернуть"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="0" y="5" width="12" height="1"/>
          </svg>
        </ControlButton>
        <ControlButton 
          dragging={dragging} 
          onClick={onMaximize}
          title={isMaximized ? "Восстановить" : "Развернуть"}
        >
          {isMaximized ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M3,1 L9,1 L9,2 L4,2 L4,7 L3,7 L3,1 Z M1,3 L7,3 L7,8 L2,8 L2,4 L1,4 L1,3 Z M2,3 L2,2 L8,2 L8,8 L7,8 L7,9 L9,9 L9,3 L2,3 Z"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="1" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          )}
        </ControlButton>
        <ControlButton 
          dragging={dragging} 
          close 
          onClick={onClose}
          title="Закрыть"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M1,1 L11,11 M11,1 L1,11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </ControlButton>
      </WindowControls>
    </Header>
  );
}