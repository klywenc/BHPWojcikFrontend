import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease;
`;

const Content = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
`;

const StyledImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: -10px;
  background: none;
  border: none;
  color: white;
  font-size: 2.5rem;
  font-weight: 300;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Lightbox = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
        <Overlay onClick={onClose}>
            <Content onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <StyledImage src={imageUrl} alt="Powiększone zdjęcie incydentu" />
            </Content>
        </Overlay>
    );
};

export default Lightbox;