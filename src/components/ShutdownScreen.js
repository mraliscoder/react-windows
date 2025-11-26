import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10002;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Logo = styled.div`
  font-size: 64px;
  margin-bottom: 30px;
  color: #0078d7;
`;

const ProgressContainer = styled.div`
  width: 400px;
  margin-bottom: 20px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #333;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #0078d7;
  width: ${props => props.progress}%;
  transition: width 0.5s ease;
`;

const ProgressText = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

const SubText = styled.div`
  font-size: 14px;
  color: #ccc;
`;

const FinalMessage = styled.div`
  margin-top: 30px;
  font-size: 16px;
  color: #ccc;
`;

export default function ShutdownScreen({ type, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  const getSteps = () => {
    switch (type) {
      case 'restart':
        return [
          "Закрытие приложений...",
          "Сохранение профиля пользователя...",
          "Заказываем пиццу...",
          "Почти готово...",
          "Перезагрузка системы..."
        ];
      case 'logout':
        return [
          "Закрытие приложений...",
          "Сохранение профиля пользователя...",
          "Завершение сеанса...",
          "Подготовка к выходу..."
        ];
      case 'shutdown':
        return [
          "Закрытие приложений...",
          "Сохранение профиля пользователя...",
          "Подготовка к выключению...",
          "Завершение работы..."
        ];
      default:
        return [];
    }
  };

  const steps = getSteps();

  useEffect(() => {
    let currentProgress = 0;
    const totalSteps = steps.length;
    const progressPerStep = 100 / totalSteps;

    const interval = setInterval(() => {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => {
          const newStep = prev + 1;
          currentProgress = newStep * progressPerStep;
          setProgress(currentProgress);
          return newStep;
        });
      } else {
        clearInterval(interval);
        
        // После завершения прогресса
        setTimeout(() => {
          if (type === 'shutdown') {
            // Для выключения показываем финальное сообщение
            setShowFinalMessage(true);
            setTimeout(() => {
              // Пытаемся закрыть вкладку
              if (!window.close()) {
                // Если не получилось, остаемся на экране с сообщением
                setTimeout(() => {
                  onComplete();
                }, 3000);
              }
            }, 2000);
          } else {
            // Для перезагрузки и выхода просто завершаем
            onComplete();
          }
        }, 1000);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [type, steps.length, currentStep, onComplete]);

  const getTitle = () => {
    switch (type) {
      case 'restart': return "Перезагрузка";
      case 'logout': return "Выход из системы";
      case 'shutdown': return "Завершение работы";
      default: return "";
    }
  };

  if (showFinalMessage) {
    return (
      <ScreenContainer>
        <Logo>
          <i className="fab fa-windows"></i>
        </Logo>
        <ProgressText>NEWindows</ProgressText>
        <FinalMessage>Теперь питание компьютера можно отключить.</FinalMessage>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Logo>
        <i className="fab fa-windows"></i>
      </Logo>
      <ProgressText>{getTitle()}</ProgressText>
      <ProgressContainer>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        <SubText>{steps[currentStep - 1] || "Подготовка..."}</SubText>
      </ProgressContainer>
    </ScreenContainer>
  );
}