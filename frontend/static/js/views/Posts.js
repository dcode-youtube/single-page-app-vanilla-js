import View from '../core/View.js';

export default class extends View {
    constructor(params) {
        super(params);
    }

    async render() {
        return `
            <h1>Posts</h1>
            <p>You are viewing the posts!</p>
        `;
    }
}
