import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Upewnij się, że ścieżka do api jest poprawna

const ImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Loader = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top: 2px solid ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

const FallbackIcon = styled.span`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.5;
`;

const ImageWithFallback = ({ objectName, alt }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true; // Flaga do obsługi odmontowania komponentu

        const fetchUrl = async () => {
            if (!objectName) {
                setLoading(false);
                setError(true);
                return;
            }
            try {
                const response = await api.get(`/files/get-url/${objectName}`);
                if (isMounted) {
                    setImageUrl(response.data.url);
                }
            } catch (err) {
                console.error(`Nie udało się pobrać linku dla ${objectName}`, err);
                if (isMounted) {
                    setError(true);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUrl();

        return () => { isMounted = false; }; // Cleanup
    }, [objectName]);

    if (loading) {
        return <ImageWrapper><Loader /></ImageWrapper>;
    }

    if (error || !imageUrl) {
        return (
            <ImageWrapper title="Nie można załadować zdjęcia">
                <FallbackIcon>🖼️</FallbackIcon>
            </ImageWrapper>
        );
    }

    return (
        <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            <ImageWrapper>
                <StyledImage src={imageUrl} alt={alt} />
            </ImageWrapper>
        </a>
    );
};

export default ImageWithFallback;