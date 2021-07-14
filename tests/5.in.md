???+note " [Intersection of Permutations](https://codeforces.com/problemset/problem/1093/E) "
    给出两个排列 $a$ 和 $b$，要求实现以下两种操作：
    
    1. 给出 $l_a, r_a, l_b, r_b$，要求查询既出现在 $a[l_a ... r_a]$ 又出现在 $b[l_b ... r_b]$ 中的元素的个数。
    2. 给出 $x, y$，$swap(b_x, b_y)$。
    
    序列长度 $n$ 满足 $2 \le n \le 2 \cdot 10^5$，操作个数 $q$ 满足 $1 \le q \le 2 \cdot 10^5$。
