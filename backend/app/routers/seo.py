from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Scheme
from datetime import datetime

router = APIRouter(tags=["SEO"])

@router.get("/sitemap.xml")
def get_sitemap(db: Session = Depends(get_db)):
    """
    Dynamically generates an XML sitemap for search engine crawlers.
    Lists all schemes with their relative URLs.
    """
    schemes = db.query(Scheme).all()
    
    # Base URL of the frontend - in production this would be the actual domain
    base_url = "http://localhost:5173"
    
    # Start XML string
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Add static pages
    static_pages = ["/", "/schemes", "/eligibility", "/chatbot", "/login", "/register"]
    for page in static_pages:
        xml_content += f'  <url>\n    <loc>{base_url}{page}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n'
    
    # Add dynamic scheme pages
    for scheme in schemes:
        lastmod = scheme.last_updated.strftime("%Y-%m-%d") if scheme.last_updated else datetime.now().strftime("%Y-%m-%d")
        xml_content += f'  <url>\n    <loc>{base_url}/scheme/{scheme.id}</loc>\n    <lastmod>{lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n'
    
    xml_content += '</urlset>'
    
    return Response(content=xml_content, media_type="application/xml")
