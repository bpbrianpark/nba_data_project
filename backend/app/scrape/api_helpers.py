import psycopg2

from psycopg2 import connect
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# con = None

def create_db():
    con = None
    con=psycopg2.connect(
        database="postgres",
        user="brianpark",
        host="localhost",
        password="123",
        port="5532"
    )
    dbname = "bbal_db_tester_1"
        
    # autocommit ends transaction after every query
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    cur.execute('CREATE DATABASE ' + dbname)
    cur.execute("""CREATE TABLE players2024(
                name VARCHAR(50) NOT NULL,
                age INTEGER NOT NULL,
                team VARCHAR(50) NOT NULL,
                pos VARCHAR(50) NOT NULL,
                gamesPlayed INTEGER NOT NULL,
                gamesStarted INTEGER NOT NULL,
                minutes DECIMAL,
                fg DECIMAL(4,2),
                fga DECIMAL(4,2),
                fgp DECIMAL(4,3),
                threep DECIMAL(4,2),
                threepa DECIMAL(4,2),
                threepp DECIMAL(4,3),
                twop DECIMAL(4,2),
                twopa DECIMAL(4,2),
                twopp DECIMAL(4,3),
                efg DECIMAL(4,3),
                ft DECIMAL(4,2),
                fta DECIMAL(4,2),
                ftp DECIMAL(4,3),
                orb DECIMAL(4,2),
                drb DECIMAL(4,2),
                trb DECIMAL(4,2),
                ast DECIMAL(4,2),
                stl DECIMAL(4,2),
                blk DECIMAL(4,2),
                tov DECIMAL(4,2),
                pf DECIMAL(4,2),
                pts DECIMAL(4, 2));
                """)
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
    """)
    tables = cur.fetchall()
    print("Tables in the database:", tables)
    con.commit()

def add_to_db(columns):
    con = None
    con=psycopg2.connect(
        database="postgres",
        user="brianpark",
        host="localhost",
        password="123",
        port="5532"
    )
    con.commit()
    cur = con.cursor()

    def safe_get(column):
        return column.text.strip() if column.text.strip() else None
    
    name = safe_get(columns[0])
    age = int(safe_get(columns[1]) or 0)  # Default age to 0 if missing
    team = safe_get(columns[2])
    pos = safe_get(columns[3])
    g = int(safe_get(columns[4]) or 0)  # Default games played to 0
    gs = int(safe_get(columns[5]) or 0)  # Default games started to 0
    mp = float(safe_get(columns[6]) or 0)  # Default minutes to 0
    fg = float(safe_get(columns[7]) or 0)
    fga = float(safe_get(columns[8]) or 0)
    fgp = float(safe_get(columns[9]) or 0)
    threep = float(safe_get(columns[10]) or 0)
    threepa = float(safe_get(columns[11]) or 0)
    threepp = float(safe_get(columns[12]) or 0)
    twop = float(safe_get(columns[13]) or 0)
    twopa = float(safe_get(columns[14]) or 0)
    twopp = float(safe_get(columns[15]) or 0)
    efg = float(safe_get(columns[16]) or 0)
    ft = float(safe_get(columns[17]) or 0)
    fta = float(safe_get(columns[18]) or 0)
    ftp = float(safe_get(columns[19]) or 0)
    orb = float(safe_get(columns[20]) or 0)
    drb = float(safe_get(columns[21]) or 0)
    trb = float(safe_get(columns[22]) or 0)
    ast = float(safe_get(columns[23]) or 0)
    stl = float(safe_get(columns[24]) or 0)
    blk = float(safe_get(columns[25]) or 0)
    tov = float(safe_get(columns[26]) or 0)
    pf = float(safe_get(columns[27]) or 0)
    pts = float(safe_get(columns[28]) or 0)
    cur.execute(
    "INSERT INTO players2024 (name, age, team, pos, gamesPlayed, gamesStarted, minutes, fg, fga, fgp, threep, threepa, threepp, twop, twopa, twopp, efg, ft, fta, ftp, orb, drb, trb, ast, stl, blk, tov, pf, pts) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
    (name, age, team, pos, g, gs, mp, fg, fga, fgp, threep, threepa, threepp, twop, twopa, twopp, efg, ft, fta, ftp, orb, drb, trb, ast, stl, blk, tov, pf, pts)
    )
    con.commit()
    cur.close()
    con.commit()
    con.close()
    
# don't forget to commit to make changes persistent 
def close_db():
    con.commit()
    con.close()