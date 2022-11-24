import styled from "styled-components";

export const Background = styled.div`
  position: fixed;
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.div`
  font: 3rem "Noto Sans KR";
  text-align: center;
`;
