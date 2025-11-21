# bloomfund backend

### creating a venv

```
python3 -m venv .venv # makes venv
source .venv/bin/activate # enters venv
```

### install dependencies

```
pip install -r requirements.txt
```

### run the server

```
python3 run.py
```

## api endpoints

takes api requests to the server

GET - read/retrieve data
POST - you send data to server, it stores/processes it
DELETE - youre telling server to delete smth

### resume processing

- `POST /upload-resume` - upload PDF resume and extract structured JSON
- `POST /match-scholarships` - match user profile to scholarships

### scholarships

- `GET /scholarships` - get all scholarships
- `GET /scholarships/{scholarship_id}` - get specific scholarship
- `POST /scholarships` - add new scholarship

### favourites

- `POST /favourites` - save scholarship to favorites
- `GET /favourites/{user_id}` - get user's favorites
- `DELETE /favourites/{user_id}/{scholarship_id}` - remove favorite

## Project Structure

```
bloomfund-backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # fastAPI application and routes
│   ├── config.py            # configuration management
│   ├── db/
│   │   ├── __init__.py
│   │   ├── models.py        # database operations
│   │   └── supabase_client.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── file_validator.py
│   │   ├── pdf_extraction.py
│   │   ├── jsonify_user_data.py
│   │   └── scholarship_matching.py
│   └── utils/
│       ├── __init__.py
│       └── cleaner.py
├── run.py                   # server startup script
├── requirements.txt         # python dependencies
└── .env                     # environment variables (not in git)
```
