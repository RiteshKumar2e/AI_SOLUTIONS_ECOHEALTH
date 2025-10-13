import React, { useState, useEffect } from 'react';
import { 
  Video, Phone, MessageSquare, Calendar, Users, Clock, MapPin, 
  FileText, Mic, MicOff, VideoOff, PhoneOff, Share2, Star, 
  AlertCircle, CheckCircle2, Info, Settings, Bell, Search,
  ChevronRight, Activity, Heart, TrendingUp, Download,
  Plus, Filter, X, Loader, Grid, Maximize, AlertTriangle,
  BarChart3, Zap, Shield
} from 'lucide-react';

// Utility function for merging styles
const mergeStyles = (...styles) => Object.assign({}, ...styles);

// Light Theme Color Palette - Modern 2025
const colors = {
  // Primary palette
  primary: '#3B82F6',        // Bright Blue
  primaryLight: '#60A5FA',   // Light Blue
  primaryDark: '#2563EB',    // Dark Blue
  primaryBg: '#EFF6FF',      // Very Light Blue
  
  // Secondary palette
  secondary: '#10B981',      // Emerald Green
  secondaryLight: '#34D399', // Light Green
  secondaryDark: '#059669',  // Dark Green
  secondaryBg: '#ECFDF5',    // Very Light Green
  
  // Accent colors
  accent: '#F59E0B',         // Amber
  accentLight: '#FBBF24',    // Light Amber
  accentBg: '#FEF3C7',       // Very Light Amber
  
  purple: '#8B5CF6',         // Purple
  purpleLight: '#A78BFA',    // Light Purple
  purpleBg: '#F3E8FF',       // Very Light Purple
  
  pink: '#EC4899',           // Pink
  pinkLight: '#F472B6',      // Light Pink
  pinkBg: '#FCE7F3',         // Very Light Pink
  
  // Neutral palette
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  
  // Shadows
  shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  shadow2xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

// Global Styles Object with Light Theme
const styles = {
  // Base styles
  app: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${colors.gray50} 0%, ${colors.primaryBg} 50%, ${colors.purpleBg} 100%)`,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  },
  appBackground: {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.06) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
    position: 'relative',
    zIndex: 1,
  },

  // Header styles
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '1.5rem 2rem',
    background: colors.white,
    borderRadius: '24px',
    boxShadow: colors.shadowXl,
    border: `1px solid ${colors.gray100}`,
    position: 'relative',
  },
  headerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${colors.primary}, ${colors.purple}, ${colors.pink})`,
    borderRadius: '24px 24px 0 0',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logo: {
    width: '48px',
    height: '48px',
    color: colors.primary,
    filter: `drop-shadow(0 4px 12px ${colors.primary}33)`,
  },
  logoContainer: {
    width: '56px',
    height: '56px',
    background: `linear-gradient(135deg, ${colors.primaryBg}, ${colors.purpleBg})`,
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 4px 12px ${colors.primary}22`,
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: colors.gray600,
    margin: 0,
    fontWeight: 500,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },

  // Search styles
  searchContainer: {
    position: 'relative',
    width: '320px',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    color: colors.gray400,
    pointerEvents: 'none',
    transition: 'all 0.3s ease',
    zIndex: 1,
  },
  searchInput: {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 3rem',
    border: `2px solid ${colors.gray200}`,
    borderRadius: '14px',
    fontSize: '0.875rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: colors.gray50,
    outline: 'none',
    color: colors.gray900,
    fontWeight: 500,
  },
  searchInputFocused: {
    borderColor: colors.primary,
    background: colors.white,
    boxShadow: `0 0 0 4px ${colors.primaryBg}, ${colors.shadowMd}`,
    transform: 'translateY(-2px)',
  },

  // Button styles
  iconBtn: {
    position: 'relative',
    width: '48px',
    height: '48px',
    border: 'none',
    background: colors.gray100,
    borderRadius: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: colors.gray700,
  },
  iconBtnHover: {
    background: colors.primary,
    color: colors.white,
    boxShadow: `0 8px 20px -4px ${colors.primary}66`,
    transform: 'translateY(-2px) scale(1.05)',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: `linear-gradient(135deg, ${colors.danger}, #DC2626)`,
    color: colors.white,
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '3px 7px',
    borderRadius: '12px',
    boxShadow: `0 2px 8px ${colors.danger}66`,
    border: `2px solid ${colors.white}`,
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: `3px solid ${colors.primary}`,
    boxShadow: `0 4px 12px ${colors.primary}44`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  // Navigation styles
  nav: {
    display: 'flex',
    gap: '0.75rem',
    padding: '0.75rem',
    background: colors.white,
    borderRadius: '20px',
    marginBottom: '2rem',
    boxShadow: colors.shadowLg,
    border: `1px solid ${colors.gray100}`,
  },
  navTab: {
    flex: 1,
    padding: '1rem 1.5rem',
    border: 'none',
    background: 'transparent',
    borderRadius: '14px',
    fontSize: '0.875rem',
    fontWeight: 700,
    color: colors.gray600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    letterSpacing: '0.02em',
  },
  navTabActive: {
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
    color: colors.white,
    boxShadow: `0 8px 20px -4px ${colors.primary}66`,
    transform: 'translateY(-2px)',
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statsCard: {
    background: colors.white,
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: colors.shadowXl,
    border: `1px solid ${colors.gray100}`,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  statsCardBlue: {
    borderTop: `4px solid ${colors.primary}`,
    background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.primaryBg} 100%)`,
  },
  statsCardGreen: {
    borderTop: `4px solid ${colors.secondary}`,
    background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.secondaryBg} 100%)`,
  },
  statsCardPurple: {
    borderTop: `4px solid ${colors.purple}`,
    background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.purpleBg} 100%)`,
  },
  statsCardOrange: {
    borderTop: `4px solid ${colors.accent}`,
    background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.accentBg} 100%)`,
  },
  statsCardHover: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: colors.shadow2xl,
  },
  statsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  statsIconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  statsIconBlue: {
    background: colors.primaryBg,
    color: colors.primary,
    boxShadow: `0 4px 12px ${colors.primary}22`,
  },
  statsIconGreen: {
    background: colors.secondaryBg,
    color: colors.secondary,
    boxShadow: `0 4px 12px ${colors.secondary}22`,
  },
  statsIconPurple: {
    background: colors.purpleBg,
    color: colors.purple,
    boxShadow: `0 4px 12px ${colors.purple}22`,
  },
  statsIconOrange: {
    background: colors.accentBg,
    color: colors.accent,
    boxShadow: `0 4px 12px ${colors.accent}22`,
  },
  statsBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '0.375rem 0.875rem',
    borderRadius: '20px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  statsBadgeBlue: {
    background: colors.primaryBg,
    color: colors.primary,
  },
  statsBadgeGreen: {
    background: colors.secondaryBg,
    color: colors.secondary,
  },
  statsBadgePurple: {
    background: colors.purpleBg,
    color: colors.purple,
  },
  statsBadgeOrange: {
    background: colors.accentBg,
    color: colors.accent,
  },
  statsValue: {
    fontSize: '2.75rem',
    fontWeight: 800,
    margin: '0.75rem 0',
    color: colors.gray900,
    letterSpacing: '-0.02em',
  },
  statsLabel: {
    fontSize: '0.875rem',
    color: colors.gray600,
    fontWeight: 600,
  },
  statsDecorationBlue: {
    position: 'absolute',
    bottom: '-20px',
    right: '-20px',
    width: '120px',
    height: '120px',
    background: `radial-gradient(circle, ${colors.primary}22 0%, transparent 70%)`,
    borderRadius: '50%',
  },
  statsDecorationGreen: {
    position: 'absolute',
    bottom: '-20px',
    right: '-20px',
    width: '120px',
    height: '120px',
    background: `radial-gradient(circle, ${colors.secondary}22 0%, transparent 70%)`,
    borderRadius: '50%',
  },
  statsDecorationPurple: {
    position: 'absolute',
    bottom: '-20px',
    right: '-20px',
    width: '120px',
    height: '120px',
    background: `radial-gradient(circle, ${colors.purple}22 0%, transparent 70%)`,
    borderRadius: '50%',
  },
  statsDecorationOrange: {
    position: 'absolute',
    bottom: '-20px',
    right: '-20px',
    width: '120px',
    height: '120px',
    background: `radial-gradient(circle, ${colors.accent}22 0%, transparent 70%)`,
    borderRadius: '50%',
  },

  // AI Alert
  aiAlert: {
    background: colors.white,
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: colors.shadowXl,
    marginBottom: '2rem',
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${colors.gray100}`,
  },
  aiAlertGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${colors.primary}, ${colors.purple}, ${colors.secondary})`,
  },
  aiAlertContent: {
    display: 'flex',
    gap: '1.5rem',
    position: 'relative',
    zIndex: 1,
  },
  aiIcon: {
    flexShrink: 0,
    width: '56px',
    height: '56px',
    background: `linear-gradient(135deg, ${colors.primaryBg}, ${colors.purpleBg})`,
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.primary,
    boxShadow: `0 4px 12px ${colors.primary}22`,
  },
  aiTitle: {
    fontSize: '1.375rem',
    fontWeight: 800,
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.75rem',
  },
  aiText: {
    fontSize: '0.95rem',
    color: colors.gray700,
    lineHeight: 1.7,
    marginBottom: '1.25rem',
    fontWeight: 500,
  },
  aiTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  aiTag: {
    padding: '0.5rem 1rem',
    background: colors.primaryBg,
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: colors.primary,
    transition: 'all 0.3s ease',
    border: `1px solid ${colors.primary}22`,
  },

  // Section styles
  section: {
    marginBottom: '3rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.75rem',
    fontWeight: 800,
    color: colors.gray900,
    margin: 0,
    letterSpacing: '-0.02em',
  },
  sectionIcon: {
    width: '32px',
    height: '32px',
    padding: '6px',
    background: `linear-gradient(135deg, ${colors.secondaryBg}, ${colors.secondary}22)`,
    borderRadius: '10px',
    color: colors.secondary,
  },
  sectionActions: {
    display: 'flex',
    gap: '0.75rem',
  },

  // Button styles
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.75rem',
    border: 'none',
    borderRadius: '14px',
    fontSize: '0.875rem',
    fontWeight: 700,
    cursor: 'pointer',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
    color: colors.white,
    boxShadow: `0 4px 12px ${colors.primary}44`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  btnPrimaryHover: {
    boxShadow: `0 8px 24px ${colors.primary}66`,
    transform: 'translateY(-2px) scale(1.02)',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.75rem',
    border: `2px solid ${colors.gray200}`,
    borderRadius: '14px',
    fontSize: '0.875rem',
    fontWeight: 700,
    cursor: 'pointer',
    background: colors.white,
    color: colors.gray700,
    boxShadow: colors.shadow,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  btnSecondaryHover: {
    background: colors.gray50,
    borderColor: colors.primary,
    color: colors.primary,
    boxShadow: colors.shadowMd,
    transform: 'translateY(-2px)',
  },

  // Consultation Card
  consultationCard: {
    background: colors.white,
    borderRadius: '24px',
    padding: '2rem',
    marginBottom: '1.5rem',
    boxShadow: colors.shadowLg,
    border: `1px solid ${colors.gray100}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  },
  consultationCardHover: {
    transform: 'translateY(-4px) scale(1.01)',
    boxShadow: colors.shadow2xl,
    borderColor: colors.primary,
  },
  consultationCardPriority: {
    borderLeft: `6px solid ${colors.danger}`,
    background: `linear-gradient(135deg, ${colors.white} 0%, #FEF2F2 100%)`,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.25rem',
  },
  patientInfo: {
    display: 'flex',
    gap: '1.25rem',
    flex: 1,
  },
  patientAvatar: {
    width: '72px',
    height: '72px',
    borderRadius: '18px',
    overflow: 'hidden',
    border: `3px solid ${colors.primary}`,
    boxShadow: `0 4px 12px ${colors.primary}33`,
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  patientAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  priorityBadgeIcon: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: `linear-gradient(135deg, ${colors.danger}, #DC2626)`,
    color: colors.white,
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 2px 8px ${colors.danger}66`,
    border: `2px solid ${colors.white}`,
  },
  patientDetails: {
    flex: 1,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    marginBottom: '0.625rem',
  },
  patientName: {
    fontSize: '1.375rem',
    fontWeight: 800,
    color: colors.gray900,
    margin: 0,
    letterSpacing: '-0.01em',
  },
  priorityTag: {
    fontSize: '0.65rem',
    background: `linear-gradient(135deg, ${colors.danger}, #DC2626)`,
    color: colors.white,
    padding: '0.375rem 0.875rem',
    borderRadius: '12px',
    fontWeight: 800,
    letterSpacing: '0.05em',
    boxShadow: `0 2px 8px ${colors.danger}33`,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.625rem',
    fontSize: '0.875rem',
    color: colors.gray600,
    fontWeight: 500,
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
  typeIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  typeIconVideo: {
    background: colors.primaryBg,
    color: colors.primary,
    boxShadow: `0 4px 12px ${colors.primary}22`,
  },
  typeIconPhone: {
    background: colors.secondaryBg,
    color: colors.secondary,
    boxShadow: `0 4px 12px ${colors.secondary}22`,
  },
  cardBody: {
    padding: '1.25rem 0',
    borderTop: `2px solid ${colors.gray100}`,
    borderBottom: `2px solid ${colors.gray100}`,
    marginBottom: '1.25rem',
  },
  conditionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    marginBottom: '0.75rem',
    fontSize: '0.95rem',
  },
  label: {
    fontWeight: 700,
    color: colors.gray700,
  },
  value: {
    color: colors.gray900,
    fontWeight: 600,
  },
  timeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: colors.gray600,
    fontWeight: 600,
  },
  cardFooter: {
    display: 'flex',
    gap: '0.875rem',
  },
  btnStart: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.625rem',
    padding: '1rem',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
    color: colors.white,
    border: 'none',
    borderRadius: '14px',
    fontSize: '0.875rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `0 4px 12px ${colors.primary}44`,
  },
  btnIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.gray100,
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    color: colors.gray700,
    transition: 'all 0.3s ease',
  },
  btnIconHover: {
    background: colors.primaryBg,
    color: colors.primary,
    transform: 'scale(1.1)',
  },

  // Table styles
  tableContainer: {
    background: colors.white,
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: colors.shadowXl,
    border: `1px solid ${colors.gray100}`,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    background: colors.gray50,
    borderBottom: `2px solid ${colors.gray200}`,
  },
  th: {
    padding: '1.25rem 1.5rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: colors.gray700,
  },
  td: {
    padding: '1.25rem 1.5rem',
    fontSize: '0.875rem',
    color: colors.gray700,
    borderBottom: `1px solid ${colors.gray100}`,
    fontWeight: 500,
  },
  tr: {
    transition: 'all 0.3s ease',
  },
  trHover: {
    background: colors.primaryBg,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'capitalize',
  },
  badgeVideo: {
    background: colors.primaryBg,
    color: colors.primary,
    border: `1px solid ${colors.primary}33`,
  },
  badgePhone: {
    background: colors.secondaryBg,
    color: colors.secondary,
    border: `1px solid ${colors.secondary}33`,
  },
  rating: {
    display: 'flex',
    gap: '0.25rem',
  },
  starFilled: {
    width: '18px',
    height: '18px',
    fill: colors.accent,
    color: colors.accent,
  },

  // Footer
  footer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '3rem',
  },
  footerCard: {
    display: 'flex',
    gap: '1.25rem',
    padding: '2rem',
    background: colors.white,
    borderRadius: '20px',
    boxShadow: colors.shadowLg,
    border: `1px solid ${colors.gray100}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  footerCardHover: {
    borderColor: colors.primary,
    boxShadow: colors.shadow2xl,
    transform: 'translateY(-8px)',
  },
  footerIcon: {
    flexShrink: 0,
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerIconGreen: {
    background: colors.secondaryBg,
    color: colors.secondary,
  },
  footerIconBlue: {
    background: colors.primaryBg,
    color: colors.primary,
  },
  footerIconPurple: {
    background: colors.purpleBg,
    color: colors.purple,
  },
  footerTitle: {
    fontSize: '1.125rem',
    fontWeight: 800,
    color: colors.gray900,
    marginBottom: '0.5rem',
  },
  footerText: {
    fontSize: '0.875rem',
    color: colors.gray600,
    lineHeight: 1.7,
    fontWeight: 500,
  },

  // Video Call Interface (Light Theme)
  videoInterface: {
    position: 'fixed',
    inset: 0,
    background: colors.gray900,
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  remoteVideo: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1f2937, #111827)',
  },
  videoPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    color: colors.gray400,
  },
  patientVideoInfo: {
    textAlign: 'center',
    color: colors.white,
  },
  patientAvatarLarge: {
    width: '140px',
    height: '140px',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: `0 20px 40px ${colors.primary}66`,
  },
  localVideo: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    width: '240px',
    height: '180px',
    background: colors.gray800,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    border: `3px solid ${colors.white}`,
    cursor: 'move',
  },
  localVideoVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  pipLabel: {
    position: 'absolute',
    bottom: '0.75rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.8)',
    color: colors.white,
    padding: '0.375rem 1rem',
    borderRadius: '10px',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  callInfo: {
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '1rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: colors.shadow2xl,
  },
  recordingIndicator: {
    width: '12px',
    height: '12px',
    background: colors.danger,
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
  },
  callTimer: {
    color: colors.gray900,
    fontFamily: 'monospace',
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  aiPanel: {
    position: 'absolute',
    bottom: '120px',
    right: '1.5rem',
    width: '380px',
    maxHeight: '520px',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: colors.shadow2xl,
    overflowY: 'auto',
    border: `1px solid ${colors.gray200}`,
  },
  aiPanelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.25rem',
    paddingBottom: '1rem',
    borderBottom: `2px solid ${colors.gray100}`,
  },
  aiPanelTitle: {
    flex: 1,
    fontSize: '1.125rem',
    fontWeight: 800,
    margin: 0,
    color: colors.gray900,
  },
  aiPanelClose: {
    background: colors.gray100,
    border: 'none',
    color: colors.gray700,
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
  },
  aiInsights: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
    marginBottom: '1.5rem',
  },
  aiInsight: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    background: colors.gray50,
    borderRadius: '12px',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
    border: `1px solid ${colors.gray200}`,
    fontWeight: 500,
    color: colors.gray700,
  },
  insightBullet: {
    color: colors.secondary,
    fontWeight: 800,
    fontSize: '1.125rem',
  },
  vitalSigns: {
    background: colors.primaryBg,
    borderRadius: '16px',
    padding: '1.25rem',
    border: `2px solid ${colors.primary}33`,
  },
  vitalSignsTitle: {
    fontSize: '0.95rem',
    fontWeight: 800,
    marginBottom: '1rem',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  vitalsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  vitalItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    padding: '0.75rem',
    background: colors.white,
    borderRadius: '10px',
  },
  vitalLabel: {
    fontSize: '0.75rem',
    color: colors.gray600,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  vitalValue: {
    fontSize: '1.375rem',
    fontWeight: 800,
    color: colors.gray900,
  },

  // Control Bar
  controlBar: {
    background: colors.white,
    borderTop: `1px solid ${colors.gray200}`,
    padding: '2rem',
    boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.1)',
  },
  controlsWrapper: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  controlBtn: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: 'none',
    background: colors.gray100,
    color: colors.gray700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: colors.shadowMd,
  },
  controlBtnHover: {
    background: colors.primary,
    color: colors.white,
    transform: 'translateY(-6px) scale(1.15)',
    boxShadow: `0 12px 24px ${colors.primary}44`,
  },
  controlBtnActive: {
    background: colors.danger,
    color: colors.white,
  },
  controlBtnEnd: {
    background: `linear-gradient(135deg, ${colors.danger}, #DC2626)`,
    color: colors.white,
    width: 'auto',
    padding: '0 2.5rem',
    borderRadius: '32px',
    gap: '0.75rem',
    fontWeight: 700,
    fontSize: '0.95rem',
  },
  controlBtnEndHover: {
    transform: 'translateY(-8px) scale(1.08)',
    boxShadow: `0 16px 32px ${colors.danger}66`,
  },

  // Loading
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '1.5rem',
  },
  spinner: {
    width: '56px',
    height: '56px',
    color: colors.primary,
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '1.125rem',
    color: colors.gray700,
    fontWeight: 700,
  },
};

// Add keyframe animations via style tag
const globalStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.15); }
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.gray100};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.gray300};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.gray400};
  }
`;

export default function Telemedicine() {
  // State Management
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([{ id: 1, text: 'New consultation request' }]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  // Mock Data
  const [upcomingConsultations] = useState([
    {
      id: 1,
      patient: {
        name: "Priya Sharma",
        age: 42,
        gender: "Female",
        location: "Samastipur, Bihar",
        condition: "Follow-up: Diabetes Management",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      time: "10:30 AM",
      date: "Today",
      duration: "30 min",
      type: "video",
      priority: "normal"
    },
    {
      id: 2,
      patient: {
        name: "Ramesh Yadav",
        age: 67,
        gender: "Male",
        location: "Sitamarhi, Bihar",
        condition: "Hypertension Consultation",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      time: "11:00 AM",
      date: "Today",
      duration: "20 min",
      type: "video",
      priority: "high"
    },
    {
      id: 3,
      patient: {
        name: "Geeta Devi",
        age: 55,
        gender: "Female",
        location: "Madhubani, Bihar",
        condition: "General Consultation",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      time: "2:00 PM",
      date: "Today",
      duration: "15 min",
      type: "phone",
      priority: "normal"
    }
  ]);

  const [pastConsultations] = useState([
    {
      id: 101,
      patient: "Santosh Kumar",
      date: "Oct 2, 2025",
      duration: "25 min",
      type: "video",
      rating: 5
    },
    {
      id: 102,
      patient: "Anita Singh",
      date: "Oct 1, 2025",
      duration: "18 min",
      type: "phone",
      rating: 5
    }
  ]);

  const statsData = [
    { 
      icon: <Calendar size={28} />, 
      value: 3, 
      label: "Scheduled Consultations", 
      sublabel: "Today", 
      type: "blue",
      decoration: styles.statsDecorationBlue
    },
    { 
      icon: <CheckCircle2 size={28} />, 
      value: 47, 
      label: "Completed Sessions", 
      sublabel: "This Week", 
      type: "green",
      decoration: styles.statsDecorationGreen
    },
    { 
      icon: <Users size={28} />, 
      value: 234, 
      label: "Registered Patients", 
      sublabel: "Active", 
      type: "purple",
      decoration: styles.statsDecorationPurple
    },
    { 
      icon: <Star size={28} />, 
      value: 4.9, 
      label: "Average Rating", 
      sublabel: "Rating", 
      type: "orange",
      decoration: styles.statsDecorationOrange
    },
  ];

  const aiInsights = [
    { type: 'info', text: 'Patient has diabetes history with regular monitoring' },
    { type: 'vital', text: 'Last BP reading: 138/86 mmHg (recorded 2 days ago)' },
    { type: 'medication', text: 'Medication adherence score: 85% (Good compliance)' },
    { type: 'translation', text: 'Real-time translation: Hindi ↔ English active' }
  ];

  // Call timer
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    setIsCallActive(true);
    setCallDuration(0);
  };

  const endConsultation = () => {
    setIsCallActive(false);
    setCallDuration(0);
    setSelectedConsultation(null);
  };

  // Video Call Interface Component
  const VideoCallInterface = () => (
    <div style={styles.videoInterface}>
      <div style={styles.videoContainer}>
        {/* Remote Video */}
        <div style={styles.remoteVideo}>
          {isVideoOn ? (
            <div style={styles.patientVideoInfo}>
              <div style={styles.patientAvatarLarge}>
                <Users size={70} />
              </div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', fontWeight: 800 }}>{selectedConsultation?.patient.name}</h3>
              <p style={{ color: colors.gray400, fontSize: '1rem' }}>{selectedConsultation?.patient.condition}</p>
            </div>
          ) : (
            <div style={styles.videoPlaceholder}>
              <VideoOff size={56} />
              <p style={{ fontSize: '1.125rem' }}>Camera is off</p>
            </div>
          )}
        </div>

        {/* Local Video */}
        <div style={styles.localVideo}>
          <div style={{ ...styles.localVideoVideo, background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontSize: '1.125rem', fontWeight: 700 }}>
            Dr. You
          </div>
          <span style={styles.pipLabel}>You</span>
        </div>

        {/* Call Info */}
        <div style={styles.callInfo}>
          <div style={styles.recordingIndicator}></div>
          <span style={styles.callTimer}>{formatDuration(callDuration)}</span>
        </div>

        {/* AI Panel */}
        {showAIPanel && (
          <div style={styles.aiPanel}>
            <div style={styles.aiPanelHeader}>
              <Activity size={24} style={{ color: colors.primary }} />
              <h4 style={styles.aiPanelTitle}>AI Real-time Assist</h4>
              <button 
                onClick={() => setShowAIPanel(false)}
                style={mergeStyles(
                  styles.aiPanelClose,
                  hoveredElement === 'ai-close' && { background: colors.gray200 }
                )}
                onMouseEnter={() => setHoveredElement('ai-close')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                ×
              </button>
            </div>
            
            <div style={styles.aiInsights}>
              {aiInsights.map((insight, index) => (
                <div key={index} style={mergeStyles(
                  styles.aiInsight,
                  hoveredElement === `insight-${index}` && { background: colors.primaryBg, borderColor: colors.primary }
                )}
                onMouseEnter={() => setHoveredElement(`insight-${index}`)}
                onMouseLeave={() => setHoveredElement(null)}
                >
                  <span style={styles.insightBullet}>•</span>
                  <span>{insight.text}</span>
                </div>
              ))}
            </div>

            <div style={styles.vitalSigns}>
              <h5 style={styles.vitalSignsTitle}>Live Vitals Monitor</h5>
              <div style={styles.vitalsGrid}>
                <div style={styles.vitalItem}>
                  <span style={styles.vitalLabel}>Heart Rate</span>
                  <span style={styles.vitalValue}>78 bpm</span>
                </div>
                <div style={styles.vitalItem}>
                  <span style={styles.vitalLabel}>Blood Pressure</span>
                  <span style={styles.vitalValue}>120/80</span>
                </div>
                <div style={styles.vitalItem}>
                  <span style={styles.vitalLabel}>O₂ Saturation</span>
                  <span style={styles.vitalValue}>98%</span>
                </div>
                <div style={styles.vitalItem}>
                  <span style={styles.vitalLabel}>Temperature</span>
                  <span style={styles.vitalValue}>98.6°F</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div style={styles.controlBar}>
        <div style={styles.controlsWrapper}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={mergeStyles(
              styles.controlBtn,
              isMuted && styles.controlBtnActive,
              hoveredElement === 'mute' && styles.controlBtnHover
            )}
            onMouseEnter={() => setHoveredElement('mute')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            style={mergeStyles(
              styles.controlBtn,
              !isVideoOn && styles.controlBtnActive,
              hoveredElement === 'video' && styles.controlBtnHover
            )}
            onMouseEnter={() => setHoveredElement('video')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            {isVideoOn ? <Video size={28} /> : <VideoOff size={28} />}
          </button>

          <button
            style={mergeStyles(
              styles.controlBtn,
              hoveredElement === 'share' && styles.controlBtnHover
            )}
            onMouseEnter={() => setHoveredElement('share')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <Share2 size={28} />
          </button>

          <button
            style={mergeStyles(
              styles.controlBtn,
              hoveredElement === 'chat' && styles.controlBtnHover
            )}
            onMouseEnter={() => setHoveredElement('chat')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <MessageSquare size={28} />
          </button>

          <button
            style={mergeStyles(
              styles.controlBtn,
              hoveredElement === 'files' && styles.controlBtnHover
            )}
            onMouseEnter={() => setHoveredElement('files')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <FileText size={28} />
          </button>

          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            style={mergeStyles(
              styles.controlBtn,
              hoveredElement === 'ai' && styles.controlBtnHover
            )}
            onMouseEnter={() => setHoveredElement('ai')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <Activity size={28} />
          </button>

          <button
            style={mergeStyles(
              styles.controlBtn,
              hoveredElement === 'settings' && styles.controlBtnHover
            )}
            onMouseEnter={() => setHoveredElement('settings')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <Settings size={28} />
          </button>

          <button
            onClick={endConsultation}
            style={mergeStyles(
              styles.controlBtnEnd,
              hoveredElement === 'end' && styles.controlBtnEndHover
            )}
            onMouseEnter={() => setHoveredElement('end')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <PhoneOff size={28} />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard Component
  const Dashboard = () => (
    <div>
      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {statsData.map((stat, index) => {
          const cardStyle = stat.type === 'blue' ? styles.statsCardBlue :
                           stat.type === 'green' ? styles.statsCardGreen :
                           stat.type === 'purple' ? styles.statsCardPurple :
                           styles.statsCardOrange;
          
          const iconStyle = stat.type === 'blue' ? styles.statsIconBlue :
                           stat.type === 'green' ? styles.statsIconGreen :
                           stat.type === 'purple' ? styles.statsIconPurple :
                           styles.statsIconOrange;
          
          const badgeStyle = stat.type === 'blue' ? styles.statsBadgeBlue :
                            stat.type === 'green' ? styles.statsBadgeGreen :
                            stat.type === 'purple' ? styles.statsBadgePurple :
                            styles.statsBadgeOrange;

          return (
            <div
              key={index}
              style={mergeStyles(
                styles.statsCard,
                cardStyle,
                hoveredElement === `stat-${index}` && styles.statsCardHover
              )}
              onMouseEnter={() => setHoveredElement(`stat-${index}`)}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div style={styles.statsHeader}>
                <div style={mergeStyles(styles.statsIconWrapper, iconStyle)}>
                  {stat.icon}
                </div>
                <span style={mergeStyles(styles.statsBadge, badgeStyle)}>{stat.sublabel}</span>
              </div>
              <h3 style={styles.statsValue}>{stat.value}</h3>
              <p style={styles.statsLabel}>{stat.label}</p>
              <div style={stat.decoration}></div>
            </div>
          );
        })}
      </div>

      {/* AI Alert */}
      <div style={styles.aiAlert}>
        <div style={styles.aiAlertGradient}></div>
        <div style={styles.aiAlertContent}>
          <div style={styles.aiIcon}>
            <Zap size={28} />
          </div>
          <div>
            <h3 style={styles.aiTitle}>AI Triage Assistant Active</h3>
            <p style={styles.aiText}>
              AI has pre-screened patients and flagged 2 high-priority cases requiring immediate attention. 
              Preliminary symptom analysis, medical history review, and multilingual translation capabilities 
              are available before consultation.
            </p>
            <div style={styles.aiTags}>
              <span style={styles.aiTag}>✨ Smart Scheduling</span>
              <span style={styles.aiTag}>🔍 Symptom Analysis</span>
              <span style={styles.aiTag}>🌐 Language Translation</span>
              <span style={styles.aiTag}>📊 Health Insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Consultations */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            <Clock style={styles.sectionIcon} />
            Today's Schedule
          </h2>
          <div style={styles.sectionActions}>
            <button 
              style={mergeStyles(
                styles.btnSecondary,
                hoveredElement === 'filter' && styles.btnSecondaryHover
              )}
              onMouseEnter={() => setHoveredElement('filter')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <Filter size={18} />
              Filter
            </button>
            <button 
              style={mergeStyles(
                styles.btnPrimary,
                hoveredElement === 'add' && styles.btnPrimaryHover
              )}
              onMouseEnter={() => setHoveredElement('add')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <Plus size={18} />
              Add Consultation
            </button>
          </div>
        </div>

        <div>
          {upcomingConsultations.map((consultation) => (
            <div
              key={consultation.id}
              style={mergeStyles(
                styles.consultationCard,
                consultation.priority === 'high' && styles.consultationCardPriority,
                hoveredElement === `card-${consultation.id}` && styles.consultationCardHover
              )}
              onMouseEnter={() => setHoveredElement(`card-${consultation.id}`)}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div style={styles.cardHeader}>
                <div style={styles.patientInfo}>
                  <div style={styles.patientAvatar}>
                    <img src={consultation.patient.avatar} alt={consultation.patient.name} style={styles.patientAvatarImg} />
                    {consultation.priority === 'high' && (
                      <div style={styles.priorityBadgeIcon}>
                        <AlertTriangle size={14} />
                      </div>
                    )}
                  </div>
                  <div style={styles.patientDetails}>
                    <div style={styles.nameRow}>
                      <h3 style={styles.patientName}>{consultation.patient.name}</h3>
                      {consultation.priority === 'high' && (
                        <span style={styles.priorityTag}>HIGH PRIORITY</span>
                      )}
                    </div>
                    <div style={styles.infoGrid}>
                      <span style={styles.infoItem}>
                        <Users size={14} />
                        {consultation.patient.age} • {consultation.patient.gender}
                      </span>
                      <span style={styles.infoItem}>
                        <MapPin size={14} />
                        {consultation.patient.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={consultation.type === 'video' ? styles.typeIconVideo : styles.typeIconPhone}>
                  {consultation.type === 'video' ? <Video size={22} /> : <Phone size={22} />}
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.conditionRow}>
                  <span style={styles.label}>Condition:</span>
                  <span style={styles.value}>{consultation.patient.condition}</span>
                </div>
                <div style={styles.timeRow}>
                  <Clock size={16} />
                  <span>{consultation.time} • {consultation.duration}</span>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <button
                  onClick={() => startConsultation(consultation)}
                  style={mergeStyles(
                    styles.btnStart,
                    hoveredElement === `start-${consultation.id}` && styles.btnPrimaryHover
                  )}
                  onMouseEnter={() => setHoveredElement(`start-${consultation.id}`)}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <Video size={18} />
                  Start Consultation
                </button>
                <button
                  style={mergeStyles(
                    styles.btnIcon,
                    hoveredElement === `records-${consultation.id}` && styles.btnIconHover
                  )}
                  onMouseEnter={() => setHoveredElement(`records-${consultation.id}`)}
                  onMouseLeave={() => setHoveredElement(null)}
                  title="View Medical Records"
                >
                  <FileText size={22} />
                </button>
                <button
                  style={mergeStyles(
                    styles.btnIcon,
                    hoveredElement === `chat-${consultation.id}` && styles.btnIconHover
                  )}
                  onMouseEnter={() => setHoveredElement(`chat-${consultation.id}`)}
                  onMouseLeave={() => setHoveredElement(null)}
                  title="Send Message"
                >
                  <MessageSquare size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Consultations */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            <FileText style={styles.sectionIcon} />
            Recent Consultations
          </h2>
          <button 
            style={mergeStyles(
              styles.btnSecondary,
              hoveredElement === 'view-all' && styles.btnSecondaryHover
            )}
            onMouseEnter={() => setHoveredElement('view-all')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            View All
            <ChevronRight size={18} />
          </button>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Patient Name</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pastConsultations.map((consultation) => (
                <tr
                  key={consultation.id}
                  style={mergeStyles(
                    styles.tr,
                    hoveredElement === `row-${consultation.id}` && styles.trHover
                  )}
                  onMouseEnter={() => setHoveredElement(`row-${consultation.id}`)}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <td style={styles.td}>
                    <div style={{ fontWeight: 700, color: colors.gray900 }}>{consultation.patient}</div>
                  </td>
                  <td style={styles.td}>{consultation.date}</td>
                  <td style={styles.td}>{consultation.duration}</td>
                  <td style={styles.td}>
                    <span style={consultation.type === 'video' ? mergeStyles(styles.badge, styles.badgeVideo) : mergeStyles(styles.badge, styles.badgePhone)}>
                      {consultation.type === 'video' ? <Video size={16} /> : <Phone size={16} />}
                      {consultation.type}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.rating}>
                      {[...Array(consultation.rating)].map((_, i) => (
                        <Star key={i} style={styles.starFilled} />
                      ))}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <button style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: colors.primary, 
                      fontWeight: 700, 
                      cursor: 'pointer', 
                      fontSize: '0.875rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = colors.primaryDark}
                    onMouseLeave={(e) => e.target.style.color = colors.primary}
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{globalStyles}</style>
      <div style={styles.app}>
        <div style={styles.appBackground}></div>
        
        {isCallActive ? (
          <VideoCallInterface />
        ) : (
          <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
              <div style={styles.headerGlow}></div>
              <div style={styles.headerLeft}>
                <div style={styles.logoContainer}>
                  <Video style={styles.logo} />
                </div>
                <div>
                  <h1 style={styles.title}>Telemedicine Platform</h1>
                  <p style={styles.subtitle}>Connecting healthcare to rural communities through innovation</p>
                </div>
              </div>

              <div style={styles.headerRight}>
                <div style={styles.searchContainer}>
                  <Search style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search patients, consultations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    style={mergeStyles(
                      styles.searchInput,
                      searchFocused && styles.searchInputFocused
                    )}
                  />
                </div>

                <button 
                  style={mergeStyles(
                    styles.iconBtn,
                    hoveredElement === 'notif' && styles.iconBtnHover
                  )}
                  onMouseEnter={() => setHoveredElement('notif')}
                  onMouseLeave={() => setHoveredElement(null)}
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="Notifications"
                >
                  <Bell size={22} />
                  {notifications.length > 0 && (
                    <span style={styles.notificationBadge}>{notifications.length}</span>
                  )}
                </button>

                <button 
                  style={mergeStyles(
                    styles.iconBtn,
                    hoveredElement === 'settings-btn' && styles.iconBtnHover
                  )}
                  onMouseEnter={() => setHoveredElement('settings-btn')}
                  onMouseLeave={() => setHoveredElement(null)}
                  title="Settings"
                >
                  <Settings size={22} />
                </button>

                <div 
                  style={mergeStyles(
                    styles.userAvatar,
                    hoveredElement === 'avatar' && { transform: 'scale(1.1) rotate(5deg)' }
                  )}
                  onMouseEnter={() => setHoveredElement('avatar')}
                  onMouseLeave={() => setHoveredElement(null)}
                  title="Profile"
                >
                  <img src="https://i.pravatar.cc/150?img=5" alt="Dr. User" style={styles.avatarImg} />
                </div>
              </div>
            </header>

            {/* Navigation */}
            <nav style={styles.nav}>
              {['dashboard', 'schedule', 'patients', 'analytics'].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  style={mergeStyles(
                    styles.navTab,
                    activeView === view && styles.navTabActive
                  )}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </nav>

            {/* Main Content */}
            <main>
              {loading ? (
                <div style={styles.loadingContainer}>
                  <Loader style={styles.spinner} />
                  <p style={styles.loadingText}>Loading your dashboard...</p>
                </div>
              ) : (
                <>
                  {activeView === 'dashboard' && <Dashboard />}
                  {activeView === 'schedule' && (
                    <div style={{ 
                      background: colors.white, 
                      borderRadius: '24px', 
                      padding: '4rem', 
                      textAlign: 'center', 
                      boxShadow: colors.shadowXl 
                    }}>
                      <Calendar size={64} style={{ color: colors.primary, margin: '0 auto 1rem' }} />
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: colors.gray900, marginBottom: '0.5rem' }}>
                        Schedule View
                      </h2>
                      <p style={{ color: colors.gray600, fontSize: '1rem' }}>Coming Soon</p>
                    </div>
                  )}
                  {activeView === 'patients' && (
                    <div style={{ 
                      background: colors.white, 
                      borderRadius: '24px', 
                      padding: '4rem', 
                      textAlign: 'center', 
                      boxShadow: colors.shadowXl 
                    }}>
                      <Users size={64} style={{ color: colors.purple, margin: '0 auto 1rem' }} />
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: colors.gray900, marginBottom: '0.5rem' }}>
                        Patients Directory
                      </h2>
                      <p style={{ color: colors.gray600, fontSize: '1rem' }}>Coming Soon</p>
                    </div>
                  )}
                  {activeView === 'analytics' && (
                    <div style={{ 
                      background: colors.white, 
                      borderRadius: '24px', 
                      padding: '4rem', 
                      textAlign: 'center', 
                      boxShadow: colors.shadowXl 
                    }}>
                      <BarChart3 size={64} style={{ color: colors.secondary, margin: '0 auto 1rem' }} />
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: colors.gray900, marginBottom: '0.5rem' }}>
                        Analytics Dashboard
                      </h2>
                      <p style={{ color: colors.gray600, fontSize: '1rem' }}>Coming Soon</p>
                    </div>
                  )}
                </>
              )}
            </main>

            {/* Footer */}
            <footer style={styles.footer}>
              <div 
                style={mergeStyles(
                  styles.footerCard,
                  hoveredElement === 'footer-1' && styles.footerCardHover
                )}
                onMouseEnter={() => setHoveredElement('footer-1')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div style={mergeStyles(styles.footerIcon, styles.footerIconGreen)}>
                  <Shield size={24} />
                </div>
                <div>
                  <h4 style={styles.footerTitle}>End-to-End Encryption</h4>
                  <p style={styles.footerText}>All video consultations are encrypted with industry-standard protocols for complete patient privacy and HIPAA compliance.</p>
                </div>
              </div>

              <div 
                style={mergeStyles(
                  styles.footerCard,
                  hoveredElement === 'footer-2' && styles.footerCardHover
                )}
                onMouseEnter={() => setHoveredElement('footer-2')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div style={mergeStyles(styles.footerIcon, styles.footerIconBlue)}>
                  <Zap size={24} />
                </div>
                <div>
                  <h4 style={styles.footerTitle}>AI-Powered Translation</h4>
                  <p style={styles.footerText}>Real-time AI translation in Hindi, Bengali, Tamil, Telugu, Marathi, and 10+ regional languages for seamless communication.</p>
                </div>
              </div>

              <div 
                style={mergeStyles(
                  styles.footerCard,
                  hoveredElement === 'footer-3' && styles.footerCardHover
                )}
                onMouseEnter={() => setHoveredElement('footer-3')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div style={mergeStyles(styles.footerIcon, styles.footerIconPurple)}>
                  <Activity size={24} />
                </div>
                <div>
                  <h4 style={styles.footerTitle}>Rural Connectivity</h4>
                  <p style={styles.footerText}>Optimized for low-bandwidth areas with adaptive streaming technology, ensuring quality healthcare reaches every corner.</p>
                </div>
              </div>
            </footer>
          </div>
        )}
      </div>
    </>
  );
}
