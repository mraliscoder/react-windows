import styled from "styled-components";
import { useState, useEffect } from "react";
import { useFileSystem } from "../contexts/FileSystemContext";

const PropertiesContainer = styled.div`
  width: 500px;
  height: 400px;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: none;
  background: ${props => props.active ? '#fff' : '#f0f0f0'};
  border-bottom: ${props => props.active ? '2px solid #0078d7' : 'none'};
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: ${props => props.active ? '#fff' : '#e8e8e8'};
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const PropertyRow = styled.div`
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;
`;

const PropertyLabel = styled.div`
  width: 120px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const PropertyValue = styled.div`
  flex: 1;
  font-size: 14px;
  color: #000;
`;

const IconPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 4px;
`;

const FileIcon = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 10px;
`;

const FileName = styled.div`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

const FileType = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: ${props => props.primary ? '#0078d7' : 'white'};
  color: ${props => props.primary ? 'white' : 'black'};
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  
  &:hover {
    background: ${props => props.primary ? '#106ebe' : '#f0f0f0'};
  }
`;

export default function PropertiesWindow({ file, onClose }) {
  const { getStats } = useFileSystem();
  const [activeTab, setActiveTab] = useState('general');
  const [fileStats, setFileStats] = useState(null);

  useEffect(() => {
    const loadFileStats = async () => {
      if (file && file.path) {
        try {
          const stats = await getStats(file.path);
          setFileStats(stats);
        } catch (error) {
          console.error('Error getting file stats:', error);
        }
      }
    };

    loadFileStats();
  }, [file, getStats]);

  const getFileIcon = (filename, isDirectory = false) => {
    const iconBase = "https://cdn.jsdelivr.net/npm/windows-icons@1.0.0/icons/64x64";
    
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

  const getFileType = (filename, isDirectory) => {
    if (isDirectory) return 'Папка с файлами';
    
    const ext = filename.split('.').pop()?.toLowerCase();
    const typeMap = {
      'txt': 'Текстовый документ',
      'lnk': 'Ярлык',
      'exe': 'Приложение',
      'jpg': 'Изображение JPEG',
      'png': 'Изображение PNG',
      'pdf': 'Документ PDF',
      'doc': 'Документ Word'
    };

    return typeMap[ext] || 'Файл';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Не доступно';
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU');
  };

  const formatSize = (size) => {
    if (!size) return 'Не доступно';
    if (size < 1024) return `${size} байт`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} КБ`;
    return `${(size / (1024 * 1024)).toFixed(1)} МБ`;
  };

  if (!file) return null;

  return (
    <PropertiesContainer>
      <Tabs>
        <Tab 
          active={activeTab === 'general'} 
          onClick={() => setActiveTab('general')}
        >
          Общие
        </Tab>
        <Tab 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')}
        >
          Безопасность
        </Tab>
      </Tabs>

      <Content>
        {activeTab === 'general' && (
          <>
            <IconPreview>
              <FileIcon 
                src={getFileIcon(file.name, file.isDirectory)} 
                alt={file.name} 
              />
              <FileName>{file.name}</FileName>
              <FileType>{getFileType(file.name, file.isDirectory)}</FileType>
            </IconPreview>

            <PropertyRow>
              <PropertyLabel>Тип:</PropertyLabel>
              <PropertyValue>{getFileType(file.name, file.isDirectory)}</PropertyValue>
            </PropertyRow>

            <PropertyRow>
              <PropertyLabel>Расположение:</PropertyLabel>
              <PropertyValue>{file.path}</PropertyValue>
            </PropertyRow>

            <PropertyRow>
              <PropertyLabel>Размер:</PropertyLabel>
              <PropertyValue>
                {fileStats ? formatSize(fileStats.size) : 'Загрузка...'}
                {file.isDirectory && ' (содержимое папки)'}
              </PropertyValue>
            </PropertyRow>

            <PropertyRow>
              <PropertyLabel>Создан:</PropertyLabel>
              <PropertyValue>
                {fileStats ? formatDate(fileStats.birthtime) : 'Загрузка...'}
              </PropertyValue>
            </PropertyRow>

            <PropertyRow>
              <PropertyLabel>Изменен:</PropertyLabel>
              <PropertyValue>
                {fileStats ? formatDate(fileStats.mtime) : 'Загрузка...'}
              </PropertyValue>
            </PropertyRow>
          </>
        )}

        {activeTab === 'security' && (
          <div>
            <PropertyRow>
              <PropertyLabel>Владелец:</PropertyLabel>
              <PropertyValue>Пользователь</PropertyValue>
            </PropertyRow>
            <PropertyRow>
              <PropertyLabel>Разрешения:</PropertyLabel>
              <PropertyValue>Полный доступ</PropertyValue>
            </PropertyRow>
          </div>
        )}

        <ButtonsContainer>
          <Button onClick={onClose}>OK</Button>
          <Button>Отмена</Button>
          <Button primary>Применить</Button>
        </ButtonsContainer>
      </Content>
    </PropertiesContainer>
  );
}