import sqlite3
import hashlib

class Database():
    def __init__(self):
        self.usercount = None
        self.db = sqlite3.connect('data.db', check_same_thread=False)
        self.cursor = self.db.cursor()
    
    def setupUsersTable(self):
        query = '''CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            login TEXT NOT NULL,
            password TEXT NOT NULL,
            painted_cells INTEGER 
        );'''
        self.cursor.execute(query)
        
    def setupAchievementsTable(self):
        query = '''CREATE TABLE achievements (
            id INTEGER PRIMARY KEY,
            label TEXT,
            description TEXT NOT NULL 
        );'''
        self.cursor.execute(query)

    def setupTokenTable(self):
        query = '''CREATE TABLE tokens (
            token TEXT NOT NULL,
            id INTEGER
        )'''
        self.cursor.execute(query)

    def askDb(self, query):
        self.cursor.execute(query)
        return self.cursor.fetchall()

    def setupTable(self):
        self.setupUsersTable()
        self.setupAchievementsTable()
        self.setupTokenTable()

    def getUserCount(self):
        if self.usercount == None:
            print("User count is not cached, loading it from DB")
            self.usercount = self.askDb("SELECT count(*) FROM users;")[0][0]

        return self.usercount

    def addUserToken(self, token, id):
        query = "INSERT INTO tokens (token, id) VALUES ('{token}', {id})".format(token=token, id=id)
        self.cursor.execute(query)

    def addUserData(self, id, login, password):
        query = '''INSERT INTO users (id, login, password, painted_cells) 
            VALUES ({id}, '{login}', '{password}', 0)
        '''.format(
            id=id, 
            login=login, 
            password=password
        )
        self.cursor.execute(query)

    def addUser(self, login, password):
        if (self.getUser(login) != []):
            return False

        id = self.getUserCount()
        self.addUserData(id, login, password)
        self.addUserToken(self.getHash(login, password), id)

        # For now, it will be commiting every new user.
        self.db.commit()
        return True

    def getUser(self, login):
        return self.askDb("SELECT * FROM users WHERE login = '" + login + "'")

    def addPaintedCell(self, id):
        query = """UPDATE users 
            SET painted_cells = painted_cells + 1 
            WHERE id = '{id}'
        """.format(id=id)
        self.cursor.execute(query)
        self.db.commit()

    def getHash(self, login, password):
        return hashlib.sha256(bytes(login + '/' + password, 'utf-8')).hexdigest()

    def isKnownToken(self, token):
        print("SELECT * FROM tokens WHERE token = '" + token + "'")
        id = self.askDb("SELECT * FROM tokens WHERE token = '" + token + "'")
        if (id == []):
            return None
        return id[0][1]

    def __del__(self):
        self.db.close()
