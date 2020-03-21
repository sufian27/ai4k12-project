import csv, sqlite3, json, os
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

#init dataset database
conn = sqlite3.connect("datasets.db", check_same_thread=False) #We need to serialize if multiple write operations later
c = conn.cursor()
#init app
app = Flask(__name__)
app.secret_key = os.urandom(24)
#init log database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///logdata.db'
db = SQLAlchemy(app)
from models import User
db.create_all()

#For testing

db.session.commit()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template('index.html', title='Home')
    
@app.route('/intro', methods=['GET', 'POST'])
def introduction():
    if request.method == 'POST':
        print(request.form['group1'])
        create_table_from_csv(int(request.form['group1']))
        json_object = get_db_data_json(int(request.form['group1']))
        return render_template('introduction.html', json_data = json_object, example = "example1", title='Introduction') #render next page with passing json object
    else:
        return 'Invalid Data'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session.pop('user_id', None)
        user_id = request.form['user_id']
        user_exists = db.session.query(db.exists().where(User.id == user_id)).scalar()
        if user_exists: 
            session['user_id'] = user_id
            return redirect(url_for('index'))

        return redirect(url_for('login'))

    return render_template('login.html')

def get_db_data_json(dataset):
    table_name = ''
    if dataset == 1:
        table_name = 'winequality_white'
    #add different dataset conditions later
    result = c.execute('SELECT * FROM {}'.format(table_name))
    records = [dict(zip([key[0] for key in c.description], row)) for row in result] 
    return json.dumps({'records' : records})


#function will initialize the db from file_name
def create_table_from_csv(dataset):
    file_name = ''
    if dataset == 1:
        file_name = 'winequality_white.csv'

    with open(file_name) as csvfile:
        reader = csv.DictReader(csvfile, delimiter=";") #for breast_cancer.csv, change delimiter to ,
        table_name = file_name.split('.')[0]
        c.execute('CREATE TABLE IF NOT EXISTS ' + table_name + ' ('
         + get_fields_str(reader.fieldnames) + ')'
        ) #create table
        for row in reader:            
            c.execute('INSERT INTO ' + table_name + 
            ' VALUES (' + get_values_str(reader, row) + ')') #insert values into table
        conn.commit()

def get_values_str(reader, row):
    values = []
    for field in reader.fieldnames:
        values.append(row.pop(field))
    values_str = ", ".join(values) #create string from values in a record
    return values_str


def get_fields_str(fields):
    fields_str = ''
    for i in range(0, len(fields)):
        if i == len(fields)-1:
            fields_str += fields[i] + ' real'
        else:
            fields_str += fields[i] + ' real, '
    return fields_str

#create_table_from_csv('winequality_white.csv')
#create_table_from_csv('breast_cancer.csv') #error in data



if __name__ == "__main__":
    app.run()
