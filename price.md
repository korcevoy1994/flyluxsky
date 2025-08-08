import pandas as pd

# Определим возможные регионы
regions = [
    "USA", "Europe", "Middle East", "Africa", 
    "Asia", "India/Japan", "Australia", "Oceania"
]

# Определим примерные диапазоны цен для перелетов между регионами
# (Round-trip базовые значения без учета колебаний)
routes_data = []

# Функция для добавления маршрута
def add_route(from_region, to_region, min_price, max_price, fluctuation_percent):
    routes_data.append({
        "From": from_region,
        "To": to_region,
        "Type": "International" if from_region != to_region else "Domestic",
        "MinPrice (Round-trip)": min_price,
        "MaxPrice (Round-trip)": max_price,
        "Fluctuation ±%": fluctuation_percent,
        "One-way Price": f"½ of final",
        "Multi-city Price": f"×1.5 of final"
    })

# Domestic USA (по типу расстояния)
add_route("USA", "USA (Short)", 300, 350, 10)
add_route("USA", "USA (Medium)", 500, 550, 10)
add_route("USA", "USA (Long)", 1400, 1600, 15)

# USA → Other Regions
add_route("USA", "Europe", 2000, 2500, 20)
add_route("USA", "Middle East", 1800, 2300, 20)
add_route("USA", "Africa", 1800, 2600, 20)
add_route("USA", "Asia", 2200, 3000, 20)
add_route("USA", "India/Japan", 2000, 2800, 20)
add_route("USA", "Australia", 2400, 3200, 20)
add_route("USA", "Oceania", 2200, 3000, 20)

# Europe → Other Regions
add_route("Europe", "Asia", 1600, 2200, 20)
add_route("Europe", "Africa", 900, 1300, 15)
add_route("Europe", "Middle East", 800, 1200, 15)
add_route("Europe", "India/Japan", 1400, 1900, 20)
add_route("Europe", "Australia", 1800, 2500, 20)
add_route("Europe", "Oceania", 2000, 2700, 20)

# Asia → Other Regions
add_route("Asia", "Australia", 1300, 1800, 15)
add_route("Asia", "Oceania", 1400, 1900, 15)

# India/Japan → Other
add_route("India/Japan", "Africa", 1500, 2100, 20)
add_route("India/Japan", "Australia", 1800, 2500, 20)

# Middle East → Other
add_route("Middle East", "Asia", 1000, 1600, 15)

# Africa → Other
add_route("Africa", "Asia", 1000, 1500, 15)

# Australia → USA
add_route("Australia", "USA", 2300, 3000, 20)

# Создание DataFrame
df = pd.DataFrame(routes_data)

# Показать таблицу пользователю
import caas_jupyter_tools as tools; tools.display_dataframe_to_user(name="Варианты перелётов между регионами", dataframe=df)

df.head()