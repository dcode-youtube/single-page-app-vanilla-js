import Dashboard from "./views/Dashboard.js";
import Posts from "./views/Posts.js";
import PostView from "./views/PostView.js";
import Settings from "./views/Settings.js";
import PostViewCategories from "./views/PostViewCategories.js";

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

const router = async () => {
    const routes = [
        { path: "/", view: Dashboard },
        { path: "/posts", view: Posts },
        { path: "/posts/:id", view: PostView },
        { path: "/posts/:id/category/:categoryId", view: PostViewCategories },
        { path: "/settings", view: Settings }
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
            
        };
    });


    var match
    potentialMatches.forEach(entry =>{

         if(entry.result != null) {

            match = (match === undefined || entry.route.path.length > match.route.path.length) ? entry : match
         }
              
    })



    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();
};

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