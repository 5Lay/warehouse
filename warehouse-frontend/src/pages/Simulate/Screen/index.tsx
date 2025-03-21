import { getGridData, updateGrid } from '@/services/ant-design-pro/api';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Flex, InputNumber, Popover, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
let canvas2DContext: CanvasRenderingContext2D;

const getCanvas2D = () => {
  return canvas2DContext;
};

const Screen: React.FC = () => {
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
  const [addNewRows, setAddNewRows] = useState<number>(0); // 新的行数
  const [addNewCols, setAddNewCols] = useState<number>(0); // 新的列数
  const [newRows, setNewRows] = useState<number>(1); // 新的行数
  const [newCols, setNewCols] = useState<number>(1); // 新的列数

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

    fetchGridData();
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

          // 绘制黄色矩形
          ctx.fillStyle = 'black'; // 黑色

          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              if (grid[i][j] === 1) {
                ctx.fillRect(j * gridSize, i * gridSize, gridSize, gridSize);
              }
            }
          }
        }
      }
    }
  }, [grid, rows, cols]);

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
