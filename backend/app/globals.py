PERGAME_COLS = [
        "pid", "name", "age", "team", "pos", "games_played", "games_started", 
        "minutes", "fg", "fga", "fgp", "threep", "threepa", "threepp", 
        "twop", "twopa", "twopp", "efg", "ft", "fta", "ftp", "orb", 
        "drb", "trb", "ast", "stl", "blk", "tov", "pf", "pts"
]

PER36_COLS = [
        "pid", "name", "age", "team", "pos", "games_played", "games_started", 
        "minutes", "fg", "fga", "fgp", "threep", "threepa", "threepp", 
        "twop", "twopa", "twopp", "efg", "ft", "fta", "ftp", "orb", 
        "drb", "trb", "ast", "stl", "blk", "tov", "pf", "pts"
]

PER100_COLS = [
        "pid", "name", "age", "team", "pos", "games_played", "games_started", 
        "minutes", "fg", "fga", "fgp", "threep", "threepa", "threepp", 
        "twop", "twopa", "twopp", "efg", "ft", "fta", "ftp", "orb", 
        "drb", "trb", "ast", "stl", "blk", "tov", "pf", "pts", 
        "ortg", "drtg"
    ]

ADVANCED_COLS = [
        "pid", "name", "age", "team", "pos", "games_played", "games_started", 
        "minutes", "per", "ts", "threepar", "ftr", "orbp", "drbp", 
        "trbp", "astp", "stlp", "blkp", "tovp", "usg", "ows", "dws", 
        "ws", "wsfourtyeight", "obpm", "dbpm", "bpm", "vorp"
    ]

PBP_COLS = [
        "pid", "name", "age", "team", "pos", "games_played", "games_started", 
        "minutes", "positionp_pg", "positionp_sg", "positionp_sf", "positionp_pf", 
        "positionp_c", "oncourtper100", "onoffper100", "badpassto", "lostballto", 
        "shootfoul_commit", "offensivefoul_commit", "shootfoul_drawn", 
        "offensivefoul_drawn", "pga", "and1", "blkd"
    ]

SHOOTING_COLS = [
        "pid", "name", "age", "team", "pos", "games_played", "games_started", 
        "minutes", "fgp", "avg_fg_dist", "twop_shotdiet", "zero_three_shotdiet", 
        "three_ten_shotdiet", "ten_sixteen_shotdiet", "sixteen_threep_shotdiet", 
        "threep_shotdiet", "twop_p", "zero_three_p", "three_ten_p", 
        "ten_sixteen_p", "sixteen_threep_p", "threep_p", "twop_assisted_p", 
        "threep_assisted_p", "dunk_shotdiet", "dunks", "cornerthreep_diet", 
        "cornerthreep_p", "heave_attempt", "heave"
    ]

ADJ_SHOOTING_COLS = [
        "pid", "name", "age", "team", "pos", "games_played", "games_started", 
        "minutes", "fgp", "twopp", "threepp", "efg", "ftp", "ts", "ftr", 
        "threepar", "fg_adj", "twop_adj", "threep_adj", "efg_adj", "ft_adj", 
        "ts_adj", "ftr_adj", "threepar_adj", "fg_added", "ts_added"
    ]