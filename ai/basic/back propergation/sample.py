# To support both python 2 and python 3
from __future__ import division, print_function, unicode_literals
import math
import numpy as np
import matplotlib.pyplot as plt

N = 100 # number of points per class
d0 = 2 # dimensionality
C = 3 # number of classes

X = np.zeros((d0, N*C)) # data matrix (each col = single example)
y = np.zeros(N*C, dtype='uint8') # class labels
'''
print(X[0:2,[0,1,2,3]])
#X[0:2,[0,1,2,3]] => return a 2x4 sub matrix of X
#[[0. 0. 0. 0.]
#[0. 0. 0. 0.]]
'''
for j in range(C):
	ix = range(N*j,N*(j+1)) #ix is and array
	r = np.linspace(0.0,1,N) # radius
	t = np.linspace(j*4,(j+1)*4,N) + np.random.randn(N)*0.2 # theta in 3 range intercept together
	#print(np.random.randn(N)) # get N random values from 0->1
	'''
	>>> np.c_[np.array([1,2,3]), np.array([4,5,6])]
	array([[1, 4],
		[2, 5],
		[3, 6]])
	'''
	X[:,ix] = np.c_[r*np.sin(t), r*np.cos(t)].T #numpy sin, code use radians, X[:,ix] in R2xN
	#print(X[:,ix])
	y[ix] = j
# lets visualize the data:
# plt.scatter(X[:N, 0], X[:N, 1], c=y[:N], s=40, cmap=plt.cm.Spectral)

#NOTE: a:b is from a to b. X[0, N:2*N] will re turn an array of X[row = 0][col = N to 2*N]
plt.xlabel('X_row_0')
plt.ylabel('X_row_1')
plt.plot(X[0, :N], X[1, :N], 'bs', markersize = 7); # blue + square
plt.plot(X[0, N:2*N], X[1, N:2*N], 'ro', markersize = 7); # red + circle
plt.plot(X[0, 2*N:], X[1, 2*N:], 'g^', markersize = 7); # green + triangle

# plt.axis('off')
#plt.xlim([-1.5, 1.5])
#plt.ylim([-1.5, 1.5])
plt.axis([-1.5, 1.5, -1.5, 1.5])
#cur_axes = plt.gca()
#cur_axes.axes.get_xaxis().set_ticks([])
#cur_axes.axes.get_yaxis().set_ticks([])

#plt.savefig('EX.png', bbox_inches='tight', dpi = 600)
#plt.show()

def softmax(V):
	# to make sure all e_V element <= 0 => exp(e_Vi) = 1/exp(abs(e_Vi)) <= 1
	e_V = np.exp(V - np.max(V, axis = 0, keepdims = True)) 
	Z = e_V / e_V.sum(axis = 0)
	return Z

## One-hot coding
from scipy import sparse
def convert_labels(y, C = 3):
	Y = sparse.coo_matrix((np.ones_like(y),
		(y, np.arange(len(y)))), shape = (C, len(y))).toarray()
	return Y

# cost or loss function
def cost(Y, Yhat):
	return -np.sum(Y*np.log(Yhat))/Y.shape[1]
	
d0 = 2
d1 = h = 10 # size of hidden layer fix 100 o day de test va comment - hiden layer - relu co 100 units, moi unit train voi 300 inputs (300 x)
d2 = C = 3 # output layer - softmax co 3 units, , moi unit train voi 100 inputs (100 a1)
# initialize parameters randomly
W1 = 0.01*np.random.randn(d0, d1)
b1 = np.zeros((d1, 1))
W2 = 0.01*np.random.randn(d1, d2)
b2 = np.zeros((d2, 1))

Y = convert_labels(y, C)
N = X.shape[1]
eta = 1 # learning rate
for i in range(10000):
	## Feedforward
	# W1.T.shape = (100, 2)
	# X.shape = (2, 300)
	# np.dot(W2.T, A1).shape = (100, 300)
	# b1.shape = (100, 1)
	# Z1.shape = (100, 300)
	Z1 = np.dot(W1.T, X) + b1 #b1 will be auto reshape to a np.dot(W1.T, X).shape befor sum 
	A1 = np.maximum(Z1, 0)
	# W2.T.shape = (3, 100) , co 3 layers, moi layer co trong so w(w1, w2, ... w100)
	# Z2.shape = (3, 300)
	Z2 = np.dot(W2.T, A1) + b2 
	Yhat = softmax(Z2)

	# print loss after each 1000 iterations
	if i %1000 == 0:
		# compute the loss: average cross-entropy loss
		loss = cost(Y, Yhat)
		print("iter %d, loss: %f" %(i, loss))

	# backpropagation
	E2 = (Yhat - Y )/N
	dW2 = np.dot(A1, E2.T)
	db2 = np.sum(E2, axis = 1, keepdims = True)
	E1 = np.dot(W2, E2)
	E1[Z1 <= 0] = 0 # gradient of ReLU
	dW1 = np.dot(X, E1.T)
	db1 = np.sum(E1, axis = 1, keepdims = True)

	# Gradient Descent update
	W1 += -eta*dW1
	b1 += -eta*db1
	W2 += -eta*dW2
	b2 += -eta*db2
	
Z1 = np.dot(W1.T, X) + b1
A1 = np.maximum(Z1, 0)
Z2 = np.dot(W2.T, A1) + b2
predicted_class = np.argmax(Z2, axis=0)
print('training accuracy: %.2f %%' % (100*np.mean(predicted_class == y)))