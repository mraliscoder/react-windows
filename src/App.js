import {GlobalStyles, MainContainer} from "./styles";
import wallpaper from "./assets/windows_wallpaper.jpg";
import Taskbar from "./taskbar/Taskbar";
import Window from "./windows/Window";
import Desktop from "./desktop/Desktop";
import {useEffect, useState, useCallback} from "react";
import { FileSystemProvider, useFileSystem } from "./contexts/FileSystemContext";
import BootScreen from "./components/BootScreen";

function AppContent() {
  const [windows, setWindows] = useState([]);
  const [focusedWindow, setFocusedWindow] = useState(null);
  const { initialized } = useFileSystem();
  const [booting, setBooting] = useState(true);

  const openWindow = useCallback((title, content, icon = null, props = {}) => {
    const newWindow = {
      id: Date.now() + Math.random(),
      title,
      content,
      icon,
      minimized: false,
      zIndex: Math.max(0, ...windows.map(w => w.zIndex || 0)) + 1,
      ...props
    };
    
    setWindows(prev => [...prev, newWindow]);
    setFocusedWindow(newWindow.id);
    return newWindow.id;
  }, [windows]);

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (focusedWindow === id) {
      const remainingWindows = windows.filter(w => w.id !== id);
      if (remainingWindows.length > 0) {
        setFocusedWindow(remainingWindows[remainingWindows.length - 1].id);
      } else {
        setFocusedWindow(null);
      }
    }
  }, [focusedWindow, windows]);

  const minimizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? {...w, minimized: !w.minimized} : w
    ));
  }, []);

  const bringToFront = useCallback((id) => {
    setWindows(prev => prev.map(w => 
      w.id === id 
        ? {...w, zIndex: Math.max(0, ...prev.map(w => w.zIndex || 0)) + 1}
        : w
    ));
    setFocusedWindow(id);
  }, []);

  useEffect(() => {
    window.openWindow = openWindow;
    window.closeWindow = closeWindow;
    window.minimizeWindow = minimizeWindow;
    
    return () => {
      delete window.openWindow;
      delete window.closeWindow;
      delete window.minimizeWindow;
    };
  }, [openWindow, closeWindow, minimizeWindow]);

  const handleBootComplete = () => {
    setBooting(false);
  };

  if (booting) {
    return <BootScreen onBootComplete={handleBootComplete} />;
  }

  // Если файловая система еще не готова, показываем только рабочий стол без окон
  return (
    <>
      <GlobalStyles />
      <MainContainer background={wallpaper}>
        {initialized && <Desktop onOpenWindow={openWindow} />}
        {windows.map(w => (
          <Window 
            key={w.id} 
            {...w}
            focused={focusedWindow === w.id}
            onClose={() => closeWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
            onFocus={() => bringToFront(w.id)}
          />
        ))}
        <Taskbar 
          windows={windows}
          onWindowClick={bringToFront}
          onOpenStartMenu={openWindow}
        />
      </MainContainer>
    </>
  );
}

function App() {
  return (
    <FileSystemProvider>
      <AppContent />
    </FileSystemProvider>
  );
}

export default App;