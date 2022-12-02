import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Posts");
    }

    async getHtml() {
        return new Promise(function(resolve, reject){
            let xhr = new XMLHttpRequest();
            xhr.open('GET', './static/js/views/Posts.html');
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
    }
}