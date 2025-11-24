import styled from "styled-components";
import acrylic from "../assets/taskbar_background.png";
import SystemTray from "./tray/SystemTray";
import StartMenu from "./StartMenu";
import { useState, useEffect, useCallback } from "react";
import { useFileSystem } from "../contexts/FileSystemContext";
import ContextMenu from "../components/ContextMenu";

// Импортируем приложения
import ControlPanel from "../applications/ControlPanel";
import DOSSimulator from "../applications/DOSSimulator";
import FileExplorer from "../applications/FileExplorer";
import AboutSystem from "../applications/AboutSystem";

const TaskbarContainer = styled.div`
  height: 40px;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-image: url(${acrylic});
  background-position: center center;
  background-size: cover;
  background-repeat: repeat;
  z-index: 1000;
`;

const StartButton = styled.button`
  background: none;
  border: none;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TaskbarApps = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`;

const TaskbarApp = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'none'};
  border: none;
  height: 100%;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: white;
  min-width: 120px;
  max-width: 200px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const AppIcon = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 2px;
`;

// Базовые приложения с Windows 10 иконками
const baseApps = [
  {
    id: 'control_panel',
    name: 'Панель управления',
    icon: "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/32x32/control-panel.png",
    component: ControlPanel
  },
  {
    id: 'dos_simulator',
    name: 'Симулятор MS-DOS',
    icon: "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/32x32/ms-dos.png",
    component: DOSSimulator
  },
  {
    id: 'file_explorer',
    name: 'Проводник',
    icon: "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/32x32/explorer.png",
    component: FileExplorer
  },
  {
    id: 'about_system',
    name: 'О системе',
    icon: "fas fa-info-circle",
    component: AboutSystem
  }
];

export default function Taskbar({ windows, onWindowClick, onOpenStartMenu }) {
  const [startMenuVisible, setStartMenuVisible] = useState(false);
  const [apps] = useState(baseApps);
  const [taskbarMenu, setTaskbarMenu] = useState({ show: false, x: 0, y: 0 });
  const { readDirectory, initialized } = useFileSystem();

  const loadSystemApps = useCallback(async () => {
    try {
      const systemApps = await readDirectory('/NEWindows/System64');
      console.log('System apps:', systemApps);
    } catch (error) {
      console.error('Error loading system apps:', error);
    }
  }, [readDirectory]);

  useEffect(() => {
    if (initialized) {
      loadSystemApps();
    }
  }, [initialized, loadSystemApps]);

  const openApp = (app) => {
    setStartMenuVisible(false);
    onOpenStartMenu(app.name, <app.component />, app.icon);
  };

  const handleTaskbarContextMenu = (e) => {
    e.preventDefault();
    setTaskbarMenu({
      show: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const closeTaskbarMenu = () => {
    setTaskbarMenu({ show: false, x: 0, y: 0 });
  };

  const taskbarMenuItems = [
    { label: 'Параметры панели задач', icon: 'fas fa-sliders-h', action: () => {} },
    { type: 'divider' },
    { label: 'Диспетчер задач', icon: 'fas fa-tasks', action: () => {} },
    { type: 'divider' },
    { label: 'Рабочие столы', icon: 'far fa-window-maximize', action: () => {} },
    { type: 'divider' },
    { label: 'Закрепить панель задач', icon: 'fas fa-thumbtack', action: () => {} },
    { label: 'Свойства', icon: 'fas fa-cog', action: () => {} }
  ];

  return (
    <>
      <TaskbarContainer onContextMenu={handleTaskbarContextMenu}>
        <StartButton onClick={() => setStartMenuVisible(!startMenuVisible)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
            <path d="M1,1 H19 V19 H1 Z M3,3 H17 V17 H3 Z M3,6 H17 V8 H3 Z M3,10 H17 V12 H3 Z M3,14 H17 V16 H3 Z"/>
          </svg>
        </StartButton>
        
        <TaskbarApps>
          {windows.map(w => (
            <TaskbarApp 
              key={w.id} 
              active={!w.minimized}
              onClick={() => onWindowClick(w.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTaskbarMenu({
                  show: true,
                  x: e.clientX,
                  y: e.clientY,
                  window: w
                });
              }}
            >
              {w.icon && (w.icon.startsWith('http') ? (
                <AppIcon src={w.icon} alt={w.title} />
              ) : (
                <i className={w.icon} style={{fontSize: '14px', color: 'white'}}></i>
              ))}
              {w.title}
            </TaskbarApp>
          ))}
        </TaskbarApps>
        
        <SystemTray />
      </TaskbarContainer>
      
      <StartMenu 
        visible={startMenuVisible} 
        apps={apps}
        onAppClick={openApp}
        onClose={() => setStartMenuVisible(false)}
      />
      
      {taskbarMenu.show && (
        <ContextMenu 
          x={taskbarMenu.x}
          y={taskbarMenu.y}
          items={taskbarMenuItems}
          onClose={closeTaskbarMenu}
        />
      )}
    </>
  );
}