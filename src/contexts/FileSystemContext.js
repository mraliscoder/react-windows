import React, { createContext, useContext, useEffect, useState } from 'react';

// Правильный импорт BrowserFS
import * as BrowserFS from 'browserfs';

const FileSystemContext = createContext();

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};

export const FileSystemProvider = ({ children }) => {
  const [fs, setFs] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeFS = async () => {
      return new Promise((resolve) => {
        // Правильная конфигурация BrowserFS
        BrowserFS.configure({
          fs: "IndexedDB",
          options: {}
        }, (err) => {
          if (err) {
            console.error('Error initializing filesystem', err);
            return;
          }
          
          // Получаем файловую систему
          const fs = BrowserFS.BFSRequire('fs');
          setFs(fs);
          
          // Создаем стандартную структуру папок
          const structure = [
            'NEWindows/System64',
            'Users/User/Desktop',
            'Users/User/Documents',
            'Users/User/Downloads',
            'Users/User/Pictures',
            'Program Files'
          ];

          let createdCount = 0;
          structure.forEach(path => {
            fs.mkdir(path, { recursive: true }, (err) => {
              if (err && err.code !== 'EEXIST') {
                console.error(`Error creating directory ${path}`, err);
              }
              createdCount++;
              
              // Когда все папки созданы, создаем тестовые файлы
              if (createdCount === structure.length) {
                createSampleFiles();
              }
            });
          });

          const createSampleFiles = () => {
            // Создаем несколько тестовых файлов на рабочем столе
            const desktopFiles = [
              { name: 'Readme.txt', content: 'Добро пожаловать в NEWindows!' },
              { name: 'Документ.txt', content: 'Это тестовый документ.' }
            ];

            let filesCreated = 0;
            desktopFiles.forEach(file => {
              fs.writeFile(`/Users/User/Desktop/${file.name}`, file.content, (err) => {
                if (err && err.code !== 'EEXIST') {
                  console.error(`Error creating file ${file.name}`, err);
                }
                filesCreated++;
                
                if (filesCreated === desktopFiles.length) {
                  setInitialized(true);
                  resolve();
                }
              });
            });

            // Если нет файлов для создания, сразу разрешаем
            if (desktopFiles.length === 0) {
              setInitialized(true);
              resolve();
            }
          };

          // Если нет папок для создания, сразу создаем файлы
          if (structure.length === 0) {
            createSampleFiles();
          }
        });
      });
    };

    initializeFS();
  }, []);

  const value = {
    fs,
    initialized,
    readDirectory: (path) => {
      return new Promise((resolve, reject) => {
        if (!fs) return reject(new Error('FS not initialized'));
        fs.readdir(path, (err, files) => {
          if (err) return reject(err);
          resolve(files || []);
        });
      });
    },
    readFile: (path) => {
      return new Promise((resolve, reject) => {
        if (!fs) return reject(new Error('FS not initialized'));
        fs.readFile(path, 'utf8', (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });
    },
    writeFile: (path, content) => {
      return new Promise((resolve, reject) => {
        if (!fs) return reject(new Error('FS not initialized'));
        fs.writeFile(path, content, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    },
    deleteFile: (path) => {
      return new Promise((resolve, reject) => {
        if (!fs) return reject(new Error('FS not initialized'));
        fs.unlink(path, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    },
    renameFile: (oldPath, newPath) => {
      return new Promise((resolve, reject) => {
        if (!fs) return reject(new Error('FS not initialized'));
        fs.rename(oldPath, newPath, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    },
    createDirectory: (path) => {
      return new Promise((resolve, reject) => {
        if (!fs) return reject(new Error('FS not initialized'));
        fs.mkdir(path, { recursive: true }, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    },
    exists: (path) => {
      return new Promise((resolve, reject) => {
        if (!fs) return reject(new Error('FS not initialized'));
        fs.exists(path, (exists) => {
          resolve(exists);
        });
      });
    }
  };

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  );
};