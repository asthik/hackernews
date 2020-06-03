import path from 'path';
import fs, { promises } from 'fs';
import React from 'react';
import express from 'express';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import serialize from 'serialize-javascript';
import Routes from './routes';
import { matchRoutes } from 'react-router-config';

import App from './components/App';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static('./build'));

app.get('*', (req,res) => {
    const currentRoute = Routes.find(route => matchPath(req.url, route)) || {};
    // const matchRoutes = matchRoutes(Routes, req.url);
    let promise;
    // let promises=[];

    if(currentRoute.loadData) {
        console.log('in loadData if');
        promise = currentRoute.loadData();
    }else {
        console.log('in else block');
        promise = Promise.resolve(null);
    }

    // matchRoutes.forEach(route => {
    //     if(route.loadData) {
    //         promises.push(route.loadData());
    //     }
    // });

    promise.then(data => {

        const context ={};
        const app = ReactDOMServer.renderToString(
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>);

        const indexFile = path.resolve('./build/index.html');
        fs.readFile(indexFile, 'utf8', (err, indexdata) => {
            if(err) {
                console.error('Oops!! something went wrong:', err);
                return res.status(500).send('Better luck next time...');
            }
            if(context.status === 404) {
                res.status(404);
            }
            if(context.url){
                return res.redirect(301, context.url);
            }
            return res.send(
                indexdata
                  .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
                  .replace(
                      '</body>',
                      `<script>window.__ROUTE_DATA__ = ${serialize(data)}</script></body>`
                  )
            );
        });
    });
});

app.listen(PORT, () => {
    console.log(`SERVER is listening on port${PORT}`);
});