from datetime import datetime, timedelta
import pytz

def get_date(after_days=0, date_format='%Y-%m-%d'):
    return (datetime.now(pytz.timezone("America/New_York")) + timedelta(days=after_days)).strftime(date_format)
