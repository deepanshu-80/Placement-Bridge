## Packages
framer-motion | Essential for the high-end premium animations and scroll effects required for the landing page
date-fns | Required for beautiful, human-readable date formatting on jobs and applications
lucide-react | Standard icon library for the interface
@hookform/resolvers | Required for seamless Zod integration with React Hook Form

## Notes
- Tailwind configuration must be updated with standard custom colors (primary, accent, background) using space-separated HSL values as defined in index.css.
- The UI is designed strictly for a dark mode, neon-futuristic aesthetic.
- The backend API endpoints are assumed to follow the exact structure defined in `@shared/routes` and `@shared/schema`.
- When accessing the dashboard, the application dynamically renders the appropriate view based on the user's role (`student` or `employer`).
