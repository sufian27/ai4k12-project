import numpy as np
import pandas as pd
# from matplotlib import pyplot as plt
# from sklearn.datasets.samples_generator import make_blobs
from sklearn.cluster import KMeans
import math

def json4cluster(dataset, centroids, labels, example, dataset_face):
	json_cluster = {}
	json_cluster["nodes"] = []
	json_cluster["links"] = []
	source = []
	distance_list = []
	for i in range(len(centroids)):
		source.append(len(dataset) + i)

	for i in range(len(dataset)):
		node = {}
		node["name"] = str(labels[i]) + '_' + str(i)
		node["group"] = str(labels[i])
		distance = distanceCal(dataset[i], centroids[labels[i]])
		distance_list.append(distance)
		node["distance"] = distance
		# pic_src = "/static/image/example" + str(example) + "/" + str(i) + ".png";
		# node["pic"] = pic_src
		node["data"] = dataset_face[i]
		json_cluster["nodes"].append(node)

		link = {}
		link["source"] = source[labels[i]]
		link["target"] = i
		link["group"] = str(labels[i])
		json_cluster["links"].append(link)
	
	# distance calculation for d3 force
	# distance_max = max(distance_list)
	# distance_min = min(distance_list)
	# distance_range = distance_max - distance_min

	# for i in range(len(dataset)):
	# 	original = json_cluster["nodes"][i]["distance"]
	# 	json_cluster["nodes"][i]["distance"] = (float(original) - float(distance_min)) / float(distance_range)

	# for i in range(len(centroids)):
	# 	node = {}
	# 	node["name"] = str(i) + '_'
	# 	node["group"] = str(i)
	# 	node["distance"] = 0
	# 	pic_src = "/static/image/example" + str(example) + "/circle.png";
	# 	node["pic"] = pic_src
	# 	json_cluster["nodes"].append(node)

	json_cluster['nodes'] = sorted(json_cluster['nodes'], key = lambda x: x['distance'])
	return json_cluster

def distanceCal(data1, data2):
	# scale = 0
	# for i in data2:
	# 	scale = scale + i * i
	# scale = math.sqrt(float(scale))
	# for i in range(len(data1)):
	# 	data1[i] = float(data1[i]) / float(scale)
	# for i in range(len(data2)):
	# 	data2[i] = float(data2[i]) / float(scale)
	distance = math.sqrt(sum([(a - b) ** 2 for a, b in zip(data1, data2)]))
	return distance

def labelsCount(centroids, labels):
	count = []
	for i in range(len(centroids)):
		count.append(0)
	for i in range(len(labels)):
		count[labels[i]] += 1
	return count
