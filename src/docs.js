const el = document.querySelector('main');

const xxx = tagName => heading => {
    const id = heading.id;
    const fragment = document.createDocumentFragment();
    let next = heading.nextSibling;

    fragment.appendChild(heading);

    while (next && next.tagName !== tagName) {
        const nextnext = next.nextSibling;
        fragment.appendChild(next);
        next = nextnext;
    }

    return { fragment, id };
};

const h2s = [...document.querySelectorAll('h2')];
h2s.map(xxx('H2')).forEach(obj => {

    const h3s = [...obj.fragment.querySelectorAll('h3')];
    h3s.map(xxx('H3')).forEach(obj3 => {
        const section = document.createElement('section');
        section.id = `section-${obj3.id}`;
        section.appendChild(obj3.fragment);
        obj.fragment.appendChild(section);
    });

    const section = document.createElement('section');
    section.id = `section-${obj.id}`;
    section.appendChild(obj.fragment);
    el.appendChild(section);
});



Vue.component('code-demo', {
    props: ['collapsed'],
    template: '<div class="code-demo"><button @click.prevent="collapsed = !collapsed;">Show/hide</button><div v-show="!collapsed"><slot></slot></div></div>'
});

Vue.component('nav-list', {
    props: ['tree', 'title', 'hash'],
    template: '<ul><li><a href="{{ hash }}">{{ title }}</a></li><li v-for="t in tree"><a href="#/{{ hash }}/{{ t.hash }}">{{ t.title }}</a></li></ul>'
});

Vue.component('side-navigation', {
    // template: '<div><nav-list v-for="i in tree" :title="i.title" :tree="i.tree" :hash="i.hash"></nav-list></div>',
    template: '<ul><li v-for="heading in headings" :class="heading.cls"><a :href="heading.href">{{ heading.title }}</a></li></ul>',
    props: ['tree', 'x'],
    created() {
        const headings = [...document.querySelectorAll('h2,h3')].map(heading => {
            return {
                title: heading.textContent,
                cls: heading.tagName === 'h2' ? 'nav-category' : 'nav-subcategory',
                href: `#${heading.id}`
            }
        });
        
        this.headings = headings;
        
        // const tree = [];

        // headings.forEach(h => {
        //     if (h.tagName === 'H2') {
        //         tree.push({ title: h.textContent, tree: [], hash: h.id });
        //     } else {
        //         tree[tree.length-1].tree.push({ title: h.textContent, tree: [], hash: h.id });
        //     }
        // });

        // this.tree = tree;
    }
});

// const router = new VueRouter({
//     routes: []
// });

var app = new Vue({
    el: '.page-container',
    data: {
        hash: location.hash
    },
    created() {
        window.addEventListener('hashchange', () => {
            this.hash = location.hash.replace('#', '');
        });
    },
    methods: {
        isSectionVisible() { return true; },
    }
});


