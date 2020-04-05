import numpy as np
import pandas as pd
# from matplotlib import pyplot as plt
# from sklearn.datasets.samples_generator import make_blobs
from sklearn.cluster import KMeans

def clustering(k, dataset):
	dataset_array = np.array(transfer_dataset(dataset))
	kmeans = KMeans(n_clusters=k)
	kmeans.fit(dataset_array)
	centroids = kmeans.cluster_centers_
	labels = kmeans.labels_
	return dataset_array, centroids, labels

def transfer_dataset(dataset):
	dataset_array = []
	variables = dataset[0].keys()
	for datapoint in dataset:
		datapoint_array = []
		for var in variables:
			try:
				datapoint_array.append(float(datapoint[var]))
			except ValueError:
				del datapoint[var]
		dataset_array.append(datapoint_array)
	return dataset_array