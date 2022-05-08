import View from '../core/View.js';

export default class extends View {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.setTitle(`Viewing Post #${this.postId}`);
    }

    async render() {
        return `
            <h1>Post</h1>
            <p>You are viewing post #${this.postId}.</p>
        `;
    }
}
