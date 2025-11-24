import styled from "styled-components";
import { useEffect, useRef } from "react";

const MenuContainer = styled.div`
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
  border-radius: 4px;
  z-index: 10000;
  min-width: 160px;
  padding: 4px 0;
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #0078d7;
    color: white;
  }
  
  ${props => props.disabled && `
    color: #999;
    cursor: default;
    
    &:hover {
      background: transparent;
      color: #999;
    }
  `}
`;

const MenuDivider = styled.div`
  height: 1px;
  background: #eee;
  margin: 4px 0;
`;

export default function ContextMenu({ x, y, items, onClose }) {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Adjust position if menu goes out of screen
  const adjustedX = x + 160 > window.innerWidth ? window.innerWidth - 170 : x;
  const adjustedY = y + 200 > window.innerHeight ? window.innerHeight - 210 : y;

  return (
    <MenuContainer ref={menuRef} x={adjustedX} y={adjustedY}>
      {items.map((item, index) => (
        item.type === 'divider' ? (
          <MenuDivider key={index} />
        ) : (
          <MenuItem 
            key={index}
            onClick={item.action}
            disabled={item.disabled}
          >
            {item.icon && <i className={item.icon}></i>}
            {item.label}
          </MenuItem>
        )
      ))}
    </MenuContainer>
  );
}