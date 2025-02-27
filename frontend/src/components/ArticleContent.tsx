import React from 'react';
import { Typography, Box, Link as MuiLink } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

interface ArticleContentProps {
  content: string;
  headline: string;
  selectedAnalysis: string | null;
  flaggedPhrases: string[];
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content, headline, selectedAnalysis, flaggedPhrases }) => {
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

  const getAnalysisSpecificContent = () => {
    if (!selectedAnalysis) return cleanContent(content);

    const cleanedContent = cleanContent(content);
    
    // First highlight any flagged phrases from the backend
    let processedContent = cleanedContent;
    if (flaggedPhrases && flaggedPhrases.length > 0) {
      flaggedPhrases.forEach(phrase => {
        if (phrase) {
          const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          processedContent = processedContent.replace(
            new RegExp(`(${escapedPhrase})`, 'gi'),
            '**$1**'
          );
        }
      });
    }

    // Then apply additional analysis-specific highlighting
    switch (selectedAnalysis) {
      case 'headline':
        // Add emphasis to sentences that relate to the headline
        return processedContent.replace(
          new RegExp(`(${headline.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
          '**$1**'
        );
      
      case 'evidence':
        // Highlight citations, numbers, and quotes
        return processedContent
          .replace(/(\d+(?:\.\d+)?(?:\s*%)?)/g, '**$1**') // Numbers and percentages
          .replace(/"([^"]+)"/g, '*"$1"*') // Quotes
          .replace(/\b(?:according to|cited|reported by|study|research)\b/gi, '**$&**'); // Citations
      
      case 'manipulation':
        // Keep only the flagged phrases highlighting from backend
        return processedContent;
      
      case 'bias':
        // Keep only the flagged phrases highlighting from backend
        return processedContent;
      
      default:
        return processedContent;
    }
  };

  const markdownComponents: Components = {
    a: ({ href, children }) => (
      <MuiLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
      >
        {children}
      </MuiLink>
    ),
    h3: ({ children }) => (
      <Typography
        variant="h5"
        gutterBottom
        component="h3"
        sx={{ mt: 3, mb: 2, fontWeight: 'bold', color: 'text.primary' }}
      >
        {children}
      </Typography>
    ),
    p: ({ children }) => (
      <Typography
        variant="body1"
        paragraph
        component="p"
        sx={{ mb: 2, lineHeight: 1.7, color: 'text.primary' }}
      >
        {children}
      </Typography>
    ),
    strong: ({ children }) => (
      <Typography
        variant="body1"
        component="strong"
        sx={{
          fontWeight: 700,
          display: 'inline',
          color: selectedAnalysis === 'headline' ? 'primary.main' :
                 selectedAnalysis === 'evidence' ? 'success.main' :
                 selectedAnalysis === 'manipulation' ? 'warning.main' :
                 selectedAnalysis === 'bias' ? 'secondary.main' :
                 'text.primary',
          backgroundColor: selectedAnalysis === 'headline' ? 'rgba(79, 70, 229, 0.1)' :
                         selectedAnalysis === 'evidence' ? 'rgba(34, 197, 94, 0.1)' :
                         selectedAnalysis === 'manipulation' ? 'rgba(245, 158, 11, 0.1)' :
                         selectedAnalysis === 'bias' ? 'rgba(168, 85, 247, 0.1)' :
                         'transparent',
          padding: '0.125rem 0.25rem',
          borderRadius: '0.25rem',
          border: selectedAnalysis ? '1px solid' : 'none',
          borderColor: selectedAnalysis === 'headline' ? 'rgba(79, 70, 229, 0.2)' :
                      selectedAnalysis === 'evidence' ? 'rgba(34, 197, 94, 0.2)' :
                      selectedAnalysis === 'manipulation' ? 'rgba(245, 158, 11, 0.2)' :
                      selectedAnalysis === 'bias' ? 'rgba(168, 85, 247, 0.2)' :
                      'transparent',
          boxShadow: selectedAnalysis ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: selectedAnalysis === 'headline' ? 'rgba(79, 70, 229, 0.15)' :
                           selectedAnalysis === 'evidence' ? 'rgba(34, 197, 94, 0.15)' :
                           selectedAnalysis === 'manipulation' ? 'rgba(245, 158, 11, 0.15)' :
                           selectedAnalysis === 'bias' ? 'rgba(168, 85, 247, 0.15)' :
                           'transparent',
          }
        }}
      >
        {children}
      </Typography>
    ),
    em: ({ children }) => (
      <Typography
        variant="body1"
        component="em"
        sx={{ fontStyle: 'italic', display: 'inline' }}
      >
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
        <ReactMarkdown components={markdownComponents}>
          {getAnalysisSpecificContent()}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

export { ArticleContent };