??? note "参考代码"
    ```cpp
    #include <bits/stdc++.h>
    #define LL long long
    #define il inline
    const int oo = 0x3f3f3f3f;
    const int N = 1e5 + 10;
    const int e[] = {6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 6, 6, 7,  8,
                     8, 8, 8, 8, 7, 6, 6, 7, 8, 9, 9, 9, 8, 7, 6, 6, 7, 8, 9, 10, 9,
                     8, 7, 6, 6, 7, 8, 9, 9, 9, 8, 7, 6, 6, 7, 8, 8, 8, 8, 8, 7,  6,
                     6, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6};
    int ans = -oo, a[10][10], stk[N];
    il int read() {
      int x = 0, f = 0, ch;
      while (!isdigit(ch = getchar())) f |= ch == '-';
      while (isdigit(ch)) x = (x << 1) + (x << 3) + (ch ^ 48), ch = getchar();
      return f ? -x : x;
    }
    int GetWeight(int row, int col, int num) {
      return num * e[(row - 1) * 9 + (col - 1)];
    }
    struct DLX {
      static const int MAXSIZE = 1e5 + 10;
    #define IT(i, A, x) for (i = A[x]; i != x; i = A[i])
      int n, m, tot, first[MAXSIZE + 10], siz[MAXSIZE + 10];
      int L[MAXSIZE + 10], R[MAXSIZE + 10], U[MAXSIZE + 10], D[MAXSIZE + 10];
      int col[MAXSIZE + 10], row[MAXSIZE + 10];
      void build(const int &r, const int &c) {
        n = r, m = c;
        for (int i = 0; i <= c; ++i) {
          L[i] = i - 1, R[i] = i + 1;
          U[i] = D[i] = i;
        }
        L[0] = c, R[c] = 0, tot = c;
        memset(first, 0, sizeof(first));
        memset(siz, 0, sizeof(siz));
      }
      void insert(const int &r, const int &c) {
        col[++tot] = c, row[tot] = r, ++siz[c];
        D[tot] = D[c], U[D[c]] = tot, U[tot] = c, D[c] = tot;
        if (!first[r])
          first[r] = L[tot] = R[tot] = tot;
        else {
          R[tot] = R[first[r]], L[R[first[r]]] = tot;
          L[tot] = first[r], R[first[r]] = tot;
        }
      }
      void remove(const int &c) {
        int i, j;
        L[R[c]] = L[c], R[L[c]] = R[c];
        IT(i, D, c) IT(j, R, i) U[D[j]] = U[j], D[U[j]] = D[j], --siz[col[j]];
      }
      void recover(const int &c) {
        int i, j;
        IT(i, U, c) IT(j, L, i) U[D[j]] = D[U[j]] = j, ++siz[col[j]];
        L[R[c]] = R[L[c]] = c;
      }
      void dance(int dep) {
        int i, j, c = R[0];
        if (!R[0]) {
          int cur_ans = 0;
          for (i = 1; i < dep; ++i) {
            int cur_row = (stk[i] - 1) / 9 / 9 + 1;
            int cur_col = (stk[i] - 1) / 9 % 9 + 1;
            int cur_num = (stk[i] - 1) % 9 + 1;
            cur_ans += GetWeight(cur_row, cur_col, cur_num);
          }
          ans = std::max(ans, cur_ans);
          return;
        }
        IT(i, R, 0) if (siz[i] < siz[c]) c = i;
        remove(c);
        IT(i, D, c) {
          stk[dep] = row[i];
          IT(j, R, i) remove(col[j]);
          dance(dep + 1);
          IT(j, L, i) recover(col[j]);
        }
        recover(c);
      }
    } solver;
    int GetId(int row, int col, int num) {
      return (row - 1) * 9 * 9 + (col - 1) * 9 + num;
    }
    void Insert(int row, int col, int num) {
      int dx = (row - 1) / 3 + 1;    // r
      int dy = (col - 1) / 3 + 1;    // c
      int room = (dx - 1) * 3 + dy;  // room
      int id = GetId(row, col, num);
      int f1 = (row - 1) * 9 + num;            // task 1
      int f2 = 81 + (col - 1) * 9 + num;       // task 2
      int f3 = 81 * 2 + (room - 1) * 9 + num;  // task 3
      int f4 = 81 * 3 + (row - 1) * 9 + col;   // task 4
      solver.insert(id, f1);
      solver.insert(id, f2);
      solver.insert(id, f3);
      solver.insert(id, f4);
    }
    int main() {
      solver.build(729, 324);
      for (int i = 1; i <= 9; ++i)
        for (int j = 1; j <= 9; ++j) {
          a[i][j] = read();
          for (int v = 1; v <= 9; ++v) {
            if (a[i][j] && v != a[i][j]) continue;
            Insert(i, j, v);
          }
        }
      solver.dance(1);
      printf("%d", ans == -oo ? -1 : ans);
      return 0;
    }
    ```
