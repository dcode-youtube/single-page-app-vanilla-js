import View from '../core/View.js';

export default class extends View {
    constructor(params) {
        super(params);
    }

    async render() {
        return `
            <h1>Settings</h1>
            <p>Manage your privacy and configuration.</p>
        `;
    }
}
