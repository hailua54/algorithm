import numpy as np
import matplotlib.pyplot as plt

x = np.arange(-5., 5., 0.1)
np.set_printoptions(precision=3)
with np.printoptions(precision=3, suppress=True):
    print(x*x)
y = x*x + 10*np.sin(x)
plt.plot(x, y)
plt.axis([0, 5, -10, 20])
#plt.show()

#momentum Gradient Descent ----------------
'''
v0 = 0
v1 = p*v0 + k*f'(x0)
x1 = x0 - v1 = x0 - p*v1 - k*f'(x0)
...

note:
	0 < p < 1: v->0
	adjust |v| by modify (p, k)
'''

#f(x) = x^2 + 10 sin(x)
#f'(x) = 2x + 10 cos(x)

def grad(x):
	return 2*x + 10*np.cos(x)
	
def normal_GD(N, x, k):
	v = 0
	i = 0
	while i < N:
		if abs(grad(x)) < 1e-3:
			break
		x = x - k*grad(x)
		i += 1
	return (x, i)
r = normal_GD(200, 5, 0.05)
print("1. normal_GD %.3f, %d"%r)
r = normal_GD(200, 5, 0.1)
print("2. normal_GD %.3f, %d"%r)

def momentum_GD(N, x, p, k):
	v = 0
	i = 0
	while i < N:
		if abs(grad(x)) < 1e-3:
			break
		v = p*v + k*grad(x)
		x = x - p*v - k*grad(x)
		i += 1
	return (x, i)
r = momentum_GD(200, 5, 0.9, 0.05)
print("1. momentum_GD %.3f, %d"%r)
r = momentum_GD(200, 5, 0.9, 0.1)
print("2. momentum_GD %.3f, %d"%r)
