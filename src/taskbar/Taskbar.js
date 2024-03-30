import styled from "styled-components";

import acrylic from "../assets/taskbar_background.png";
import SystemTray from "./tray/SystemTray";

const TaskbarContainer = styled.div`
    height: 40px;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    background-image: url(${acrylic});
    background-position: center center;
    background-size: cover;
    background-repeat: repeat;
`;

export default function Taskbar() {
  return(
    <TaskbarContainer>
      <div>left part</div>
      <SystemTray />
    </TaskbarContainer>
  );
}