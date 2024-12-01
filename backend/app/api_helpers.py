import psycopg2
from psycopg2 import connect
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from app.globals import PERGAME_COLS, PER36_COLS, PER100_COLS, ADVANCED_COLS, PBP_COLS, ADJ_SHOOTING_COLS

DB_NAME = "testdb_big0"
USER = "brianpark"
PASSWORD = "123"
PORT = "5532"

def create_db():
    con = psycopg2.connect(
        database="postgres",
        user=USER,
        host="localhost",
        password=PASSWORD,
        port=PORT
    )
    print("Connecting to PostGres")
    dbname = DB_NAME
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()

    cur.execute(f"SELECT 1 FROM pg_database WHERE datname = '{dbname}'")
    exists = cur.fetchone()
    if not exists:
        cur.execute(f"CREATE DATABASE {dbname}")
    print(f"Database {dbname} is ready.")
    con.close()

def create_tables(year):
    print("Creating DB: ")
    con = psycopg2.connect(
        database=DB_NAME,
        user=USER,
        host="localhost",
        password="123",
        port=PORT
    )
    cur = con.cursor()

    # Create Per Game Table
    query1 =f"""
        CREATE TABLE IF NOT EXISTS pergame_{year}(
            pid INTEGER NOT NULL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            age INTEGER NOT NULL,
            team VARCHAR(50) NOT NULL,
            pos VARCHAR(50) NOT NULL,
            games_played INTEGER NOT NULL,
            games_started INTEGER NOT NULL,
            minutes DECIMAL,
            fg DECIMAL(4,1),
            fga DECIMAL(4,1),
            fgp DECIMAL(4,3),
            threep DECIMAL(4,1),
            threepa DECIMAL(4,1),
            threepp DECIMAL(4,3),
            twop DECIMAL(4,1),
            twopa DECIMAL(4,1),
            twopp DECIMAL(4,3),
            efg DECIMAL(4,3),
            ft DECIMAL(4,1),
            fta DECIMAL(4,1),
            ftp DECIMAL(4,3),
            orb DECIMAL(4,1),
            drb DECIMAL(4,1),
            trb DECIMAL(4,1),
            ast DECIMAL(4,1),
            stl DECIMAL(4,1),
            blk DECIMAL(4,1),
            tov DECIMAL(4,1),
            pf DECIMAL(4,1),
            pts DECIMAL(4,1)
        );
    """
    cur.execute(query1)
    # Create Per 36 Min Table
    query2 =f"""
        CREATE TABLE IF NOT EXISTS per36_{year}(
            pid INTEGER NOT NULL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            age INTEGER NOT NULL,
            team VARCHAR(50) NOT NULL,
            pos VARCHAR(50) NOT NULL,
            games_played INTEGER NOT NULL,
            games_started INTEGER NOT NULL,
            minutes DECIMAL,
            fg DECIMAL(4,1),
            fga DECIMAL(4,1),
            fgp DECIMAL(4,3),
            threep DECIMAL(4,1),
            threepa DECIMAL(4,1),
            threepp DECIMAL(4,3),
            twop DECIMAL(4,1),
            twopa DECIMAL(4,1),
            twopp DECIMAL(4,3),
            efg DECIMAL(4,3),
            ft DECIMAL(4,1),
            fta DECIMAL(4,1),
            ftp DECIMAL(4,3),
            orb DECIMAL(4,1),
            drb DECIMAL(4,1),
            trb DECIMAL(4,1),
            ast DECIMAL(4,1),
            stl DECIMAL(4,1),
            blk DECIMAL(4,1),
            tov DECIMAL(4,1),
            pf DECIMAL(4,1),
            pts DECIMAL(4,1)
        );
    """
    cur.execute(query2)

    # Create Per 100 Poss Table
    query3=f"""
        CREATE TABLE IF NOT EXISTS per100_{year}(
            pid INTEGER NOT NULL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            age INTEGER NOT NULL,
            team VARCHAR(50) NOT NULL,
            pos VARCHAR(50) NOT NULL,
            games_played INTEGER NOT NULL,
            games_started INTEGER NOT NULL,
            minutes DECIMAL,
            fg DECIMAL(4,1),
            fga DECIMAL(4,1),
            fgp DECIMAL(4,3),
            threep DECIMAL(4,1),
            threepa DECIMAL(4,1),
            threepp DECIMAL(4,3),
            twop DECIMAL(4,1),
            twopa DECIMAL(4,1),
            twopp DECIMAL(4,3),
            efg DECIMAL(4,3),
            ft DECIMAL(4,1),
            fta DECIMAL(4,1),
            ftp DECIMAL(4,3),
            orb DECIMAL(4,1),
            drb DECIMAL(4,1),
            trb DECIMAL(4,1),
            ast DECIMAL(4,1),
            stl DECIMAL(4,1),
            blk DECIMAL(4,1),
            tov DECIMAL(4,1),
            pf DECIMAL(4,1),
            pts DECIMAL(4,1),
            ortg INTEGER NOT NULL,
            drtg INTEGER NOT NULL
        );
    """
    cur.execute(query3)

    # Create Advanced Table
    query4=f"""
        CREATE TABLE IF NOT EXISTS advanced_{year}(
            pid INTEGER NOT NULL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            age INTEGER NOT NULL,
            team VARCHAR(50) NOT NULL,
            pos VARCHAR(50) NOT NULL,
            games_played INTEGER NOT NULL,
            games_started INTEGER NOT NULL,
            minutes INTEGER NOT NULL,
            per DECIMAL(5,1),
            ts DECIMAL(4,3),
            threepar DECIMAL(4,3),
            ftr DECIMAL(4,3),
            orbp DECIMAL(5,1),
            drbp DECIMAL(5,1),
            trbp DECIMAL(5,1),
            astp DECIMAL(5,1),
            stlp DECIMAL(5,1),
            blkp DECIMAL(5,1),
            tovp DECIMAL(5,1),
            usg DECIMAL(5,1),
            ows DECIMAL(5,1),
            dws DECIMAL(5,1),
            ws DECIMAL(5,1),
            wsfourtyeight DECIMAL(4,3),
            obpm DECIMAL(5,1),
            dbpm DECIMAL(5,1),
            bpm DECIMAL(5,1),
            vorp DECIMAL(5,1)
        );
    """
    cur.execute(query4)

    # Create Play-by_Play Table
    query5=f"""
        CREATE TABLE IF NOT EXISTS pbp_{year}(
            pid INTEGER NOT NULL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            age INTEGER NOT NULL,
            team VARCHAR(50) NOT NULL,
            pos VARCHAR(50) NOT NULL,
            games_played INTEGER NOT NULL,
            games_started INTEGER NOT NULL,
            minutes INTEGER NOT NULL,
            positionp_pg INTEGER,
            positionp_sg INTEGER,
            positionp_sf INTEGER,
            positionp_pf INTEGER,
            positionp_c INTEGER,
            oncourtper100 DECIMAL(5,1),
            onoffper100 DECIMAL(5,1),
            badpassto INTEGER,
            lostballto INTEGER,
            shootfoul_commit INTEGER,
            offensivefoul_commit INTEGER,
            shootfoul_drawn INTEGER,
            offensivefoul_drawn INTEGER,
            pga INTEGER,
            and1 INTEGER,
            blkd INTEGER
        );
    """
    cur.execute(query5)

    # Create Shooting Table
    query6=f"""
        CREATE TABLE IF NOT EXISTS shooting_{year}(
            pid INTEGER NOT NULL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            age INTEGER NOT NULL,
            team VARCHAR(50) NOT NULL,
            pos VARCHAR(50) NOT NULL,
            games_played INTEGER NOT NULL,
            games_started INTEGER NOT NULL,
            minutes INTEGER NOT NULL,
            fgp DECIMAL(4,3),
            avg_fg_dist DECIMAL(5,1),
            twop_shotdiet DECIMAL(4,3),
            zero_three_shotdiet DECIMAL(4,3),
            three_ten_shotdiet DECIMAL(4,3),
            ten_sixteen_shotdiet DECIMAL(4,3),
            sixteen_threep_shotdiet DECIMAL(4,3),
            threep_shotdiet DECIMAL(4,3),
            twop_p DECIMAL(4,3),
            zero_three_p DECIMAL(4,3),
            three_ten_p DECIMAL(4,3),
            ten_sixteen_p DECIMAL(4,3),
            sixteen_threep_p DECIMAL(4,3),
            threep_p DECIMAL(4,3),
            twop_assisted_p DECIMAL(4,3),
            threep_assisted_p DECIMAL(4,3),
            dunk_shotdiet DECIMAL(4,3),
            dunks INTEGER,
            cornerthreep_diet DECIMAL(4,3),
            cornerthreep_p DECIMAL(4,3),
            heave_attempt INTEGER,
            heave INTEGER
        );
    """
    cur.execute(query6)

    # Create Adjusted Shooting Table
    query7=f"""
        CREATE TABLE IF NOT EXISTS adj_shooting_{year}(
            pid INTEGER NOT NULL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            age INTEGER NOT NULL,
            team VARCHAR(50) NOT NULL,
            pos VARCHAR(50) NOT NULL,
            games_played INTEGER NOT NULL,
            games_started INTEGER NOT NULL,
            minutes INTEGER NOT NULL,
            fgp DECIMAL(4,3),
            twopp DECIMAL(4,3),
            threepp DECIMAL(4,3),
            efg DECIMAL(4,3),
            ftp DECIMAL(4,3),
            ts DECIMAL(4,3),
            ftr DECIMAL(4,3),
            threepar DECIMAL(4,3),
            fg_adj INTEGER,
            twop_adj INTEGER,
            threep_adj INTEGER,
            efg_adj INTEGER,
            ft_adj INTEGER,
            ts_adj INTEGER,
            ftr_adj INTEGER,
            threepar_adj INTEGER,
            fg_added DECIMAL(4,1),
            ts_added DECIMAL(4,1)
        );
    """
    cur.execute(query7)

    # Verify tables
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
    """)
    tables = cur.fetchall()
    print("Tables in the database:", tables)
    con.commit()
    cur.close()
    con.close()

# TODO: Fix, there's a problem with the years
def col_directory(col_name):
    column_map = {
        "pid": "ID",
        "name": "NAME",
        "age": "AGE",
        "team": "TEAM",
        "pos": "POS",
        "games_played": "GP",
        "games_started": "GS",
        "minutes": "MP",
        "fg": "FG",
        "fga": "FGA",
        "fgp": "FG%",
        "threep": "3PM",
        "threepa": "3PA",
        "threepp": "3P%",
        "twop": "2PM",
        "twopa": "2PA",
        "twopp": "2P%",
        "efg": "eFG%",
        "ft": "FTM",
        "fta": "FTA",
        "ftp": "FT%",
        "orb": "ORB",
        "drb": "DRB",
        "trb": "TRB",
        "ast": "AST",
        "stl": "STL",
        "blk": "BLK",
        "tov": "TO",
        "pf": "PF",
        "ortg": "ORTG",
        "drtg": "DRTG",
        "per": "PER",
        "ts": "TS%",
        "threepar": "3PAr",
        "ftr": "FTR",
        "orbp": "ORBD%",
        "drbp": "DRBD%",
        "trbp": "TRB%",
        "astp": "AST%",
        "stlp": "STL%",
        "blkp": "BLK%",
        "tovp": "TO%",
        "usg": "USG",
        "ows": "OWS",
        "dws": "DWS",
        "ws": "WS",
        "wsfourtyeight": "WS/48",
        "obpm": "OBPM",
        "dbpm": "DBPM",
        "bpm": "BPM",
        "vorp": "VORP",
        "positionp_pg": "PG%",
        "positionp_sg": "SG%",
        "positionp_sf": "SF%",
        "positionp_pf": "PF%",
        "positionp_c": "C%",
        "oncourtper100": "OnCourt/100",
        "onoffper100": "OnOff/100",
        "badpassto": "BadPass",
        "lostballto": "LostBall",
        "shootfoul_commit": "Shooting Fouls",
        "offensivefoul_commit": "Offensive Fouls",
        "shootfoul_drawn": "Shooting Fouls Drawn",
        "offensivefoul_drawn": "Offensive Fouls Drawn",
        "pga": "PGA",
        "and1": "And1",
        "blkd": "Blkd",
        "avg_fg_dist": "Dist.",
        "twop_shotdiet": "2PD",
        "zero_three_shotdiet": "0-3D",
        "three_ten_shotdiet": "3-10D",
        "ten_sixteen_shotdiet": "10-16D",
        "sixteen_threep_shotdiet": "16+D",
        "threep_shotdiet": "3PD",
        "zero_three_p": "0-3%",
        "three_ten_p": "3-10%",
        "ten_sixteen_p": "10-16%",
        "sixteen_threep_p": "16+%",
        "twop_assisted_p": "2Pa%",
        "threep_assisted_p": "3Pa%",
        "dunk_shotdiet": "DunkD",
        "dunks": "Dunks",
        "cornerthreep_diet": "%3PA",
        "cornerthreep_p": "Corner3PA",
        "heave_attempt": "Heave Att.",
        "heave": "Heave",
        "fg_adj": "FG%A",
        "twopp_adj": "2P%A",
        "threepp_adj": "3P%A",
        "efg_adj": "eFG%A",
        "ft_adj": "FT%A",
        "ts_adj": "TS%A",
        "ftr_adj": "FTR%A",
        "threepar_adj": "3PAr%A",
        "fg_added": "FG Add",
        "ts_added": "TS Add"
    }
    return column_map.get(col_name)


def safe_get(column):
    return column.text.strip() if column.text.strip() else None

def standardize_name(raw_name):
    name = raw_name.encode("latin1").decode("utf-8")
    return name

def generate_pid(name):
    pid = abs(hash(name)) % (2**31)
    return pid

def get_cols(table_name):
    table_prefix = table_name[:-5]
    if table_prefix == "pergame":
        return PERGAME_COLS
    elif table_prefix == "per36":
        return PER36_COLS
    elif table_prefix == "per100":
        return PER100_COLS
    elif table_prefix == "advanced":
        return ADVANCED_COLS
    elif table_prefix == "pbp":
        return PBP_COLS
    elif table_prefix == "shooting":
        return SHOOTING_COLS
    elif table_prefix == "adj_shooting":
        return ADJ_SHOOTING_COLS
    else:
        return {"error": "Table prefix not recognized"}

def connect_to_db(con):
    con=psycopg2.connect(
        database=DB_NAME,
        user=USER,
        host="localhost",
        password=PASSWORD,
        port=PORT,
        options="-c client_encoding=utf8"
    )
    return con

def add_to_pergame(columns, year):
    con = None
    con = connect_to_db(con)
    con.commit()
    cur = con.cursor()
    raw_name = safe_get(columns[0])
    name = standardize_name(raw_name)
    pid = generate_pid(name)
    age = int(safe_get(columns[1]) or 0)
    team = safe_get(columns[2])
    pos = safe_get(columns[3])
    g = int(safe_get(columns[4]) or 0) 
    gs = int(safe_get(columns[5]) or 0)  
    mp = float(safe_get(columns[6]) or 0) 
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
    query=f"INSERT INTO pergame_{year} (pid, name, age, team, pos, games_played, games_started, minutes, fg, fga, fgp, threep, threepa, threepp, twop, twopa, twopp, efg, ft, fta, ftp, orb, drb, trb, ast, stl, blk, tov, pf, pts) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cur.execute(query, (pid, name, age, team, pos, g, gs, mp, fg, fga, fgp, threep, threepa, threepp, twop, twopa, twopp, efg, ft, fta, ftp, orb, drb, trb, ast, stl, blk, tov, pf, pts))
    con.commit()
    cur.close()
    con.close()

def add_to_per36(columns, year):
    con = None
    con = connect_to_db(con)
    con.commit()
    cur = con.cursor()
    raw_name = safe_get(columns[0])
    name = standardize_name(raw_name)
    pid = generate_pid(name)
    age = int(safe_get(columns[1]) or 0)
    team = safe_get(columns[2])
    pos = safe_get(columns[3])
    g = int(safe_get(columns[4]) or 0) 
    gs = int(safe_get(columns[5]) or 0)  
    mp = float(safe_get(columns[6]) or 0) 
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
    query=f"INSERT INTO per36_{year} (pid, name, age, team, pos, games_played, games_started, minutes, fg, fga, fgp, threep, threepa, threepp, twop, twopa, twopp, efg, ft, fta, ftp, orb, drb, trb, ast, stl, blk, tov, pf, pts) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cur.execute(query, (pid, name, age, team, pos, g, gs, mp, fg, fga, fgp, threep, threepa, threepp, twop, twopa, twopp, efg, ft, fta, ftp, orb, drb, trb, ast, stl, blk, tov, pf, pts))
    con.commit()
    cur.close()
    con.close()

def add_to_per100(columns, year):
    con = None
    con = connect_to_db(con)
    con.commit()
    cur = con.cursor()
    raw_name = safe_get(columns[0])
    name = standardize_name(raw_name)
    pid = generate_pid(name)
    age = int(safe_get(columns[1]) or 0)
    team = safe_get(columns[2])
    pos = safe_get(columns[3])
    g = int(safe_get(columns[4]) or 0) 
    gs = int(safe_get(columns[5]) or 0)  
    mp = float(safe_get(columns[6]) or 0) 
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
    ortg = int(safe_get(columns[29]) or 0)
    drtg = int (safe_get(columns[30]) or 0)
    query=f"INSERT INTO per100_{year} (pid, name, age, team, pos, games_played, games_started, minutes, fg, fga, fgp, threep, threepa, threepp, twop, twopa, twopp, efg, ft, fta, ftp, orb, drb, trb, ast, stl, blk, tov, pf, pts, ortg, drtg) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cur.execute(query, (pid, name, age, team, pos, g, gs, mp, fg, fga, fgp, threep, threepa, threepp, twop, twopa, twopp, efg, ft, fta, ftp, orb, drb, trb, ast, stl, blk, tov, pf, pts, ortg, drtg))
    con.commit()
    cur.close()
    con.close()

def add_to_advanced(columns, year):
    con = None
    con = connect_to_db(con)
    con.commit()
    cur = con.cursor()
    raw_name = safe_get(columns[0])
    name = standardize_name(raw_name)
    pid = generate_pid(name)
    age = int(safe_get(columns[1]) or 0)
    team = safe_get(columns[2])
    pos = safe_get(columns[3])
    g = int(safe_get(columns[4]) or 0) 
    gs = int(safe_get(columns[5]) or 0)  
    mp = float(safe_get(columns[6]) or 0) 
    per = float(safe_get(columns[7]) or 0)
    ts = float(safe_get(columns[8]) or 0)
    threepar = float(safe_get(columns[9]) or 0)
    ftr = float(safe_get(columns[10]) or 0)
    orbp = float(safe_get(columns[11]) or 0)
    drbp = float(safe_get(columns[12]) or 0)
    trbp = float(safe_get(columns[13]) or 0)
    astp = float(safe_get(columns[14]) or 0)
    stlp = float(safe_get(columns[15]) or 0)
    blkp = float(safe_get(columns[16]) or 0)
    tovp = float(safe_get(columns[17]) or 0)
    usg = float(safe_get(columns[18]) or 0)
    ows = float(safe_get(columns[19]) or 0)
    dws = float(safe_get(columns[20]) or 0)
    ws = float(safe_get(columns[21]) or 0)
    wsfourtyeight = float(safe_get(columns[22]) or 0)
    obpm = float(safe_get(columns[23]) or 0)
    dbpm = float(safe_get(columns[24]) or 0)
    bpm = float(safe_get(columns[25]) or 0)
    vorp = float(safe_get(columns[26]) or 0)
    query=f"INSERT INTO advanced_{year} (pid, name, age, team, pos, games_played, games_started, minutes, per, ts, threepar, ftr, orbp, drbp, trbp, astp, stlp, blkp, tovp, usg, ows, dws, ws, wsfourtyeight, obpm, dbpm, bpm, vorp) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cur.execute(query, (pid, name, age, team, pos, g, gs, mp, per, ts, threepar, ftr, orbp, drbp, trbp, astp, stlp, blkp, tovp, usg, ows, dws, ws, wsfourtyeight, obpm, dbpm, bpm, vorp))
    con.commit()
    cur.close()
    con.close()

def add_to_pbp(columns, year):
    con = None
    con = connect_to_db(con)
    con.commit()
    cur = con.cursor()
    raw_name = safe_get(columns[0])
    name = standardize_name(raw_name)
    pid = generate_pid(name)
    age = int(safe_get(columns[1]) or 0)
    team = safe_get(columns[2])
    pos = safe_get(columns[3])
    g = int(safe_get(columns[4]) or 0) 
    gs = int(safe_get(columns[5]) or 0)  
    mp = float(safe_get(columns[6]) or 0) 
    positionp_pg = int(safe_get(columns[7]) or 0)
    positionp_sg = int(safe_get(columns[8]) or 0)
    positionp_sf = int(safe_get(columns[9]) or 0)
    positionp_pf = int(safe_get(columns[10]) or 0)
    positionp_c =  int(safe_get(columns[11]) or 0)
    oncourtper100 = float(safe_get(columns[12]) or 0)
    onoffper100 = float(safe_get(columns[13]) or 0)
    badpassto = int(safe_get(columns[14]) or 0)
    lostballto = int(safe_get(columns[15]) or 0)
    shootfoul_commit = int(safe_get(columns[16]) or 0)
    offensivefoul_commit = int(safe_get(columns[17]) or 0)
    shootfoul_drawn = int(safe_get(columns[18]) or 0)
    offensivefoul_drawn = int(safe_get(columns[19]) or 0)
    pga = int(safe_get(columns[20]) or 0)
    and1 = int(safe_get(columns[21]) or 0)
    blkd = int(safe_get(columns[22]) or 0)
    query=f"INSERT INTO pbp_{year} (pid, name, age, team, pos, games_played, games_started, minutes, positionp_pg, positionp_sg, positionp_sf, positionp_pf, positionp_c, oncourtper100, onoffper100, badpassto, lostballto, shootfoul_commit, offensivefoul_commit, shootfoul_drawn, offensivefoul_drawn, pga, and1, blkd) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cur.execute(query, (pid, name, age, team, pos, g, gs, mp, positionp_pg, positionp_sg, positionp_sf, positionp_pf, positionp_c, oncourtper100, onoffper100, badpassto, lostballto, shootfoul_commit, offensivefoul_commit, shootfoul_drawn, offensivefoul_drawn, pga, and1, blkd))
    con.commit()
    cur.close()
    con.close()

def add_to_shooting(columns, year):
    con = None
    con = connect_to_db(con)
    con.commit()
    cur = con.cursor()
    raw_name = safe_get(columns[0])
    name = standardize_name(raw_name)
    pid = generate_pid(name)
    age = int(safe_get(columns[1]) or 0)
    team = safe_get(columns[2])
    pos = safe_get(columns[3])
    g = int(safe_get(columns[4]) or 0) 
    gs = int(safe_get(columns[5]) or 0)  
    mp = float(safe_get(columns[6]) or 0) 
    fgp = float(safe_get(columns[7]) or 0)
    avg_fg_dist = float(safe_get(columns[8]) or 0)
    twop_shotdiet = float(safe_get(columns[9]) or 0)
    zero_three_shotdiet = float(safe_get(columns[10]) or 0)
    three_ten_shotdiet = float(safe_get(columns[11]) or 0)
    ten_sixteen_shotdiet = float(safe_get(columns[12]) or 0)
    sixteen_threep_shotdiet = float(safe_get(columns[13]) or 0)
    threep_shotdiet = float(safe_get(columns[14]) or 0)
    twop_p = float(safe_get(columns[15]) or 0)
    zero_three_p = float(safe_get(columns[16]) or 0)
    three_ten_p = float(safe_get(columns[17]) or 0)
    ten_sixteen_p = float(safe_get(columns[18]) or 0)
    sixteen_threep_p = float(safe_get(columns[19]) or 0)
    threep_p = float(safe_get(columns[20]) or 0)
    twop_assisted_p = float(safe_get(columns[21]) or 0)
    threep_assisted_p = float(safe_get(columns[22]) or 0)
    dunk_shotdiet = float(safe_get(columns[23]) or 0)
    dunks = int(safe_get(columns[24]) or 0)
    cornerthreep_diet = float(safe_get(columns[25]) or 0)
    cornerthreep_p = float(safe_get(columns[26]) or 0)
    heave_attempt = int(safe_get(columns[27]) or 0)
    heave = int(safe_get(columns[28]) or 0)
    query=f"INSERT INTO shooting_{year} (pid, name, age, team, pos, games_played, games_started, minutes, fgp, avg_fg_dist, twop_shotdiet, zero_three_shotdiet, three_ten_shotdiet, ten_sixteen_shotdiet, sixteen_threep_shotdiet, threep_shotdiet, twop_p, zero_three_p, three_ten_p, ten_sixteen_p, sixteen_threep_p, threep_p, twop_assisted_p, threep_assisted_p, dunk_shotdiet, dunks, cornerthreep_diet, cornerthreep_p, heave_attempt, heave) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cur.execute(query,     (pid, name, age, team, pos, g, gs, mp, fgp, avg_fg_dist, twop_shotdiet, zero_three_shotdiet, three_ten_shotdiet, ten_sixteen_shotdiet, sixteen_threep_shotdiet, threep_shotdiet, twop_p, zero_three_p, three_ten_p, ten_sixteen_p, sixteen_threep_p, threep_p, twop_assisted_p, threep_assisted_p, dunk_shotdiet, dunks, cornerthreep_diet, cornerthreep_p, heave_attempt, heave))
    con.commit()
    cur.close()
    con.close()

def add_to_adj_shooting(columns, year):
    con = None
    con = connect_to_db(con)
    con.commit()
    cur = con.cursor()
    raw_name = safe_get(columns[0])
    name = standardize_name(raw_name)
    pid = generate_pid(name)
    age = int(safe_get(columns[1]) or 0)
    team = safe_get(columns[2])
    pos = safe_get(columns[3])
    g = int(safe_get(columns[4]) or 0) 
    gs = int(safe_get(columns[5]) or 0)  
    mp = float(safe_get(columns[6]) or 0) 
    fgp = float(safe_get(columns[7]) or 0)
    twopp = float(safe_get(columns[8]) or 0)
    threepp = float(safe_get(columns[9]) or 0)
    efg= float(safe_get(columns[10]) or 0)
    ftp = float(safe_get(columns[11]) or 0)
    ts = float(safe_get(columns[12]) or 0)
    ftr = float(safe_get(columns[13]) or 0)
    threepar = float(safe_get(columns[14]) or 0)
    fg_adj = int(safe_get(columns[15]) or 0)
    twop_adj = int(safe_get(columns[16]) or 0)
    threep_adj = int(safe_get(columns[17]) or 0)
    efg_adj = int(safe_get(columns[18]) or 0)
    ft_adj = int(safe_get(columns[19]) or 0)
    ts_adj = int(safe_get(columns[20]) or 0)
    ftr_adj = int(safe_get(columns[21]) or 0)
    threepar_adj = int(safe_get(columns[22]) or 0)
    fg_added = float(safe_get(columns[23]) or 0)
    ts_added = float(safe_get(columns[24]) or 0)
    query=f"INSERT INTO adj_shooting_{year} (pid, name, age, team, pos, games_played, games_started, minutes, fgp, twopp, threepp, efg, ftp, ts, ftr, threepar, fg_adj, twop_adj, threep_adj, efg_adj, ft_adj, ts_adj, ftr_adj, threepar_adj, fg_added, ts_added) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cur.execute(query, (pid, name, age, team, pos, g, gs, mp, fgp, twopp, threepp, efg, ftp, ts, ftr, threepar, fg_adj, twop_adj, threep_adj, efg_adj, ft_adj, ts_adj, ftr_adj, threepar_adj, fg_added, ts_added))
    con.commit()
    cur.close()
    con.close()