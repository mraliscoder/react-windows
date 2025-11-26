import styled from "styled-components";
import { useRef, useEffect } from "react";

const PopupContainer = styled.div`
  position: absolute;
  bottom: 40px;
  right: 0;
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 20px;
  z-index: 10001;
`;

const VolumeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const VolumeTitle = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const VolumeControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const VolumeSliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const VolumeIcon = styled.i`
  font-size: 20px;
  color: #333;
  width: 24px;
`;

const VolumeSlider = styled.input`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #0078d7;
    cursor: pointer;
  }
`;

const VolumeLevel = styled.span`
  font-size: 14px;
  color: #333;
  width: 40px;
  text-align: center;
`;

const AudioDevices = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
`;

const DeviceItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const DeviceIcon = styled.i`
  margin-right: 10px;
  color: #0078d7;
`;

const DeviceName = styled.span`
  font-size: 14px;
`;

export default function VolumePopup({ volume, onVolumeChange, onClose }) {
  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getVolumeIcon = () => {
    if (volume === 0) return 'fas fa-volume-mute';
    if (volume < 30) return 'fas fa-volume-down';
    if (volume < 70) return 'fas fa-volume';
    return 'fas fa-volume-up';
  };

  return (
    <PopupContainer ref={popupRef}>
      <VolumeHeader>
        <VolumeTitle>Громкость</VolumeTitle>
        <i 
          className={getVolumeIcon()} 
          style={{cursor: 'pointer', fontSize: '16px'}}
        ></i>
      </VolumeHeader>

      <VolumeControls>
        <VolumeSliderContainer>
          <VolumeIcon className={getVolumeIcon()} />
          <VolumeSlider
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          />
          <VolumeLevel>{volume}%</VolumeLevel>
        </VolumeSliderContainer>
      </VolumeControls>

      <AudioDevices>
        <DeviceItem>
          <DeviceIcon className="fas fa-headphones" />
          <DeviceName>Динамики</DeviceName>
        </DeviceItem>
        <DeviceItem>
          <DeviceIcon className="fas fa-headset" />
          <DeviceName>Наушники</DeviceName>
        </DeviceItem>
      </AudioDevices>
    </PopupContainer>
  );
}