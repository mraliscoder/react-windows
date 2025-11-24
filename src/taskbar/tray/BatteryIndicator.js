import styled from "styled-components";

const BatteryContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0 8px;
  color: white;
  font-size: 12px;
  gap: 4px;
`;

export default function BatteryIndicator() {
  const batteryLevel = 87;
  
  return (
    <BatteryContainer>
      <svg width="20" height="10" viewBox="0 0 20 10" fill="white">
        <rect x="0.5" y="0.5" width="17" height="9" rx="1" fill="none" stroke="white"/>
        <rect x="18" y="2.5" width="1.5" height="5" rx="0.5" fill="white"/>
        <rect x="1.5" y="1.5" width={15 * (batteryLevel / 100)} height="7" rx="0.5" fill="white"/>
      </svg>
      <span>{batteryLevel}%</span>
    </BatteryContainer>
  );
}