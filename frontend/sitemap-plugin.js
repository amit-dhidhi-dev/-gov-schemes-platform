import fs from 'fs';
import path from 'path';

/**
 * Custom Vite Plugin to generate a dynamic sitemap at build time.
 * Vercel serves the output of the 'dist' folder.
 * This script will fetch the latest sitemap from the Python backend
 * and save it directly into the frontend's dist directory so Google finds it at the root.
 */
export default function generateSitemapPlugin() {
    return {
        name: 'generate-sitemap',
        async closeBundle() {
            // Find the backend URL from env, or use local fallback
            const apiUrl = process.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const frontendUrl = process.env.VITE_FRONTEND_URL || 'https://yojanamitra-tau.vercel.app';

            console.log(`\n🌍 [Sitemap Generator] Fetching latest schemes from: ${apiUrl}`);

            try {
                // Fetch all schemes dynamically from the backend for the sitemap
                const response = await fetch(`${apiUrl}/api/schemes/?limit=5000`);
                if (!response.ok) throw new Error('Failed to fetch schemes for sitemap');

                const data = await response.json();
                const schemes = data.items || [];

                let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
                xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

                // 1. Static Routes
                const staticRoutes = ['/', '/schemes', '/eligibility', '/chatbot', '/login', '/register'];
                staticRoutes.forEach(route => {
                    xml += `  <url>\n    <loc>${frontendUrl}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
                });

                // 2. Dynamic Scheme Routes
                schemes.forEach(scheme => {
                    // Use current date if last_updated is missing
                    const modDate = scheme.last_updated ? scheme.last_updated.split('T')[0] : new Date().toISOString().split('T')[0];
                    xml += `  <url>\n    <loc>${frontendUrl}/scheme/${scheme.id}</loc>\n    <lastmod>${modDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
                });

                xml += '</urlset>';

                // Ensure dist directory exists (Vite creates it, but safe check)
                const distPath = path.resolve(process.cwd(), 'dist');
                if (!fs.existsSync(distPath)) {
                    fs.mkdirSync(distPath, { recursive: true });
                }

                // Write the sitemap.xml to the dist folder
                fs.writeFileSync(path.join(distPath, 'sitemap.xml'), xml);
                console.log(`✅ [Sitemap Generator] Successfully generated sitemap.xml in /dist with ${schemes.length + staticRoutes.length} URLs!`);

            } catch (error) {
                console.error('❌ [Sitemap Generator] Error building sitemap:', error.message);
                // Do not crash the build, just skip sitemap if backend is asleep
            }
        }
    };
}
