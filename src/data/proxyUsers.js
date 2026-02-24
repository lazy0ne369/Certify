/**
 * Proxy Users Data — FSAD-PS34
 * 4 users (3 regular, 1 admin). No backend — source of truth.
 */

export const proxyUsers = [
    {
        id: 'u1',
        name: 'Ashish Dohare',
        email: 'ashish@gmail.com',
        password: 'user123',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ashish',
        designation: 'Software Engineer',
        department: 'Engineering',
    },
    {
        id: 'u2',
        name: 'Sohan Kumar Sahu',
        email: 'sohan@gmail.com',
        password: 'user123',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sohan',
        designation: 'Data Analyst',
        department: 'Analytics',
    },
    {
        id: 'u3',
        name: 'T Deepak',
        email: 'deepak@gmail.com',
        password: 'user123',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepak',
        designation: 'DevOps Engineer',
        department: 'Infrastructure',
    },
    {
        id: 'u4',
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        designation: 'Platform Administrator',
        department: 'Management',
    },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
export const getUserById = (id) => proxyUsers.find((u) => u.id === id) ?? null;
export const getUserByEmail = (email) => proxyUsers.find((u) => u.email === email) ?? null;
