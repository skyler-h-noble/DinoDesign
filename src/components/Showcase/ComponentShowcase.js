// src/components/Showcase/ComponentShowcase.js
import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Chip,
  Stack,
  Card,
  CardContent,
  CardActionArea,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { showcaseConfig } from './showcaseConfig';

export function ComponentShowcase({ onSelectComponent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Get unique categories
  const categories = useMemo(() => {
    return showcaseConfig.map(cat => cat.category);
  }, []);

  // Filter components based on search and category
  const filteredConfig = useMemo(() => {
    return showcaseConfig
      .map(category => ({
        ...category,
        components: category.components.filter(
          comp =>
            comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comp.description.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter(category => 
        category.components.length > 0 && 
        (!selectedCategory || selectedCategory === category.category)
      );
  }, [searchTerm, selectedCategory]);

  // Calculate total variants
  const totalVariants = useMemo(() => {
    return showcaseConfig.reduce((sum, category) => {
      return sum + category.components.reduce((catSum, comp) => catSum + comp.variants, 0);
    }, 0);
  }, []);

  const totalComponents = useMemo(() => {
    return showcaseConfig.reduce((sum, category) => sum + category.components.length, 0);
  }, []);

  return (
    <Box sx={{ backgroundColor: 'var(--Container-Low)', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: 'var(--Header)',
            }}
          >
            Component Library
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'var(--Text-Quiet)', 
              mb: 3,
              fontWeight: 400,
            }}
          >
            {totalComponents}+ production-ready components with {totalVariants}+ variants
          </Typography>

          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search components by name or description..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1.5, color: 'var(--Text-Quiet)' }} />
              ),
            }}
            sx={{
              mb: 3,
              backgroundColor: 'var(--Container)',
              borderRadius: '4px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'var(--Border)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--Border)',
                },
              },
            }}
          />

          {/* Category Filter */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', display: 'block', mb: 1 }}>
              Filter by category:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="All"
                onClick={() => setSelectedCategory(null)}
                variant={selectedCategory === null ? 'filled' : 'outlined'}
                sx={{ 
                  mb: 1,
                  backgroundColor: selectedCategory === null ? 'var(--Buttons-Primary-Button)' : 'transparent',
                  color: selectedCategory === null ? '#fff' : 'var(--Text)',
                  borderColor: 'var(--Border)',
                }}
              />
              {categories.map(cat => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => setSelectedCategory(cat)}
                  variant={selectedCategory === cat ? 'filled' : 'outlined'}
                  sx={{ 
                    mb: 1,
                    backgroundColor: selectedCategory === cat ? 'var(--Buttons-Primary-Button)' : 'transparent',
                    color: selectedCategory === cat ? '#fff' : 'var(--Text)',
                    borderColor: 'var(--Border)',
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Components Grid */}
        {filteredConfig.length > 0 ? (
          filteredConfig.map(category => (
            <Box key={category.category} sx={{ mb: 5 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: 'var(--Header)',
                  borderBottom: '2px solid var(--Border)',
                  pb: 1.5,
                }}
              >
                {category.category}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    ml: 2,
                    color: 'var(--Text-Quiet)',
                    fontWeight: 400,
                  }}
                >
                  ({category.components.length} components)
                </Typography>
              </Typography>

              <Grid container spacing={2.5}>
                {category.components.map(comp => (
                  <Grid item xs={12} sm={6} md={4} key={comp.path}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        border: '1px solid var(--Border)',
                        backgroundColor: 'var(--Container)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
                          borderColor: 'var(--Buttons-Primary-Button)',
                        },
                      }}
                      onClick={() => onSelectComponent?.(comp)}
                    >
                      <CardActionArea sx={{ flexGrow: 1 }}>
                        <CardContent>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: 'var(--Header)',
                              mb: 1,
                            }}
                          >
                            {comp.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'var(--Text-Quiet)',
                              mb: 2,
                              lineHeight: 1.5,
                            }}
                          >
                            {comp.description}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                              label={`${comp.variants} variant${comp.variants !== 1 ? 's' : ''}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: 'var(--Border)',
                                color: 'var(--Text)',
                              }}
                            />
                            {comp.a11y && (
                              <Chip
                                label={comp.a11y}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: '#4caf50',
                                  color: '#4caf50',
                                }}
                              />
                            )}
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'var(--Container)' }}>
            <Typography variant="h6" sx={{ color: 'var(--Text-Quiet)' }}>
              No components found matching "{searchTerm}"
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--Text-Quiet)', mt: 1 }}>
              Try adjusting your search terms or category filters
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default ComponentShowcase;
