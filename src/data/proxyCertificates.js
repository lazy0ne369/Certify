/**
 * Proxy Certificates Data — FSAD-PS34
 * 9 certificates: 3 per user (1 active · 1 expiring_soon · 1 expired)
 * No backend — source of truth.
 *
 * Status values:  'active' | 'expiring_soon' | 'expired'
 * expiring_soon   = expires within 30 days of today (2026-02-24)
 */

export const STATUS = {
    ACTIVE: 'active',
    EXPIRING_SOON: 'expiring_soon',
    EXPIRED: 'expired',
};

export const proxyCertificates = [
    // ─── Ashish Dohare (u1) ────────────────────────────────────────────────────
    {
        id: 'c1',
        userId: 'u1',
        title: 'AWS Certified Solutions Architect – Associate',
        organization: 'Amazon Web Services',
        issueDate: '2024-08-10',
        expiryDate: '2027-08-10',
        credentialId: 'AWS-SAA-2024-0810',
        category: 'Cloud',
        status: STATUS.ACTIVE,
        certificateUrl: 'https://aws.amazon.com/verification',
        badgeUrl: 'https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png',
        description:
            'Validates expertise in designing distributed, scalable systems on AWS ' +
            'covering compute, storage, networking, and security best practices.',
    },
    {
        id: 'c2',
        userId: 'u1',
        title: 'Meta React Developer Certification',
        organization: 'Meta',
        issueDate: '2024-03-15',
        expiryDate: '2026-03-10',           // expiring in ~14 days → expiring_soon
        credentialId: 'META-RD-2024-0315',
        category: 'Frontend',
        status: STATUS.EXPIRING_SOON,
        certificateUrl: 'https://coursera.org/verify/meta-react',
        badgeUrl: 'https://images.credly.com/size/340x340/images/e91ed0b0-842b-417f-8d2f-b07535febdda/image.png',
        description:
            'Demonstrates proficiency in building modern React applications using ' +
            'hooks, context, state management, and component-based architecture.',
    },
    {
        id: 'c3',
        userId: 'u1',
        title: 'Google Cloud Professional Cloud Architect',
        organization: 'Google Cloud',
        issueDate: '2022-11-20',
        expiryDate: '2024-11-20',           // expired ~3 months ago
        credentialId: 'GCP-PCA-2022-1120',
        category: 'Cloud',
        status: STATUS.EXPIRED,
        certificateUrl: 'https://cloud.google.com/certification',
        badgeUrl: 'https://images.credly.com/size/340x340/images/71c579e0-d5f1-4d2e-9975-f9d4efba68cd/image.png',
        description:
            'Validates ability to design, develop, and manage robust, scalable, ' +
            'and highly available solutions on Google Cloud Platform.',
    },

    // ─── Sohan Kumar Sahu (u2) ───────────────────────────────────────────────
    {
        id: 'c4',
        userId: 'u2',
        title: 'Tableau Desktop Specialist',
        organization: 'Tableau (Salesforce)',
        issueDate: '2025-05-18',
        expiryDate: '2028-05-18',
        credentialId: 'TAB-DS-2025-0518',
        category: 'Data',
        status: STATUS.ACTIVE,
        certificateUrl: 'https://www.credly.com/badges/tableau',
        badgeUrl: 'https://images.credly.com/size/340x340/images/0f3f34db-c5c4-40de-8ead-c20a5f826b92/image.png',
        description:
            'Demonstrates foundational skills in Tableau for data visualization, ' +
            'dashboard design, and publishing interactive reports.',
    },
    {
        id: 'c5',
        userId: 'u2',
        title: 'Microsoft Power BI Data Analyst Associate',
        organization: 'Microsoft',
        issueDate: '2024-04-01',
        expiryDate: '2026-03-08',           // expiring in ~12 days → expiring_soon
        credentialId: 'MS-PBI-2024-0401',
        category: 'Data',
        status: STATUS.EXPIRING_SOON,
        certificateUrl: 'https://learn.microsoft.com/credentials',
        badgeUrl: 'https://images.credly.com/size/340x340/images/7e0db09d-e028-4dcd-8e79-c63a7e8bc5e0/image.png',
        description:
            'Validates skills in transforming raw data into actionable insights using ' +
            'Power BI, including DAX, Power Query, and report publishing.',
    },
    {
        id: 'c6',
        userId: 'u2',
        title: 'IBM Data Science Professional Certificate',
        organization: 'IBM',
        issueDate: '2022-07-14',
        expiryDate: '2024-07-14',           // expired ~7 months ago
        credentialId: 'IBM-DS-2022-0714',
        category: 'Data',
        status: STATUS.EXPIRED,
        certificateUrl: 'https://coursera.org/verify/ibm-data-science',
        badgeUrl: 'https://images.credly.com/size/340x340/images/fa39f4f0-174a-4791-a6d4-90c4e8e78523/image.png',
        description:
            'Comprehensive program covering Python, SQL, data visualization, machine ' +
            'learning, and applied data science with real-world projects.',
    },

    // ─── T Deepak (u3) ────────────────────────────────────────────────────────
    {
        id: 'c7',
        userId: 'u3',
        title: 'Certified Kubernetes Administrator (CKA)',
        organization: 'CNCF / Linux Foundation',
        issueDate: '2025-09-05',
        expiryDate: '2028-09-05',
        credentialId: 'CKA-2025-0905',
        category: 'DevOps',
        status: STATUS.ACTIVE,
        certificateUrl: 'https://training.linuxfoundation.org/certification/cka',
        badgeUrl: 'https://images.credly.com/size/340x340/images/8b8ed108-e77d-4396-ac59-2504583b9d54/image.png',
        description:
            'Validates skills required to operate, configure, and troubleshoot Kubernetes ' +
            'clusters in production environments.',
    },
    {
        id: 'c8',
        userId: 'u3',
        title: 'Docker Certified Associate (DCA)',
        organization: 'Docker Inc.',
        issueDate: '2024-06-20',
        expiryDate: '2026-03-15',           // expiring in ~19 days → expiring_soon
        credentialId: 'DCA-2024-0620',
        category: 'DevOps',
        status: STATUS.EXPIRING_SOON,
        certificateUrl: 'https://www.docker.com/certification',
        badgeUrl: 'https://images.credly.com/size/340x340/images/08216781-93cb-4ba1-8110-8eb3401fa8ce/image.png',
        description:
            'Proves expertise in containerization using Docker, including image management, ' +
            'networking, security, and orchestration with Docker Swarm.',
    },
    {
        id: 'c9',
        userId: 'u3',
        title: 'HashiCorp Certified: Terraform Associate',
        organization: 'HashiCorp',
        issueDate: '2022-03-30',
        expiryDate: '2024-03-30',           // expired ~11 months ago
        credentialId: 'HCP-TF-2022-0330',
        category: 'DevOps',
        status: STATUS.EXPIRED,
        certificateUrl: 'https://www.credly.com/badges/hashicorp-terraform',
        badgeUrl: 'https://images.credly.com/size/340x340/images/99289602-861e-4929-8277-773e63a2fa6f/image.png',
        description:
            'Validates understanding of Terraform concepts for infrastructure as code, ' +
            'including modules, state management, provisioners, and workspaces.',
    },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
export const getCertById = (id) => proxyCertificates.find((c) => c.id === id) ?? null;
export const getCertsByUser = (userId) => proxyCertificates.filter((c) => c.userId === userId);
export const getCertsByStatus = (status) => proxyCertificates.filter((c) => c.status === status);
export const getCertsByCategory = (cat) => proxyCertificates.filter((c) => c.category === cat);
