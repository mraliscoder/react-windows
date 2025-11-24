import styled from "styled-components";

const DOSContainer = styled.div`
  width: 100%;
  height: calc(100% - 30px);
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

export default function DOSSimulator() {
  return (
    <DOSContainer>
      <iframe src="https://ne-dos.ru" title="MS-DOS Simulator" />
    </DOSContainer>
  );
}