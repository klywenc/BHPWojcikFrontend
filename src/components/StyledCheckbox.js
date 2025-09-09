import React from 'react';
import styled from 'styled-components';

const CheckboxContainer = styled.div`
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute !important;
  overflow: hidden !important;
  width: 1px !important;
  height: 1px !important;
  margin: -1px !important;
  padding: 0 !important;
  border: 0 !important;
  clip: rect(0 0 0 0) !important;
  white-space: nowrap !important;
`;

const CheckmarkIcon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 3px;
  stroke-dasharray: 24;
  stroke-dashoffset: ${({ checked }) => (checked ? 0 : 24)};
  transition: stroke-dashoffset 0.3s ease-in-out;
  /* Dodajemy wymiary, aby uniknąć problemów z renderowaniem */
  width: 100%;
  height: 100%;
`;

// --- ZMIANY TUTAJ ---
const StyledCheckboxBox = styled.div`
    display: flex; /* 1. Ustawiamy flexbox */
    justify-content: center; /* 2. Wyśrodkowujemy w poziomie */
    align-items: center; /* 3. Wyśrodkowujemy w pionie */

    width: 20px;
    height: 20px;
    background: ${({ theme, checked }) => (checked ? theme.colors.accent : 'transparent')};
    border: 2px solid ${({ theme, checked }) => (checked ? theme.colors.accent : theme.colors.border)};
    border-radius: 4px;
    transition: all 0.2s ease;

    ${HiddenCheckbox}:focus + & {
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent}4D;
    }
`;

const StyledCheckbox = ({ checked, onChange, ...props }) => (
    <label>
        <CheckboxContainer>
            <HiddenCheckbox checked={checked} onChange={onChange} {...props} />
            <StyledCheckboxBox checked={checked}>
                <CheckmarkIcon checked={checked} viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                </CheckmarkIcon>
            </StyledCheckboxBox>
        </CheckboxContainer>
    </label>
);

export default StyledCheckbox;