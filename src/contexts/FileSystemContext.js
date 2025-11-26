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

  useEffect(() => {
    const initializeFS = async () => {
      return new Promise((resolve, reject) => {
        BrowserFS.configure({
          fs: "IndexedDB",
          options: {
            storeName: "newindows_fs"
          }
        }, async (err) => {
          if (err) {
            console.error('Error initializing filesystem', err);
            reject(err);
            return;
          }
          
          try {
            const fs = BrowserFS.BFSRequire('fs');
            setFs(fs);
            
            // Создаем структуру папок последовательно
            await createDirectoryRecursive(fs, 'NEWindows/System64');
            await createDirectoryRecursive(fs, 'Users/User/Desktop');
            await createDirectoryRecursive(fs, 'Users/User/Documents');
            await createDirectoryRecursive(fs, 'Users/User/Downloads');
            await createDirectoryRecursive(fs, 'Users/User/Pictures');
            await createDirectoryRecursive(fs, 'Program Files');

            // Создаем файлы на рабочем столе
            await writeFileSafe(fs, 'Users/User/Desktop/Readme.txt', 'Добро пожаловать в NEWindows!');
            await writeFileSafe(fs, 'Users/User/Desktop/Документ.txt', 'Это тестовый документ.');
            await writeFileSafe(fs, 'Users/User/Desktop/GitHub проекта.lnk', 'https://github.com/mraliscoder/react-windows');

            setInitialized(true);
            resolve();
          } catch (error) {
            console.error('Error setting up filesystem structure', error);
            reject(error);
          }
        });
      });
    };

    const createDirectoryRecursive = (fs, path) => {
      return new Promise((resolve, reject) => {
        fs.mkdir(path, { recursive: true }, (err) => {
          if (err && err.code !== 'EEXIST') {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };

    const writeFileSafe = (fs, path, content) => {
      return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (err) => {
          if (err && err.code !== 'EEXIST') {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };

    initializeFS().catch(console.error);
  }, []);

  // Убрали неиспользуемую функцию isDirectory

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
    readDirectory: (path) => {
      return new Promise((resolve, reject) => {
        if (!fs) return reject(new Error('FS not initialized'));
        fs.readdir(path, async (err, files) => {
          if (err) return reject(err);
          
          // Получаем дополнительную информацию о каждом файле
          const filesWithInfo = await Promise.all(
            (files || []).map(async (filename) => {
              const fullPath = path === '/' ? `/${filename}` : `${path}/${filename}`;
              try {
                const stats = await getStats(fullPath);
                return {
                  name: filename,
                  isDirectory: stats.isDirectory(),
                  path: fullPath
                };
              } catch (error) {
                return {
                  name: filename,
                  isDirectory: false,
                  path: fullPath
                };
              }
            })
          );
          resolve(filesWithInfo);
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
        // Проверяем, является ли путь директорией
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