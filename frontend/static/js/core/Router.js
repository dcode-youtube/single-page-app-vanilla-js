export default class Router {
    routeList = [];

    constructor(routes) {
        this.init(routes)
    }

    navigateTo = url => {
        history.pushState(null, null, url);
        this.run().then();
    };

    init = routes => {
        this.routeList = routes;

        window.addEventListener('popstate', this.run);

        document.addEventListener('DOMContentLoaded', () => {
            document.body.addEventListener('click', e => {
                if (e.target.matches('[data-link]')) {
                    e.preventDefault();
                    this.navigateTo(e.target.href);
                }
            });
            this.run().then();
        });
        this.run().then();
    };
    run = async () => {
        const routes = this.routeList;

        // Test each route for potential match
        const potentialMatches = routes.map(route => ({
                route: route,
                result: location.pathname.match(this.pathToRegex(route.path))
            })
        );

        let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

        if (!match) {
            match = {
                route: routes[0],
                result: [location.pathname]
            };
        }

       const loading = await this._getLoadingView(match);

        const view = loading.default ?
            new loading.default(this.getParams(match)) :
            new loading.view(this.getParams(match));

        if (match.route.title) {
            document.title = match.route.title;
            this.setActiveRouteOnElement(match);
        }

        document.querySelector('#app').innerHTML = await view.render();
    };

    setActiveRouteOnElement = (match) => {
        Array.from(document.querySelectorAll('[data-link]')).forEach(
            (el) => el.removeAttribute('data-active')
        );
        document.querySelector(
            `[data-link][href='${match.route.path}'], [data-link='${match.route.path}']`
        ).setAttribute('data-active', 'route');
    }

    pathToRegex = path => new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

    getParams = match => {
        const values = match.result.slice(1);
        const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

        return Object.fromEntries(keys.map((key, i) => {
            return [key, values[i]];
        }));
    };

    _getLoadingView = async (match) => typeof match.route.view === 'function' ?
        await match.route.view() :
        await match.route.view
}

