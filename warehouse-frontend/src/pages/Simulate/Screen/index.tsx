import {
  fetchPath,
  getAgvList,
  getGridData,
  getOrderList,
  saveRecord,
  updateGrid,
} from '@/services/ant-design-pro/api';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Flex, InputNumber, message, Popover, Select, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
let canvas2DContext: CanvasRenderingContext2D;

const getCanvas2D = () => {
  return canvas2DContext;
};

interface Path {
  x: number;
  y: number;
}

const Screen: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<number[][]>([]); // 用于存储从后端获取的网格数据
  const [originalGrid, setOriginalGrid] = useState<number[][]>([]); // 用于存储原始网格数据
  const [rows, setRows] = useState(0); // 网格行数
  const [cols, setCols] = useState(0); // 网格列数
  const [isEditing, setIsEditing] = useState(false); // 是否处于编辑模式
  const [isResetPopoverVisible, setIsResetPopoverVisible] = useState(false); // 是否显示Popover
  const [isAddRowsPopoverVisible, setIsAddRowsPopoverVisible] = useState(false); // 是否显示Popover
  const [isAddColsPopoverVisible, setIsAddColsPopoverVisible] = useState(false);
  const [isAgvPopoverVisible, setIsAgvPopoverVisible] = useState(false);
  const [isOrderPopoverVisible, setIsOrderPopoverVisible] = useState(false);
  const [addNewRows, setAddNewRows] = useState<number>(0); // 新的行数
  const [addNewCols, setAddNewCols] = useState<number>(0); // 新的列数
  const [newRows, setNewRows] = useState<number>(1); // 新的行数
  const [newCols, setNewCols] = useState<number>(1); // 新的列数
  const [agvList, setAgvList] = useState<API.Agv[]>([]); // AGV列表
  const [selectedAgvList, setSelectedAgvList] = useState<API.Agv[]>([]); // 选中的AGV列表
  const [selectedAgv, setSelectedAgv] = useState<API.Agv>(); // 选中的AGV
  const [orderList, setOrderList] = useState<API.Order[]>([]); // AGV列表
  const [selectedOrderList, setSelectedOrderList] = useState<API.Order[]>([]); // 选中的AGV列表
  const [selectedOrder, setSelectedOrder] = useState<API.Order>(); // 选中的AGV
  const [paths, setPaths] = useState<Path[][]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStates, setAnimationStates] = useState<
    { currentStep: number; progress: number }[]
  >([]);
  const animationRef = useRef<number>();
  const speed = 0.05; // 移动速度（每帧进度增加值）

  // 模拟从后端获取网格数据
  useEffect(() => {
    const fetchGridData = async () => {
      try {
        const res = await getGridData(1);

        const grid = res.data.grid;
        setGrid(grid);
        setOriginalGrid(grid); // 保存原始网格数据
        setRows(grid.length);
        setCols(grid[0].length);
      } catch (error) {
        console.error('Failed to fetch grid data:', error);
      }
    };

    const fetchAgvList = async () => {
      try {
        const res = await getAgvList();
        setAgvList(res.data);
      } catch (error) {
        console.error('Failed to fetch AGV list:', error);
      }
    };

    const fetchOderList = async () => {
      const res = await getOrderList();
      setOrderList(res.data);
    };

    fetchGridData();
    fetchAgvList();
    fetchOderList();
  }, []);

  // 绘制网格
  useEffect(() => {
    if (rows === 0 || cols === 0) return;

    const screen = screenRef.current;
    if (screen) {
      const screenRect = screen.getBoundingClientRect();
      const gridSize = Math.min(screenRect.height / rows, screenRect.width / cols);

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = cols * gridSize;
        canvas.height = rows * gridSize;

        canvas2DContext = canvas.getContext('2d') as CanvasRenderingContext2D;
        const ctx = getCanvas2D();

        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 绘制背景网格
          ctx.strokeStyle = '#e0e0e0';
          ctx.lineWidth = 1;

          // 绘制水平线
          for (let i = 0; i <= rows; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(cols * gridSize, i * gridSize);
            ctx.stroke();
          }

          // 绘制垂直线
          for (let i = 0; i <= cols; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, rows * gridSize);
            ctx.stroke();
          }

          // 绘制货架
          ctx.fillStyle = 'black'; // 黑色

          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              if (grid[i][j] === 1) {
                ctx.fillRect(j * gridSize, i * gridSize, gridSize, gridSize);
              }
            }
          }

          // 绘制被选择的AGV
          for (let i = 0; i < selectedAgvList.length; i++) {
            if (selectedAgvList[i]) {
              const x = (selectedAgvList[i]?.startX ?? 0) * gridSize + gridSize / 2;
              const y = (selectedAgvList[i]?.startY ?? 0) * gridSize + gridSize / 2;
              const radius = gridSize / 3; // 圆形半径为网格大小的1/3

              ctx.fillStyle = 'blue';
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // 绘制被选择的订单
          for (let i = 0; i < selectedOrderList.length; i++) {
            if (selectedOrderList[i]) {
              const x = (selectedOrderList[i]?.goalX ?? 0) * gridSize + gridSize / 2;
              const y = (selectedOrderList[i]?.goalY ?? 0) * gridSize + gridSize / 2;
              const triangleSize = gridSize / 3; // 三角形大小为网格大小的1/3

              ctx.fillStyle = 'red';
              ctx.beginPath();
              ctx.moveTo(x, y - triangleSize);
              ctx.lineTo(x - triangleSize, y + triangleSize);
              ctx.lineTo(x + triangleSize, y + triangleSize);
              ctx.closePath();
              ctx.fill();
            }
          }

          // 绘制AGV和路径
          ctx.fillStyle = 'blue';
          paths.forEach((path, agvIndex) => {
            const agv = agvList[agvIndex];
            if (agv) {
              // 绘制路径
              ctx.strokeStyle = 'green';
              ctx.lineWidth = 2;
              ctx.beginPath();
              path.forEach((point, index) => {
                if (index === 0) {
                  ctx.moveTo(point.x * gridSize + gridSize / 2, point.y * gridSize + gridSize / 2);
                } else {
                  ctx.lineTo(point.x * gridSize + gridSize / 2, point.y * gridSize + gridSize / 2);
                }
              });
              ctx.stroke();

              // 绘制AGV
              const currentPoint = path[0];
              ctx.beginPath();
              ctx.arc(
                currentPoint.x * gridSize + gridSize / 2,
                currentPoint.y * gridSize + gridSize / 2,
                gridSize / 3,
                0,
                Math.PI * 2,
              );
              ctx.fill();
            }
          });

          // ============= 新增动画AGV绘制部分 =============
          animationStates.forEach((state, agvIndex) => {
            const path = paths[agvIndex];
            if (!path || path.length === 0) return;

            const currentStep = Math.min(state.currentStep, path.length - 1);
            const currentPoint = path[currentStep];

            // 计算当前实际位置
            let displayX = currentPoint.x;
            let displayY = currentPoint.y;
            let rotation = 0;

            if (currentStep < path.length - 1) {
              const nextPoint = path[currentStep + 1];
              displayX = currentPoint.x + (nextPoint.x - currentPoint.x) * state.progress;
              displayY = currentPoint.y + (nextPoint.y - currentPoint.y) * state.progress;
              rotation = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x);
            }

            // 绘制动画中的AGV
            ctx.save();
            ctx.translate(displayX * gridSize + gridSize / 2, displayY * gridSize + gridSize / 2);
            ctx.rotate(rotation + Math.PI / 2);

            // 绘制圆形车身
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(0, 0, gridSize / 3, 0, Math.PI * 2);
            ctx.fill();

            // 绘制方向箭头
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(0, -gridSize / 4);
            ctx.lineTo(gridSize / 8, -gridSize / 8);
            ctx.lineTo(-gridSize / 8, -gridSize / 8);
            ctx.fill();

            ctx.restore();
          });
        }
      }
    }
  }, [grid, rows, cols, selectedAgvList, selectedOrderList, paths, animationStates]);

  // 初始化动画状态
  useEffect(() => {
    if (paths.length > 0) {
      setAnimationStates(
        paths.map(() => ({
          currentStep: 0,
          progress: 0,
        })),
      );
    }
  }, [paths]);

  // 动画逻辑
  useEffect(() => {
    const animate = () => {
      setAnimationStates((prevStates) => {
        let allFinished = true;
        const newStates = prevStates.map((state, agvIndex) => {
          const path = paths[agvIndex];
          if (!path || state.currentStep >= path.length - 1) return state;

          allFinished = false;
          const newProgress = state.progress + speed;

          if (newProgress >= 1) {
            return {
              currentStep: state.currentStep + 1,
              progress: 0,
            };
          }
          return {
            ...state,
            progress: newProgress,
          };
        });

        if (allFinished) {
          setIsAnimating(false);
          // 自动重置到初始状态
          setAnimationStates(
            paths.map(() => ({
              currentStep: 0,
              progress: 0,
            })),
          );
        }
        return newStates;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // 进入编辑模式时保存当前网格数据
  const enterEditMode = () => {
    setOriginalGrid(grid); // 保存当前网格数据为原始数据
    setIsEditing(true);
  };

  // 处理格子点击事件
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEditing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const gridSize = Math.min(canvas.height / rows, canvas.width / cols);

    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      const newGrid = grid.map((r, i) =>
        i === row ? r.map((c, j) => (j === col ? (c === 1 ? 0 : 1) : c)) : r,
      );
      setGrid(newGrid);
    }
  };

  // 取消修改
  const cancelEdit = () => {
    setGrid(originalGrid); // 恢复进入编辑模式时的网格数据
    setRows(originalGrid.length);
    setCols(originalGrid[0].length);
    setIsEditing(false);
  };

  // 清空地图
  const clearGrid = () => {
    const newGrid = Array(rows).fill(Array(cols).fill(0));
    setGrid(newGrid);
  };

  // 保存修改到后端
  const saveGrid = async () => {
    try {
      await updateGrid({ id: 1, grid });
      setOriginalGrid(grid); // 保存当前网格数据为新的原始数据
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save grid data:', error);
    }
  };

  // 添加n行
  const addRows = (direction: string, n: number) => {
    let newGrid = [];
    if (direction === 'top') {
      for (let i = 0; i < n; i++) {
        newGrid.push(Array(cols).fill(0));
      }
    }
    newGrid = [...newGrid, ...grid];
    if (direction === 'bottom') {
      for (let i = 0; i < n; i++) {
        newGrid.push(Array(cols).fill(0));
      }
    }
    setGrid(newGrid);
    setRows(newGrid.length);
  };

  // 添加n列
  const addCols = (direction: string, n: number) => {
    let newGrid;
    if (direction === 'right') {
      newGrid = grid.map((row) => {
        return [...row, ...Array(n).fill(0)];
      });
    } else {
      newGrid = grid.map((row) => {
        return [...Array(n).fill(0), ...row];
      });
    }

    setGrid(newGrid);
    setCols(newGrid[0].length);
  };

  // 重置grid
  const resetGrid = () => {
    if (newRows > 0 && newCols > 0) {
      const newGrid = Array(newRows).fill(Array(newCols).fill(0));
      setGrid(newGrid);
      setRows(newRows);
      setCols(newCols);
      setIsResetPopoverVisible(false);
    } else {
      alert('请输入有效的正整数');
    }
  };

  const submitTask = async (requestData: API.PathRequest) => {
    const res = await fetchPath(requestData);

    const taskId = res.data; // Use res.data directly or parse it if necessary
    console.log('Task ID:', taskId);
    // 2. 建立WebSocket连接并等待结果
    const result = await new Promise((resolve, reject) => {
      const socket = new WebSocket(`ws://localhost:8080/api/ws/task-status/${taskId}`);

      // 超时处理（可选）
      const timeoutId = setTimeout(() => {
        socket.close();
        reject(new Error('WebSocket connection timed out'));
      }, 30000); // 30秒超时

      socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      socket.onmessage = (event) => {
        clearTimeout(timeoutId); // 清除超时计时器
        const response = JSON.parse(event.data);
        setPaths(response.paths);
        socket.close();
        resolve(response); // 解析Promise并返回结果
      };

      socket.onerror = (error) => {
        clearTimeout(timeoutId);
        socket.close();
        reject(new Error(`WebSocket error: ${error.type}`));
      };

      socket.onclose = (event) => {
        if (!event.wasClean && !result) {
          clearTimeout(timeoutId);
          reject(new Error('Connection closed before receiving result'));
        }
      };
    });
    // 3. 返回最终结果
    return result;
  };

  //
  const handleSimulation = async () => {
    // 提取 agvId
    const agvId = selectedAgvList.map((agv) => agv.id);

    // 提取 orderId
    const orderId = selectedOrderList.map((order) => order.id);
    const requestData: API.PathRequest = {
      agvId: agvId,
      orderId: orderId,
      grid: grid,
    };
    try {
      console.log('Request data:', requestData);
      const result = (await submitTask(requestData)) as API.PathResponse;
      console.log('Final paths:', result);
      // 更新UI或执行其他操作
    } catch (error) {
      console.error('Error processing task:', error);
      // 显示错误提示
    }
  };

  // 保存记录处理函数
  const handleSaveRecord = async () => {
    if (!currentUser) {
      message.error('请先登录后再保存记录');
      return;
    }

    // 构造请求数据
    const recordData: API.RecordDto = {
      starts: selectedAgvList.map(agv => ({
        x: agv.startX || 0,
        y: agv.startY || 0
      })),
      goals: selectedOrderList.map(order => ({
        x: order.goalX || 0,
        y: order.goalY || 0
      })),
      grid: grid,
      paths: paths,
      userId: currentUser.id
    };
    console.log('Record data:', recordData);
  await saveRecord(recordData);
  
  };

  const addRowsContent = (
    <Space>
      <InputNumber
        addonBefore="行数"
        value={addNewRows}
        onChange={(value) => setAddNewRows(value || 0)}
        placeholder="输入行数"
        min={1}
      />
      <Button type="primary" onClick={() => addRows('top', addNewRows)}>
        添加行
      </Button>
    </Space>
  );

  const addColsContent = (
    <Space>
      <InputNumber
        addonBefore="列数"
        value={addNewCols}
        onChange={(value) => setAddNewCols(value || 0)}
        placeholder="输入列数"
        min={1}
      />
      <Button type="primary" onClick={() => addCols('left', addNewCols)}>
        添加列
      </Button>
    </Space>
  );

  const resetContent = (
    <Space direction="vertical">
      <InputNumber
        addonBefore="行数"
        value={newRows}
        onChange={(value) => setNewRows(value || 0)}
        placeholder="输入行数"
        min={1}
      />
      <InputNumber
        addonBefore="列数"
        value={newCols}
        onChange={(value) => setNewCols(value || 0)}
        placeholder="输入列数"
        min={1}
      />
      <Space>
        <Button onClick={() => setIsResetPopoverVisible(false)}>取消</Button>
        <Button type="primary" onClick={resetGrid}>
          确定
        </Button>
      </Space>
    </Space>
  );

  const agvPopoverContent = (
    <Space direction="vertical" style={{ width: '200px' }}>
      <Select
        placeholder="选择AGV"
        options={agvList.map((agv) => ({
          value: agv.id,
          label: 'AGV' + agv.id + ':' + '(' + agv.startX + ',' + agv.startY + ')',
        }))}
        onChange={(value) => {
          const selected = agvList.find((agv) => agv.id === value);
          if (selected) {
            setSelectedAgv(selected);
          }
        }}
      />
      <Space>
        <Button onClick={() => setIsAgvPopoverVisible(false)}>取消</Button>
        <Button
          type="primary"
          onClick={() => {
            setIsAgvPopoverVisible(false);
            // 这里可以添加确认逻辑，比如将选中的AGV添加到地图上
            if (selectedAgv) {
              // 检查是否已经存在相同的 selectedOrder
              const isAgvExists = selectedAgvList.some(
                (agv) => agv.id === selectedAgv.id, // 假设 order 有唯一标识符 id
              );

              if (!isAgvExists) {
                if (
                  selectedAgv.startX !== undefined &&
                  selectedAgv.startY !== undefined &&
                  grid[selectedAgv.startX][selectedAgv.startY] === 1
                ) {
                  message.error('该位置已经有货架');
                  return;
                }
                setSelectedAgvList([...selectedAgvList, selectedAgv]);
              } else {
                message.warning('该AGV已存在');
              }
            }
          }}
        >
          确定
        </Button>
      </Space>
    </Space>
  );

  const orderPopoverContent = (
    <Space direction="vertical" style={{ width: '200px' }}>
      <Select
        placeholder="选择订单"
        options={orderList.map((order) => ({
          value: order.id,
          label: '订单' + order.id + ':' + '(' + order.goalX + ',' + order.goalY + ')',
        }))}
        onChange={(value) => {
          const selected = orderList.find((order) => order.id === value);
          if (selected) {
            setSelectedOrder(selected);
          }
        }}
      />
      <Space>
        <Button onClick={() => setIsOrderPopoverVisible(false)}>取消</Button>
        <Button
          type="primary"
          onClick={() => {
            setIsOrderPopoverVisible(false);
            // 这里可以添加确认逻辑，比如将选中的AGV添加到地图上
            if (selectedOrder) {
              // 检查是否已经存在相同的 selectedOrder
              const isOrderExists = selectedOrderList.some(
                (order) => order.id === selectedOrder.id, // 假设 order 有唯一标识符 id
              );

              if (!isOrderExists) {
                if (
                  selectedOrder.goalX !== undefined &&
                  selectedOrder.goalY !== undefined &&
                  grid[selectedOrder.goalX][selectedOrder.goalY] === 1
                ) {
                  message.error('该位置已经有货架');
                  return;
                }
                setSelectedOrderList([...selectedOrderList, selectedOrder]);
              } else {
                message.warning('该订单已存在');
              }
            }
          }}
        >
          确定
        </Button>
      </Space>
    </Space>
  );

  return (
    <div
      id="screen"
      ref={screenRef}
      style={{
        margin: '10 auto',
        display: 'flex',
        justifyContent: 'center',
        width: '80vw',
        height: '70vh',
      }}
    >
      <Flex gap="middle" vertical>
        <Popover
          content={agvPopoverContent}
          title="添加AGV"
          trigger="click"
          visible={isAgvPopoverVisible}
          onVisibleChange={setIsAgvPopoverVisible}
          placement="right"
        >
          <Button type="primary">添加AGV</Button>
        </Popover>
        <Popover
          content={orderPopoverContent}
          title="添加订单"
          trigger="click"
          visible={isOrderPopoverVisible}
          onVisibleChange={setIsOrderPopoverVisible}
          placement="right"
        >
          <Button type="primary">添加订单</Button>
        </Popover>
        <Button type="primary" onClick={handleSimulation}>
          开始仿真
        </Button>
        <Button
          type="primary"
          onClick={() => setIsAnimating(!isAnimating)}
          disabled={paths.length === 0 || animationStates.length === 0}
        >
          {isAnimating ? '暂停动画' : '开始动画'}
        </Button>
        <Button
          type="primary"
          onClick={handleSaveRecord}
          disabled={paths.length === 0 || !currentUser}
        >
          保存记录
        </Button>
        <Button
          type="default"
          onClick={() => {
            setIsAnimating(false);
            setAnimationStates(
              paths.map(() => ({
                currentStep: 0,
                progress: 0,
              })),
            );
          }}
          disabled={paths.length === 0}
        >
          重置动画
        </Button>
      </Flex>

      <canvas
        ref={canvasRef}
        id="canvasContainer"
        style={{ margin: '0 auto' }}
        onClick={handleCanvasClick}
      ></canvas>

      {/* 修改按钮 */}
      {!isEditing && (
        <Button type="primary" onClick={enterEditMode}>
          编辑地图
        </Button>
      )}

      {/* 编辑模式下的按钮（保存和清空） */}
      {isEditing && (
        <Flex gap="middle" vertical>
          <Button type="primary" onClick={saveGrid}>
            保存修改
          </Button>
          <Button type="primary" onClick={clearGrid}>
            清空地图
          </Button>
          <Button type="primary" onClick={cancelEdit}>
            取消修改
          </Button>
          <Popover
            content={addRowsContent}
            title="添加行"
            visible={isAddRowsPopoverVisible}
            onVisibleChange={setIsAddRowsPopoverVisible}
            trigger="click"
            placement="left"
          >
            <Button type="primary">添加列</Button>
          </Popover>

          <Popover
            content={addColsContent}
            title="添加列"
            visible={isAddColsPopoverVisible}
            onVisibleChange={setIsAddColsPopoverVisible}
            trigger="click"
            placement="left"
          >
            <Button type="primary">添加列</Button>
          </Popover>

          <Popover
            content={resetContent}
            title="重置地图"
            visible={isResetPopoverVisible}
            onVisibleChange={setIsResetPopoverVisible}
            trigger="click"
            placement="left"
          >
            <Button type="primary">重置地图</Button>
          </Popover>
        </Flex>
      )}

      {/* 上下左右添加删除按钮 */}
      {isEditing && (
        <>
          {/* 上方添加行按钮 */}
          <Flex
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '30px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlusCircleOutlined
              onClick={() => addRows('top', 1)}
              style={{
                fontSize: '24px',
                color: '#007bff',
                cursor: 'pointer',
              }}
            />
          </Flex>

          {/* 下方添加行按钮 */}
          <Flex
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '30px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlusCircleOutlined
              onClick={() => addRows('bottom', 1)}
              style={{
                fontSize: '24px',
                color: '#007bff',
                cursor: 'pointer',
              }}
            />
          </Flex>

          {/* 左侧添加列按钮 */}
          <Flex
            style={{
              position: 'absolute',
              left: '0',
              top: '0',
              bottom: '0',
              width: '30px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlusCircleOutlined
              onClick={() => addCols('left', 1)}
              style={{
                fontSize: '24px',
                color: '#007bff',
                cursor: 'pointer',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            />
          </Flex>

          {/* 右侧添加列按钮 */}
          <Flex
            style={{
              position: 'absolute',
              right: '0',
              top: '0',
              bottom: '0',
              width: '30px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlusCircleOutlined
              onClick={() => addCols('right', 1)}
              style={{
                fontSize: '24px',
                color: '#007bff',
                cursor: 'pointer',
                writingMode: 'vertical-rl',
              }}
            />
          </Flex>
        </>
      )}
    </div>
  );
};
export default Screen;
