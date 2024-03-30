import styled from "styled-components";
import HideWindowsButton from "./HideWindowsButton";
import NotificationsButton from "./NotificationsButton";
import Time from "./Time";

const SystemTrayContainer = styled.div`
    display: flex;
    align-items: center;
`;

export default function SystemTray() {
  return (
    <SystemTrayContainer>
      <div>buttons</div>
      <Time />
      <NotificationsButton />
      <HideWindowsButton />
    </SystemTrayContainer>
  );
}