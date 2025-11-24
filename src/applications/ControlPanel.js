import styled from "styled-components";
import { useState } from "react";

const ControlPanelContainer = styled.div`
  padding: 20px;
  height: calc(100% - 30px);
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Setting = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  padding: 8px 0;
`;

export default function ControlPanel() {
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(80);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ControlPanelContainer>
      <Section>
        <SectionTitle>
          <i className="fas fa-desktop"></i>
          Система
        </SectionTitle>
        <Setting>
          <span>Яркость экрана</span>
          <input 
            type="range" 
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(e.target.value)}
          />
          <span>{brightness}%</span>
        </Setting>
      </Section>
      
      <Section>
        <SectionTitle>
          <i className="fas fa-volume-up"></i>
          Звук
        </SectionTitle>
        <Setting>
          <span>Громкость</span>
          <input 
            type="range" 
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
          <span>{volume}%</span>
        </Setting>
      </Section>
      
      <Section>
        <SectionTitle>
          <i className="fas fa-palette"></i>
          Персонализация
        </SectionTitle>
        <Setting>
          <span>Темная тема</span>
          <input 
            type="checkbox" 
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
        </Setting>
      </Section>
    </ControlPanelContainer>
  );
}