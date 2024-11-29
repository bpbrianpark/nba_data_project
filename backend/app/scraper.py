import requests
from bs4 import BeautifulSoup
from app.api_helpers import add_to_pergame, add_to_per36, add_to_per100, add_to_advanced, add_to_pbp, add_to_shooting, add_to_adj_shooting, create_db

# Given a data entry and the preceding data entry, check if it is valid
def isValidPlayer(prev, curr):
    if (prev == curr):
        return False
    elif (curr == "League Average"):
        return False
    else:
        return True

# Given a table and its columns, determine which table to add to
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

# Webscrape the given page
def scrape_page(table_name, result_url):
    response = requests.get(result_url)
    content = response.text
    soup = BeautifulSoup(content, 'lxml')
    table = soup.find('table', class_='stats_table')
    prev_player = ""
    for row in table.tbody.find_all('tr'):
        columns = row.find_all('td')
        if (columns != []):
            name = columns[0].text.strip()
            if (isValidPlayer(prev_player, name)):
                prev_player = name
                determine_table(table_name, columns)
            else:
                continue
    return

# Webscrape all the player data for a given year
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

# TODO:
# Webscrape all the player data for every year
def scrape_all_years():
    # Increment from 2003 to 2024
    return