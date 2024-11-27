import requests
from bs4 import BeautifulSoup
from api_helpers import add_to_db, create_db

def is_dupe(prev, curr):
    if (prev == curr):
        return True
    else:
        return False
    
def determine_table(name, columns):
    if (name == "Per Game"):
        add_to_db(columns)
        return ""
    elif (name == "Per 36 Min"):
        # add_to_per36_table(columns)
        return ""
    elif (name == "Per 100 Poss"):
        # add_to_per100_table(columns)
        return ""
    elif (name == "Advanced"):
        # add_to_advanced_table(columns)
        return ""
    elif (name == "Play-by-Play"):
        # add_to_pbp_table(columns)
        return ""
    elif (name == "Shooting"):
        # add_to_shooting_table(columns)
        return ""
    elif (name == "Adjusted Shooting"):
        # add_to_adjshooting_table(columns)
        return ""
    return ""

def scrape_page(content):
    soup = BeautifulSoup(content, 'lxml')
    table = soup.find('table', class_='stats_table')
    dupe_detector = ""
    for row in table.tbody.find_all('tr'):
        columns = row.find_all('td')
        if (columns != []):
            name = columns[0].text.strip()
            lgAvg = "League Average"
            if (name == dupe_detector): 
                continue 
            if (name ==  lgAvg):
                continue
            dupe_detector = name
            add_to_db(columns)
    return ""

def scrape_nba_data():
    root = "https://www.basketball-reference.com"
    website = f'{root}/leagues/NBA_2024_per_game.html'

    response = requests.get(website)
    content = response.text
    soup = BeautifulSoup(content, 'lxml')

    sections = soup.find_all('div', class_="filter")
    for link in sections[0].find_all('a', href=True):
        print("Href: ", link)
        result = requests.get(f'{root}/{link}')
        content = result.text
        # scrape_page(content)
        # soup = BeautifulSoup(content, 'lxml')
    
    table = soup.find('table', class_='stats_table')
    dupe_detector = ""
    create_db()
    for row in table.tbody.find_all('tr'):
        columns = row.find_all('td')
        if (columns != []):
            name = columns[0].text.strip()
            lgAvg = "League Average"
            if (name == dupe_detector): 
                continue 
            if (name ==  lgAvg):
                continue
            dupe_detector = name
            add_to_db(columns)
    return ""

if __name__ == "__main__":
    scrape_nba_data()