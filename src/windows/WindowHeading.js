import styled, {css} from "styled-components";

import icon from "../assets/windows_icon.png";

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px;
    user-select: none;
    
    ${props => props.dragging && css`
        cursor: grabbing;
    `}
`;
const Title = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
`;
const Icon = styled.img`
    width: 16px;
    height: 16px;
`;
const CloseButton = styled.button`
    width: 16px;
    height: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 0;
`;

export default function WindowHeading({ title, dragging }) {
  return(
    <Header className={`heading`} dragging={dragging}>
      <Title>
        <Icon alt={title} src={icon} />
        {title}
      </Title>
      <CloseButton>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 9 9" fill="none">
          <path
            d="M0.099665 0.242656L0.164753 0.164753C0.360015 -0.0305096 0.663117 -0.0522056 0.882344 0.099665L0.960247 0.164753L4.5 3.70463L8.03975 0.164753C8.25942 -0.0549174 8.61558 -0.0549174 8.83525 0.164753C9.05492 0.384422 9.05492 0.740578 8.83525 0.960247L5.29537 4.5L8.83525 8.03975C9.03051 8.23501 9.05221 8.53812 8.90033 8.75734L8.83525 8.83525C8.63999 9.03051 8.33688 9.05221 8.11766 8.90033L8.03975 8.83525L4.5 5.29537L0.960247 8.83525C0.740578 9.05492 0.384422 9.05492 0.164753 8.83525C-0.0549174 8.61558 -0.0549174 8.25942 0.164753 8.03975L3.70463 4.5L0.164753 0.960247C-0.0305096 0.764985 -0.0522056 0.461883 0.099665 0.242656Z"
            fill="#212121"/>
        </svg>
      </CloseButton>
    </Header>
  );
}