import Router from './core/Router.js';

new Router([
    {
        path: '/',
        title: 'Dashboard',
        view: await import('./views/Dashboard.js')
    },
    {
        path: '/posts',
        title: 'Posts',
        view: async () => await import('./views/Posts.js')
    },
    {
        path: '/posts/:id',
        title: 'Viewing Post',
        view: async () => await import('./views/PostView.js')
    },
    {
        path: '/settings',
        title: 'Settings',
        view: async () => await import('./views/Settings.js')
    }
]);
