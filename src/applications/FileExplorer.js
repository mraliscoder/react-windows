import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { useFileSystem } from "../contexts/FileSystemContext";
import PropertiesWindow from "../windows/PropertiesWindow";

const ExplorerContainer = styled.div`
  display: flex;
  height: calc(100% - 30px);
  font-family: 'Segoe UI', sans-serif;
`;

const Sidebar = styled.div`
  width: 220px;
  background: #f8f8f8;
  border-right: 1px solid #e5e5e5;
  padding: 10px 0;
`;

const MainContent = styled.div`
  flex: 1;
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
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  
  &:hover {
    background: #f0f0f0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AddressBar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  gap: 8px;
`;

const AddressInput = styled.input`
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.loading ? 'center' : 'flex-start'};
  align-items: ${props => props.loading ? 'center' : 'flex-start'};
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    background: #f8f8f8;
  }
  
  ${props => props.selected && `
    background: #e3f2fd;
  `}
`;

const FileIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 12px;
`;

const FileName = styled.span`
  flex: 1;
  font-size: 14px;
`;

const FileSize = styled.span`
  font-size: 12px;
  color: #666;
  width: 80px;
  text-align: right;
`;

const FileDate = styled.span`
  font-size: 12px;
  color: #666;
  width: 120px;
  text-align: right;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #e8f4fd;
  }
  
  ${props => props.active && `
    background: #e3f2fd;
    font-weight: 500;
  `}
`;

const SidebarIcon = styled.i`
  width: 20px;
  margin-right: 8px;
  text-align: center;
`;

const QuickAccess = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 14px;
`;

export default function FileExplorer() {
  const { readDirectory, readFile, deleteFile, createDirectory, renameFile, getStats, initialized } = useFileSystem();
  const [currentPath, setCurrentPath] = useState('/Users/User/Desktop');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [history, setHistory] = useState(['/Users/User/Desktop']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const getFileIcon = (filename, isDirectory = false) => {
    const iconBase = "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/32x32";
    
    if (isDirectory) {
      return `${iconBase}/folder.png`;
    }
    
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

  const loadFiles = useCallback(async (path) => {
    if (!initialized) {
      setLoading(true);
      return;
    }
    
    try {
      setLoading(true);
      const filesWithInfo = await readDirectory(path);
      setFiles(filesWithInfo);
    } catch (error) {
      console.error('Error loading files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [readDirectory, initialized]);

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath, loadFiles]);

  const handleFileDoubleClick = async (file) => {
    if (file.isDirectory) {
      const newPath = file.path;
      setCurrentPath(newPath);
      
      // Обновляем историю
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newPath);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else if (file.name.endsWith('.txt')) {
      try {
        const content = await readFile(file.path);
        window.openWindow(
          file.name,
          <div style={{ padding: '20px', whiteSpace: 'pre-wrap', fontFamily: 'Consolas, monospace' }}>{content}</div>,
          getFileIcon(file.name)
        );
      } catch (error) {
        console.error('Error reading file:', error);
      }
    } else if (file.name.endsWith('.lnk')) {
      try {
        const url = await readFile(file.path);
        window.open(url, '_blank');
      } catch (error) {
        console.error('Error reading shortcut:', error);
      }
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt('Введите имя новой папки:');
    if (folderName) {
      try {
        await createDirectory(`${currentPath}/${folderName}`);
        loadFiles(currentPath);
      } catch (error) {
        alert('Ошибка создания папки: ' + error.message);
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) return;
    
    if (window.confirm(`Удалить "${selectedFile.name}"?`)) {
      try {
        await deleteFile(selectedFile.path);
        setSelectedFile(null);
        loadFiles(currentPath);
      } catch (error) {
        alert('Ошибка удаления: ' + error.message);
      }
    }
  };

  const handleRename = async () => {
    if (!selectedFile) return;
    
    const newName = prompt('Введите новое имя:', selectedFile.name);
    if (newName && newName !== selectedFile.name) {
      try {
        const newPath = `${currentPath}/${newName}`;
        await renameFile(selectedFile.path, newPath);
        loadFiles(currentPath);
      } catch (error) {
        alert('Ошибка переименования: ' + error.message);
      }
    }
  };

  const handleProperties = () => {
    if (!selectedFile) return;
    
    window.openWindow(
      `Свойства: ${selectedFile.name}`,
      <PropertiesWindow file={selectedFile} onClose={() => window.closeWindow()} />,
      "fas fa-info-circle"
    );
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const goUp = () => {
    if (currentPath !== '/') {
      const pathParts = currentPath.split('/').filter(Boolean);
      pathParts.pop();
      const newPath = pathParts.length ? `/${pathParts.join('/')}` : '/';
      setCurrentPath(newPath);
      
      // Обновляем историю
      const newHistory = [...history, newPath];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const quickAccessItems = [
    { name: 'Рабочий стол', path: '/Users/User/Desktop', icon: 'fas fa-desktop' },
    { name: 'Документы', path: '/Users/User/Documents', icon: 'far fa-file' },
    { name: 'Изображения', path: '/Users/User/Pictures', icon: 'far fa-image' },
    { name: 'Загрузки', path: '/Users/User/Downloads', icon: 'fas fa-download' }
  ];

  const thisPcItems = [
    { name: 'Локальный диск (C:)', path: '/', icon: 'fas fa-hdd' },
    { name: 'Program Files', path: '/Program Files', icon: 'fas fa-folder' },
    { name: 'NEWindows', path: '/NEWindows', icon: 'fas fa-cog' }
  ];

  return (
    <ExplorerContainer>
      <Sidebar>
        <QuickAccess>
          <SectionTitle>Быстрый доступ</SectionTitle>
          {quickAccessItems.map(item => (
            <SidebarItem 
              key={item.path}
              active={currentPath === item.path}
              onClick={() => setCurrentPath(item.path)}
            >
              <SidebarIcon className={item.icon} />
              {item.name}
            </SidebarItem>
          ))}
        </QuickAccess>
        
        <div>
          <SectionTitle>Этот компьютер</SectionTitle>
          {thisPcItems.map(item => (
            <SidebarItem 
              key={item.path}
              active={currentPath === item.path}
              onClick={() => setCurrentPath(item.path)}
            >
              <SidebarIcon className={item.icon} />
              {item.name}
            </SidebarItem>
          ))}
        </div>
      </Sidebar>
      
      <MainContent>
        <Toolbar>
          <Button onClick={goBack} disabled={historyIndex === 0}>
            <i className="fas fa-arrow-left"></i>
            Назад
          </Button>
          <Button onClick={goForward} disabled={historyIndex === history.length - 1}>
            <i className="fas fa-arrow-right"></i>
            Вперед
          </Button>
          <Button onClick={goUp} disabled={currentPath === '/'}>
            <i className="fas fa-arrow-up"></i>
            Вверх
          </Button>
          <Button onClick={handleCreateFolder}>
            <i className="fas fa-folder-plus"></i>
            Новая папка
          </Button>
          <Button onClick={handleDelete} disabled={!selectedFile}>
            <i className="fas fa-trash"></i>
            Удалить
          </Button>
          <Button onClick={handleRename} disabled={!selectedFile}>
            <i className="fas fa-i-cursor"></i>
            Переименовать
          </Button>
          <Button onClick={handleProperties} disabled={!selectedFile}>
            <i className="fas fa-info-circle"></i>
            Свойства
          </Button>
        </Toolbar>
        
        <AddressBar>
          <i className="fas fa-folder" style={{color: '#0078d7'}}></i>
          <AddressInput 
            type="text" 
            value={currentPath} 
            onChange={(e) => setCurrentPath(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loadFiles(currentPath)}
          />
        </AddressBar>
        
        <FileList loading={loading}>
          {loading ? (
            <LoadingMessage>
              <i className="fas fa-spinner fa-spin" style={{fontSize: '24px', marginBottom: '10px'}}></i>
              <div>Загрузка...</div>
            </LoadingMessage>
          ) : (
            files.map(file => (
              <FileItem
                key={file.name}
                selected={selectedFile && selectedFile.name === file.name}
                onClick={() => setSelectedFile(file)}
                onDoubleClick={() => handleFileDoubleClick(file)}
              >
                <FileIcon src={getFileIcon(file.name, file.isDirectory)} alt={file.name} />
                <FileName>{file.name}</FileName>
                <FileSize>{file.isDirectory ? 'Папка' : 'Файл'}</FileSize>
                <FileDate>Сегодня</FileDate>
              </FileItem>
            ))
          )}
        </FileList>
      </MainContent>
    </ExplorerContainer>
  );
}