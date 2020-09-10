import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionController from './controllers/ConnectionsController';

const routes = express.Router();
const classescontrollers = new  ClassesController();
const connectionControler = new ConnectionController();

routes.get('/classes', classescontrollers.index);
routes.post('/classes', classescontrollers.create);

routes.get('/connections', connectionControler.index);
routes.post('/connections', connectionControler.create);


export default routes;