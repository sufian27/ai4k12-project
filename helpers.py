#file contains helper methods
from app import c, conn
import csv, json

def get_db_data_json(dataset):
    table_name = ''
    if dataset == 1:
        table_name = 'winequality_white_short'
    elif dataset == 2:
        table_name = 'beetle_richness_short'
    elif dataset == 3:
        table_name = 'breast_cancer'
    #add different dataset conditions later
    result = c.execute('SELECT * FROM {}'.format(table_name))
    records = [dict(zip([key[0] for key in c.description], row)) for row in result] 
    return json.dumps({'records' : records})

#function will initialize the db from file_name
def create_table_from_csv(dataset):
    file_name = ''
    if dataset == 1:
        file_name = 'winequality_white.csv'
    elif dataset == 2:
        file_name = 'beetle_richness.csv'
    elif dataset == 3:
        file_name = 'breast_cancer.csv'

    with open(file_name) as csvfile:
        reader = csv.DictReader(csvfile, delimiter=",") #for breast_cancer.csv, change delimiter to ,
        table_name = file_name.split('.')[0]
        if dataset == 1:
            command = ''' CREATE TABLE IF NOT EXISTS winequality_white_short (
                id integer primary key, fixed_acidity real, volatile_acidity real, 
                residual_sugar real, free_sulfur_dioxide real, 
                total_sulfur_dioxide real, density real, 
                pH real, alcohol real, quality real
            ) '''
        elif dataset == 2:
            command = ''' CREATE TABLE IF NOT EXISTS beetle_richness_short (
                id text primary key, Latitude real,
                Mean_Temp_degC real, Mean_Ann_Precip_mm real, 
                Mean_Canopy_Height_m real, 
                Small_Mammal_Richness real, Beetles_Richness real
            ) '''
        elif dataset == 3:
            command = ''' CREATE TABLE IF NOT EXISTS breast_cancer (
                id integer primary key, clump_thickness integer,
                uniformity_of_cell_size integer, uniformity_of_cell_shape integer, 
                marginal_adhesion integer, single_epithelial_cell_size integer, 
                bare_nuclei integer, bland_chromatin integer, 
                normal_nucleoli integer, mitoses integer, class integer
            )''' 


        c.execute(command) #create table

        for row in reader: 
            vals = get_values_str(reader, row)

            if dataset == 1:
                command = 'INSERT INTO winequality_white_short VALUES (' + vals + ')'
            elif dataset == 2:
                vals = ''.join(['"'+ vals[:4] + '"', vals[4:]])
                command = 'INSERT INTO beetle_richness_short VALUES (' + vals + ')'
            elif dataset == 3:
                command = 'INSERT INTO breast_cancer VALUES (' + vals + ')' 

            try:
                c.execute(command) #insert values into table
            except:
                pass
            
        conn.commit()

def get_values_str(reader, row):
    values = []
    for field in reader.fieldnames:
        values.append(row.pop(field))
    values_str = ", ".join(values) #create string from values in a record
    return values_str

# def get_fields_str(fields):
#     fields_str = ''
#     for i in range(0, len(fields)):
#         if i == len(fields)-1:
#             fields_str += fields[i] + ' real'
#         else:
#             fields_str += fields[i] + ' real, '
#     return fields_str

def dataset_pre_analysis(dataset_face):
    variables = dataset_face[0].keys()
    dataset_by_var = {}
    for i in variables:
        dataset_by_var[i] = []
    for datapoint in dataset_face:
        for var in variables:
            dataset_by_var[var].append(datapoint[var])
    stat_by_var = {}
    for var in variables:
        stat_by_var[var] = {}
        stat_by_var[var]["max"] = max(dataset_by_var[var])
        stat_by_var[var]["min"] = min(dataset_by_var[var])
    return stat_by_var

def dataset_preprocess(dataset_face, dataset_stat):
    variables = dataset_face[0].keys()
    for datapoint in dataset_face:
        for var in variables:
            if var != "id":
                try:
                    datapoint[var] = (float(datapoint[var]) - float(dataset_stat[var]["min"]))/(float(dataset_stat[var]["max"]) - float(dataset_stat[var]["min"]))
                except ValueError:
                    del datapoint[var]
    return dataset_face
