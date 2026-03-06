import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from scraper.advanced_scraper import run_scraping_pipeline

logger = logging.getLogger("scheduler")
logger.setLevel(logging.INFO)

scheduler = AsyncIOScheduler()

async def scheduled_scraping_job():
    """Wrapper function to log and execute the scraping job"""
    logger.info("⏱️ [CRON JOB] Triggering automated scraping engine...")
    try:
        inserted = await run_scraping_pipeline()
        logger.info(f"⏱️ [CRON JOB] Scraping complete. Inserted {inserted} items.")
    except Exception as e:
        logger.error(f"⏱️ [CRON JOB] Scraping failed: {e}")

def start_scheduler():
    """
    Configures and starts the background job scheduler.
    """
    # For production, we might run this every night at 2:00 AM using CronTrigger
    # scheduler.add_job(scheduled_scraping_job, CronTrigger(hour=2, minute=0))
    
    # Run every 3 days to keep the database fully updated without overloading gov servers
    scheduler.add_job(
        scheduled_scraping_job, 
        IntervalTrigger(days=3), 
        id="scraping_engine_cron", 
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("⏰ Background Scheduler Started. The Advanced Scraping Engine will run automatically every 3 days.")

def stop_scheduler():
    """Gracefully shuts down the scheduler"""
    scheduler.shutdown()
    logger.info("⏰ Background Scheduler Stopped.")
