import sqlite3, os
import csv, json
import yaml
import base64
from k_means_cluster import clustering
from cluster_vis import json4cluster
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, g, make_response
from flask_sqlalchemy import SQLAlchemy
#important note: what are needed for most pages: json_dataset, dataset_face(in case some original variables are not numeric), json_mapping, example index, page title
# for some pages, centroids and value for k are also needed

#init dataset database
conn = sqlite3.connect("datasets.db", check_same_thread=False) #todo: We need to serialize if multiple write operations later
c = conn.cursor()
#init app
# app = Flask(__name__)
app = Flask(__name__, static_url_path='/static')
app.secret_key = 'KJNVDDNK32239JFSKNVRJNONOCEIN2930232I802UONNC'
#init log database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///logdata.db'

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://sufian:sufian123@ai4k12.ccww9pi9mcdx.us-east-1.rds.amazonaws.com:5432/ai4k12'

db = SQLAlchemy(app)
from models import User, User_Action
from helpers import get_db_data_json, create_table_from_csv, dataset_pre_analysis, dataset_preprocess
db.create_all()
# json_object = get_db_data_json(1) #todo: store the dataset as a global variable that all the webpage can access (try session?)

@app.before_request
def before_request(): #set global user
    g.user = None
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        g.user = user
        
@app.route('/', methods=["GET", "POST"])
def index():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == "GET": #handle asynchronous request
        db.session.add(User_Action('user at home page', session['user_id'])) #log data 
        db.session.commit()
        return render_template('index.html', title='SmileyCluster')
    else:
        return 'Invalid Data'

@app.route('/login', methods=['GET', 'POST'])
def login():
    valid_user = False
    if request.method == 'POST':
        session.pop('user_id', None)
        user_id = request.form['user_id']
        user_exists = db.session.query(db.exists().where(User.id == user_id)).scalar()
        if user_exists: #user logged in
            session['user_id'] = user_id
            db.session.add(User_Action('successfully logged in', user_id)) #log data
            db.session.commit()
            return redirect(url_for('index'))

        return render_template('login.html', valid = user_exists)

    return render_template('login.html', valid = True)

@app.route('/logout')
def logout():
    db.session.add(User_Action('user logged out', session['user_id'])) #log data 
    db.session.commit()
    session.pop('user_id', None)
    
    return redirect(url_for('login'))

@app.route('/add', methods=['GET', 'POST'])
def add():
    added = False
    unique = True
    user_id = None
    if request.method == 'POST':
        try: 
            db.session.add(User(request.form['user_id']))
            db.session.commit()
            user_id = request.form['user_id']
            added = True
        except:
            unique = False
    
    return render_template('add.html', added = added, user_id = user_id, unique = unique)

@app.route('/intro', methods=['GET', 'POST'])
def introduction():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == 'GET':
        example_index = request.args.get('example', default = 0, type = int)
        create_table_from_csv(example_index)
        json_object = get_db_data_json(example_index)
        json_dataset = yaml.safe_load(json_object)["records"]
        dataset_stat = dataset_pre_analysis(json_dataset)
        dataset_face = dataset_preprocess(json_dataset, dataset_stat)

        db.session.add(User_Action('user made dataset selection {}'.format(example_index), session['user_id']))
        db.session.add(User_Action('user at intro page', session['user_id'])) #log data 
        db.session.commit()
        return render_template('introduction.html', json_data = json_object, dataset_face = dataset_face, example = str(example_index), title='Introduction') #render next page with passing json object
    else:
        return 'Invalid Data'

@app.route('/var', methods = ['GET', 'POST'])
def var():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == 'GET':
        example_index = request.args.get('example', default = 0, type = int)
        create_table_from_csv(example_index)
        json_object = get_db_data_json(example_index)
        json_dataset = yaml.safe_load(json_object)["records"]
        dataset_stat = dataset_pre_analysis(json_dataset)
        dataset_face = dataset_preprocess(json_dataset, dataset_stat)

        db.session.add(User_Action('user at var page', session['user_id'])) #log data 
        db.session.commit()
        return render_template('var.html', json_data = json_object, dataset_face = dataset_face, example = str(example_index), title='Factor')
    else:
        return 'Invalid Data'

@app.route('/data_intro', methods = ['GET', 'POST'])
def data_intro():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == 'GET':
        example_index = request.args.get('example', default = 0, type = int)
        create_table_from_csv(example_index)
        json_object = get_db_data_json(example_index)
        json_dataset = yaml.safe_load(json_object)["records"]
        dataset_stat = dataset_pre_analysis(json_dataset)
        dataset_face = dataset_preprocess(json_dataset, dataset_stat)

        db.session.add(User_Action('user at data intro page', session['user_id'])) #log data 
        db.session.commit()
        return render_template('data_intro.html', json_data = json_object, dataset_face = dataset_face, example = str(example_index), title='Dataset Introduction')
    else:
        return 'Invalid Data'

@app.route('/feature_map', methods = ['GET', 'POST'])
def feature_map():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == 'GET':
        example_index = request.args.get('example', default = 0, type = int)
        create_table_from_csv(example_index)
        json_object = get_db_data_json(example_index)
        json_dataset = yaml.safe_load(json_object)["records"]
        dataset_stat = dataset_pre_analysis(json_dataset)
        dataset_face = dataset_preprocess(json_dataset, dataset_stat)

        db.session.add(User_Action('user at feature mapping page', session['user_id'])) #log data 
        db.session.commit()
        return render_template('feature_map.html', json_data = json_object, dataset_face = dataset_face, example = str(example_index), title='Make Your Emoji')
    else:
        return 'Invalid Data'

@app.route('/slider', methods = ['GET', 'POST'])
def slider():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == "GET":
        example_index = request.args.get('example', default = 0, type = int)
        json_object = get_db_data_json(example_index)
        json_dataset = yaml.safe_load(json_object)["records"]
        dataset_stat = dataset_pre_analysis(json_dataset)
        dataset_face = dataset_preprocess(json_dataset, dataset_stat)

        db.session.add(User_Action('user at slider page', session['user_id'])) #log data 
        db.session.commit()
        return render_template('slider.html', example = str(example_index), json_data = json_object, dataset_face = dataset_face, dataset_stat = dataset_stat, title='Feature Slider')
    else:
        return 'Invalid Data'

@app.route('/dataset2face', methods = ['GET', 'POST'])
def dataset2face():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == "GET":
        example_index = request.args.get('example', default = 0, type = int)
        json_object = get_db_data_json(example_index)
        json_dataset = yaml.safe_load(json_object)["records"]
        dataset_stat = dataset_pre_analysis(json_dataset)
        dataset_face = dataset_preprocess(json_dataset, dataset_stat)

        db.session.add(User_Action('user at dataset2face page', session['user_id'])) #log data 
        db.session.commit()
        return render_template('dataset2face.html', example = str(example_index), json_data = json_object, dataset_face = dataset_face, title='Full Dataset')
    else:
        return 'Invalid Data'

@app.route('/compare', methods = ['GET', 'POST'])
def compare():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == 'GET':
        example_index = request.args.get('example', default = 0, type = int)
        json_object = get_db_data_json(example_index)
        json_dataset = yaml.safe_load(json_object)["records"]
        dataset_stat = dataset_pre_analysis(json_dataset)
        dataset_face = dataset_preprocess(json_dataset, dataset_stat)

        db.session.add(User_Action('user at compare page', session['user_id'])) #log data 
        db.session.commit()
        return render_template('compare.html', example = str(example_index), json_data = json_object, dataset_face = dataset_face, title='Smilarity Comparison')
    else:
        return 'Invalid Data'

@app.route('/groupwise_compare', methods = ['GET', 'POST'])
def groupwise_compare():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == 'GET':
        example_index = request.args.get('example', default = 0, type = int)
        json_object = get_db_data_json(example_index)
        json_dataset = yaml.safe_load(json_object)["records"]
        dataset_stat = dataset_pre_analysis(json_dataset)
        dataset_face = dataset_preprocess(json_dataset, dataset_stat)

        db.session.add(User_Action('user at groupwise compare page', session['user_id'])) #log data 
        db.session.commit()
        return render_template('groupwise_compare.html', example = str(example_index), json_data = json_object, dataset_face = dataset_face, title='Groupwise Smilarity Comparison')
    else:
        return 'Invalid Data'

@app.route('/cluster2', methods = ['GET', 'POST'])
def cluster():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == 'GET':
        example_index = request.args.get('example', default = 0, type = int)
        k_value = request.args.get('k', default = 2, type = int)
        unmapped = request.args.getlist('unmapped')
        unmapped_list = [str(x) for x in unmapped]
        unmapped_list = unmapped_list[0].split(',')
        # print('--------')
        # print(k_value)
        json_object = get_db_data_json(example_index)
        json_dataset = yaml.safe_load(json_object)["records"]
        dataset_stat = dataset_pre_analysis(json_dataset)
        dataset_face = dataset_preprocess(json_dataset, dataset_stat)
        # dataset_array, centroids, labels = clustering(k_value, json_dataset)
        dataset_array, centroids, labels = clustering(k_value, dataset_face, unmapped_list)
        if example_index == 2 and k_value == 4:
            f = open('example2.json',) 
            data = json.load(f)
            json_cluster = json.dumps(data)
            # print('--------')
            f.close()
        else:
            json_cluster = json4cluster(dataset_array, centroids, labels, example_index, dataset_face)
        
        # with open('cluster.json', 'w') as outfile:
        #     json.dump(json_cluster , outfile)

        db.session.add(User_Action('user at cluster page with k value {} and unmapped features {}'.format(k_value, unmapped_list), session['user_id'])) #log data 
        db.session.commit()
        return render_template('cluster2.html', example = str(example_index), json_data = json_object, dataset_face = dataset_face, centroids = centroids, k = k_value, json_cluster = json_cluster, title='Automatic Clustering')
    else:
        return 'Invalid Data'

@app.route('/stem', methods = ['GET', 'POST'])
def stem():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == 'GET':
        example_index = request.args.get('example', default = 0, type = int)

        db.session.add(User_Action('user at stem page', session['user_id'])) #log data 
        db.session.commit()
        return render_template('stem.html', example = str(example_index), title='What we found')
    else:
        return 'Invalid Data'

@app.route('/answer', methods = ['GET', 'POST'])
def answer():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == "POST": #handle asynchronous request for log data
        req = request.get_json()
        db.session.add(User_Action('user response: {}, {}'.format(req['q_index'], req['val']), session['user_id']))
        db.session.commit()
        res = make_response(jsonify(req), 200)
        return res
    else:
        return 'Invalid Data'

@app.route('/feedback', methods = ['GET', 'POST'])
def feedback():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == "POST": #handle asynchronous request for log data
        req = request.get_json()
        db.session.add(User_Action('user feedback: {}, {}'.format(req['page'], req['val']), session['user_id']))
        db.session.commit()
        res = make_response(jsonify(req), 200)
        return res
    else:
        return 'Invalid Data'

@app.route('/click_record', methods = ['GET', 'POST'])
def click_record():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == "POST": #handle asynchronous request for log data
        req = request.get_json()
        print('------------')
        print(req)
        db.session.add(User_Action('user clicked {}, {}'.format(req['page'], req['element']), session['user_id']))
        db.session.commit()
        res = make_response(jsonify(req), 200)
        return res
    else:
        return 'Invalid Data'

@app.route('/mapping_record', methods = ['GET', 'POST'])
def mapping_record():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == "POST": #handle asynchronous request for log data
        req = request.get_json()
        print('------------')
        print(req)
        db.session.add(User_Action('user final mapping {}'.format(req['val']), session['user_id']))
        db.session.commit()
        res = make_response(jsonify(req), 200)
        return res
    else:
        return 'Invalid Data'

@app.route('/uploadcanvas', methods = ['GET', 'POST'])
def testing():
    if request.method == 'POST':
        #from https://blog.csdn.net/weixin_41679938/java/article/details/89400287
        recv_data = request.get_json()
        if recv_data is None:
            print("request.get_json() is None")
            recv_data = request.get_data()

        json_re = json.loads(recv_data)
        keys = json_re.keys()
        for i in keys:
            if i == "example":
                example_id = json_re[i]
            else:
                image_name = i
                imgRes = json_re[image_name]        
        imgdata = base64.b64decode(imgRes)
        
        user_id = g.user.id    
        folder_path = './static/image/user' + str(user_id) + '/' + 'example' + str(example_id) + '/'
        isFolder = os.path.isdir(folder_path) 
        if not isFolder:
            os.makedirs(folder_path)
        
        file_path = folder_path + image_name + '.png'
        isFile = os.path.isfile(file_path)
        if not isFile:
            file = open(file_path, "wb")
            file.write(imgdata)
            file.close()
        return render_template('uploadcanvas.html')
    else:
        return 'Invalid Data'
