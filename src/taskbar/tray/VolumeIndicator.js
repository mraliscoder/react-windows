import styled from "styled-components";
import { useState } from "react";
import VolumePopup from "./VolumePopup";

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0 5px;
  color: white;
  position: relative;
`;

const VolumeButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 8px;
  cursor: pointer;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export default function VolumeIndicator() {
  const [volume, setVolume] = useState(70);
  const [showPopup, setShowPopup] = useState(false);
  // УДАЛЕНО: неиспользуемая переменная muted
  // const [muted, setMuted] = useState(false);

  const getVolumeIcon = () => {
    // Упростим логику, так как muted больше не используется
    if (volume === 0) return 'fas fa-volume-mute';
    if (volume < 30) return 'fas fa-volume-down';
    if (volume < 70) return 'fas fa-volume';
    return 'fas fa-volume-up';
  };

  // УДАЛЕНО: неиспользуемая функция toggleMute
  // const toggleMute = () => {
  //   setMuted(!muted);
  // };

  const handleVolumeClick = () => {
    setShowPopup(!showPopup);
  };

  return (
    <VolumeContainer>
      <VolumeButton onClick={handleVolumeClick}>
        <i className={getVolumeIcon()} style={{fontSize: '16px'}}></i>
      </VolumeButton>
      
      {showPopup && (
        <VolumePopup
          volume={volume}
          onVolumeChange={setVolume}
          onClose={() => setShowPopup(false)}
        />
      )}
    </VolumeContainer>
  );
}