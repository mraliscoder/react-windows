import {useState, useRef, useEffect} from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import WindowHeading from "./WindowHeading";
import {Resizable} from "re-resizable";

const Container = styled.div`
  width: ${props => props.isMaximized ? '100vw' : props.w + 'px'};
  height: ${props => props.isMaximized ? 'calc(100vh - 40px)' : props.h + 'px'};
  background-color: #fff;
  display: block;
  position: absolute;
  z-index: ${props => props.zIndex};
  border: ${props => props.focused ? '1px solid #0078d7' : '1px solid #ccc'};
  box-shadow: ${props => props.focused ? '0 0 10px rgba(0, 120, 215, 0.5)' : '0 0 5px rgba(0, 0, 0, 0.3)'};
  top: ${props => props.isMaximized ? '0' : 'auto'};
  left: ${props => props.isMaximized ? '0' : 'auto'};
`;

export default function Window({ 
  id, 
  title, 
  content, 
  icon, 
  focused, 
  zIndex,
  onClose, 
  onMinimize, 
  onFocus 
}) {
  const [x, setX] = useState(100 + (id % 10) * 20);
  const [y, setY] = useState(100 + (id % 10) * 20);
  const [w, setW] = useState(600);
  const [h, setH] = useState(400);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const [tempW, setTempW] = useState(w);
  const [tempH, setTempH] = useState(h);
  const [tempX, setTempX] = useState(x);
  const [tempY, setTempY] = useState(y);
  
  const [dragging, setDragging] = useState(false);
  const windowRef = useRef();

  const dragControl = (e, data) => {
    if (!isMaximized) {
      setX(data.x);
      setY(data.y);
    }
  };

  const handleMaximize = () => {
    if (isMaximized) {
      // Restore window
      setW(tempW);
      setH(tempH);
      setX(tempX);
      setY(tempY);
    } else {
      // Save current position and size
      setTempW(w);
      setTempH(h);
      setTempX(x);
      setTempY(y);
      // Maximize
      setW(window.innerWidth);
      setH(window.innerHeight - 40);
      setX(0);
      setY(0);
    }
    setIsMaximized(!isMaximized);
  };

  const handleClick = () => {
    onFocus(id);
  };

  // Reset position if window goes out of bounds
  useEffect(() => {
    if (!isMaximized && (x > window.innerWidth || y > window.innerHeight)) {
      setX(100);
      setY(100);
    }
  }, [isMaximized, x, y]);

  return (
    <Draggable
      defaultPosition={{ x, y }}
      position={isMaximized ? { x: 0, y: 0 } : { x, y }}
      onDrag={dragControl}
      onStart={() => {
        setDragging(true);
        onFocus(id);
      }}
      onStop={() => setDragging(false)}
      handle={".heading"}
      disabled={isMaximized}
      bounds="parent"
    >
      <Resizable
        size={{ width: isMaximized ? '100%' : w, height: isMaximized ? '100%' : h }}
        onResizeStart={() => {
          if (!isMaximized) {
            setTempH(h);
            setTempW(w);
            onFocus(id);
          }
        }}
        onResize={(e, direction, ref, d) => {
          if (!isMaximized) {
            setH(tempH + d.height);
            setW(tempW + d.width);
          }
        }}
        minHeight={300}
        minWidth={400}
        bounds="parent"
        enable={!isMaximized ? {
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true
        } : false}
      >
        <Container 
          ref={windowRef}
          h={h} 
          w={w} 
          zIndex={zIndex}
          focused={focused}
          onClick={handleClick}
          isMaximized={isMaximized}
        >
          <WindowHeading 
            dragging={dragging}
            title={title}
            icon={icon}
            onClose={onClose}
            onMinimize={onMinimize}
            onMaximize={handleMaximize}
            isMaximized={isMaximized}
          />
          {content}
        </Container>
      </Resizable>
    </Draggable>
  );
}