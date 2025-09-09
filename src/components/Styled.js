import styled from 'styled-components';
import { Link } from 'react-router-dom';

// --- Główne Tytuły ---
export const Title = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
`;

// --- Kontenery Layoutu ---
export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

// --- Przyciski ---
export const Button = styled.button`
  padding: 0.7rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 700;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitionSpeed} ease;
  background-color: ${({ theme, variant }) => {
    if (variant === 'primary') return theme.colors.primary;
    if (variant === 'danger') return theme.colors.danger;
    return theme.colors.accent;
}};
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadow};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ButtonLink = styled(Button).attrs({ as: Link })`
  text-decoration: none;
  display: inline-block;
  text-align: center;
`;

// --- Karty ---
export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 1.5rem;
  transition: all ${({ theme }) => theme.transitionSpeed} ease;
`;

export const CardHeader = styled.div`
  padding: 1rem 1.5rem;
  font-weight: 700;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CardBody = styled.div`
  padding: 1.5rem;
`;

export const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
`;

// --- Elementy Formularzy ---
export const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 2.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadow};
  max-width: 500px;
  margin: 2rem auto;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all ${({ theme }) => theme.transitionSpeed} ease;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(61, 82, 213, 0.2);
  }
`;

// ... (na końcu pliku dodaj ten nowy komponent)

export const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;

  &::after {
    content: '▼';
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    pointer-events: none;
  }
`;

// Zastąp stary komponent Select tym nowym
export const Select = styled.select`
  width: 100%;
  padding: 0.8rem 2rem 0.8rem 1rem;
  font-size: 0.9rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitionSpeed} ease, box-shadow ${({ theme }) => theme.transitionSpeed} ease;
  appearance: none; // Kluczowe do ukrycia domyślnej strzałki

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(61, 82, 213, 0.2);
  }
`;

export const Textarea = styled.textarea`
  // Dziedziczy style z Input
  ${Input}
  resize: vertical;
  min-height: 120px;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
`;
