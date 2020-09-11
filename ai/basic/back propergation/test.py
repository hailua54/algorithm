from __future__ import division, print_function, unicode_literals
import math
import numpy as np
import matplotlib.pyplot as plt
# The arrays to be added. 
#If a.shape != b.shape, they must be broadcastable to a common shape (which may be the shape of one or the other).
# mean b will be broadcasted to a 2x2 befor sum
a = np.array([4,1,2,3]).reshape((2,2))
b = np.array([1,1]).reshape((2,1))
#print(a)
#print(b)
#print(a+b)
print('a')
print(a)
print('np.max(a), axis = 0, keepdims = True')
print(np.max(a, axis = 0, keepdims = True))
print('a - np.max(a)')
print(a - np.max(a, axis = 0, keepdims = True))
