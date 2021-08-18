???+note "[Codeforces #487 E. Tourists](https://codeforces.com/contest/487/problem/E)"
    ??? mdui-shadow-6 "题意简述"
        给定一张简单无向连通图，要求支持两种操作：
        
        1. 修改一个点的点权。
        
        2. 询问两点之间所有简单路径上点权的最小值。
    
    ??? mdui-shadow-6 "题解"
        同样地，我们建出原图的圆方树，令方点权值为相邻圆点权值的最小值，问题转化为求路径上最小值。
        
        路径最小值可以使用树链剖分和线段树维护，但是修改呢？
        
        一次修改一个圆点的点权，需要修改所有和它相邻的方点，这样很容易被卡到 $\mathcal{O}(n)$ 个修改。
        
        这时我们利用圆方树是棵树的性质，令方点权值为自己的儿子圆点的权值最小值，这样的话修改时只需要修改父亲方点。
        
        对于方点的维护，只需要对每个方点开一个 `multiset` 维护权值集合即可。
        
        需要注意的是查询时若 LCA 是方点，则还需要查 LCA 的父亲圆点的权值。
        
        注意：圆方树点数要开原图的两倍，否则会数组越界。
    
    ??? mdui-shadow-6 "参考代码"
        ```cpp
        #include <algorithm>
        #include <cstdio>
        #include <set>
        #include <vector>
        
        const int MN = 100005;
        const int MS = 524288;
        const int Inf = 0x7fffffff;
        
        int N, M, Q, cnt;
        int w[MN * 2];
        std::vector<int> G[MN], T[MN * 2];
        std::multiset<int> S[MN * 2];
        
        int dfn[MN * 2], low[MN], dfc;
        int stk[MN], tp;
        
        void Tarjan(int u) {
          low[u] = dfn[u] = ++dfc;
          stk[++tp] = u;
          for (int v : G[u]) {
            if (!dfn[v]) {
              Tarjan(v);
              low[u] = std::min(low[u], low[v]);
              if (low[v] == dfn[u]) {
                ++cnt;
                for (int x = 0; x != v; --tp) {
                  x = stk[tp];
                  T[cnt].push_back(x);
                  T[x].push_back(cnt);
                }
                T[cnt].push_back(u);
                T[u].push_back(cnt);
              }
            } else
              low[u] = std::min(low[u], dfn[v]);
          }
        }
        
        int idf[MN * 2], faz[MN * 2], siz[MN * 2], dep[MN * 2], son[MN * 2],
            top[MN * 2];
        
        void DFS0(int u, int fz) {
          faz[u] = fz, dep[u] = dep[fz] + 1, siz[u] = 1;
          for (int v : T[u])
            if (v != fz) {
              DFS0(v, u);
              siz[u] += siz[v];
              if (siz[son[u]] < siz[v]) son[u] = v;
            }
        }
        
        void DFS1(int u, int fz, int tp) {
          dfn[u] = ++dfc, idf[dfc] = u, top[u] = tp;
          if (son[u]) DFS1(son[u], u, tp);
          for (int v : T[u])
            if (v != fz && v != son[u]) DFS1(v, u, v);
        }
        
        #define li (i << 1)
        #define ri (i << 1 | 1)
        #define mid ((l + r) >> 1)
        #define ls li, l, mid
        #define rs ri, mid + 1, r
        
        int dat[MS];
        
        void Build(int i, int l, int r) {
          if (l == r) {
            dat[i] = w[idf[l]];
            return;
          }
          Build(ls), Build(rs);
          dat[i] = std::min(dat[li], dat[ri]);
        }
        
        void Mdf(int i, int l, int r, int p, int x) {
          if (l == r) {
            dat[i] = x;
            return;
          }
          if (p <= mid)
            Mdf(ls, p, x);
          else
            Mdf(rs, p, x);
          dat[i] = std::min(dat[li], dat[ri]);
        }
        
        int Qur(int i, int l, int r, int a, int b) {
          if (r < a || b < l) return Inf;
          if (a <= l && r <= b) return dat[i];
          return std::min(Qur(ls, a, b), Qur(rs, a, b));
        }
        
        int main() {
          scanf("%d%d%d", &N, &M, &Q);
          for (int i = 1; i <= N; ++i) scanf("%d", &w[i]);
         cnt = N;
          for (int i = 1; i <= M; ++i) {
            int u, v;
            scanf("%d%d", &u, &v);
            G[u].push_back(v);
            G[v].push_back(u);
          }
          Tarjan(1), DFS0(1, 0), dfc = 0, DFS1(1, 0, 1);
          for (int i = 1; i <= N; ++i)
            if (faz[i]) S[faz[i]].insert(w[i]);
          for (int i = N + 1; i <= cnt; ++i) w[i] = *S[i].begin();
          Build(1, 1, cnt);
          for (int q = 1; q <= Q; ++q) {
            char opt[3];
            int x, y;
            scanf("%s%d%d", opt, &x, &y);
            if (*opt == 'C') {
              Mdf(1, 1, cnt, dfn[x], y);
              if (faz[x]) {
                int u = faz[x];
                S[u].erase(S[u].lower_bound(w[x]));
                S[u].insert(y);
                if (w[u] != *S[u].begin()) {
                  w[u] = *S[u].begin();
                  Mdf(1, 1, cnt, dfn[u], w[u]);
                }
              }
              w[x] = y;
            } else {
              int Ans = Inf;
              while (top[x] != top[y]) {
                if (dep[top[x]] < dep[top[y]]) std::swap(x, y);
                Ans = std::min(Ans, Qur(1, 1, cnt, dfn[top[x]], dfn[x]));
                x = faz[top[x]];
              }
              if (dfn[x] > dfn[y]) std::swap(x, y);
              Ans = std::min(Ans, Qur(1, 1, cnt, dfn[x], dfn[y]));
              if (x > N) Ans = std::min(Ans, w[faz[x]]);
              printf("%d\n", Ans);
            }
          }
          return 0;
        }
        ```

 
