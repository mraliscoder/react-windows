import styled from "styled-components";
import HideWindowsButton from "./HideWindowsButton";
import NotificationsButton from "./NotificationsButton";
import Time from "./Time";
import BatteryIndicator from "./BatteryIndicator";
import VolumeIndicator from "./VolumeIndicator";

const SystemTrayContainer = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`;

export default function SystemTray() {
  return (
    <SystemTrayContainer>
      <VolumeIndicator />
      <BatteryIndicator />
      <Time />
      <NotificationsButton />
      <HideWindowsButton />
    </SystemTrayContainer>
  );
}