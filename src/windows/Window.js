import {useState} from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import WindowHeading from "./WindowHeading";
import {Resizable} from "re-resizable";

const Container = styled.div`
    width: ${props => props.w}px;
    height: ${props => props.h}px;
    
    background-color: #fff;
    display: block;
    position: absolute;
`;

export default function Window({ title, content }) {
  const [ x, setX ] = useState(100);
  const [ y, setY ] = useState(100);
  const [ w, setW ] = useState(600);
  const [ h, setH ] = useState(400);
  const [ t, setT ] = useState(title);

  const [ tempW, setTempW ] = useState(w);
  const [ tempH, setTempH ] = useState(h);

  const [ dragging, setDragging ] = useState(false);

  const dragControl = (e, data) => {
    setX(data.x);
    setY(data.y);
  };
  return(
    <Draggable
      defaultPosition={{ x, y }}
      position={{ x, y }}
      onDrag={dragControl}
      onStart={() => setDragging(true)}
      onStop={() => setDragging(false)}
      handle={".heading"}
    >
      <Resizable
        size={{ width: w, height: w }}
        onResizeStart={(a, b, c, d) => {
          setTempH(h);
          setTempW(w);
        }}
        onResize={(a, b, c, d) => {
          setH(tempH + d.height);
          setW(tempW + d.width);
        }}
        minHeight={400}
        minWidth={600}
        boundsByDirection
      >
        <Container h={h} w={w}>
          <WindowHeading dragging={dragging} title={t} />
          {content}
        </Container>
      </Resizable>
    </Draggable>
  );
}