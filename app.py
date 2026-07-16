"""
Food Calorie Estimation - Mini Project
Flask backend that serves a food database and calculates
calories/protein/carbs/fat based on selected food items and quantity (grams).
"""

from flask import Flask, render_template, jsonify, request
import csv
import os

app = Flask(__name__)

FOOD_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'food_data.csv')


def load_food_data():
    """Load food nutrition data from CSV into a dictionary."""
    data = {}
    with open(FOOD_DATA_PATH, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            data[row['food_name']] = {
                'calories': float(row['calories_per_100g']),
                'protein': float(row['protein_g']),
                'carbs': float(row['carbs_g']),
                'fat': float(row['fat_g']),
            }
    return data


FOOD_DATA = load_food_data()


@app.route('/')
def index():
    """Render main page with list of available foods."""
    return render_template('index.html', foods=sorted(FOOD_DATA.keys()))


@app.route('/api/foods')
def get_foods():
    """Return list of all food names (for search/autocomplete)."""
    return jsonify(sorted(FOOD_DATA.keys()))


@app.route('/api/calculate', methods=['POST'])
def calculate():
    """
    Accepts JSON: { "items": [ {"food": "Rice", "quantity": 150}, ... ] }
    Returns per-item breakdown + total nutrition.
    """
    payload = request.get_json(force=True) or {}
    items = payload.get('items', [])

    results = []
    total = {'calories': 0.0, 'protein': 0.0, 'carbs': 0.0, 'fat': 0.0}

    for item in items:
        name = item.get('food')
        try:
            qty = float(item.get('quantity', 0))
        except (TypeError, ValueError):
            qty = 0

        if name in FOOD_DATA and qty > 0:
            info = FOOD_DATA[name]
            factor = qty / 100.0

            calories = round(info['calories'] * factor, 2)
            protein = round(info['protein'] * factor, 2)
            carbs = round(info['carbs'] * factor, 2)
            fat = round(info['fat'] * factor, 2)

            results.append({
                'food': name,
                'quantity': qty,
                'calories': calories,
                'protein': protein,
                'carbs': carbs,
                'fat': fat,
            })

            total['calories'] += calories
            total['protein'] += protein
            total['carbs'] += carbs
            total['fat'] += fat

    total = {k: round(v, 2) for k, v in total.items()}

    return jsonify({'items': results, 'total': total})


if __name__ == '__main__':
    app.run(debug=True)
