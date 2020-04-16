import numpy as np
import pandas as pd
# from matplotlib import pyplot as plt
# from sklearn.datasets.samples_generator import make_blobs
from sklearn.cluster import KMeans

def clustering(k, dataset, unmapped):
	dataset_array = np.array(transfer_dataset(dataset, unmapped))
	kmeans = KMeans(n_clusters=k)
	kmeans.fit(dataset_array)
	centroids = kmeans.cluster_centers_
	labels = kmeans.labels_
	centroids_new, labels_new = fixedSeq(k, centroids, labels)
	return dataset_array, centroids_new, labels_new

def transfer_dataset(dataset, unmapped):
	unmapped.append('id')
	dataset_array = []
	variables = dataset[0].keys()
	for datapoint in dataset:
		datapoint_array = []
		for var in variables:
			if not var in unmapped:
				try:
					datapoint_array.append(float(datapoint[var]))
				except ValueError:
					del datapoint[var]
		dataset_array.append(datapoint_array)
	return dataset_array

def fixedSeq(k, centroids, labels):
	old_labels = {}
	new_match = {}
	for i in range(k):
		old_labels[str(centroids[i])] = i
	centroids_new = sorted(centroids, key=lambda x: x[0], reverse = True)
	for i in range(k):
		new_label = i
		old_label = old_labels[str(centroids_new[i])]
		new_match[old_label] = new_label
	labels_new = []
	for i in labels:
		update = new_match[i]
		labels_new.append(update)
	return centroids_new, labels_new

