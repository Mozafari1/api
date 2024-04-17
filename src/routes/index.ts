// src/routes/index.ts
import express from 'express';

import blogsRouter from './blogs';
import usersRouter from './users';
import pricesRouter from './prices';
import servicesRouter from './services';
import projectsRouter from './projects';
import contactsRouter from './contacts';
import uploadsRouter from './uploads';
import filesRouter from './files';
import commnsRouter from './commons';
import inboxesRouter from './inboxes';
import connectionsTypeRouter from './connectionsType';
import feedbacksRouter from './feedbacks';
const router = express.Router();

router.use(blogsRouter);
router.use(usersRouter);
router.use(pricesRouter)
router.use(servicesRouter)
router.use(projectsRouter)
router.use(contactsRouter)
router.use(uploadsRouter)
router.use(filesRouter)
router.use(commnsRouter)
router.use(inboxesRouter)
router.use(connectionsTypeRouter)
router.use(feedbacksRouter)
export default router;
