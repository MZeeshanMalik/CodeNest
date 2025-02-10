export interface AppErrorTypes {
  statusCode: number;
  status: string;
  isOpreational: boolean;
  message: string;
  stack?: string;
  path?: string;
  value?: string;
  keyValue?: any;
  errors?: Array<any>;
  code?: number;
  name?: string;
}
