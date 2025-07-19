from decouple import config
from pymongo import MongoClient

def get_mongo_client():
    mongo_url = config('MONGO_URL')
    return MongoClient(mongo_url)

def get_database():
    client = get_mongo_client()
    db_name = config('DB_NAME')
    return client[db_name]

def get_user_collection():
    db = get_database()
    collection_name = config('USER_COLLECTION')
    return db[collection_name]

def get_task_collection():
    db = get_database()
    collection_name = config('TASK_COLLECTION')
    return db[collection_name]