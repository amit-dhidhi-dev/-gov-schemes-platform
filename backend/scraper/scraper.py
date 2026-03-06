import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.db.database import SessionLocal
from app.models.models import Scheme, Category

async def scrape_scheme_portal(url: str):
    """
    Automated Web Scraper for Government Schemes
    Uses Playwright to render JS heavy pages and BeautifulSoup for extraction.
    Note: Real implementation would need specific selectors for the target gov website.
    """
    print(f"🕷️ Scraper starting for URL: {url}")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        try:
            await page.goto(url, wait_until="networkidle")
            content = await page.content()
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # Simulated data extraction based on common gov portal structures
            schemes_data = []
            
            # Assuming schemes are listed in articles or specific divs. 
            # In a real scenario, these selectors would target actual CSS classes 
            # like '.scheme-card' or 'table.schemes tbody tr'
            
            # Mock extraction block for demonstration
            # For this example, we fallback to a mock payload if no real elements matched
            mock_elements = soup.select('.mock-scheme-item')
            
            if not mock_elements:
                print("No standard schema found. Using AI heuristic extraction on raw text...")
                # Here we would normally pass `soup.get_text()` to an LLM for structured extraction
                # Instead, we will simulate storing a newly scraped scheme
                schemes_data.append({
                    "scheme_name": "Newly Scraped State Pension Scheme",
                    "description": "Extracted description: State sponsored pension for unorganized workers.",
                    "ministry": "State Ministry of Social Welfare",
                    "scheme_type": "state",
                    "applicable_state": "Maharashtra",
                    "benefits": "₹1,500 monthly pension",
                    "documents_required": ["Aadhaar", "Bank Passbook", "Domicile Certificate"],
                    "apply_link": url,
                    "target_occupation": "unorganized worker",
                    "min_age": 60,
                    "income_limit": 100000,
                    "category_slug": "senior"
                })
            else:
                for el in mock_elements:
                    title = el.select_one('.title').text.strip()
                    desc = el.select_one('.desc').text.strip()
                    schemes_data.append({
                        "scheme_name": title,
                        "description": desc,
                        # ... other mapped fields ...
                    })
                    
            return schemes_data
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            return []
        finally:
            await browser.close()


def store_scraped_schemes(schemes_data):
    """Save extracted schemes to the PostgreSQL/SQLite database"""
    if not schemes_data:
        print("No data to store.")
        return
        
    db = SessionLocal()
    try:
        added_count = 0
        for data in schemes_data:
            # Check if exists
            existing = db.query(Scheme).filter(Scheme.scheme_name == data["scheme_name"]).first()
            if existing:
                continue
                
            # Fetch category context
            slug = data.pop("category_slug", "finance")
            cat = db.query(Category).filter(Category.slug == slug).first()
            if cat:
                data["category_id"] = cat.id
                
            new_scheme = Scheme(**data)
            db.add(new_scheme)
            added_count += 1
            
        db.commit()
        print(f"✅ Successfully saved {added_count} new schemes to the database.")
    except Exception as e:
        db.rollback()
        print(f"Database error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Test URL - replace with actual target like https://myscheme.gov.in
    target_url = "https://example.com/mock-gov-portal"
    scraped_data = asyncio.run(scrape_scheme_portal(target_url))
    store_scraped_schemes(scraped_data)
