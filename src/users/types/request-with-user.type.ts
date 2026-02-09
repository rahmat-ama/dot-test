import { Request } from 'express';

// request from jwt strategy
export type ReqWithUser = Request & {
  user: {
    id: number;
    email: string;
    name: string;
  } | null;
};
