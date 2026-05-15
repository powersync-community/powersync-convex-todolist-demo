import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import TerminalIcon from '@mui/icons-material/Terminal';
import WifiIcon from '@mui/icons-material/Wifi';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Toolbar,
  Typography,
  styled
} from '@mui/material';
import React from 'react';

import { AUTH_ROUTE, SQL_CONSOLE_ROUTE, TODO_LISTS_ARCHIVED_ROUTE, TODO_LISTS_ROUTE } from '@/app/router';
import { useNavigationPanel } from '@/components/navigation/NavigationPanelContext';
import { useDemoMode } from '@/library/demoMode';
import { useAuthActions } from '@convex-dev/auth/react';
import { usePowerSync, useStatus } from '@powersync/react';
import { useNavigate } from 'react-router-dom';

function formatSyncError(error: unknown) {
  if (!error) {
    return undefined;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object') {
    const errorLike = error as { message?: unknown; error?: unknown; details?: unknown };
    const message = errorLike.message ?? errorLike.error ?? errorLike.details;
    if (typeof message === 'string') {
      return message;
    }

    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return Object.prototype.toString.call(error);
    }
  }

  return String(error);
}

/** App shell for authenticated pages, including navigation, sync status, and sign-out controls. */
export default function ViewsLayout({ children }: { children: React.ReactNode }) {
  const { isDemoMode, disableDemoMode } = useDemoMode();
  const powerSync = usePowerSync();
  const navigate = useNavigate();
  const { signOut } = useAuthActions();

  const syncStatus = useStatus();
  const syncErrorText = [
    formatSyncError(syncStatus?.dataFlowStatus.downloadError),
    formatSyncError(syncStatus?.dataFlowStatus.uploadError)
  ]
    .filter(Boolean)
    .join('\n');
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [demoMenuAnchor, setDemoMenuAnchor] = React.useState<HTMLElement | null>(null);
  const { title } = useNavigationPanel();

  const handleSignOut = async () => {
    await powerSync.disconnectAndClear();
    await signOut();
    navigate(AUTH_ROUTE);
  };

  const handleDisableDemoMode = async () => {
    setDemoMenuAnchor(null);
    await powerSync.disconnectAndClear();
    disableDemoMode();
    navigate(AUTH_ROUTE);
  };

  const seedDemoListIfNeeded = React.useCallback(async () => {
    const existing = await powerSync.execute('SELECT id FROM lists LIMIT 1');
    if (existing.rows?.length) {
      return;
    }

    await powerSync.execute(
      `INSERT INTO lists (id, created_at, name, owner_id, notes, priority, tags, archived) VALUES (uuid(), datetime(), ?, ?, '', 0, '[]', 0)`,
      ['play around with demo', 'demo-user']
    );
  }, [powerSync]);

  React.useEffect(() => {
    if (!isDemoMode) {
      return;
    }

    void seedDemoListIfNeeded();
  }, [isDemoMode, seedDemoListIfNeeded]);

  const NAVIGATION_ITEMS = React.useMemo(
    () => [
      {
        path: SQL_CONSOLE_ROUTE,
        title: 'SQL Console',
        icon: () => <TerminalIcon />
      },
      {
        path: TODO_LISTS_ROUTE,
        title: 'TODO Lists',
        icon: () => <ChecklistRtlIcon />
      },
      {
        path: TODO_LISTS_ARCHIVED_ROUTE,
        title: 'Archived lists',
        icon: () => <ArchiveOutlinedIcon />
      }
    ],
    []
  );

  return (
    <S.MainBox>
      <S.TopBar position="sticky" elevation={0}>
        <Toolbar sx={{ minHeight: 72 }}>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2, bgcolor: 'rgba(37, 99, 235, 0.08)' }}
            onClick={() => setOpenDrawer(!openDrawer)}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
              mr: 1.5
            }}
            aria-label={[
              syncStatus?.connected ? 'Connected' : 'Disconnected',
              syncStatus?.dataFlowStatus.uploading ? 'Uploading' : null,
              syncStatus?.dataFlowStatus.downloading ? 'Downloading' : null
            ]
              .filter(Boolean)
              .join('. ')}>
            <Box
              sx={{
                height: { xs: 0, sm: 14 },
                minHeight: { xs: 0, sm: 14 },
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'flex-end',
                justifyContent: 'center',
                mb: -0.75,
                lineHeight: 0
              }}>
              <KeyboardArrowUpIcon
                sx={{
                  fontSize: '1rem',
                  color: 'success.main',
                  display: 'block',
                  opacity: syncStatus?.dataFlowStatus.uploading ? 1 : 0,
                  visibility: syncStatus?.dataFlowStatus.uploading ? 'visible' : 'hidden'
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                lineHeight: 0,
                color: syncStatus?.connected ? 'success.main' : 'error.main'
              }}>
              {syncErrorText ? (
                <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{syncErrorText}</span>}>
                  <ErrorOutlineIcon color="error" sx={{ mr: 0.5, fontSize: '1.25rem' }} />
                </Tooltip>
              ) : null}
              {syncStatus?.connected ? (
                <WifiIcon sx={{ fontSize: '1.35rem' }} />
              ) : (
                <SignalWifiOffIcon sx={{ fontSize: '1.35rem' }} />
              )}
            </Box>
            <Box
              sx={{
                height: { xs: 0, sm: 14 },
                minHeight: { xs: 0, sm: 14 },
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'flex-start',
                justifyContent: 'center',
                mt: -0.75,
                lineHeight: 0
              }}>
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: '1rem',
                  color: 'success.main',
                  display: 'block',
                  opacity: syncStatus?.dataFlowStatus.downloading ? 1 : 0,
                  visibility: syncStatus?.dataFlowStatus.downloading ? 'visible' : 'hidden'
                }}
              />
            </Box>
          </Box>
          {!isDemoMode ? (
            <Button color="primary" variant="outlined" onClick={handleSignOut} startIcon={<LogoutIcon />} sx={{ ml: 2 }}>
              Logout
            </Button>
          ) : (
            <>
              <Button
                color="secondary"
                variant="outlined"
                size="small"
                onClick={(event) => setDemoMenuAnchor(event.currentTarget)}
                endIcon={<ExpandMoreIcon />}
                sx={{ ml: 2, whiteSpace: 'nowrap' }}>
                Demo mode
              </Button>
              <Menu
                anchorEl={demoMenuAnchor}
                open={Boolean(demoMenuAnchor)}
                onClose={() => setDemoMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MenuItem onClick={() => void handleDisableDemoMode()}>Disable demo mode</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </S.TopBar>
      <Drawer
        anchor={'left'}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: {
            width: 300,
            borderRight: '1px solid',
            borderColor: 'divider'
          }
        }}>
        <Box sx={{ p: 3 }}>
          <S.PowerSyncLogo alt="PowerSync Logo" width={190} height={54} src="/powersync-logo.svg" />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
            <Avatar
              src="/convex-logo.svg"
              alt="Convex"
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.92)', width: 36, height: 36, p: 0.75 }}
            />
            <Box>
              <Typography variant="subtitle2">Convex Todo Demo</Typography>
              <Typography variant="caption" color="text.secondary">
                Local-first sync
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <List sx={{ p: 1.5 }}>
          {NAVIGATION_ITEMS.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  minHeight: 48
                }}
                onClick={async () => {
                  navigate(item.path);
                  setOpenDrawer(false);
                }}>
                <ListItemIcon>{item.icon()}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <S.MainBox>{children}</S.MainBox>
    </S.MainBox>
  );
}

namespace S {
  export const MainBox = styled(Box)`
    flex-grow: 1;
    min-height: 100vh;
  `;

  export const TopBar = styled(AppBar)`
    margin-bottom: 12px;
    background: rgba(17, 24, 39, 0.84);
    color: ${({ theme }) => theme.palette.text.primary};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    backdrop-filter: blur(16px);
  `;

  export const PowerSyncLogo = styled('img')`
    max-width: 190px;
    max-height: 54px;
    object-fit: contain;
  `;
}
