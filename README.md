# Place
## Idea
This project is fan copy of **r/place**, which is popular reddit social experiment (look [here](https://wikipedia.org/wiki/Place) for more). Implemented as a homework from python MIPT course (Flask). 
Project consists of four main parts:
1. Python ***flask*** server things.
2. ***SQLite*** database and Database class implemented for comfortable work.
3. ***Javascript*** that rules all the things on the client side.
4. Beautiful frontend (just look at that!)

## Do I need to setup something?
If you have ***flask*** and ***PIL*** installed - you are good to go. Otherwise run:
```
pip install -r requirements.txt
```
from the main directory.

If you want to recreate database, [go to this section](#how-to-setup-database).


## OKAY, how to run this?
Just go to ```./src/``` folder, and run ```server.py``` like so:
```
cd src
python server.py
```
Flask will show you **ip & port** where your server listens on


<img width="578" alt="" src="https://user-images.githubusercontent.com/36928556/164556745-cfbbe156-6595-4727-a35d-5765eddb8109.png">


Next step: have fun! 🥳

## How to setup database?
Firstly, make sure you remove/renamed old database (```src/data.db```). Otherwise - it will drop the exception and do nothing. Next step is setting up the table. There is no special script for that. But it is as easy as that:
```
>>> from database import Database
>>> d = Database()
>>> d.setupTable()
```
After that, pretty and fresh ```data.db``` will apear. Done.
