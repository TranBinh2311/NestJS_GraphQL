// import { Request} from "express";

// export interface MyContext {
//     req: Request,
// }

import { Request, Response } from 'express';
import { User } from '../model/user.model';

type MyContext = {
  req: Request & { user?: User };
  res: Response;
};

export default MyContext;