package com.wulei.warehousebackend.service.utils;

import com.wulei.warehousebackend.model.dto.Coordinate;

import java.util.Arrays;

public class HungarianAlgorithm {
    private int[][] costMatrix;
    private int size;
    private int[] match;  // 匹配结果：match[i] = j 表示AGV i分配到订单j

    public HungarianAlgorithm(Coordinate[] agvs, Coordinate[] orders) {
        // 创建成本矩阵
        this.size = Math.max(agvs.length, orders.length);
        this.costMatrix = new int[size][size];

        // 填充成本矩阵
        for (int i = 0; i < agvs.length; i++) {
            for (int j = 0; j < orders.length; j++) {
                costMatrix[i][j] = agvs[i].manhattanDistance(orders[j]);
            }
            // 补充虚拟列（如果订单数 < AGV数）
            Arrays.fill(costMatrix[i], orders.length, size, Integer.MAX_VALUE);
        }
        // 补充虚拟行（如果AGV数 < 订单数）
        for (int i = agvs.length; i < size; i++) {
            Arrays.fill(costMatrix[i], Integer.MAX_VALUE);
        }
    }

    public int[] execute() {
        int[] u = new int[size+1];
        int[] v = new int[size+1];
        int[] p = new int[size+1];
        int[] way = new int[size+1];

        for (int i = 1; i <= size; i++) {
            p[0] = i;
            int j0 = 0;
            int[] minv = new int[size+1];
            Arrays.fill(minv, Integer.MAX_VALUE);
            boolean[] used = new boolean[size+1];

            do {
                used[j0] = true;
                int i0 = p[j0], delta = Integer.MAX_VALUE, j1 = 0;

                for (int j = 1; j <= size; j++) {
                    if (!used[j]) {
                        int cur = costMatrix[i0-1][j-1] - u[i0] - v[j];
                        if (cur < minv[j]) {
                            minv[j] = cur;
                            way[j] = j0;
                        }
                        if (minv[j] < delta) {
                            delta = minv[j];
                            j1 = j;
                        }
                    }
                }

                for (int j = 0; j <= size; j++) {
                    if (used[j]) {
                        u[p[j]] += delta;
                        v[j] -= delta;
                    } else {
                        minv[j] -= delta;
                    }
                }
                j0 = j1;
            } while (p[j0] != 0);

            do {
                int j1 = way[j0];
                p[j0] = p[j1];
                j0 = j1;
            } while (j0 != 0);
        }

        int[] result = new int[size];
        for (int j = 1; j <= size; j++) {
            if (p[j] != 0) {
                result[p[j]-1] = j-1;
            }
        }
        return result;
    }
}

