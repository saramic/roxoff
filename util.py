from datetime import datetime, timedelta
"""
based on
    http://stackoverflow.com/questions/33415475/how-to-get-current-date-and-time-from-gps-unsegment-time-in-python
""
def leap(date):
    """
    Return the number of leap seconds since 6/Jan/1980
    :param date: datetime instance
    :return: leap seconds for the date (int)
    """
    if date < datetime(1981, 6, 30, 23, 59, 59):
        return 0
    leap_list = [(1981, 6, 30), (1982, 6, 30), (1983, 6, 30),
                 (1985, 6, 30), (1987, 12, 31), (1989, 12, 31),
                 (1990, 12, 31), (1992, 6, 30), (1993, 6, 30),
                 (1994, 6, 30), (1995, 12, 31), (1997, 6, 30),
                 (1998, 12, 31), (2005, 12, 31), (2008, 12, 31),
                 (2012, 6, 30), (2015, 6, 30)]
    leap_dates = list(map(lambda x: datetime(x[0], x[1], x[2], 23, 59, 59), leap_list))
    for j in range(len(leap_dates[:-1])):
        if leap_dates[j] < date < leap_dates[j + 1]:
            return j + 1
    return len(leap_dates)

def gps2utc(week, secs):
    """
    :param week: GPS week number, i.e. 1866
    :param secs: number of seconds since the beginning of `week`
    :return: datetime instance with UTC time
    """
    secs_in_week = 604800
    gps_epoch = datetime(1980, 1, 6, 0, 0, 0)
    date_before_leaps = gps_epoch + timedelta(seconds=week * secs_in_week + secs)
    return date_before_leaps - timedelta(seconds=leap(date_before_leaps))

