import {GlobalStyles, MainContainer} from "./styles";

import wallpaper from "./assets/windows_wallpaper.jpg";
import Taskbar from "./taskbar/Taskbar";
import Window from "./windows/Window";
import {useEffect, useState} from "react";

function App() {
  const [ windows, setWindows ] = useState([
    {
      id: Date.now(),
      title: "Test Window",
      content: <div>хуй</div>
    }
  ]);

  useEffect(() => {
    window.openWindow = (title, content) => {
      const w = windows;
      w.push({
        id: Date.now(),
        title,
        content
      });
      setWindows(w);
    };
  }, []);

  return (
    <>
      <GlobalStyles />
      <MainContainer background={wallpaper}>
        {windows.map(w => (
          <Window key={w.id} title={w.title} content={w.content} />
        ))}
        <Taskbar />
      </MainContainer>
    </>
  );
}

export default App;
