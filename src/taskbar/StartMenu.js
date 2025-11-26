import styled from "styled-components";
import { useState } from "react"; // Добавили импорт useState

const StartMenuContainer = styled.div`
  position: fixed;
  bottom: 40px;
  left: 0;
  width: 480px;
  height: 560px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  z-index: 10000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #0078d7 0%, #106ebe 100%);
  color: white;
`;

const UserName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const UserStatus = styled.div`
  font-size: 12px;
  opacity: 0.8;
`;

const AppList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 20px;
  flex: 1;
`;

const AppItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 120, 215, 0.1);
    transform: translateY(-2px);
  }
`;

const AppIconImage = styled.img`
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  border-radius: 4px;
`;

const AppIconFontAwesome = styled.i`
  font-size: 24px;
  margin-bottom: 8px;
  color: #0078d7;
`;

const AppName = styled.span`
  font-size: 12px;
  text-align: center;
  font-weight: 500;
`;

const Footer = styled.div`
  padding: 12px 20px;
  background: #f8f8f8;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PowerButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PowerButton = styled.button`
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  
  ${props => props.danger && `
    color: #d13438;
    
    &:hover {
      background: rgba(209, 52, 56, 0.1);
    }
  `}
`;

const ShutdownMessage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
`;

export default function StartMenu({ visible, apps, onAppClick, onClose }) {
  const [showShutdownMessage, setShowShutdownMessage] = useState(false);

  const handleLogout = () => {
    // Возврат на экран входа
    window.location.reload();
  };

  const handleRestart = () => {
    // Перезагрузка страницы
    window.location.reload();
  };

  const handleShutdown = () => {
    setShowShutdownMessage(true);
    // Пытаемся закрыть вкладку
    setTimeout(() => {
      if (!window.close()) {
        // Если не удалось закрыть вкладку, показываем сообщение
        setTimeout(() => {
          setShowShutdownMessage(false);
        }, 3000);
      }
    }, 2000);
  };

  if (!visible) return null;

  if (showShutdownMessage) {
    return (
      <ShutdownMessage>
        <i className="fas fa-power-off" style={{fontSize: '64px', marginBottom: '20px', color: '#0078d7'}}></i>
        <h2>Завершение работы</h2>
        <p>NEWindows завершает работу...</p>
        {!window.close() && (
          <p style={{marginTop: '20px', color: '#ccc'}}>
            Теперь питание компьютера можно выключить
          </p>
        )}
      </ShutdownMessage>
    );
  }

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
        onClick={onClose}
      />
      <StartMenuContainer visible={visible}>
        <Header>
          <UserName>Пользователь</UserName>
          <UserStatus>Работает</UserStatus>
        </Header>
        
        <AppList>
          {apps.map(app => (
            <AppItem key={app.id} onClick={() => onAppClick(app)}>
              {app.icon.startsWith('http') ? (
                <AppIconImage src={app.icon} alt={app.name} />
              ) : app.icon.startsWith('fas') || app.icon.startsWith('fab') || app.icon.startsWith('far') ? (
                <AppIconFontAwesome className={app.icon} />
              ) : (
                <AppIconImage src={app.icon} alt={app.name} />
              )}
              <AppName>{app.name}</AppName>
            </AppItem>
          ))}
        </AppList>
        
        <Footer>
          <div style={{fontSize: '12px', color: '#666'}}>
            NEWindows v1.0
          </div>
          <PowerButtons>
            <PowerButton onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Выход
            </PowerButton>
            <PowerButton onClick={handleRestart}>
              <i className="fas fa-redo"></i>
              Перезагрузка
            </PowerButton>
            <PowerButton danger onClick={handleShutdown}>
              <i className="fas fa-power-off"></i>
              Выключение
            </PowerButton>
          </PowerButtons>
        </Footer>
      </StartMenuContainer>
    </>
  );
}