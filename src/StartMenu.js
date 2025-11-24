import styled from "styled-components";
import { useState } from "react";

const StartMenuContainer = styled.div`
  position: fixed;
  bottom: 40px;
  left: 0;
  width: 400px;
  height: 500px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  display: ${props => props.visible ? 'block' : 'none'};
  z-index: 10000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const AppList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 20px;
`;

const AppItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 120, 215, 0.1);
  }
`;

const AppIcon = styled.img`
  width: 32px;
  height: 32px;
  margin-bottom: 5px;
`;

const AppName = styled.span`
  font-size: 12px;
  text-align: center;
`;

export default function StartMenu({ visible, apps, onAppClick }) {
  return (
    <StartMenuContainer visible={visible}>
      <AppList>
        {apps.map(app => (
          <AppItem key={app.id} onClick={() => onAppClick(app)}>
            <AppIcon src={app.icon} alt={app.name} />
            <AppName>{app.name}</AppName>
          </AppItem>
        ))}
      </AppList>
    </StartMenuContainer>
  );
}