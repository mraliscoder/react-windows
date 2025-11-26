import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const BootContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  color: #fff;
  font-family: 'Courier New', monospace;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${props => props.fadingOut ? fadeOut : 'none'} 0.5s ease-in-out;
`;

const BiosScreen = styled.div`
  text-align: left;
  padding: 20px;
`;

const BiosText = styled.p`
  margin: 5px 0;
  font-size: 14px;
  line-height: 1.4;
`;

const LogoContainer = styled.div`
  text-align: center;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Logo = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
  color: #0078d7;
  font-family: 'Segoe UI', sans-serif;
`;

const LoadingBar = styled.div`
  width: 300px;
  height: 4px;
  background: #333;
  border-radius: 2px;
  overflow: hidden;
  margin: 20px 0;
`;

const LoadingProgress = styled.div`
  height: 100%;
  background: #0078d7;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const Copyright = styled.p`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: #666;
`;

const LoginScreen = styled.div`
  background: linear-gradient(135deg, #0078d7 0%, #106ebe 100%);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'Segoe UI', sans-serif;
`;

const UserAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 40px;
`;

const UserName = styled.h2`
  margin: 0 0 10px 0;
  font-weight: 300;
`;

const LoginButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 10px 30px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const StatusText = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const LoginProgress = styled.div`
  margin-top: 20px;
  text-align: center;
  min-height: 60px;
`;

const ProgressText = styled.p`
  margin: 5px 0;
  font-size: 14px;
  opacity: 0.9;
`;

export default function BootScreen({ onBootComplete }) {
  const [stage, setStage] = useState('bios');
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const [biosLines, setBiosLines] = useState([]);
  const [loginProgress, setLoginProgress] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // BIOS screen simulation
    const biosMessages = [
      "UEFI BIOS (C) 2024-2025 NEWindows Corporation",
      "Build Date: Jun 15 2024 12:00:00",
      "CPU: Ant Tomato 4 Pro 1700X @ 3.80GHz",
      "Memory Test: 16384 MeowByte OK",
      "Initializing USB controllers... Done",
      "Detecting SATA devices... None",
      "Boot Device: POTATO-SSD",
      "Loading operating system...",
    ];

    let currentLine = 0;
    const biosInterval = setInterval(() => {
      if (currentLine < biosMessages.length) {
        setBiosLines(prev => [...prev, biosMessages[currentLine]]);
        currentLine++;
      } else {
        clearInterval(biosInterval);
        setTimeout(() => {
          setStage('logo');
          // Start loading progress
          let p = 0;
          const progressInterval = setInterval(() => {
            p += 2;
            setProgress(p);
            if (p >= 100) {
              clearInterval(progressInterval);
              setTimeout(() => {
                setStage('login');
              }, 500);
            }
          }, 50);
        }, 1000);
      }
    }, 300);

    return () => {
      clearInterval(biosInterval);
    };
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    setLoginProgress('Подготовка NEWindows...');
    
    // Симуляция процесса входа
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoginProgress('Загрузка профиля пользователя...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoginProgress('Пылесосим кота...');

    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoginProgress('Черт, кота засосало!');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoginProgress('Добро пожаловать!');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setFadingOut(true);
    setTimeout(() => {
      onBootComplete();
    }, 500);
  };

  const renderStage = () => {
    switch (stage) {
      case 'bios':
        return (
          <BiosScreen>
            {biosLines.map((line, index) => (
              <BiosText key={index}>{line}</BiosText>
            ))}
            <BiosText style={{color: '#0078d7'}}>_</BiosText>
          </BiosScreen>
        );
      case 'logo':
        return (
          <LogoContainer>
            <Logo>
              <i className="fab fa-windows" style={{marginRight: '15px'}}></i>
              NEWindows
            </Logo>
            <LoadingBar>
              <LoadingProgress progress={progress} />
            </LoadingBar>
            <div style={{fontSize: '14px', marginTop: '10px'}}>
              {progress < 100 ? 'Подготовка системы...' : 'Готово!'}
            </div>
            <Copyright>© 2024-2025 NEWindows Corporation. All rights reserved.</Copyright>
          </LogoContainer>
        );
      case 'login':
        return (
          <LoginScreen>
            <UserAvatar>
              <i className="fas fa-user"></i>
            </UserAvatar>
            <UserName>Пользователь</UserName>
            <p style={{margin: 0, opacity: 0.8}}>Нажмите для входа</p>
            <LoginButton onClick={handleLogin} disabled={isLoggingIn}>
              {isLoggingIn ? 'Вход...' : 'Войти'}
            </LoginButton>
            
            {isLoggingIn && (
              <LoginProgress>
                <ProgressText>{loginProgress}</ProgressText>
              </LoginProgress>
            )}
            
            <StatusText>
              NEWindows 10 Pro • Сборка 19045.3803
            </StatusText>
          </LoginScreen>
        );
      default:
        return null;
    }
  };

  return (
    <BootContainer fadingOut={fadingOut}>
      {renderStage()}
    </BootContainer>
  );
}