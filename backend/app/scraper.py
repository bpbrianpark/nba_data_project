import requests
from bs4 import BeautifulSoup
from app.api_helpers import add_to_pergame, add_to_per36, add_to_per100, add_to_advanced, add_to_pbp, add_to_shooting, add_to_adj_shooting, create_db

def is_dupe(prev, curr):
    if (prev == curr):
        return True
    else:
        return False
    
def determine_table(name, columns):
    if (name == "Per Game"):
        add_to_pergame(columns)
        return
    elif (name == "Per 36 Min"):
        add_to_per36(columns)
        return
    elif (name == "Per 100 Poss"):
        add_to_per100(columns)
        return
    elif (name == "Advanced"):
        add_to_advanced(columns)
        return
    elif (name == "Play-by-Play"):
        add_to_pbp(columns)
        return
    elif (name == "Shooting"):
        add_to_shooting(columns)
        return
    elif (name == "Adjusted Shooting"):
        add_to_adj_shooting(columns)
        return
    else:
        return

def scrape_page(table_name, result_url):
    response = requests.get(result_url)
    content = response.text
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
            determine_table(table_name, columns)
    return

def scrape_year_data():
    # Establish the root website (Basketball Reference)
    root = "https://www.basketball-reference.com"
    website = f'{root}/leagues/NBA_2024_per_game.html'

    # Make a request to the website to get the page content
    response = requests.get(website)
    content = response.text
    soup = BeautifulSoup(content, 'lxml')
    
    # Find all the sections on the page (ex. Per Game, Per 36, Per 100 Possessions)
    sections = soup.find_all('div', class_="filter")

    # Scrape through each of these tables
    for link in sections[0].find_all('a', href=True):
        table_name = link.text.strip()
        href = link['href'] 
        result_url = f'{root}{href}' 
        scrape_page(table_name, result_url)
    return ""

def scrape_all_years():
    return