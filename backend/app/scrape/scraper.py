import requests
from bs4 import BeautifulSoup

def scrape_nba_data():
    root = "https://www.basketball-reference.com"
    website = f'{root}/leagues/NBA_2024_per_game.html'
    print("Getting website: ", website)

    response = requests.get(website)
    content = response.text
    soup = BeautifulSoup(content, 'lxml')

    print('Classes of each table:')
    for table in soup.find_all('table'):
        print(table.get('class'))
    
    table = soup.find('table', class_='stats_table')
    # Collecting Ddata
    print('Classes of each table:')
    link_list = list()
    dupe_detector = ""
    for row in table.tbody.find_all('tr'):

        columns = row.find_all('td')
        if (columns != []):
            name = columns[0].text.strip()
            if (name == dupe_detector): 
                continue 
            dupe_detector = name
            hreflink = columns[0].find('a', href=True)
            link_list.append(hreflink)
            print(hreflink)
    return link_list

if __name__ == "__main__":
    links = scrape_nba_data()
    print("Scraped Links:", links.prettify())
