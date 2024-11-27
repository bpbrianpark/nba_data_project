import requests
from bs4 import BeautifulSoup
from api_helpers import add_to_db, create_db

def scrape_nba_data():
    root = "https://www.basketball-reference.com"
    website = f'{root}/leagues/NBA_2024_per_game.html'

    response = requests.get(website)
    content = response.text
    soup = BeautifulSoup(content, 'lxml')

    print('Classes of each table:')
    for table in soup.find_all('table'):
        print(table.get('class'))
    
    table = soup.find('table', class_='stats_table')
    link_list = list()
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
            hreflink = columns[0].find('a', href=True)
            add_to_db(columns)
            # link_list.append(hreflink)
            # print(hreflink)
    return ""

if __name__ == "__main__":
    scrape_nba_data()