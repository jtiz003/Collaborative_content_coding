import json
from pprint import pprint

import mongoDBInterface


class User:
    def __init__(self, first_name, last_name, email, permissions):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.permissions = permissions

    def create_user_db(self):
        # Create database just for users if does not exist
        my_client = mongoDBInterface.get_db_client()
        if not my_client.list_database_names().__contains__("Users"):
            mongoDBInterface.get_db_client()["Users"].create_collection("users")
            mongoDBInterface.get_col("Users", "users")
        mongoDBInterface.get_col("Users", "users").insert_one(self.__dict__)
