---
layout: doc
outline: deep
---

# Python 多线程

```python

from threading import Thread

def func():
    for i in range(1000):
        print('func', i)


if __name__ == '__main__':
    t = Thread(target=func)	# 创建线程并给线程安排任务
    t.start()	# 多线程状态为可以开始工作状态，具体执行时间由CPU决定
    for i in range(1000):
        print('main', i)
```

::: info 运行结果:

```python
funcmain 0 0
func
main 1
func 2
func 3
func 4
 1
main func 5
func 6
func2
 7
......
funcmain  998992

funcmain  999993

main 994
main 995
main 996
main 997
main 998
main 999

```

:::
