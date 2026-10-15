import { Router } from 'express';
import mongoose from 'mongoose';

import ConflictError from '../../src/shared/errors/ConflictError.js';
import ForbiddenError from '../../src/shared/errors/ForbiddenError.js';
import errorsMessages from '../../src/shared/utils/errorsMessages.js';

const testRouter = Router();

testRouter.get('/conflict', (req, res, next) => {
  next(new ConflictError(errorsMessages.conflict));
});

testRouter.get('/forbidden', (req, res, next) => {
  next(new ForbiddenError(errorsMessages.forbidden));
});

testRouter.get('/cast', (req, res, next) => {
  next(new mongoose.Error.CastError('ObjectId', 'abc', '_id'));
});

testRouter.get('/validation', (req, res, next) => {
  next(new mongoose.Error.ValidationError());
});

export default testRouter;
