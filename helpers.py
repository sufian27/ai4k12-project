#file contains helper methods
from app import c, conn
import csv, json

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
