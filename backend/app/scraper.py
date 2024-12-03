import requests
from bs4 import BeautifulSoup
from app.api_helpers import add_to_pergame, add_to_per36, add_to_per100, add_to_advanced, add_to_pbp, add_to_shooting, add_to_adj_shooting, create_db, create_tables

# Given a data entry and the preceding data entry, check if it is valid
def isValidPlayer(prev, curr):
    if (prev == curr):
        return False
    elif (curr == "League Average"):
        return False
    else:
        return True

# Given a table and its columns, determine which table to add to
def determine_table(name, columns, year):
    if (name == "Per Game"):
        add_to_pergame(columns, year)
        return
    elif (name == "Per 36 Min"):
        add_to_per36(columns, year)
        return
    elif (name == "Per 100 Poss"):
        add_to_per100(columns, year)
        return
    elif (name == "Advanced"):
        add_to_advanced(columns, year)
        return
    elif (name == "Play-by-Play"):
        add_to_pbp(columns, year)
        return
    elif (name == "Shooting"):
        add_to_shooting(columns, year)
        return
    elif (name == "Adjusted Shooting"):
        add_to_adj_shooting(columns, year)
        return
    else:
        return

# Webscrape the given page
def scrape_page(table_name, result_url, year):
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
                determine_table(table_name, columns, year)
            else:
                continue
    return

# Webscrape all the player data for a given year
def scrape_year_data(year):
    # Establish the root website (Basketball Reference)
    root = "https://www.basketball-reference.com"
    website = f'{root}/leagues/NBA_{year}_per_game.html'

    # Make a request to the website to get the page content
    response = requests.get(website)
    content = response.text
    soup = BeautifulSoup(content, 'lxml')
    
    # Find all the sections on the page (ex. Per Game, Per 36, Per 100 Possessions)
    sections = soup.find_all('div', class_="filter")
    create_tables(year)
    # Scrape through each of these tables
    for link in sections[0].find_all('a', href=True):
        table_name = link.text.strip()
        href = link['href'] 
        result_url = f'{root}{href}' 
        scrape_page(table_name, result_url, year)
    return ""

# TODO: Adjust the range to be 10
# Webscrape all the player data for every year
def scrape_all_years():
    start_year = 2024
    for x in range(3):
        curr_year = start_year - x
        scrape_year_data(curr_year)
    return

if __name__ == "__main__":
    create_db()
    scrape_all_years()