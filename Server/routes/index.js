// Importar cada ruta
import usersRouter from './usersRouter.js';
import brandsRouter from './brandsRouter.js';
import categoriesRouter from './categoriesRouter.js';
import awardsRouter from './awardsRouter.js';
import pointsRouter from './pointsRouter.js';
import redemptionsRouter from './redemptionsRouter.js';
import adminRouter from './adminRouter.js';
import historiesRouter from './historiesRouter.js';
import favoritesRouter from './favoritesRouter.js';
import eventsRouter from './eventsRouter.js';

function routerAPI(app){
    // Definir cada ruta
    app.use('/api/users', usersRouter);
    app.use('/api/brands', brandsRouter);
    app.use('/api/categories', categoriesRouter);
    app.use('/api/awards', awardsRouter);
    app.use('/api/points', pointsRouter);
    app.use('/api/redemptions', redemptionsRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/histories', historiesRouter);
    app.use('/api/favorites', favoritesRouter);
    app.use('/api/events', eventsRouter);
}

export default routerAPI;