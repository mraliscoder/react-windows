import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { useFileSystem } from "../contexts/FileSystemContext";

const ExplorerContainer = styled.div`
  padding: 10px;
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  padding: 5px;
  border-bottom: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 5px 10px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  
  &:hover {
    background: #f0f0f0;
  }
  
  ${props => props.selected && `
    background: #0078d7;
    color: white;
  `}
`;

const FileIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

const PathBar = styled.div`
  padding: 5px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  margin-bottom: 10px;
`;

export default function FileExplorer() {
  const { readDirectory, readFile, deleteFile, createDirectory } = useFileSystem();
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const loadFiles = useCallback(async (path) => {
    try {
      const fileList = await readDirectory(path);
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }, [readDirectory]);

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath, loadFiles]);

  const getFileIcon = (filename) => {
    const isDirectory = !filename.includes('.');
    const iconBase = "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/16x16";
    
    if (isDirectory) {
      return `${iconBase}/folder.png`;
    }
    
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconMap = {
      'txt': `${iconBase}/text-file.png`,
      'exe': `${iconBase}/application.png`,
      'jpg': `${iconBase}/picture.png`,
      'png': `${iconBase}/picture.png`
    };

    return iconMap[ext] || `${iconBase}/file.png`;
  };

  const handleFileDoubleClick = async (filename) => {
    const fullPath = currentPath === '/' ? `/${filename}` : `${currentPath}/${filename}`;
    
    // Проверяем, является ли файл директорией
    if (!filename.includes('.')) {
      setCurrentPath(fullPath);
    } else {
      // Открываем файл
      try {
        const content = await readFile(fullPath);
        window.openWindow(
          filename,
          <div style={{ padding: '20px', whiteSpace: 'pre-wrap' }}>{content}</div>,
          getFileIcon(filename)
        );
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt('Введите имя папки:');
    if (folderName) {
      const fullPath = currentPath === '/' ? `/${folderName}` : `${currentPath}/${folderName}`;
      try {
        await createDirectory(fullPath);
        loadFiles(currentPath);
      } catch (error) {
        alert('Ошибка создания папки');
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) return;
    
    if (window.confirm(`Удалить "${selectedFile}"?`)) {
      const fullPath = currentPath === '/' ? `/${selectedFile}` : `${currentPath}/${selectedFile}`;
      try {
        await deleteFile(fullPath);
        setSelectedFile(null);
        loadFiles(currentPath);
      } catch (error) {
        alert('Ошибка удаления файла');
      }
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        // Здесь нужно реализовать запись файла в файловую систему
        // Для простоты пока просто откроем содержимое
        window.openWindow(
          file.name,
          <div style={{ padding: '20px' }}>
            <p>Файл: {file.name}</p>
            <p>Размер: {file.size} bytes</p>
            <p>Тип: {file.type}</p>
          </div>,
          getFileIcon(file.name)
        );
      };
      reader.readAsText(file);
    }
  };

  const goUp = () => {
    if (currentPath !== '/') {
      const pathParts = currentPath.split('/').filter(Boolean);
      pathParts.pop();
      const newPath = pathParts.length ? `/${pathParts.join('/')}` : '/';
      setCurrentPath(newPath);
    }
  };

  return (
    <ExplorerContainer>
      <Toolbar>
        <Button onClick={goUp}>↑ Наверх</Button>
        <Button onClick={handleCreateFolder}>📁 Создать папку</Button>
        <Button onClick={handleDelete} disabled={!selectedFile}>🗑️ Удалить</Button>
        <Button>
          <label htmlFor="file-upload" style={{cursor: 'pointer'}}>
            📤 Загрузить
          </label>
          <input
            id="file-upload"
            type="file"
            style={{display: 'none'}}
            onChange={handleUpload}
          />
        </Button>
      </Toolbar>
      
      <PathBar>Текущий путь: {currentPath}</PathBar>
      
      <FileList>
        {files.map(file => (
          <FileItem
            key={file}
            selected={selectedFile === file}
            onClick={() => setSelectedFile(file)}
            onDoubleClick={() => handleFileDoubleClick(file)}
          >
            <FileIcon src={getFileIcon(file)} alt={file} />
            {file}
          </FileItem>
        ))}
      </FileList>
    </ExplorerContainer>
  );
}