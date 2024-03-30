import styled from "styled-components";
import {useEffect, useState} from "react";

const ButtonContainer = styled.button`
    background-color: transparent;
    border: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 40px;
    margin: 0;
    padding: 0 5px;
    
    line-height: 16px;
    font-size: 11px;
    color: #fff;
`;

export default function Time() {
  const [ currentTimeString, setCurrentTimeString ] = useState("10:00 AM");
  const [ currentDateString, setCurrentDateString ] = useState("30.03.2024");

  const setTimeDate = () => {
    const date = new Date();

    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);

    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();

    setCurrentTimeString(`${hours}:${minutes}`);
    setCurrentDateString(`${day}.${month}.${year}`);
  };

  useEffect(() => {
    setTimeDate();
    const i = setInterval(setTimeDate, 500);
    return () => clearInterval(i);
  }, []);

  return(
    <ButtonContainer>
      {currentTimeString}<br />
      {currentDateString}
    </ButtonContainer>
  );
}