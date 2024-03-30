import styled, {createGlobalStyle} from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
    }
    
    * {
        box-sizing: border-box;
        font-family: 'Segoe UI', sans-serif;
    }
`;

export const MainContainer = styled.div`
    width: 100vw;
    height: 100vh;
    
    overflow: hidden;
    background-image: url(${props => props.background});
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
`;