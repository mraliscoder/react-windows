import {GlobalStyles, MainContainer} from "./styles";
import wallpaper from "./assets/windows_wallpaper.jpg";
import Taskbar from "./taskbar/Taskbar";
import Window from "./windows/Window";
import {useEffect, useState} from "react";

function App() {
  const [windows, setWindows] = useState([]);
  const [focusedWindow, setFocusedWindow] = useState(null);

  const openWindow = (title, content, icon = null) => {
    const newWindow = {
      id: Date.now(),
      title,
      content,
      icon,
      minimized: false,
      zIndex: Math.max(...windows.map(w => w.zIndex), 0) + 1
    };
    
    setWindows(prev => [...prev, newWindow]);
    setFocusedWindow(newWindow.id);
  };

  const closeWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (focusedWindow === id) {
      setFocusedWindow(null);
    }
  };

  const minimizeWindow = (id) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? {...w, minimized: !w.minimized} : w
    ));
  };

  const bringToFront = (id) => {
    setWindows(prev => prev.map(w => 
      w.id === id 
        ? {...w, zIndex: Math.max(...prev.map(w => w.zIndex), 0) + 1}
        : w
    ));
    setFocusedWindow(id);
  };

  useEffect(() => {
    window.openWindow = openWindow;
    window.closeWindow = closeWindow;
    window.minimizeWindow = minimizeWindow;
  }, []);

  return (
    <>
      <GlobalStyles />
      <MainContainer background={wallpaper}>
        {windows.map(w => (
          !w.minimized && (
            <Window 
              key={w.id} 
              {...w}
              focused={focusedWindow === w.id}
              onClose={() => closeWindow(w.id)}
              onMinimize={() => minimizeWindow(w.id)}
              onFocus={() => bringToFront(w.id)}
            />
          )
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

export default App;