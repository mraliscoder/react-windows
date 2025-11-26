import styled from "styled-components";
import { useRef } from "react";

const DOSContainer = styled.div`
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8f8f8;
  border-bottom: 1px solid #e5e5e5;
  gap: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 3px;
  font-size: 14px;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const IFrameContainer = styled.div`
  flex: 1;
  position: relative;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export default function DOSSimulator() {
  const iframeRef = useRef(null);

  const handleRefresh = () => {
    if (iframeRef.current) {
      // Исправляем самоприсваивание
      iframeRef.current.contentWindow.location.reload();
    }
  };

  const handleHome = () => {
    iframeRef.current.src = "https://ne-dos.ru";
  };

  return (
    <DOSContainer>
      <Toolbar>
        <Button onClick={handleHome}>
          <i className="fas fa-home"></i> Домой
        </Button>
        <Button onClick={handleRefresh}>
          <i className="fas fa-sync-alt"></i> Обновить
        </Button>
        <Button onClick={() => window.open("https://ne-dos.ru", '_blank')}>
          <i className="fas fa-external-link-alt"></i> Открыть в новом окне
        </Button>
      </Toolbar>
      <IFrameContainer>
        <StyledIframe 
          ref={iframeRef}
          src="https://ne-dos.ru" 
          title="MS-DOS Simulator"
        />
      </IFrameContainer>
    </DOSContainer>
  );
}