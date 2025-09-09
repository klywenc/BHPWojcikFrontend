import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';

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
    cursor: pointer; // <-- DODAJEMY KURSOR, ABY WSKAZAĆ KLIKALNOŚĆ
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.05);
    }
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

const ImageWithFallback = ({ objectName, alt, onClick }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchUrl = async () => {
            if (!objectName) { setLoading(false); setError(true); return; }
            try {
                const response = await api.get(`/files/get-url/${objectName}`);
                if (isMounted) setImageUrl(response.data.url);
            } catch (err) {
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchUrl();
        return () => { isMounted = false; };
    }, [objectName]);

    if (loading) return <ImageWrapper><Loader /></ImageWrapper>;
    if (error || !imageUrl) return <ImageWrapper title="Nie można załadować zdjęcia"><FallbackIcon>🖼️</FallbackIcon></ImageWrapper>;

    return (
        // --- ZMIANA: Zamiast <a>, mamy onClick, który przekazuje URL do rodzica ---
        <ImageWrapper onClick={() => onClick(imageUrl)} title="Kliknij, aby powiększyć">
            <StyledImage src={imageUrl} alt={alt} />
        </ImageWrapper>
    );
};

export default ImageWithFallback;