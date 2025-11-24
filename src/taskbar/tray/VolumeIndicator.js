import styled from "styled-components";
import { useState } from "react";

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0 8px;
  color: white;
  gap: 4px;
`;

const VolumeSlider = styled.input`
  width: 80px;
  margin-left: 8px;
`;

export default function VolumeIndicator() {
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  
  return (
    <VolumeContainer>
      <div 
        style={{cursor: 'pointer'}}
        onClick={() => setMuted(!muted)}
      >
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
            <path d="M11,3 L11,15 L6,12 L3,12 L3,6 L6,6 L11,3 Z M12,6 L15,3 L15,15 L12,12 L12,6 Z"/>
            <line x1="1" y1="17" x2="17" y2="1" stroke="white" strokeWidth="2"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
            <path d="M11,3 L11,15 L6,12 L3,12 L3,6 L6,6 L11,3 Z M12,6 L15,3 L15,15 L12,12 L12,6 Z"/>
          </svg>
        )}
      </div>
      <VolumeSlider 
        type="range" 
        min="0" 
        max="100" 
        value={muted ? 0 : volume}
        onChange={(e) => {
          setVolume(e.target.value);
          if (muted && e.target.value > 0) setMuted(false);
        }}
      />
    </VolumeContainer>
  );
}