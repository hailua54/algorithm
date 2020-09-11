import numpy as np
# a = [0 1 2 3 4 5]
a = np.arange(6)
#a = a.reshape((2,3))
print(a)
a = a.reshape((-1,1))
print(a)