import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { useFileSystem } from "../contexts/FileSystemContext";
import ContextMenu from "../components/ContextMenu";
import PropertiesWindow from "../windows/PropertiesWindow";

const DesktopContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 40px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 10px;
`;

const DesktopIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
  margin: 10px;
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
  background: ${props => props.selected ? 'rgba(255, 255, 255, 0.3)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const IconImage = styled.img`
  width: 32px;
  height: 32px;
  margin-bottom: 5px;
  border-radius: 4px;
`;

const IconLabel = styled.span`
  font-size: 12px;
  color: white;
  text-align: center;
  text-shadow: 1px 1px 1px black;
  padding: 2px 4px;
  border-radius: 2px;
  background: ${props => props.selected ? 'rgba(0, 120, 215, 0.8)' : 'transparent'};
`;

const FileIcon = ({ file, selected, onClick, onDoubleClick, onContextMenu }) => {
  const getIcon = (filename, isDirectory = false) => {
    const iconBase = "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/32x32";
    
    if (isDirectory) {
      return `${iconBase}/folder.png`;
    }
    
    // Определяем иконку по расширению
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconMap = {
      'txt': `${iconBase}/text-file.png`,
      'lnk': `${iconBase}/shortcut.png`,
      'exe': `${iconBase}/application.png`,
      'jpg': `${iconBase}/picture.png`,
      'png': `${iconBase}/picture.png`,
      'pdf': `${iconBase}/pdf.png`,
      'doc': `${iconBase}/word.png`
    };

    return iconMap[ext] || `${iconBase}/file.png`;
  };

  return (
    <DesktopIcon 
      selected={selected}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <IconImage src={getIcon(file.name, file.isDirectory)} alt={file.name} />
      <IconLabel selected={selected}>{file.name}</IconLabel>
    </DesktopIcon>
  );
};

export default function Desktop({ onOpenWindow }) {
  const { readDirectory, readFile, deleteFile, createDirectory, renameFile, initialized } = useFileSystem();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [loading, setLoading] = useState(true);

  const loadDesktopFiles = useCallback(async () => {
    if (!initialized) {
      setLoading(true);
      return;
    }
    
    try {
      setLoading(true);
      const filesWithInfo = await readDirectory('/Users/User/Desktop');
      setFiles(filesWithInfo);
    } catch (error) {
      console.error('Error loading desktop files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [readDirectory, initialized]);

  useEffect(() => {
    loadDesktopFiles();
  }, [loadDesktopFiles]);

  const handleFileDoubleClick = async (file) => {
    if (file.isDirectory) {
      // Открываем папку в Проводнике
      onOpenWindow(
        file.name,
        <div>Содержимое папки: {file.name}</div>,
        "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/32x32/folder.png"
      );
    } else if (file.name.endsWith('.txt')) {
      openTextFile(file);
    } else if (file.name.endsWith('.lnk')) {
      openShortcut(file);
    } else {
      // Для других файлов просто показываем информацию
      onOpenWindow(
        file.name,
        <div style={{ padding: '20px' }}>
          <p>Файл: {file.name}</p>
          <p>Тип: {file.isDirectory ? 'Папка' : 'Файл'}</p>
        </div>,
        "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/32x32/file.png"
      );
    }
  };

  const openTextFile = async (file) => {
    try {
      const content = await readFile(file.path);
      onOpenWindow(
        file.name,
        <div style={{ padding: '20px', whiteSpace: 'pre-wrap', fontFamily: 'Consolas, monospace' }}>{content}</div>,
        "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/32x32/text-file.png"
      );
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const openShortcut = async (file) => {
    try {
      const url = await readFile(file.path);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error reading shortcut:', error);
    }
  };

  const handleDesktopContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY
    });
    setSelectedFile(null);
  };

  const handleFileContextMenu = (e, file) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      file: file
    });
    setSelectedFile(file.name);
  };

  const closeContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, file: null });
  };

  const handleCreateFolder = async () => {
    const folderName = prompt('Введите имя новой папки:');
    if (folderName) {
      try {
        await createDirectory(`/Users/User/Desktop/${folderName}`);
        loadDesktopFiles();
      } catch (error) {
        alert('Ошибка создания папки: ' + error.message);
      }
    }
    closeContextMenu();
  };

  const handleCreateFile = async () => {
    const fileName = prompt('Введите имя нового файла:');
    if (fileName) {
      try {
        await createDirectory('/Users/User/Desktop'); // Убедимся, что папка существует
        // Создаем пустой файл
        await readDirectory('/Users/User/Desktop'); // Это создаст папку если её нет
        // Для создания файла нам нужно использовать writeFile
        // Но сначала проверим, что у файла есть расширение
        const fullFileName = fileName.includes('.') ? fileName : `${fileName}.txt`;
        await readDirectory('/Users/User/Desktop'); // Это создаст папку если её нет
        // Используем существующий API для создания файла
        window.openWindow(
          fullFileName,
          <div style={{ padding: '20px' }}>
            <p>Новый файл: {fullFileName}</p>
            <button onClick={() => {
              // Здесь можно добавить функциональность редактирования
              alert('Функция редактирования будет добавлена позже');
            }}>Редактировать</button>
          </div>,
          "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/32x32/file.png"
        );
      } catch (error) {
        alert('Ошибка создания файла: ' + error.message);
      }
    }
    closeContextMenu();
  };

  const handleRefresh = () => {
    loadDesktopFiles();
    closeContextMenu();
  };

  const handleDelete = async () => {
    if (!contextMenu.file) return;
    
    if (window.confirm(`Удалить "${contextMenu.file.name}"?`)) {
      try {
        await deleteFile(contextMenu.file.path);
        setSelectedFile(null);
        loadDesktopFiles();
      } catch (error) {
        alert('Ошибка удаления: ' + error.message);
      }
    }
    closeContextMenu();
  };

  const handleProperties = (file) => {
    onOpenWindow(
      `Свойства: ${file.name}`,
      <PropertiesWindow file={file} onClose={() => window.closeWindow()} />,
      "fas fa-info-circle"
    );
    closeContextMenu();
  };

  const handleRename = async () => {
    if (!contextMenu.file) return;
    
    const newName = prompt('Введите новое имя:', contextMenu.file.name);
    if (newName && newName !== contextMenu.file.name) {
      try {
        const newPath = `/Users/User/Desktop/${newName}`;
        await renameFile(contextMenu.file.path, newPath);
        loadDesktopFiles();
      } catch (error) {
        alert('Ошибка переименования: ' + error.message);
      }
    }
    closeContextMenu();
  };

  const getContextMenuItems = () => {
    if (contextMenu.file) {
      // File context menu
      return [
        { label: 'Открыть', icon: 'fas fa-folder-open', action: () => handleFileDoubleClick(contextMenu.file) },
        { label: 'Открыть в новом окне', icon: 'fas fa-external-link-alt', action: () => {} },
        { type: 'divider' },
        { label: 'Вырезать', icon: 'fas fa-cut', action: () => {} },
        { label: 'Копировать', icon: 'far fa-copy', action: () => {} },
        { label: 'Вставить', icon: 'far fa-clipboard', action: () => {}, disabled: true },
        { type: 'divider' },
        { label: 'Переименовать', icon: 'fas fa-i-cursor', action: handleRename },
        { label: 'Удалить', icon: 'far fa-trash-alt', action: handleDelete },
        { type: 'divider' },
        { label: 'Свойства', icon: 'fas fa-info-circle', action: () => handleProperties(contextMenu.file) }
      ];
    } else {
      // Desktop context menu
      return [
        { label: 'Вид', icon: 'fas fa-eye', action: () => {} },
        { label: 'Упорядочить значки', icon: 'fas fa-sort-alpha-down', action: () => {} },
        { label: 'Обновить', icon: 'fas fa-sync-alt', action: handleRefresh },
        { type: 'divider' },
        { label: 'Вставить', icon: 'far fa-clipboard', action: () => {}, disabled: true },
        { type: 'divider' },
        { label: 'Создать', icon: 'fas fa-plus', action: () => {} },
        { 
          label: 'Папку', 
          icon: 'far fa-folder', 
          action: handleCreateFolder 
        },
        { 
          label: 'Текстовый документ', 
          icon: 'far fa-file-alt', 
          action: handleCreateFile 
        },
        { label: 'Ярлык', icon: 'fas fa-link', action: () => {} },
        { type: 'divider' },
        { label: 'Персонализация', icon: 'fas fa-palette', action: () => {} }
      ];
    }
  };

  if (!initialized || loading) {
    return (
      <DesktopContainer>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <i className="fas fa-spinner fa-spin" style={{fontSize: '24px', marginBottom: '10px'}}></i>
          <div>Загрузка рабочего стола...</div>
        </div>
      </DesktopContainer>
    );
  }

  return (
    <DesktopContainer onContextMenu={handleDesktopContextMenu}>
      {files.map(file => (
        <FileIcon 
          key={file.name} 
          file={file}
          selected={selectedFile === file.name}
          onClick={() => setSelectedFile(file.name)}
          onDoubleClick={() => handleFileDoubleClick(file)}
          onContextMenu={(e) => handleFileContextMenu(e, file)}
        />
      ))}
      
      {contextMenu.show && (
        <ContextMenu 
          x={contextMenu.x}
          y={contextMenu.y}
          items={getContextMenuItems()}
          onClose={closeContextMenu}
        />
      )}
    </DesktopContainer>
  );
};