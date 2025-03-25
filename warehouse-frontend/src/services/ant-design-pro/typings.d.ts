// @ts-ignore
/* eslint-disable */

declare namespace API {
  type BaseResponse<T> = {
    code: number;
    data: T;
    message: string;
    description: string;
  };

  type Coordinate = {
    x: number;
    y: number;
  };

  type PathRequest = {
    agvId: number[];
    orderId: number[];
    grid: number[][];
  };

  type PathResponse = {
    starts: Coordinate[];
    goals: Coordinate[];
    grid: number[][];
    paths: Coordinate[][];
  }

  type RecordDto = {
    starts: Coordinate[];
    goals: Coordinate[];
    grid: number[][];
    paths: Coordinate[][];
    userId: number;
  };

  type Record = {
    id: number;
    starts: Coordinate[];
    goals: Coordinate[];
    grid: number[][];
    paths: Coordinate[][];
    userId: number;
    createTime: Date;
  };

  type Order = {
    id:number;
    goalX?: number;
    goalY?: number;
    createTime?: Date;
    updateTime?: Date;
  };

  type GridData = {
    id: number
    grid: number[][];
  };
  
  type CurrentUser = {
    id: number
    username?: string;
    nickname?: string;
    gender?: number;
    age?: number;
    avatar?: string;
    address?: string;
    phone?: string;
    email?: string;
    userStatus?: number;
    userRole?: number;
    createTime?: Date;
  };

  type Agv = {
    id: number;
    startX?: number;
    startY?: number;
    createTime?: Date;
    updateTime?: Date;
  }

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type RegisterResult = number;

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type RegisterParams = {
    username?: string;
    password?: string;
    checkPassword?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
