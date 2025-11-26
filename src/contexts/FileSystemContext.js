import React, { createContext, useContext, useEffect, useState } from 'react';
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeFS = async () => {
      return new Promise((resolve, reject) => {
        // Проверяем, доступен ли BrowserFS
        if (typeof BrowserFS === 'undefined') {
          const error = new Error('BrowserFS not available');
          setError(error);
          reject(error);
          return;
        }

        try {
          BrowserFS.configure({
            fs: "IndexedDB",
            options: {
              storeName: "newindows_fs"
            }
          }, async (err) => {
            if (err) {
              console.error('Error initializing BrowserFS:', err);
              setError(err);
              reject(err);
              return;
            }
            
            try {
              const fs = BrowserFS.BFSRequire('fs');
              setFs(fs);
              
              // Создаем структуру папок с проверкой ошибок
              await createDirectoryStructure(fs);
              setInitialized(true);
              resolve();
            } catch (fsError) {
              console.error('Error setting up filesystem structure:', fsError);
              setError(fsError);
              reject(fsError);
            }
          });
        } catch (configError) {
          console.error('Error configuring BrowserFS:', configError);
          setError(configError);
          reject(configError);
        }
      });
    };

    const createDirectoryStructure = async (fs) => {
      const structure = [
        'NEWindows/System64',
        'Users/User/Desktop',
        'Users/User/Documents',
        'Users/User/Downloads',
        'Users/User/Pictures',
        'Program Files'
      ];

      // Создаем папки
      for (const path of structure) {
        await new Promise((resolve) => {
          fs.mkdir(path, { recursive: true }, (err) => {
            if (err && err.code !== 'EEXIST') {
              console.warn(`Could not create directory ${path}:`, err);
            }
            resolve();
          });
        });
      }

      // Создаем тестовые файлы на рабочем столе
      const desktopFiles = [
        { name: 'Readme.txt', content: 'Добро пожаловать в NEWindows!' },
        { name: 'Документ.txt', content: 'Это тестовый документ.' },
        { name: 'GitHub проекта.lnk', content: 'https://github.com/mraliscoder/react-windows' }
      ];

      for (const file of desktopFiles) {
        await new Promise((resolve) => {
          fs.writeFile(`Users/User/Desktop/${file.name}`, file.content, (err) => {
            if (err && err.code !== 'EEXIST') {
              console.warn(`Could not create file ${file.name}:`, err);
            }
            resolve();
          });
        });
      }
    };

    initializeFS().catch(error => {
      console.error('Failed to initialize filesystem:', error);
      // Даже если инициализация не удалась, помечаем как инициализированную чтобы показать интерфейс
      setTimeout(() => setInitialized(true), 1000);
    });
  }, []);

  // Функция для получения информации о файле/папке
  const getStats = (path) => {
    return new Promise((resolve, reject) => {
      if (!fs) return reject(new Error('FS not initialized'));
      fs.stat(path, (err, stats) => {
        if (err) return reject(err);
        resolve(stats);
      });
    });
  };

  const value = {
    fs,
    initialized,
    error,
    readDirectory: (path) => {
      return new Promise((resolve, reject) => {
        if (!fs) return reject(new Error('FS not initialized'));
        fs.readdir(path, (err, files) => {
          if (err) {
            // Если папки не существует, возвращаем пустой массив
            if (err.code === 'ENOENT') {
              resolve([]);
            } else {
              reject(err);
            }
            return;
          }
          
          // Получаем дополнительную информацию о каждом файле
          Promise.all(
            (files || []).map(async (filename) => {
              const fullPath = path === '/' ? `/${filename}` : `${path}/${filename}`;
              try {
                const stats = await getStats(fullPath);
                return {
                  name: filename,
                  isDirectory: stats.isDirectory(),
                  path: fullPath,
                  size: stats.size,
                  mtime: stats.mtime
                };
              } catch (error) {
                return {
                  name: filename,
                  isDirectory: false,
                  path: fullPath,
                  size: 0,
                  mtime: new Date()
                };
              }
            })
          ).then(resolve).catch(reject);
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
        
        // Сначала получаем информацию о файле
        getStats(path).then(stats => {
          if (stats.isDirectory()) {
            // Удаляем директорию рекурсивно
            fs.rmdir(path, { recursive: true }, (err) => {
              if (err) return reject(err);
              resolve();
            });
          } else {
            // Удаляем файл
            fs.unlink(path, (err) => {
              if (err) return reject(err);
              resolve();
            });
          }
        }).catch(reject);
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
    },
    getStats
  };

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  );
};