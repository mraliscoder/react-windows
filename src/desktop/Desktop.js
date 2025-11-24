import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { useFileSystem } from "../contexts/FileSystemContext";
import ContextMenu from "../components/ContextMenu";

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
  const getIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconBase = "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/32x32";
    
    const iconMap = {
      'txt': `${iconBase}/text-file.png`,
      'exe': `${iconBase}/application.png`,
      'jpg': `${iconBase}/picture.png`,
      'png': `${iconBase}/picture.png`,
      'pdf': `${iconBase}/pdf.png`,
      'doc': `${iconBase}/word.png`,
      'folder': `${iconBase}/folder.png`
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
      <IconImage src={getIcon(file.name)} alt={file.name} />
      <IconLabel selected={selected}>{file.name}</IconLabel>
    </DesktopIcon>
  );
};

export default function Desktop({ onOpenWindow }) {
  const { readDirectory, readFile, deleteFile, createDirectory } = useFileSystem();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });

  const loadDesktopFiles = useCallback(async () => {
    try {
      const fileList = await readDirectory('/Users/User/Desktop');
      const filesWithInfo = fileList.map(filename => ({
        name: filename, 
        type: filename.includes('.') ? 'file' : 'folder'
      }));
      setFiles(filesWithInfo);
    } catch (error) {
      console.error('Error loading desktop files:', error);
    }
  }, [readDirectory]);

  useEffect(() => {
    loadDesktopFiles();
  }, [loadDesktopFiles]);

  const handleFileDoubleClick = (file) => {
    if (file.type === 'folder') {
      // Open folder in File Explorer
      onOpenWindow(
        file.name,
        <div>Папка: {file.name}</div>,
        "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/32x32/folder.png"
      );
    } else if (file.name.endsWith('.txt')) {
      openTextFile(file.name);
    }
  };

  const openTextFile = async (filename) => {
    try {
      const content = await readFile(`/Users/User/Desktop/${filename}`);
      onOpenWindow(
        filename,
        <div style={{ padding: '20px', whiteSpace: 'pre-wrap', fontFamily: 'Consolas, monospace' }}>{content}</div>,
        "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/32x32/text-file.png"
      );
    } catch (error) {
      console.error('Error reading file:', error);
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
        alert('Ошибка создания папки');
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
        await deleteFile(`/Users/User/Desktop/${contextMenu.file.name}`);
        setSelectedFile(null);
        loadDesktopFiles();
      } catch (error) {
        alert('Ошибка удаления файла');
      }
    }
    closeContextMenu();
  };

  const handleRename = async () => {
    if (!contextMenu.file) return;
    
    const newName = prompt('Введите новое имя:', contextMenu.file.name);
    if (newName && newName !== contextMenu.file.name) {
      // Здесь нужно реализовать переименование через файловую систему
      alert(`Функция переименования будет реализована позже`);
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
        { label: 'Свойства', icon: 'fas fa-info-circle', action: () => {} }
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
        { label: 'Ярлык', icon: 'fas fa-link', action: () => {} },
        { type: 'divider' },
        { label: 'Персонализация', icon: 'fas fa-palette', action: () => {} }
      ];
    }
  };

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
}