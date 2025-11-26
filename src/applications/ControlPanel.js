import styled from "styled-components";
import { useState, useEffect } from "react";

const ControlPanelContainer = styled.div`
  padding: 20px;
  height: calc(100% - 30px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

const SectionTitle = styled.div`
  background: #f8f8f8;
  padding: 12px 16px;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Setting = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

const Label = styled.span`
  font-size: 14px;
`;

const Slider = styled.input`
  width: 200px;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
    
    &:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: #0078d7;
  }
  
  input:checked + span:before {
    transform: translateX(26px);
  }
`;

const Dropdown = styled.select`
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
`;

export default function ControlPanel() {
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ru');
  const [dateFormat, setDateFormat] = useState('dd.mm.yyyy');
  const [autoStart, setAutoStart] = useState(false);

  // Эффекты для применения настроек
  useEffect(() => {
    document.documentElement.style.setProperty('--volume', `${volume}%`);
    // Здесь можно добавить реальное изменение громкости системы
  }, [volume]);

  useEffect(() => {
    document.documentElement.style.setProperty('--brightness', `${brightness}%`);
    // Здесь можно добавить реальное изменение яркости
  }, [brightness]);

  useEffect(() => {
    if (darkMode) {
      document.body.style.filter = 'invert(1) hue-rotate(180deg)';
    } else {
      document.body.style.filter = 'none';
    }
  }, [darkMode]);

  const handleReset = () => {
    setVolume(70);
    setBrightness(80);
    setDarkMode(false);
    setLanguage('ru');
    setDateFormat('dd.mm.yyyy');
    setAutoStart(false);
  };

  return (
    <ControlPanelContainer>
      <Section>
        <SectionTitle>
          <i className="fas fa-desktop"></i>
          Система
        </SectionTitle>
        <SectionContent>
          <Setting>
            <Label>Яркость экрана</Label>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <Slider 
                type="range" 
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
              />
              <span>{brightness}%</span>
            </div>
          </Setting>
          
          <Setting>
            <Label>Автозапуск приложений</Label>
            <Toggle>
              <input 
                type="checkbox" 
                checked={autoStart}
                onChange={(e) => setAutoStart(e.target.checked)}
              />
              <span></span>
            </Toggle>
          </Setting>
        </SectionContent>
      </Section>
      
      <Section>
        <SectionTitle>
          <i className="fas fa-volume-up"></i>
          Звук
        </SectionTitle>
        <SectionContent>
          <Setting>
            <Label>Громкость</Label>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <Slider 
                type="range" 
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
              />
              <span>{volume}%</span>
            </div>
          </Setting>
        </SectionContent>
      </Section>
      
      <Section>
        <SectionTitle>
          <i className="fas fa-palette"></i>
          Персонализация
        </SectionTitle>
        <SectionContent>
          <Setting>
            <Label>Темная тема</Label>
            <Toggle>
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span></span>
            </Toggle>
          </Setting>
          
          <Setting>
            <Label>Язык системы</Label>
            <Dropdown value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </Dropdown>
          </Setting>
          
          <Setting>
            <Label>Формат даты</Label>
            <Dropdown value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
              <option value="dd.mm.yyyy">дд.мм.гггг</option>
              <option value="mm/dd/yyyy">мм/дд/гггг</option>
              <option value="yyyy-mm-dd">гггг-мм-дд</option>
            </Dropdown>
          </Setting>
        </SectionContent>
      </Section>
      
      <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
        <Button onClick={handleReset}>Сбросить настройки</Button>
        <Button primary>Применить</Button>
      </div>
    </ControlPanelContainer>
  );
}

const Button = styled.button`
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: ${props => props.primary ? '#0078d7' : 'white'};
  color: ${props => props.primary ? 'white' : 'black'};
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background: ${props => props.primary ? '#106ebe' : '#f0f0f0'};
  }
`;