/**
 * Formats a user's role for display
 */
export const formatRole = (role) =>
    role === 'admin' ? 'Administrator' : 'User';

/**
 * Get initials from a full name
 */
export const getInitials = (name = '') =>
    name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

/**
 * Truncate text to a max length
 */
export const truncate = (str, max = 60) =>
    str && str.length > max ? `${str.slice(0, max)}…` : str;

/**
 * Generate a consistent avatar background color from a string
 */
const COLORS = [
    'bg-indigo-500', 'bg-violet-500', 'bg-sky-500',
    'bg-emerald-500', 'bg-rose-500', 'bg-amber-500',
];
export const avatarColor = (str = '') => {
    const idx = str.charCodeAt(0) % COLORS.length;
    return COLORS[idx];
};
