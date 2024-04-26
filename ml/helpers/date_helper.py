from datetime import datetime, timedelta

def get_date(after_days=0, date_format='%Y-%m-%d'):
    return (datetime.today() + timedelta(days=after_days)).strftime(date_format)
