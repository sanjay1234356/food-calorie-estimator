# Food Calorie Estimator (Mini Project)

A simple Flask web app that estimates calories, protein, carbs, and fat
for a meal, based on food items and quantity (in grams). Includes 80+
common Indian and international foods.

## Project Structure
```
food-calorie-estimator/
├── app.py                 # Flask backend
├── requirements.txt
├── data/
│   └── food_data.csv      # Food nutrition database
├── templates/
│   └── index.html         # Main page
└── static/
    ├── style.css
    └── script.js
```

## How to Run (VS Code)

1. Extract this zip and open the `food-calorie-estimator` folder in VS Code.
2. Open a terminal in VS Code: `Terminal > New Terminal`.
3. (Recommended) Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate      # Windows
   source venv/bin/activate   # macOS/Linux
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the app:
   ```bash
   python app.py
   ```
6. Open your browser at: **http://127.0.0.1:5000**

## How it Works

- `data/food_data.csv` stores calories, protein, carbs, and fat per 100g
  for each food item.
- User selects a food + enters quantity in grams in the browser.
- Frontend (`script.js`) sends the selected items to `/api/calculate`.
- Backend (`app.py`) scales the per-100g values by the quantity entered
  and returns per-item + total nutrition as JSON.
- Results are displayed in a table with a total summary card.

## Daily Calorie Goal Tracking (Feature)

- Enter your daily calorie goal (e.g. 2000) and click **Save Goal**.
- After calculating a meal, a **progress bar** shows how much of your
  goal that meal used up.
- If the meal exceeds the goal, the bar turns red and shows how many
  calories over the limit you are.
- The goal is kept in memory for the current browser session (resets
  on page reload) — no external storage is used.

## Ideas to Extend (for viva / demo)

- Add a search/autocomplete box instead of a dropdown.
- Store meal history using a database (SQLite) so the goal and meals
  persist across days/sessions.
- Add user login so each user has their own goal and meal log.
- Add image-based food recognition using a pretrained ML model (advanced).

## Notes

- Calorie values are approximate, standard nutrition reference values
  per 100g of food (not medical-grade accuracy).
- Built using Python, Flask, HTML, CSS, and JavaScript — good scope
  for a mini project demo covering backend + frontend + data handling.
