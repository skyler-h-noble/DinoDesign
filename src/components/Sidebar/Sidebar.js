// src/components/Sidebar/Sidebar.js
import React, { useState } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Collapse,
  IconButton,
  Badge,
  Tooltip,
  Avatar,
  Stack,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * Sidebar Component
 * Expandable drawer sidebar with menu items
 * 
 * Design System Integration:
 * - Background: var(--Container)
 * - Text: var(--Text)
 * - Selected: var(--Buttons-Primary-Button) bg, var(--Buttons-Primary-Text) text
 * - Border: var(--Border-Variant)
 * 
 * WCAG 2.1 Accessibility:
 * - Proper semantic structure
 * - Keyboard navigation
 * - ARIA labels
 * - Focus management
 * 
 * @param {boolean} open - Sidebar open state
 * @param {function} onClose - Close handler
 * @param {Array} items - Array of menu items {label, icon, onClick, badge}
 * @param {function} onItemClick - Item click handler
 * @param {number} width - Sidebar width
 * @param {string} variant - Sidebar variant: 'standard' | 'permanent' | 'temporary'
 * @param {object} props - Additional props
 */
export function Sidebar({
  open,
  onClose,
  items = [],
  onItemClick,
  width = 280,
  variant = 'temporary',
  header,
  footer,
  sx = {},
  ...props
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const handleItemClick = (item, index) => {
    setSelectedItem(index);
    onItemClick?.(item);
    if (variant === 'temporary') {
      onClose?.();
    }
  };

  const handleToggleSubmenu = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const drawerVariant = variant === 'permanent' ? 'permanent' : variant === 'standard' ? 'standard' : 'temporary';

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--Container)',
        color: 'var(--Text)',
      }}
    >
      {/* Header */}
      {header && (
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid var(--Border-Variant)',
          }}
        >
          {typeof header === 'string' ? (
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {header}
            </Typography>
          ) : (
            header
          )}
        </Box>
      )}

      {/* Menu Items */}
      <List
        sx={{
          flex: 1,
          overflow: 'auto',
          py: 1,
        }}
      >
        {items.map((item, index) => {
          const isSelected = selectedItem === index;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isExpanded = expandedItems[index];

          return (
            <Box key={index}>
              <Tooltip title={item.tooltip || ''} placement="right">
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      if (hasSubmenu) {
                        handleToggleSubmenu(index);
                      } else {
                        handleItemClick(item, index);
                      }
                    }}
                    selected={isSelected && !hasSubmenu}
                    sx={{
                      backgroundColor: isSelected && !hasSubmenu
                        ? 'var(--Buttons-Primary-Button)'
                        : 'transparent',
                      color: isSelected && !hasSubmenu
                        ? 'var(--Buttons-Primary-Text)'
                        : 'var(--Text)',
                      '&:hover': {
                        backgroundColor: isSelected && !hasSubmenu
                          ? 'var(--Buttons-Primary-Button)'
                          : 'var(--Container-High)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'var(--Buttons-Primary-Button)',
                        color: 'var(--Buttons-Primary-Text)',
                        '&:hover': {
                          backgroundColor: 'var(--Buttons-Primary-Button)',
                        },
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {item.icon && (
                      <ListItemIcon
                        sx={{
                          color: isSelected && !hasSubmenu
                            ? 'var(--Buttons-Primary-Text)'
                            : 'var(--Icons-Primary)',
                          minWidth: 40,
                        }}
                      >
                        {item.badge ? (
                          <Badge badgeContent={item.badge} color="error">
                            {item.icon}
                          </Badge>
                        ) : (
                          item.icon
                        )}
                      </ListItemIcon>
                    )}
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: isSelected && !hasSubmenu ? 600 : 500,
                      }}
                    />
                    {hasSubmenu && (
                      <Box sx={{ ml: 1 }}>
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>

              {/* Submenu */}
              {hasSubmenu && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu.map((subitem, subindex) => (
                      <ListItem key={subindex} disablePadding>
                        <ListItemButton
                          onClick={() => handleItemClick(subitem, subindex)}
                          sx={{
                            pl: 4,
                            backgroundColor: 'transparent',
                            color: 'var(--Text)',
                            '&:hover': {
                              backgroundColor: 'var(--Container-High)',
                            },
                            '&.Mui-selected': {
                              backgroundColor: 'var(--Buttons-Primary-Button)',
                              color: 'var(--Buttons-Primary-Text)',
                            },
                          }}
                        >
                          {subitem.icon && (
                            <ListItemIcon
                              sx={{
                                color: 'var(--Icons-Primary)',
                                minWidth: 40,
                              }}
                            >
                              {subitem.icon}
                            </ListItemIcon>
                          )}
                          <ListItemText primary={subitem.label} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}

              {/* Divider */}
              {item.divider && <Divider sx={{ my: 1, borderColor: 'var(--Border-Variant)' }} />}
            </Box>
          );
        })}
      </List>

      {/* Footer */}
      {footer && (
        <Box
          sx={{
            borderTop: '1px solid var(--Border-Variant)',
            p: 2,
          }}
        >
          {typeof footer === 'string' ? (
            <Typography
              variant="caption"
              sx={{
                color: 'var(--Text-Quiet)',
              }}
            >
              {footer}
            </Typography>
          ) : (
            footer
          )}
        </Box>
      )}
    </Box>
  );

  if (variant === 'permanent') {
    return (
      <Box
        sx={{
          width,
          flexShrink: 0,
          ...sx,
        }}
      >
        {sidebarContent}
      </Box>
    );
  }

  return (
    <Drawer
      variant={drawerVariant}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width,
          backgroundColor: 'var(--Container)',
          color: 'var(--Text)',
          ...sx,
        },
      }}
      {...props}
    >
      {sidebarContent}
    </Drawer>
  );
}

/**
 * CollapsibleSidebar Component
 * Sidebar that collapses to icon-only mode
 * 
 * @param {boolean} collapsed - Collapsed state
 * @param {function} onToggle - Toggle collapse handler
 * @param {Array} items - Menu items
 * @param {object} props - Additional props
 */
export function CollapsibleSidebar({
  collapsed = false,
  onToggle,
  items = [],
  onItemClick,
  header,
  sx = {},
  ...props
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const width = collapsed ? 80 : 280;

  const handleItemClick = (item, index) => {
    setSelectedItem(index);
    onItemClick?.(item);
  };

  return (
    <Box
      sx={{
        width,
        transition: 'width 0.3s ease-in-out',
        backgroundColor: 'var(--Container)',
        color: 'var(--Text)',
        borderRight: '1px solid var(--Border-Variant)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        ...sx,
      }}
    >
      {/* Header with Toggle */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--Border-Variant)',
        }}
      >
        {!collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {header || 'Menu'}
          </Typography>
        )}
        <IconButton
          onClick={onToggle}
          size="small"
          sx={{
            color: 'var(--Icons-Primary)',
          }}
        >
          <ChevronRightIcon
            sx={{
              transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease-in-out',
            }}
          />
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        {items.map((item, index) => (
          <Tooltip
            key={index}
            title={collapsed ? item.label : ''}
            placement="right"
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(item, index)}
                selected={selectedItem === index}
                sx={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  backgroundColor: selectedItem === index
                    ? 'var(--Buttons-Primary-Button)'
                    : 'transparent',
                  color: selectedItem === index
                    ? 'var(--Buttons-Primary-Text)'
                    : 'var(--Text)',
                  '&:hover': {
                    backgroundColor: selectedItem === index
                      ? 'var(--Buttons-Primary-Button)'
                      : 'var(--Container-High)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'var(--Buttons-Primary-Button)',
                    color: 'var(--Buttons-Primary-Text)',
                  },
                }}
              >
                {item.icon && (
                  <ListItemIcon
                    sx={{
                      color: selectedItem === index
                        ? 'var(--Buttons-Primary-Text)'
                        : 'var(--Icons-Primary)',
                      minWidth: collapsed ? 40 : 40,
                    }}
                  >
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                )}
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: selectedItem === index ? 600 : 500,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Box>
  );
}

/**
 * UserProfileSidebar Component
 * Sidebar with user profile section
 * 
 * @param {object} user - User object {name, avatar, email}
 * @param {Array} items - Menu items
 * @param {object} props - Additional props
 */
export function UserProfileSidebar({
  open,
  onClose,
  user,
  items = [],
  onItemClick,
  onUserClick,
  sx = {},
  ...props
}) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item, index) => {
    setSelectedItem(index);
    onItemClick?.(item);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: 'var(--Container)',
          color: 'var(--Text)',
          ...sx,
        },
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* User Profile */}
        {user && (
          <Box
            onClick={onUserClick}
            sx={{
              p: 2,
              backgroundColor: 'var(--Container-Low)',
              borderBottom: '1px solid var(--Border-Variant)',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'var(--Container-High)',
              },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              {user.avatar && (
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: 'var(--Buttons-Primary-Button)',
                  }}
                >
                  {user.name?.charAt(0)}
                </Avatar>
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.name}
                </Typography>
                {user.email && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'var(--Text-Secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.email}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
        )}

        {/* Menu Items */}
        <List sx={{ flex: 1, overflow: 'auto', py: 1 }}>
          {items.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  handleItemClick(item, index);
                  onClose();
                }}
                selected={selectedItem === index}
                sx={{
                  backgroundColor: selectedItem === index
                    ? 'var(--Buttons-Primary-Button)'
                    : 'transparent',
                  color: selectedItem === index
                    ? 'var(--Buttons-Primary-Text)'
                    : 'var(--Text)',
                  '&:hover': {
                    backgroundColor: selectedItem === index
                      ? 'var(--Buttons-Primary-Button)'
                      : 'var(--Container-High)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'var(--Buttons-Primary-Button)',
                    color: 'var(--Buttons-Primary-Text)',
                  },
                }}
              >
                {item.icon && (
                  <ListItemIcon
                    sx={{
                      color: selectedItem === index
                        ? 'var(--Buttons-Primary-Text)'
                        : 'var(--Icons-Primary)',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Box
          sx={{
            borderTop: '1px solid var(--Border-Variant)',
            p: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'var(--Text-Quiet)',
            }}
          >
            © 2024 MyApp
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

/**
 * MinimalSidebar Component
 * Minimal icon-only sidebar
 * 
 * @param {Array} items - Menu items (icon only)
 * @param {object} props - Additional props
 */
export function MinimalSidebar({
  items = [],
  onItemClick,
  sx = {},
  ...props
}) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item, index) => {
    setSelectedItem(index);
    onItemClick?.(item);
  };

  return (
    <Box
      sx={{
        width: 80,
        backgroundColor: 'var(--Container)',
        color: 'var(--Text)',
        borderRight: '1px solid var(--Border-Variant)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        gap: 1,
        ...sx,
      }}
    >
      {items.map((item, index) => (
        <Tooltip key={index} title={item.label} placement="right">
          <IconButton
            onClick={() => handleItemClick(item, index)}
            selected={selectedItem === index}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: selectedItem === index
                ? 'var(--Buttons-Primary-Button)'
                : 'transparent',
              color: selectedItem === index
                ? 'var(--Buttons-Primary-Text)'
                : 'var(--Icons-Primary)',
              '&:hover': {
                backgroundColor: selectedItem === index
                  ? 'var(--Buttons-Primary-Button)'
                  : 'var(--Container-High)',
              },
              borderRadius: '8px',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {item.badge ? (
              <Badge badgeContent={item.badge} color="error">
                {item.icon}
              </Badge>
            ) : (
              item.icon
            )}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
}

export default Sidebar;
