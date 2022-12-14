const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const loadFile = async (pathname, ext) => {
    return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', window.location.origin + '/static/js/views/'+pathname+'.'+ext);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                // reject();
            }
        };
        xhr.onerror = function () {
            // reject();
        };
        xhr.send();
    });
};
const router = async function() {
    if (typeof this.customScope === 'undefined') {
        this.customScope = {};
    }
    if (typeof this.js === 'undefined') {
        this.js = {};
    }
    const routes = [
        { path: "/", viewName: 'Dashboard' },
        { path: "/posts", viewName: 'Posts' },
        { path: "/posts/:id", viewName: 'PostView' },
        { path: "/dashboard/:id/:name", viewName: 'PostView' },
        { path: "/posts/:id/:name", viewName: 'PostView' },
        { path: "/settings", viewName: 'Settings' }
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    // let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);
    let match = routes.find(r => {
        let rSplit = r.path.split('/').filter(aaa => { return aaa !== '' });
        let colonIndices = rSplit.reduce((r, n, i) => {
            n.startsWith(':') && r.push(i);            
            return r;
          }, []);
        let localPath = location.pathname.split('/').filter(aaa => { return aaa !== '' });
        let localPathCheck = localPath.filter((elem, indx) => !colonIndices.includes(indx));
        let routeCheck = rSplit.filter(bb => { return !bb.startsWith(':') })
        if(localPathCheck.toLocaleString() === routeCheck.toLocaleString()) {
            return r;
        }
    });

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }
    
    if (typeof window.currentObjects !== 'undefined') {
        for (const cO in window.currentObjects) {
            delete window[cO];
        }
    }

    const _module = await import('./views/'+match.viewName+'.js')

    window.currentObjects = _module[match.viewName];
    for (const f in _module[match.viewName]) {
        window[f] = _module[match.viewName][f];
    }
    if (typeof window.onInit !== 'undefined'){
        window.onInit();
    }
    this.customScope[match.viewName] = typeof this.customScope[match.viewName] === 'undefined' ? await this.loadFile(match.viewName,'html') : this.customScope[match.viewName];
    document.querySelector("#app").innerHTML = this.customScope[match.viewName]
    if (typeof window.afterDOMLoad !== 'undefined'){
        window.afterDOMLoad();
    }
}.bind( {'loadFile': loadFile} );

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    
    router();    
});