import React from 'react';
import { Typography, Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Link } from '@mui/material';

interface ArticleContentProps {
  content: string;
  headline: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content, headline }) => {
  const cleanContent = (text: string) => {
    return text
      .replace(/\*\*\$\*\*\*\*/g, '**$')
      .replace(/\*\*\*\*/g, '**')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n/g, '\n\n')
      .replace(/\*\* /g, '**')
      .replace(/ \*\*/g, '**');
  };

  const components = {
    a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
      <Link href={href} target="_blank" rel="noopener noreferrer" color="primary">
        {children}
      </Link>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
        {children}
      </Typography>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, color: 'text.primary' }}>
        {children}
      </Typography>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <Typography component="span" sx={{ fontWeight: 700, display: 'inline', color: 'text.primary' }}>
        {children}
      </Typography>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <Typography component="span" sx={{ fontStyle: 'italic', display: 'inline' }}>
        {children}
      </Typography>
    ),
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, color: 'text.primary', fontWeight: 'bold' }}>
        {headline}
      </Typography>
      <Box sx={{ '& > *': { mb: 2 }, fontSize: { xs: '0.875rem', sm: '1rem' }, color: 'text.primary' }}>
        <ReactMarkdown components={components as any}>
          {cleanContent(content)}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

export { ArticleContent };