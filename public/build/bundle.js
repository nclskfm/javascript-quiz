
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.35.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const questions = writable([]);

    const counter = derived(questions, ($questions) => {
      const oldCounter = get_store_value(counter); 
      const newCorrect = $questions.filter((question) => question.isCorrect).length;
      const newIncorrect = $questions.filter((question) => question.isCorrect === false).length;
      let increased = undefined;
      if (oldCounter) {
        if (newCorrect > oldCounter.correct) {
          increased = 'correct';
        } else if (newIncorrect > oldCounter.incorrect) {
          increased = 'incorrect';
        }
      } else if (newCorrect) {
        increased = 'correct';
      } else if (newIncorrect) {
        increased = 'incorrect';
      }
        
      return {
        questions: $questions.length,
        correct: newCorrect,
        incorrect: newIncorrect,
        increased
      };
    });

    /* src/Header.svelte generated by Svelte v3.35.0 */
    const file$h = "src/Header.svelte";

    function create_fragment$i(ctx) {
    	let nav;
    	let div;
    	let span0;
    	let t0;
    	let t1_value = /*$counter*/ ctx[1].correct + "";
    	let t1;
    	let span0_title_value;
    	let t2;
    	let span1;
    	let t3;
    	let t4_value = /*$counter*/ ctx[1].incorrect + "";
    	let t4;
    	let span1_title_value;
    	let t5;
    	let span2;
    	let t6;
    	let t7_value = /*$counter*/ ctx[1].questions - /*$counter*/ ctx[1].correct - /*$counter*/ ctx[1].incorrect + "";
    	let t7;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			span0 = element("span");
    			t0 = text("Correct: ");
    			t1 = text(t1_value);
    			t2 = space();
    			span1 = element("span");
    			t3 = text("Incorrect: ");
    			t4 = text(t4_value);
    			t5 = space();
    			span2 = element("span");
    			t6 = text("Remaining: ");
    			t7 = text(t7_value);
    			attr_dev(span0, "id", "correct");
    			attr_dev(span0, "title", span0_title_value = "Correct: " + /*$counter*/ ctx[1].correct);
    			attr_dev(span0, "class", "svelte-15zi7d5");
    			toggle_class(span0, "correct-blur-out", /*animateClass*/ ctx[0] === "correct");
    			add_location(span0, file$h, 15, 4, 341);
    			attr_dev(span1, "id", "incorrect");
    			attr_dev(span1, "title", span1_title_value = "Incorrect: " + /*$counter*/ ctx[1].incorrect);
    			attr_dev(span1, "class", "svelte-15zi7d5");
    			toggle_class(span1, "incorrect-blur-out", /*animateClass*/ ctx[0] === "incorrect");
    			add_location(span1, file$h, 18, 4, 499);
    			attr_dev(span2, "id", "remaining");
    			attr_dev(span2, "class", "svelte-15zi7d5");
    			add_location(span2, file$h, 21, 4, 671);
    			attr_dev(div, "id", "wrapper");
    			attr_dev(div, "class", "svelte-15zi7d5");
    			add_location(div, file$h, 14, 2, 318);
    			attr_dev(nav, "class", "svelte-15zi7d5");
    			add_location(nav, file$h, 13, 0, 310);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			append_dev(div, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(div, t2);
    			append_dev(div, span1);
    			append_dev(span1, t3);
    			append_dev(span1, t4);
    			append_dev(div, t5);
    			append_dev(div, span2);
    			append_dev(span2, t6);
    			append_dev(span2, t7);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$counter*/ 2 && t1_value !== (t1_value = /*$counter*/ ctx[1].correct + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$counter*/ 2 && span0_title_value !== (span0_title_value = "Correct: " + /*$counter*/ ctx[1].correct)) {
    				attr_dev(span0, "title", span0_title_value);
    			}

    			if (dirty & /*animateClass*/ 1) {
    				toggle_class(span0, "correct-blur-out", /*animateClass*/ ctx[0] === "correct");
    			}

    			if (dirty & /*$counter*/ 2 && t4_value !== (t4_value = /*$counter*/ ctx[1].incorrect + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*$counter*/ 2 && span1_title_value !== (span1_title_value = "Incorrect: " + /*$counter*/ ctx[1].incorrect)) {
    				attr_dev(span1, "title", span1_title_value);
    			}

    			if (dirty & /*animateClass*/ 1) {
    				toggle_class(span1, "incorrect-blur-out", /*animateClass*/ ctx[0] === "incorrect");
    			}

    			if (dirty & /*$counter*/ 2 && t7_value !== (t7_value = /*$counter*/ ctx[1].questions - /*$counter*/ ctx[1].correct - /*$counter*/ ctx[1].incorrect + "")) set_data_dev(t7, t7_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $counter;
    	validate_store(counter, "counter");
    	component_subscribe($$self, counter, $$value => $$invalidate(1, $counter = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	let animateClass = undefined;

    	counter.subscribe(c => {
    		$$invalidate(0, animateClass = c.increased);

    		setTimeout(
    			() => {
    				$$invalidate(0, animateClass = undefined);
    			},
    			1000
    		);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ counter, animateClass, $counter });

    	$$self.$inject_state = $$props => {
    		if ("animateClass" in $$props) $$invalidate(0, animateClass = $$props.animateClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [animateClass, $counter];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    function getCookie(key) {
      return document.cookie
        .split('; ')
        ?.find((row) => row.startsWith(key + '='))
        ?.split('=')[1];
    }

    function setCookie(key, value, expiration) {
      if (key === 'cookiesAllowed' || getCookie('cookiesAllowed') || expiration) {
        if (!expiration) {
          const date = new Date();
          date.setDate(date.getDate() + 30);
          expiration = date.toGMTString();
        }
        document.cookie =
          key +
          '=' +
          JSON.stringify(value) +
          '; expires=' +
          expiration +
          '; path=/';
      }
    }

    function removeAllCookies() {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++)
        setCookie(cookies[i].split('=')[0], null, date.toGMTString());
    }

    /* src/Settings.svelte generated by Svelte v3.35.0 */
    const file$g = "src/Settings.svelte";

    // (44:13) {#if cookiesAllowed}
    function create_if_block_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("*");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(44:13) {#if cookiesAllowed}",
    		ctx
    	});

    	return block;
    }

    // (51:4) {#if cookiesAllowed}
    function create_if_block$c(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "* Your current score will also be cleared! ⚠️";
    			attr_dev(p, "class", "svelte-1ycxmg5");
    			add_location(p, file$g, 51, 6, 1480);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(51:4) {#if cookiesAllowed}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div2;
    	let div1;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t4;
    	let a0;
    	let t6;
    	let t7;
    	let p2;
    	let t9;
    	let p3;
    	let t11;
    	let div0;
    	let button0;
    	let t12;
    	let t13;
    	let button1;
    	let t15;
    	let t16;
    	let a1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*cookiesAllowed*/ ctx[0] && create_if_block_1$3(ctx);
    	let if_block1 = /*cookiesAllowed*/ ctx[0] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "JavaScript quiz";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Hi, here is a quiz to test your knowledge about JavaScript. But beware,\n      some questions are quite tricky. 🔥";
    			t3 = space();
    			p1 = element("p");
    			t4 = text("The questions have been created by ");
    			a0 = element("a");
    			a0.textContent = "Lydia Hallie";
    			t6 = text(". Thanks for sharing!");
    			t7 = space();
    			p2 = element("p");
    			p2.textContent = "The app can save your answers locally so you can continue playing another\n      time. If you want to do that, press the green button. ✅";
    			t9 = space();
    			p3 = element("p");
    			p3.textContent = "And now have fun! 🚀";
    			t11 = space();
    			div0 = element("div");
    			button0 = element("button");
    			t12 = text("deny");
    			if (if_block0) if_block0.c();
    			t13 = space();
    			button1 = element("button");
    			button1.textContent = "allow";
    			t15 = space();
    			if (if_block1) if_block1.c();
    			t16 = space();
    			a1 = element("a");
    			a1.textContent = "source code";
    			attr_dev(h1, "class", "svelte-1ycxmg5");
    			add_location(h1, file$g, 22, 4, 527);
    			attr_dev(p0, "class", "svelte-1ycxmg5");
    			add_location(p0, file$g, 23, 4, 556);
    			attr_dev(a0, "href", "https://github.com/lydiahallie/javascript-questions/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener");
    			add_location(a0, file$g, 28, 41, 738);
    			attr_dev(p1, "class", "svelte-1ycxmg5");
    			add_location(p1, file$g, 27, 4, 693);
    			attr_dev(p2, "class", "svelte-1ycxmg5");
    			add_location(p2, file$g, 34, 4, 914);
    			attr_dev(p3, "class", "svelte-1ycxmg5");
    			add_location(p3, file$g, 38, 4, 1073);
    			attr_dev(button0, "class", "deny plausible-event-name=Deny+Cookies svelte-1ycxmg5");
    			add_location(button0, file$g, 40, 6, 1140);
    			attr_dev(button1, "class", "allow plausible-event-name=Allow+Cookies svelte-1ycxmg5");
    			add_location(button1, file$g, 45, 6, 1306);
    			attr_dev(div0, "class", "button-wrapper svelte-1ycxmg5");
    			add_location(div0, file$g, 39, 4, 1105);
    			attr_dev(a1, "href", "https://github.com/nclskfm/javascript-quiz");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener");
    			attr_dev(a1, "class", "svelte-1ycxmg5");
    			add_location(a1, file$g, 53, 4, 1547);
    			attr_dev(div1, "class", "content svelte-1ycxmg5");
    			add_location(div1, file$g, 21, 2, 501);
    			attr_dev(div2, "class", "settings-wrapper svelte-1ycxmg5");
    			add_location(div2, file$g, 20, 0, 468);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, p0);
    			append_dev(div1, t3);
    			append_dev(div1, p1);
    			append_dev(p1, t4);
    			append_dev(p1, a0);
    			append_dev(p1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, p2);
    			append_dev(div1, t9);
    			append_dev(div1, p3);
    			append_dev(div1, t11);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t12);
    			if (if_block0) if_block0.m(button0, null);
    			append_dev(div0, t13);
    			append_dev(div0, button1);
    			append_dev(div1, t15);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t16);
    			append_dev(div1, a1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Settings", slots, []);
    	const dispatch = createEventDispatcher();
    	const cookiesAllowed = getCookie("cookiesAllowed");

    	function closeSettings(allowCookies) {
    		if (allowCookies) {
    			setCookie("cookiesAllowed", true);
    		} else {
    			if (cookiesAllowed) {
    				removeAllCookies();
    			}
    		}

    		dispatch("close");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => closeSettings();
    	const click_handler_1 = () => closeSettings(true);

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		getCookie,
    		removeAllCookies,
    		setCookie,
    		dispatch,
    		cookiesAllowed,
    		closeSettings
    	});

    	return [cookiesAllowed, closeSettings, click_handler, click_handler_1];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    function getQuestions() {
      let request = new XMLHttpRequest();
      request.open(
        'GET',
        'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md'
      );
      request.send();
      request.onreadystatechange = (e) => {
        if (request.readyState === 4 && request.status === 200) {
          const unparsed = request.responseText.split(/(?=#{6} [1-9])/).slice(1);
          questions.set(parseQuestions(unparsed));
          loadAnsweredQuestionsFromStorage();
        }
      };
    }

    function parseQuestions(unparsed) {
      return unparsed.map((question) => {
        const indexOfFirstDot = question.indexOf('.');
        const indexOfA = question.indexOf('- A: ');
        const indexOfDetails = question.indexOf('<details>', indexOfA);

        const id = question.slice(7, indexOfFirstDot);
        const title = question.slice(indexOfFirstDot + 2, question.indexOf('\n'));
        const body = question.slice(question.indexOf('\n') + 2, indexOfA - 2);
        const answers = question
          .slice(indexOfA, indexOfDetails - 2)
          .split('\n')
          .map((answer) => {
            return {
              char: answer[2],
              text: answer.slice(5),
            };
          });

        const spoiler = question.slice(indexOfDetails);
        const indexOfCorrectAnswer = spoiler.indexOf('#### Answer: ') + 13;

        const correctAnswer = spoiler[indexOfCorrectAnswer];

        const explanation = spoiler.slice(
          indexOfCorrectAnswer + 3,
          spoiler.indexOf('</p>', indexOfCorrectAnswer) - 1
        );

        const obj = { id, title, body, answers, correctAnswer, explanation };
        return obj;
      });
    }

    function handleAnswer(event) {
      questions.update((questions) => {
        return questions.map((question) => {
          if (question.id === event.detail.id) {
            question.clickedAnswer = event.detail.clickedAnswer;
            question.isCorrect = event.detail.isCorrect;
          }
          return question;
        });
      });
      saveAnsweredQuestionsToStorage();
    }

    function loadAnsweredQuestionsFromStorage() {
      if (!getCookie('cookiesAllowed') || !getCookie('questions')) {
        return false;
      }
      const answeredQuestions = JSON.parse(getCookie('questions'));

      questions.update((questions) => {
        return questions.map((q) => {
          const answer = answeredQuestions.find((a) => a.startsWith(q.id));
          if (!answer) {
            return q;
          }
          q.clickedAnswer = answer.split('-')[1];
          q.isCorrect = q.clickedAnswer === q.correctAnswer;
          return q;
        });
      });
      return true;
    }

    function saveAnsweredQuestionsToStorage() {
      const q = get_store_value(questions);
      if (!getCookie('cookiesAllowed') || !q?.length) {
        return;
      }
      const answeredQuestions = q
        .filter((a) => a.clickedAnswer)
        .map((a) => a.id + '-' + a.clickedAnswer);
      // fehler
      if (!answeredQuestions?.length) {
        return;
      }
      setCookie('questions', answeredQuestions);
    }

    /* node_modules/carbon-icons-svelte/lib/ChevronRight16/ChevronRight16.svelte generated by Svelte v3.35.0 */

    const file$f = "node_modules/carbon-icons-svelte/lib/ChevronRight16/ChevronRight16.svelte";

    // (39:4) {#if title}
    function create_if_block$b(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$f, 39, 6, 1040);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(39:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (38:8)      
    function fallback_block$4(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$4.name,
    		type: "fallback",
    		source: "(38:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$4(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "ChevronRight16" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 16 16" },
    		{ fill: "currentColor" },
    		{ width: "16" },
    		{ height: "16" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M11 8L6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z");
    			add_location(path, file$f, 36, 2, 952);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$f, 22, 0, 633);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*title*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "ChevronRight16" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 16 16" },
    				{ fill: "currentColor" },
    				{ width: "16" },
    				{ height: "16" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ChevronRight16", slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$props) $$invalidate(3, style = $$new_props.style);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ("labelled" in $$props) $$invalidate(9, labelled = $$new_props.labelled);
    		if ("attributes" in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(7, ariaLabel = $$props["aria-label"]);
    		$$invalidate(8, ariaLabelledBy = $$props["aria-labelledby"]);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 388) {
    			$$invalidate(9, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				"aria-label": ariaLabel,
    				"aria-labelledby": ariaLabelledBy,
    				"aria-hidden": labelled ? undefined : true,
    				role: labelled ? "img" : undefined,
    				focusable: tabindex === "0" ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class ChevronRight16 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronRight16",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get class() {
    		throw new Error("<ChevronRight16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ChevronRight16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ChevronRight16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ChevronRight16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<ChevronRight16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<ChevronRight16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<ChevronRight16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<ChevronRight16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ChevronRight16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ChevronRight16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ChevronRight16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ChevronRight16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-components-svelte/src/SkeletonText/SkeletonText.svelte generated by Svelte v3.35.0 */

    const file$e = "node_modules/carbon-components-svelte/src/SkeletonText/SkeletonText.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i].width;
    	return child_ctx;
    }

    // (39:0) {:else}
    function create_else_block$4(ctx) {
    	let p;
    	let p_style_value;
    	let mounted;
    	let dispose;

    	let p_levels = [
    		/*$$restProps*/ ctx[4],
    		{
    			style: p_style_value = "width: " + /*width*/ ctx[2] + ";" + /*$$restProps*/ ctx[4].style
    		}
    	];

    	let p_data = {};

    	for (let i = 0; i < p_levels.length; i += 1) {
    		p_data = assign(p_data, p_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			set_attributes(p, p_data);
    			toggle_class(p, "bx--skeleton__text", true);
    			toggle_class(p, "bx--skeleton__heading", /*heading*/ ctx[0]);
    			add_location(p, file$e, 39, 2, 1089);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(p, "click", /*click_handler_1*/ ctx[12], false, false, false),
    					listen_dev(p, "mouseover", /*mouseover_handler_1*/ ctx[13], false, false, false),
    					listen_dev(p, "mouseenter", /*mouseenter_handler_1*/ ctx[14], false, false, false),
    					listen_dev(p, "mouseleave", /*mouseleave_handler_1*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(p, p_data = get_spread_update(p_levels, [
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4],
    				dirty & /*width, $$restProps*/ 20 && p_style_value !== (p_style_value = "width: " + /*width*/ ctx[2] + ";" + /*$$restProps*/ ctx[4].style) && { style: p_style_value }
    			]));

    			toggle_class(p, "bx--skeleton__text", true);
    			toggle_class(p, "bx--skeleton__heading", /*heading*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(39:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:0) {#if paragraph}
    function create_if_block$a(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	let each_value = /*rows*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	let div_levels = [/*$$restProps*/ ctx[4]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_attributes(div, div_data);
    			add_location(div, file$e, 29, 2, 813);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler*/ ctx[9], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler*/ ctx[10], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rows, heading*/ 9) {
    				each_value = /*rows*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(29:0) {#if paragraph}",
    		ctx
    	});

    	return block;
    }

    // (31:4) {#each rows as { width }}
    function create_each_block$5(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			set_style(p, "width", /*width*/ ctx[2]);
    			toggle_class(p, "bx--skeleton__text", true);
    			toggle_class(p, "bx--skeleton__heading", /*heading*/ ctx[0]);
    			add_location(p, file$e, 31, 6, 922);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rows*/ 8) {
    				set_style(p, "width", /*width*/ ctx[2]);
    			}

    			if (dirty & /*heading*/ 1) {
    				toggle_class(p, "bx--skeleton__heading", /*heading*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(31:4) {#each rows as { width }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*paragraph*/ ctx[1]) return create_if_block$a;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let rows;
    	let widthNum;
    	let widthPx;
    	const omit_props_names = ["lines","heading","paragraph","width"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SkeletonText", slots, []);
    	let { lines = 3 } = $$props;
    	let { heading = false } = $$props;
    	let { paragraph = false } = $$props;
    	let { width = "100%" } = $$props;
    	const RANDOM = [0.973, 0.153, 0.567];

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("lines" in $$new_props) $$invalidate(5, lines = $$new_props.lines);
    		if ("heading" in $$new_props) $$invalidate(0, heading = $$new_props.heading);
    		if ("paragraph" in $$new_props) $$invalidate(1, paragraph = $$new_props.paragraph);
    		if ("width" in $$new_props) $$invalidate(2, width = $$new_props.width);
    	};

    	$$self.$capture_state = () => ({
    		lines,
    		heading,
    		paragraph,
    		width,
    		RANDOM,
    		rows,
    		widthNum,
    		widthPx
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("lines" in $$props) $$invalidate(5, lines = $$new_props.lines);
    		if ("heading" in $$props) $$invalidate(0, heading = $$new_props.heading);
    		if ("paragraph" in $$props) $$invalidate(1, paragraph = $$new_props.paragraph);
    		if ("width" in $$props) $$invalidate(2, width = $$new_props.width);
    		if ("rows" in $$props) $$invalidate(3, rows = $$new_props.rows);
    		if ("widthNum" in $$props) $$invalidate(6, widthNum = $$new_props.widthNum);
    		if ("widthPx" in $$props) $$invalidate(7, widthPx = $$new_props.widthPx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 4) {
    			$$invalidate(6, widthNum = parseInt(width, 10));
    		}

    		if ($$self.$$.dirty & /*width*/ 4) {
    			$$invalidate(7, widthPx = width.includes("px"));
    		}

    		if ($$self.$$.dirty & /*paragraph, lines, widthPx, widthNum, rows, width*/ 238) {
    			if (paragraph) {
    				for (let i = 0; i < lines; i++) {
    					const min = widthPx ? widthNum - 75 : 0;
    					const max = widthPx ? widthNum : 75;
    					const rand = Math.floor(RANDOM[i % 3] * (max - min + 1)) + min + "px";

    					$$invalidate(3, rows = [
    						...rows,
    						{
    							width: widthPx ? rand : `calc(${width} - ${rand})`
    						}
    					]);
    				}
    			}
    		}
    	};

    	$$invalidate(3, rows = []);

    	return [
    		heading,
    		paragraph,
    		width,
    		rows,
    		$$restProps,
    		lines,
    		widthNum,
    		widthPx,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1
    	];
    }

    class SkeletonText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			lines: 5,
    			heading: 0,
    			paragraph: 1,
    			width: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SkeletonText",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get lines() {
    		throw new Error("<SkeletonText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lines(value) {
    		throw new Error("<SkeletonText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get heading() {
    		throw new Error("<SkeletonText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set heading(value) {
    		throw new Error("<SkeletonText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paragraph() {
    		throw new Error("<SkeletonText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paragraph(value) {
    		throw new Error("<SkeletonText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<SkeletonText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<SkeletonText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-components-svelte/src/Accordion/AccordionSkeleton.svelte generated by Svelte v3.35.0 */
    const file$d = "node_modules/carbon-components-svelte/src/Accordion/AccordionSkeleton.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (37:2) {#if open}
    function create_if_block$9(ctx) {
    	let li;
    	let span;
    	let chevronright16;
    	let t0;
    	let skeletontext0;
    	let t1;
    	let div;
    	let skeletontext1;
    	let t2;
    	let skeletontext2;
    	let t3;
    	let skeletontext3;
    	let current;

    	chevronright16 = new ChevronRight16({
    			props: { class: "bx--accordion__arrow" },
    			$$inline: true
    		});

    	skeletontext0 = new SkeletonText({
    			props: { class: "bx--accordion__title" },
    			$$inline: true
    		});

    	skeletontext1 = new SkeletonText({ props: { width: "90%" }, $$inline: true });
    	skeletontext2 = new SkeletonText({ props: { width: "80%" }, $$inline: true });
    	skeletontext3 = new SkeletonText({ props: { width: "95%" }, $$inline: true });

    	const block = {
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			create_component(chevronright16.$$.fragment);
    			t0 = space();
    			create_component(skeletontext0.$$.fragment);
    			t1 = space();
    			div = element("div");
    			create_component(skeletontext1.$$.fragment);
    			t2 = space();
    			create_component(skeletontext2.$$.fragment);
    			t3 = space();
    			create_component(skeletontext3.$$.fragment);
    			toggle_class(span, "bx--accordion__heading", true);
    			add_location(span, file$d, 41, 6, 1031);
    			attr_dev(div, "class", "bx--accordion__content");
    			add_location(div, file$d, 45, 6, 1206);
    			toggle_class(li, "bx--accordion__item", true);
    			toggle_class(li, "bx--accordion__item--active", true);
    			add_location(li, file$d, 37, 4, 925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			mount_component(chevronright16, span, null);
    			append_dev(span, t0);
    			mount_component(skeletontext0, span, null);
    			append_dev(li, t1);
    			append_dev(li, div);
    			mount_component(skeletontext1, div, null);
    			append_dev(div, t2);
    			mount_component(skeletontext2, div, null);
    			append_dev(div, t3);
    			mount_component(skeletontext3, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronright16.$$.fragment, local);
    			transition_in(skeletontext0.$$.fragment, local);
    			transition_in(skeletontext1.$$.fragment, local);
    			transition_in(skeletontext2.$$.fragment, local);
    			transition_in(skeletontext3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronright16.$$.fragment, local);
    			transition_out(skeletontext0.$$.fragment, local);
    			transition_out(skeletontext1.$$.fragment, local);
    			transition_out(skeletontext2.$$.fragment, local);
    			transition_out(skeletontext3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(chevronright16);
    			destroy_component(skeletontext0);
    			destroy_component(skeletontext1);
    			destroy_component(skeletontext2);
    			destroy_component(skeletontext3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(37:2) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (53:2) {#each Array.from({ length: open ? count - 1 : count }, (_, i) => i) as item (item)}
    function create_each_block$4(key_1, ctx) {
    	let li;
    	let span;
    	let chevronright16;
    	let t0;
    	let skeletontext;
    	let t1;
    	let current;

    	chevronright16 = new ChevronRight16({
    			props: { class: "bx--accordion__arrow" },
    			$$inline: true
    		});

    	skeletontext = new SkeletonText({
    			props: { class: "bx--accordion__title" },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			create_component(chevronright16.$$.fragment);
    			t0 = space();
    			create_component(skeletontext.$$.fragment);
    			t1 = space();
    			attr_dev(span, "class", "bx--accordion__heading");
    			add_location(span, file$d, 54, 6, 1515);
    			attr_dev(li, "class", "bx--accordion__item");
    			add_location(li, file$d, 53, 4, 1476);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			mount_component(chevronright16, span, null);
    			append_dev(span, t0);
    			mount_component(skeletontext, span, null);
    			append_dev(li, t1);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronright16.$$.fragment, local);
    			transition_in(skeletontext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronright16.$$.fragment, local);
    			transition_out(skeletontext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(chevronright16);
    			destroy_component(skeletontext);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(53:2) {#each Array.from({ length: open ? count - 1 : count }, (_, i) => i) as item (item)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let ul;
    	let t;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*open*/ ctx[3] && create_if_block$9(ctx);

    	let each_value = Array.from(
    		{
    			length: /*open*/ ctx[3]
    			? /*count*/ ctx[0] - 1
    			: /*count*/ ctx[0]
    		},
    		func$1
    	);

    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[9];
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	let ul_levels = [/*$$restProps*/ ctx[4]];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (if_block) if_block.c();
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_attributes(ul, ul_data);
    			toggle_class(ul, "bx--skeleton", true);
    			toggle_class(ul, "bx--accordion", true);
    			toggle_class(ul, "bx--accordion--start", /*align*/ ctx[1] === "start");
    			toggle_class(ul, "bx--accordion--end", /*align*/ ctx[1] === "end");
    			toggle_class(ul, "bx--accordion--sm", /*size*/ ctx[2] === "sm");
    			toggle_class(ul, "bx--accordion--xl", /*size*/ ctx[2] === "xl");
    			add_location(ul, file$d, 23, 0, 578);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			if (if_block) if_block.m(ul, null);
    			append_dev(ul, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(ul, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(ul, "mouseover", /*mouseover_handler*/ ctx[6], false, false, false),
    					listen_dev(ul, "mouseenter", /*mouseenter_handler*/ ctx[7], false, false, false),
    					listen_dev(ul, "mouseleave", /*mouseleave_handler*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*open*/ ctx[3]) {
    				if (if_block) {
    					if (dirty & /*open*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(ul, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*open, count*/ 9) {
    				each_value = Array.from(
    					{
    						length: /*open*/ ctx[3]
    						? /*count*/ ctx[0] - 1
    						: /*count*/ ctx[0]
    					},
    					func$1
    				);

    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
    				check_outros();
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]]));
    			toggle_class(ul, "bx--skeleton", true);
    			toggle_class(ul, "bx--accordion", true);
    			toggle_class(ul, "bx--accordion--start", /*align*/ ctx[1] === "start");
    			toggle_class(ul, "bx--accordion--end", /*align*/ ctx[1] === "end");
    			toggle_class(ul, "bx--accordion--sm", /*size*/ ctx[2] === "sm");
    			toggle_class(ul, "bx--accordion--xl", /*size*/ ctx[2] === "xl");
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (if_block) if_block.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$1 = (_, i) => i;

    function instance$e($$self, $$props, $$invalidate) {
    	const omit_props_names = ["count","align","size","open"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AccordionSkeleton", slots, []);
    	let { count = 4 } = $$props;
    	let { align = "end" } = $$props;
    	let { size = undefined } = $$props;
    	let { open = true } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("count" in $$new_props) $$invalidate(0, count = $$new_props.count);
    		if ("align" in $$new_props) $$invalidate(1, align = $$new_props.align);
    		if ("size" in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ("open" in $$new_props) $$invalidate(3, open = $$new_props.open);
    	};

    	$$self.$capture_state = () => ({
    		count,
    		align,
    		size,
    		open,
    		ChevronRight16,
    		SkeletonText
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("count" in $$props) $$invalidate(0, count = $$new_props.count);
    		if ("align" in $$props) $$invalidate(1, align = $$new_props.align);
    		if ("size" in $$props) $$invalidate(2, size = $$new_props.size);
    		if ("open" in $$props) $$invalidate(3, open = $$new_props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		count,
    		align,
    		size,
    		open,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class AccordionSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { count: 0, align: 1, size: 2, open: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AccordionSkeleton",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get count() {
    		throw new Error("<AccordionSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set count(value) {
    		throw new Error("<AccordionSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<AccordionSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<AccordionSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<AccordionSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<AccordionSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<AccordionSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<AccordionSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-components-svelte/src/Accordion/Accordion.svelte generated by Svelte v3.35.0 */
    const file$c = "node_modules/carbon-components-svelte/src/Accordion/Accordion.svelte";

    // (43:0) {:else}
    function create_else_block$3(ctx) {
    	let ul;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let ul_levels = [/*$$restProps*/ ctx[3]];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			toggle_class(ul, "bx--accordion", true);
    			toggle_class(ul, "bx--accordion--start", /*align*/ ctx[0] === "start");
    			toggle_class(ul, "bx--accordion--end", /*align*/ ctx[0] === "end");
    			toggle_class(ul, "bx--accordion--sm", /*size*/ ctx[1] === "sm");
    			toggle_class(ul, "bx--accordion--xl", /*size*/ ctx[1] === "xl");
    			add_location(ul, file$c, 43, 2, 927);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(ul, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(ul, "mouseover", /*mouseover_handler_1*/ ctx[8], false, false, false),
    					listen_dev(ul, "mouseenter", /*mouseenter_handler_1*/ ctx[9], false, false, false),
    					listen_dev(ul, "mouseleave", /*mouseleave_handler_1*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			toggle_class(ul, "bx--accordion", true);
    			toggle_class(ul, "bx--accordion--start", /*align*/ ctx[0] === "start");
    			toggle_class(ul, "bx--accordion--end", /*align*/ ctx[0] === "end");
    			toggle_class(ul, "bx--accordion--sm", /*size*/ ctx[1] === "sm");
    			toggle_class(ul, "bx--accordion--xl", /*size*/ ctx[1] === "xl");
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(43:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:0) {#if skeleton}
    function create_if_block$8(ctx) {
    	let accordionskeleton;
    	let current;
    	const accordionskeleton_spread_levels = [/*$$restProps*/ ctx[3], { align: /*align*/ ctx[0] }, { size: /*size*/ ctx[1] }];
    	let accordionskeleton_props = {};

    	for (let i = 0; i < accordionskeleton_spread_levels.length; i += 1) {
    		accordionskeleton_props = assign(accordionskeleton_props, accordionskeleton_spread_levels[i]);
    	}

    	accordionskeleton = new AccordionSkeleton({
    			props: accordionskeleton_props,
    			$$inline: true
    		});

    	accordionskeleton.$on("click", /*click_handler*/ ctx[11]);
    	accordionskeleton.$on("mouseover", /*mouseover_handler*/ ctx[12]);
    	accordionskeleton.$on("mouseenter", /*mouseenter_handler*/ ctx[13]);
    	accordionskeleton.$on("mouseleave", /*mouseleave_handler*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(accordionskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(accordionskeleton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const accordionskeleton_changes = (dirty & /*$$restProps, align, size*/ 11)
    			? get_spread_update(accordionskeleton_spread_levels, [
    					dirty & /*$$restProps*/ 8 && get_spread_object(/*$$restProps*/ ctx[3]),
    					dirty & /*align*/ 1 && { align: /*align*/ ctx[0] },
    					dirty & /*size*/ 2 && { size: /*size*/ ctx[1] }
    				])
    			: {};

    			accordionskeleton.$set(accordionskeleton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accordionskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accordionskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(accordionskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(33:0) {#if skeleton}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*skeleton*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	const omit_props_names = ["align","size","disabled","skeleton"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Accordion", slots, ['default']);
    	let { align = "end" } = $$props;
    	let { size = undefined } = $$props;
    	let { disabled = false } = $$props;
    	let { skeleton = false } = $$props;
    	const disableItems = writable(disabled);
    	setContext("Accordion", { disableItems });

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble($$self, event);
    	}

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("align" in $$new_props) $$invalidate(0, align = $$new_props.align);
    		if ("size" in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("skeleton" in $$new_props) $$invalidate(2, skeleton = $$new_props.skeleton);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		align,
    		size,
    		disabled,
    		skeleton,
    		setContext,
    		writable,
    		AccordionSkeleton,
    		disableItems
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("align" in $$props) $$invalidate(0, align = $$new_props.align);
    		if ("size" in $$props) $$invalidate(1, size = $$new_props.size);
    		if ("disabled" in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("skeleton" in $$props) $$invalidate(2, skeleton = $$new_props.skeleton);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*disabled*/ 16) {
    			disableItems.set(disabled);
    		}
    	};

    	return [
    		align,
    		size,
    		skeleton,
    		$$restProps,
    		disabled,
    		$$scope,
    		slots,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class Accordion extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			align: 0,
    			size: 1,
    			disabled: 4,
    			skeleton: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Accordion",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get align() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skeleton() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skeleton(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-components-svelte/src/Accordion/AccordionItem.svelte generated by Svelte v3.35.0 */
    const file$b = "node_modules/carbon-components-svelte/src/Accordion/AccordionItem.svelte";
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (75:25) {title}
    function fallback_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$3.name,
    		type: "fallback",
    		source: "(75:25) {title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let li;
    	let button;
    	let chevronright16;
    	let t0;
    	let div0;
    	let t1;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;

    	chevronright16 = new ChevronRight16({
    			props: {
    				class: "bx--accordion__arrow",
    				"aria-label": /*iconDescription*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const title_slot_template = /*#slots*/ ctx[7].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[6], get_title_slot_context);
    	const title_slot_or_fallback = title_slot || fallback_block$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let li_levels = [/*$$restProps*/ ctx[5]];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			create_component(chevronright16.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			if (title_slot_or_fallback) title_slot_or_fallback.c();
    			t1 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			toggle_class(div0, "bx--accordion__title", true);
    			add_location(div0, file$b, 73, 4, 1862);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "title", /*iconDescription*/ ctx[3]);
    			attr_dev(button, "aria-expanded", /*open*/ ctx[0]);
    			button.disabled = /*disabled*/ ctx[1];
    			toggle_class(button, "bx--accordion__heading", true);
    			add_location(button, file$b, 48, 2, 1311);
    			toggle_class(div1, "bx--accordion__content", true);
    			add_location(div1, file$b, 77, 2, 1969);
    			set_attributes(li, li_data);
    			toggle_class(li, "bx--accordion__item", true);
    			toggle_class(li, "bx--accordion__item--active", /*open*/ ctx[0]);
    			toggle_class(li, "bx--accordion__item--disabled", /*disabled*/ ctx[1]);
    			toggle_class(li, "bx--accordion__item--expanding", /*animation*/ ctx[4] === "expanding");
    			toggle_class(li, "bx--accordion__item--collapsing", /*animation*/ ctx[4] === "collapsing");
    			add_location(li, file$b, 36, 0, 932);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			mount_component(chevronright16, button, null);
    			append_dev(button, t0);
    			append_dev(button, div0);

    			if (title_slot_or_fallback) {
    				title_slot_or_fallback.m(div0, null);
    			}

    			append_dev(li, t1);
    			append_dev(li, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[14], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler*/ ctx[10], false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler*/ ctx[11], false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler*/ ctx[12], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[13], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler_1*/ ctx[15], false, false, false),
    					listen_dev(li, "animationend", /*animationend_handler*/ ctx[8], false, false, false),
    					listen_dev(li, "animationend", /*animationend_handler_1*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const chevronright16_changes = {};
    			if (dirty & /*iconDescription*/ 8) chevronright16_changes["aria-label"] = /*iconDescription*/ ctx[3];
    			chevronright16.$set(chevronright16_changes);

    			if (title_slot) {
    				if (title_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(title_slot, title_slot_template, ctx, /*$$scope*/ ctx[6], dirty, get_title_slot_changes, get_title_slot_context);
    				}
    			} else {
    				if (title_slot_or_fallback && title_slot_or_fallback.p && dirty & /*title*/ 4) {
    					title_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (!current || dirty & /*iconDescription*/ 8) {
    				attr_dev(button, "title", /*iconDescription*/ ctx[3]);
    			}

    			if (!current || dirty & /*open*/ 1) {
    				attr_dev(button, "aria-expanded", /*open*/ ctx[0]);
    			}

    			if (!current || dirty & /*disabled*/ 2) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[1]);
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]]));
    			toggle_class(li, "bx--accordion__item", true);
    			toggle_class(li, "bx--accordion__item--active", /*open*/ ctx[0]);
    			toggle_class(li, "bx--accordion__item--disabled", /*disabled*/ ctx[1]);
    			toggle_class(li, "bx--accordion__item--expanding", /*animation*/ ctx[4] === "expanding");
    			toggle_class(li, "bx--accordion__item--collapsing", /*animation*/ ctx[4] === "collapsing");
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronright16.$$.fragment, local);
    			transition_in(title_slot_or_fallback, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronright16.$$.fragment, local);
    			transition_out(title_slot_or_fallback, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(chevronright16);
    			if (title_slot_or_fallback) title_slot_or_fallback.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	const omit_props_names = ["title","open","disabled","iconDescription"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AccordionItem", slots, ['title','default']);
    	let { title = "title" } = $$props;
    	let { open = false } = $$props;
    	let { disabled = false } = $$props;
    	let { iconDescription = "Expand/Collapse" } = $$props;
    	let initialDisabled = disabled;
    	const ctx = getContext("Accordion");

    	const unsubscribe = ctx.disableItems.subscribe(value => {
    		if (!value && initialDisabled) return;
    		$$invalidate(1, disabled = value);
    	});

    	let animation = undefined;

    	onMount(() => {
    		return () => {
    			unsubscribe();
    		};
    	});

    	function animationend_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	const click_handler_1 = () => {
    		$$invalidate(0, open = !open);
    		$$invalidate(4, animation = open ? "expanding" : "collapsing");
    	};

    	const keydown_handler_1 = ({ key }) => {
    		if (open && key === "Escape") {
    			$$invalidate(0, open = false);
    		}
    	};

    	const animationend_handler_1 = () => {
    		$$invalidate(4, animation = undefined);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("open" in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ("disabled" in $$new_props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ("iconDescription" in $$new_props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		open,
    		disabled,
    		iconDescription,
    		onMount,
    		getContext,
    		ChevronRight16,
    		initialDisabled,
    		ctx,
    		unsubscribe,
    		animation
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("open" in $$props) $$invalidate(0, open = $$new_props.open);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ("iconDescription" in $$props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    		if ("initialDisabled" in $$props) initialDisabled = $$new_props.initialDisabled;
    		if ("animation" in $$props) $$invalidate(4, animation = $$new_props.animation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open,
    		disabled,
    		title,
    		iconDescription,
    		animation,
    		$$restProps,
    		$$scope,
    		slots,
    		animationend_handler,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keydown_handler,
    		click_handler_1,
    		keydown_handler_1,
    		animationend_handler_1
    	];
    }

    class AccordionItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			title: 2,
    			open: 0,
    			disabled: 1,
    			iconDescription: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AccordionItem",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get title() {
    		throw new Error("<AccordionItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<AccordionItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<AccordionItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<AccordionItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<AccordionItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<AccordionItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<AccordionItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<AccordionItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-components-svelte/src/Button/ButtonSkeleton.svelte generated by Svelte v3.35.0 */

    const file$a = "node_modules/carbon-components-svelte/src/Button/ButtonSkeleton.svelte";

    // (38:0) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	let div_levels = [/*$$restProps*/ ctx[3]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--skeleton", true);
    			toggle_class(div, "bx--btn", true);
    			toggle_class(div, "bx--btn--field", /*size*/ ctx[1] === "field");
    			toggle_class(div, "bx--btn--sm", /*size*/ ctx[1] === "small" || /*small*/ ctx[2]);
    			add_location(div, file$a, 38, 2, 799);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler_1*/ ctx[8], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler_1*/ ctx[9], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler_1*/ ctx[10], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler_1*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			toggle_class(div, "bx--skeleton", true);
    			toggle_class(div, "bx--btn", true);
    			toggle_class(div, "bx--btn--field", /*size*/ ctx[1] === "field");
    			toggle_class(div, "bx--btn--sm", /*size*/ ctx[1] === "small" || /*small*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(38:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if href}
    function create_if_block$7(ctx) {
    	let a;
    	let t_value = "" + "";
    	let t;
    	let a_rel_value;
    	let mounted;
    	let dispose;

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{
    			rel: a_rel_value = /*$$restProps*/ ctx[3].target === "_blank"
    			? "noopener noreferrer"
    			: undefined
    		},
    		{ role: "button" },
    		/*$$restProps*/ ctx[3]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--skeleton", true);
    			toggle_class(a, "bx--btn", true);
    			toggle_class(a, "bx--btn--field", /*size*/ ctx[1] === "field");
    			toggle_class(a, "bx--btn--sm", /*size*/ ctx[1] === "small" || /*small*/ ctx[2]);
    			add_location(a, file$a, 21, 2, 406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler*/ ctx[5], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler*/ ctx[6], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*href*/ 1 && { href: /*href*/ ctx[0] },
    				dirty & /*$$restProps*/ 8 && a_rel_value !== (a_rel_value = /*$$restProps*/ ctx[3].target === "_blank"
    				? "noopener noreferrer"
    				: undefined) && { rel: a_rel_value },
    				{ role: "button" },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));

    			toggle_class(a, "bx--skeleton", true);
    			toggle_class(a, "bx--btn", true);
    			toggle_class(a, "bx--btn--field", /*size*/ ctx[1] === "field");
    			toggle_class(a, "bx--btn--sm", /*size*/ ctx[1] === "small" || /*small*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(21:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[0]) return create_if_block$7;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","size","small"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ButtonSkeleton", slots, []);
    	let { href = undefined } = $$props;
    	let { size = "default" } = $$props;
    	let { small = false } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("href" in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ("size" in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ("small" in $$new_props) $$invalidate(2, small = $$new_props.small);
    	};

    	$$self.$capture_state = () => ({ href, size, small });

    	$$self.$inject_state = $$new_props => {
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("size" in $$props) $$invalidate(1, size = $$new_props.size);
    		if ("small" in $$props) $$invalidate(2, small = $$new_props.small);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		href,
    		size,
    		small,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1
    	];
    }

    class ButtonSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { href: 0, size: 1, small: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonSkeleton",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get href() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get small() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-components-svelte/src/Button/Button.svelte generated by Svelte v3.35.0 */
    const file$9 = "node_modules/carbon-components-svelte/src/Button/Button.svelte";
    const get_default_slot_changes = dirty => ({ props: dirty[0] & /*buttonProps*/ 512 });
    const get_default_slot_context = ctx => ({ props: /*buttonProps*/ ctx[9] });

    // (153:0) {:else}
    function create_else_block$1(ctx) {
    	let button;
    	let t;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasIconOnly*/ ctx[0] && create_if_block_4(ctx);
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	var switch_value = /*icon*/ ctx[3];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-hidden": "true",
    				class: "bx--btn__icon",
    				"aria-label": /*iconDescription*/ ctx[4]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	let button_levels = [/*buttonProps*/ ctx[9]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(button, button_data);
    			add_location(button, file$9, 153, 2, 3981);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (switch_instance) {
    				mount_component(switch_instance, button, null);
    			}

    			/*button_binding*/ ctx[32](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_2*/ ctx[23], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler_2*/ ctx[24], false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler_2*/ ctx[25], false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler_2*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hasIconOnly*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(button, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 131072) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[17], dirty, null, null);
    				}
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*iconDescription*/ 16) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[4];

    			if (switch_value !== (switch_value = /*icon*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, button, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty[0] & /*buttonProps*/ 512 && /*buttonProps*/ ctx[9]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (switch_instance) destroy_component(switch_instance);
    			/*button_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(153:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (133:28) 
    function create_if_block_2(ctx) {
    	let a;
    	let t;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasIconOnly*/ ctx[0] && create_if_block_3(ctx);
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	var switch_value = /*icon*/ ctx[3];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-hidden": "true",
    				class: "bx--btn__icon",
    				"aria-label": /*iconDescription*/ ctx[4]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	let a_levels = [/*buttonProps*/ ctx[9]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(a, a_data);
    			add_location(a, file$9, 134, 2, 3598);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if (if_block) if_block.m(a, null);
    			append_dev(a, t);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			if (switch_instance) {
    				mount_component(switch_instance, a, null);
    			}

    			/*a_binding*/ ctx[31](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler_1*/ ctx[19], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler_1*/ ctx[20], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler_1*/ ctx[21], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler_1*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hasIconOnly*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(a, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 131072) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[17], dirty, null, null);
    				}
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*iconDescription*/ 16) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[4];

    			if (switch_value !== (switch_value = /*icon*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, a, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [dirty[0] & /*buttonProps*/ 512 && /*buttonProps*/ ctx[9]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (switch_instance) destroy_component(switch_instance);
    			/*a_binding*/ ctx[31](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(133:28) ",
    		ctx
    	});

    	return block;
    }

    // (131:13) 
    function create_if_block_1$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope, buttonProps*/ 131584) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[17], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(131:13) ",
    		ctx
    	});

    	return block;
    }

    // (120:0) {#if skeleton}
    function create_if_block$6(ctx) {
    	let buttonskeleton;
    	let current;

    	const buttonskeleton_spread_levels = [
    		{ href: /*href*/ ctx[8] },
    		{ size: /*size*/ ctx[2] },
    		/*$$restProps*/ ctx[10],
    		{
    			style: /*hasIconOnly*/ ctx[0] && "width: 3rem;"
    		}
    	];

    	let buttonskeleton_props = {};

    	for (let i = 0; i < buttonskeleton_spread_levels.length; i += 1) {
    		buttonskeleton_props = assign(buttonskeleton_props, buttonskeleton_spread_levels[i]);
    	}

    	buttonskeleton = new ButtonSkeleton({
    			props: buttonskeleton_props,
    			$$inline: true
    		});

    	buttonskeleton.$on("click", /*click_handler*/ ctx[27]);
    	buttonskeleton.$on("mouseover", /*mouseover_handler*/ ctx[28]);
    	buttonskeleton.$on("mouseenter", /*mouseenter_handler*/ ctx[29]);
    	buttonskeleton.$on("mouseleave", /*mouseleave_handler*/ ctx[30]);

    	const block = {
    		c: function create() {
    			create_component(buttonskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonskeleton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const buttonskeleton_changes = (dirty[0] & /*href, size, $$restProps, hasIconOnly*/ 1285)
    			? get_spread_update(buttonskeleton_spread_levels, [
    					dirty[0] & /*href*/ 256 && { href: /*href*/ ctx[8] },
    					dirty[0] & /*size*/ 4 && { size: /*size*/ ctx[2] },
    					dirty[0] & /*$$restProps*/ 1024 && get_spread_object(/*$$restProps*/ ctx[10]),
    					dirty[0] & /*hasIconOnly*/ 1 && {
    						style: /*hasIconOnly*/ ctx[0] && "width: 3rem;"
    					}
    				])
    			: {};

    			buttonskeleton.$set(buttonskeleton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(120:0) {#if skeleton}",
    		ctx
    	});

    	return block;
    }

    // (162:4) {#if hasIconOnly}
    function create_if_block_4(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*iconDescription*/ ctx[4]);
    			toggle_class(span, "bx--assistive-text", true);
    			add_location(span, file$9, 162, 6, 4130);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconDescription*/ 16) set_data_dev(t, /*iconDescription*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(162:4) {#if hasIconOnly}",
    		ctx
    	});

    	return block;
    }

    // (143:4) {#if hasIconOnly}
    function create_if_block_3(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*iconDescription*/ ctx[4]);
    			toggle_class(span, "bx--assistive-text", true);
    			add_location(span, file$9, 143, 6, 3742);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconDescription*/ 16) set_data_dev(t, /*iconDescription*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(143:4) {#if hasIconOnly}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_if_block_1$2, create_if_block_2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*skeleton*/ ctx[6]) return 0;
    		if (/*as*/ ctx[5]) return 1;
    		if (/*href*/ ctx[8] && !/*disabled*/ ctx[7]) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let buttonProps;

    	const omit_props_names = [
    		"kind","size","isSelected","hasIconOnly","icon","iconDescription","tooltipAlignment","tooltipPosition","as","skeleton","disabled","href","tabindex","type","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { kind = "primary" } = $$props;
    	let { size = "default" } = $$props;
    	let { isSelected = false } = $$props;
    	let { hasIconOnly = false } = $$props;
    	let { icon = undefined } = $$props;
    	let { iconDescription = undefined } = $$props;
    	let { tooltipAlignment = "center" } = $$props;
    	let { tooltipPosition = "bottom" } = $$props;
    	let { as = false } = $$props;
    	let { skeleton = false } = $$props;
    	let { disabled = false } = $$props;
    	let { href = undefined } = $$props;
    	let { tabindex = "0" } = $$props;
    	let { type = "button" } = $$props;
    	let { ref = null } = $$props;
    	const ctx = getContext("ComposedModal");

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble($$self, event);
    	}

    	function click_handler_2(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler_2(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler_2(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler_2(event) {
    		bubble($$self, event);
    	}

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("kind" in $$new_props) $$invalidate(11, kind = $$new_props.kind);
    		if ("size" in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ("isSelected" in $$new_props) $$invalidate(12, isSelected = $$new_props.isSelected);
    		if ("hasIconOnly" in $$new_props) $$invalidate(0, hasIconOnly = $$new_props.hasIconOnly);
    		if ("icon" in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    		if ("iconDescription" in $$new_props) $$invalidate(4, iconDescription = $$new_props.iconDescription);
    		if ("tooltipAlignment" in $$new_props) $$invalidate(13, tooltipAlignment = $$new_props.tooltipAlignment);
    		if ("tooltipPosition" in $$new_props) $$invalidate(14, tooltipPosition = $$new_props.tooltipPosition);
    		if ("as" in $$new_props) $$invalidate(5, as = $$new_props.as);
    		if ("skeleton" in $$new_props) $$invalidate(6, skeleton = $$new_props.skeleton);
    		if ("disabled" in $$new_props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ("href" in $$new_props) $$invalidate(8, href = $$new_props.href);
    		if ("tabindex" in $$new_props) $$invalidate(15, tabindex = $$new_props.tabindex);
    		if ("type" in $$new_props) $$invalidate(16, type = $$new_props.type);
    		if ("ref" in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		kind,
    		size,
    		isSelected,
    		hasIconOnly,
    		icon,
    		iconDescription,
    		tooltipAlignment,
    		tooltipPosition,
    		as,
    		skeleton,
    		disabled,
    		href,
    		tabindex,
    		type,
    		ref,
    		getContext,
    		ButtonSkeleton,
    		ctx,
    		buttonProps
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("kind" in $$props) $$invalidate(11, kind = $$new_props.kind);
    		if ("size" in $$props) $$invalidate(2, size = $$new_props.size);
    		if ("isSelected" in $$props) $$invalidate(12, isSelected = $$new_props.isSelected);
    		if ("hasIconOnly" in $$props) $$invalidate(0, hasIconOnly = $$new_props.hasIconOnly);
    		if ("icon" in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ("iconDescription" in $$props) $$invalidate(4, iconDescription = $$new_props.iconDescription);
    		if ("tooltipAlignment" in $$props) $$invalidate(13, tooltipAlignment = $$new_props.tooltipAlignment);
    		if ("tooltipPosition" in $$props) $$invalidate(14, tooltipPosition = $$new_props.tooltipPosition);
    		if ("as" in $$props) $$invalidate(5, as = $$new_props.as);
    		if ("skeleton" in $$props) $$invalidate(6, skeleton = $$new_props.skeleton);
    		if ("disabled" in $$props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ("href" in $$props) $$invalidate(8, href = $$new_props.href);
    		if ("tabindex" in $$props) $$invalidate(15, tabindex = $$new_props.tabindex);
    		if ("type" in $$props) $$invalidate(16, type = $$new_props.type);
    		if ("ref" in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ("buttonProps" in $$props) $$invalidate(9, buttonProps = $$new_props.buttonProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*ref*/ 2) {
    			if (ctx && ref) {
    				ctx.declareRef(ref);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*icon*/ 8) {
    			$$invalidate(0, hasIconOnly = icon && !$$slots.default);
    		}

    		$$invalidate(9, buttonProps = {
    			type: href && !disabled ? undefined : type,
    			tabindex,
    			disabled,
    			href,
    			"aria-pressed": hasIconOnly && kind === "ghost" ? isSelected : undefined,
    			...$$restProps,
    			class: [
    				"bx--btn",
    				size === "field" && "bx--btn--field",
    				size === "small" && "bx--btn--sm",
    				kind && `bx--btn--${kind}`,
    				disabled && "bx--btn--disabled",
    				hasIconOnly && "bx--btn--icon-only",
    				hasIconOnly && "bx--tooltip__trigger",
    				hasIconOnly && "bx--tooltip--a11y",
    				hasIconOnly && tooltipPosition && `bx--tooltip--${tooltipPosition}`,
    				hasIconOnly && tooltipAlignment && `bx--tooltip--align-${tooltipAlignment}`,
    				hasIconOnly && isSelected && kind === "ghost" && "bx--btn--selected",
    				$$restProps.class
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		hasIconOnly,
    		ref,
    		size,
    		icon,
    		iconDescription,
    		as,
    		skeleton,
    		disabled,
    		href,
    		buttonProps,
    		$$restProps,
    		kind,
    		isSelected,
    		tooltipAlignment,
    		tooltipPosition,
    		tabindex,
    		type,
    		$$scope,
    		slots,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1,
    		click_handler_2,
    		mouseover_handler_2,
    		mouseenter_handler_2,
    		mouseleave_handler_2,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$a,
    			create_fragment$a,
    			safe_not_equal,
    			{
    				kind: 11,
    				size: 2,
    				isSelected: 12,
    				hasIconOnly: 0,
    				icon: 3,
    				iconDescription: 4,
    				tooltipAlignment: 13,
    				tooltipPosition: 14,
    				as: 5,
    				skeleton: 6,
    				disabled: 7,
    				href: 8,
    				tabindex: 15,
    				type: 16,
    				ref: 1
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get kind() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kind(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelected() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasIconOnly() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasIconOnly(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipAlignment() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipAlignment(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipPosition() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipPosition(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get as() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skeleton() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skeleton(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-icons-svelte/lib/CaretRight16/CaretRight16.svelte generated by Svelte v3.35.0 */

    const file$8 = "node_modules/carbon-icons-svelte/lib/CaretRight16/CaretRight16.svelte";

    // (39:4) {#if title}
    function create_if_block$5(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$8, 39, 6, 1018);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(39:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (38:8)      
    function fallback_block$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(38:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$2(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "CaretRight16" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ width: "16" },
    		{ height: "16" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M12 8L22 16 12 24z");
    			add_location(path, file$8, 36, 2, 950);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$8, 22, 0, 633);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*title*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "CaretRight16" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ width: "16" },
    				{ height: "16" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CaretRight16", slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$props) $$invalidate(3, style = $$new_props.style);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ("labelled" in $$props) $$invalidate(9, labelled = $$new_props.labelled);
    		if ("attributes" in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(7, ariaLabel = $$props["aria-label"]);
    		$$invalidate(8, ariaLabelledBy = $$props["aria-labelledby"]);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 388) {
    			$$invalidate(9, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				"aria-label": ariaLabel,
    				"aria-labelledby": ariaLabelledBy,
    				"aria-hidden": labelled ? undefined : true,
    				role: labelled ? "img" : undefined,
    				focusable: tabindex === "0" ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class CaretRight16 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CaretRight16",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get class() {
    		throw new Error("<CaretRight16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CaretRight16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<CaretRight16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<CaretRight16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<CaretRight16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<CaretRight16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<CaretRight16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<CaretRight16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<CaretRight16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<CaretRight16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<CaretRight16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<CaretRight16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-icons-svelte/lib/CaretLeft16/CaretLeft16.svelte generated by Svelte v3.35.0 */

    const file$7 = "node_modules/carbon-icons-svelte/lib/CaretLeft16/CaretLeft16.svelte";

    // (39:4) {#if title}
    function create_if_block$4(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$7, 39, 6, 1017);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(39:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (38:8)      
    function fallback_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(38:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "CaretLeft16" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ width: "16" },
    		{ height: "16" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M20 24L10 16 20 8z");
    			add_location(path, file$7, 36, 2, 949);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$7, 22, 0, 633);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*title*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "CaretLeft16" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ width: "16" },
    				{ height: "16" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CaretLeft16", slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$props) $$invalidate(3, style = $$new_props.style);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ("labelled" in $$props) $$invalidate(9, labelled = $$new_props.labelled);
    		if ("attributes" in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(7, ariaLabel = $$props["aria-label"]);
    		$$invalidate(8, ariaLabelledBy = $$props["aria-labelledby"]);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 388) {
    			$$invalidate(9, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				"aria-label": ariaLabel,
    				"aria-labelledby": ariaLabelledBy,
    				"aria-hidden": labelled ? undefined : true,
    				role: labelled ? "img" : undefined,
    				focusable: tabindex === "0" ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class CaretLeft16 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CaretLeft16",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get class() {
    		throw new Error("<CaretLeft16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CaretLeft16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<CaretLeft16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<CaretLeft16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<CaretLeft16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<CaretLeft16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<CaretLeft16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<CaretLeft16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<CaretLeft16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<CaretLeft16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<CaretLeft16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<CaretLeft16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-components-svelte/src/PaginationNav/PaginationItem.svelte generated by Svelte v3.35.0 */

    const file$6 = "node_modules/carbon-components-svelte/src/PaginationNav/PaginationItem.svelte";

    function create_fragment$7(ctx) {
    	let li;
    	let button;
    	let span;
    	let t0;
    	let t1;
    	let button_aria_current_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			span = element("span");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			t1 = text(/*page*/ ctx[0]);
    			toggle_class(span, "bx--pagination-nav__accessibility-label", true);
    			add_location(span, file$6, 16, 4, 411);
    			attr_dev(button, "data-page", /*page*/ ctx[0]);
    			attr_dev(button, "aria-current", button_aria_current_value = /*active*/ ctx[1] ? "page" : undefined);
    			toggle_class(button, "bx--pagination-nav__page", true);
    			toggle_class(button, "bx--pagination-nav__page--active", /*active*/ ctx[1]);
    			add_location(button, file$6, 9, 2, 212);
    			toggle_class(li, "bx--pagination-nav__list-item", true);
    			add_location(li, file$6, 8, 0, 160);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			append_dev(button, t0);
    			append_dev(button, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*page*/ 1) set_data_dev(t1, /*page*/ ctx[0]);

    			if (!current || dirty & /*page*/ 1) {
    				attr_dev(button, "data-page", /*page*/ ctx[0]);
    			}

    			if (!current || dirty & /*active*/ 2 && button_aria_current_value !== (button_aria_current_value = /*active*/ ctx[1] ? "page" : undefined)) {
    				attr_dev(button, "aria-current", button_aria_current_value);
    			}

    			if (dirty & /*active*/ 2) {
    				toggle_class(button, "bx--pagination-nav__page--active", /*active*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PaginationItem", slots, ['default']);
    	let { page = 0 } = $$props;
    	let { active = false } = $$props;
    	const writable_props = ["page", "active"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PaginationItem> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("page" in $$props) $$invalidate(0, page = $$props.page);
    		if ("active" in $$props) $$invalidate(1, active = $$props.active);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ page, active });

    	$$self.$inject_state = $$props => {
    		if ("page" in $$props) $$invalidate(0, page = $$props.page);
    		if ("active" in $$props) $$invalidate(1, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page, active, $$scope, slots, click_handler];
    }

    class PaginationItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { page: 0, active: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationItem",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get page() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-icons-svelte/lib/OverflowMenuHorizontal16/OverflowMenuHorizontal16.svelte generated by Svelte v3.35.0 */

    const file$5 = "node_modules/carbon-icons-svelte/lib/OverflowMenuHorizontal16/OverflowMenuHorizontal16.svelte";

    // (39:4) {#if title}
    function create_if_block$3(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$5, 39, 6, 1110);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(39:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (38:8)      
    function fallback_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(38:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let svg;
    	let circle0;
    	let circle1;
    	let circle2;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let svg_levels = [
    		{
    			"data-carbon-icon": "OverflowMenuHorizontal16"
    		},
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ width: "16" },
    		{ height: "16" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(circle0, "cx", "8");
    			attr_dev(circle0, "cy", "16");
    			attr_dev(circle0, "r", "2");
    			add_location(circle0, file$5, 36, 2, 962);
    			attr_dev(circle1, "cx", "16");
    			attr_dev(circle1, "cy", "16");
    			attr_dev(circle1, "r", "2");
    			add_location(circle1, file$5, 36, 40, 1000);
    			attr_dev(circle2, "cx", "24");
    			attr_dev(circle2, "cy", "16");
    			attr_dev(circle2, "r", "2");
    			add_location(circle2, file$5, 36, 79, 1039);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$5, 22, 0, 633);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, circle2);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*title*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{
    					"data-carbon-icon": "OverflowMenuHorizontal16"
    				},
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ width: "16" },
    				{ height: "16" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("OverflowMenuHorizontal16", slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$props) $$invalidate(3, style = $$new_props.style);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ("labelled" in $$props) $$invalidate(9, labelled = $$new_props.labelled);
    		if ("attributes" in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(7, ariaLabel = $$props["aria-label"]);
    		$$invalidate(8, ariaLabelledBy = $$props["aria-labelledby"]);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 388) {
    			$$invalidate(9, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				"aria-label": ariaLabel,
    				"aria-labelledby": ariaLabelledBy,
    				"aria-hidden": labelled ? undefined : true,
    				role: labelled ? "img" : undefined,
    				focusable: tabindex === "0" ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class OverflowMenuHorizontal16 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverflowMenuHorizontal16",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get class() {
    		throw new Error("<OverflowMenuHorizontal16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<OverflowMenuHorizontal16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<OverflowMenuHorizontal16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<OverflowMenuHorizontal16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<OverflowMenuHorizontal16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<OverflowMenuHorizontal16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<OverflowMenuHorizontal16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<OverflowMenuHorizontal16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<OverflowMenuHorizontal16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<OverflowMenuHorizontal16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<OverflowMenuHorizontal16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<OverflowMenuHorizontal16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-components-svelte/src/PaginationNav/PaginationOverflow.svelte generated by Svelte v3.35.0 */
    const file$4 = "node_modules/carbon-components-svelte/src/PaginationNav/PaginationOverflow.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (47:22) 
    function create_if_block_1$1(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				page: /*fromIndex*/ ctx[0] + 1,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationitem.$on("click", /*click_handler*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};
    			if (dirty & /*fromIndex*/ 1) paginationitem_changes.page = /*fromIndex*/ ctx[0] + 1;

    			if (dirty & /*$$scope*/ 512) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(47:22) ",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if count > 1}
    function create_if_block$2(ctx) {
    	let li;
    	let div1;
    	let select;
    	let option;
    	let t;
    	let div0;
    	let overflowmenuhorizontal16;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = Array.from({ length: /*count*/ ctx[1] }, func);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	overflowmenuhorizontal16 = new OverflowMenuHorizontal16({
    			props: { class: "bx--pagination-nav__select-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			div1 = element("div");
    			select = element("select");
    			option = element("option");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			div0 = element("div");
    			create_component(overflowmenuhorizontal16.$$.fragment);
    			option.__value = "";
    			option.value = option.__value;
    			option.hidden = true;
    			add_location(option, file$4, 34, 8, 995);
    			attr_dev(select, "aria-label", "Select Page number");
    			toggle_class(select, "bx--pagination-nav__page", true);
    			toggle_class(select, "bx--pagination-nav__page--select", true);
    			add_location(select, file$4, 24, 6, 668);
    			toggle_class(div0, "bx--pagination-nav__select-icon-wrapper", true);
    			add_location(div0, file$4, 41, 6, 1258);
    			toggle_class(div1, "bx--pagination-nav__select", true);
    			add_location(div1, file$4, 22, 4, 568);
    			toggle_class(li, "bx--pagination-nav__list-item", true);
    			add_location(li, file$4, 21, 2, 514);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div1);
    			append_dev(div1, select);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*value*/ ctx[2]);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			mount_component(overflowmenuhorizontal16, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*change_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fromIndex, Array, count*/ 3) {
    				each_value = Array.from({ length: /*count*/ ctx[1] }, func);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*value, fromIndex, Array, count*/ 7) {
    				select_option(select, /*value*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overflowmenuhorizontal16.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overflowmenuhorizontal16.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_each(each_blocks, detaching);
    			destroy_component(overflowmenuhorizontal16);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(21:0) {#if count > 1}",
    		ctx
    	});

    	return block;
    }

    // (48:2) <PaginationItem     page="{fromIndex + 1}"     on:click="{() => {       dispatch('select', { index: fromIndex });     }}"   >
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(48:2) <PaginationItem     page=\\\"{fromIndex + 1}\\\"     on:click=\\\"{() => {       dispatch('select', { index: fromIndex });     }}\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (36:8) {#each Array.from({ length: count }, (_, i) => i) as i}
    function create_each_block$3(ctx) {
    	let option;
    	let t0_value = /*fromIndex*/ ctx[0] + /*i*/ ctx[6] + 1 + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_data_page_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*fromIndex*/ ctx[0] + /*i*/ ctx[6];
    			option.value = option.__value;
    			attr_dev(option, "data-page", option_data_page_value = /*fromIndex*/ ctx[0] + /*i*/ ctx[6] + 1);
    			add_location(option, file$4, 36, 10, 1103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fromIndex, count*/ 3 && t0_value !== (t0_value = /*fromIndex*/ ctx[0] + /*i*/ ctx[6] + 1 + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*fromIndex, count*/ 3 && option_value_value !== (option_value_value = /*fromIndex*/ ctx[0] + /*i*/ ctx[6])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty & /*fromIndex, count*/ 3 && option_data_page_value !== (option_data_page_value = /*fromIndex*/ ctx[0] + /*i*/ ctx[6] + 1)) {
    				attr_dev(option, "data-page", option_data_page_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(36:8) {#each Array.from({ length: count }, (_, i) => i) as i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*count*/ ctx[1] > 1) return 0;
    		if (/*count*/ ctx[1] === 1) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = (_, i) => i;

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PaginationOverflow", slots, []);
    	let { fromIndex = 0 } = $$props;
    	let { count = 0 } = $$props;
    	const dispatch = createEventDispatcher();
    	let value = "";
    	const writable_props = ["fromIndex", "count"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PaginationOverflow> was created with unknown prop '${key}'`);
    	});

    	const change_handler = ({ target }) => {
    		$$invalidate(2, value = "");
    		dispatch("select", { index: Number(target.value) });
    	};

    	const click_handler = () => {
    		dispatch("select", { index: fromIndex });
    	};

    	$$self.$$set = $$props => {
    		if ("fromIndex" in $$props) $$invalidate(0, fromIndex = $$props.fromIndex);
    		if ("count" in $$props) $$invalidate(1, count = $$props.count);
    	};

    	$$self.$capture_state = () => ({
    		fromIndex,
    		count,
    		createEventDispatcher,
    		OverflowMenuHorizontal16,
    		PaginationItem,
    		dispatch,
    		value
    	});

    	$$self.$inject_state = $$props => {
    		if ("fromIndex" in $$props) $$invalidate(0, fromIndex = $$props.fromIndex);
    		if ("count" in $$props) $$invalidate(1, count = $$props.count);
    		if ("value" in $$props) $$invalidate(2, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [fromIndex, count, value, dispatch, change_handler, click_handler];
    }

    class PaginationOverflow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { fromIndex: 0, count: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationOverflow",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get fromIndex() {
    		throw new Error("<PaginationOverflow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fromIndex(value) {
    		throw new Error("<PaginationOverflow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get count() {
    		throw new Error("<PaginationOverflow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set count(value) {
    		throw new Error("<PaginationOverflow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/carbon-components-svelte/src/PaginationNav/PaginationNav.svelte generated by Svelte v3.35.0 */
    const file$3 = "node_modules/carbon-components-svelte/src/PaginationNav/PaginationNav.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    // (91:4) {#if fit > MIN || (fit <= MIN && page <= 1)}
    function create_if_block_1(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				page: 1,
    				active: /*page*/ ctx[0] === 0,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationitem.$on("click", /*click_handler_1*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};
    			if (dirty & /*page*/ 1) paginationitem_changes.active = /*page*/ ctx[0] === 0;

    			if (dirty & /*$$scope, page*/ 8388609) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(91:4) {#if fit > MIN || (fit <= MIN && page <= 1)}",
    		ctx
    	});

    	return block;
    }

    // (92:6) <PaginationItem         page="{1}"         active="{page === 0}"         on:click="{() => (page = 0)}"       >
    function create_default_slot_2(ctx) {
    	let t_value = (/*page*/ ctx[0] === 0 ? "Active, Page" : "Page") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*page*/ 1 && t_value !== (t_value = (/*page*/ ctx[0] === 0 ? "Active, Page" : "Page") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(92:6) <PaginationItem         page=\\\"{1}\\\"         active=\\\"{page === 0}\\\"         on:click=\\\"{() => (page = 0)}\\\"       >",
    		ctx
    	});

    	return block;
    }

    // (106:6) <PaginationItem         page="{item + 1}"         active="{page === item}"         on:click="{() => (page = item)}"       >
    function create_default_slot_1$1(ctx) {
    	let t_value = (/*page*/ ctx[0] === /*item*/ ctx[20]
    	? "Active, Page"
    	: "Page") + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*page, items*/ 513 && t_value !== (t_value = (/*page*/ ctx[0] === /*item*/ ctx[20]
    			? "Active, Page"
    			: "Page") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(106:6) <PaginationItem         page=\\\"{item + 1}\\\"         active=\\\"{page === item}\\\"         on:click=\\\"{() => (page = item)}\\\"       >",
    		ctx
    	});

    	return block;
    }

    // (105:4) {#each items as item}
    function create_each_block$2(ctx) {
    	let paginationitem;
    	let current;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[16](/*item*/ ctx[20]);
    	}

    	paginationitem = new PaginationItem({
    			props: {
    				page: /*item*/ ctx[20] + 1,
    				active: /*page*/ ctx[0] === /*item*/ ctx[20],
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationitem.$on("click", click_handler_2);

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const paginationitem_changes = {};
    			if (dirty & /*items*/ 512) paginationitem_changes.page = /*item*/ ctx[20] + 1;
    			if (dirty & /*page, items*/ 513) paginationitem_changes.active = /*page*/ ctx[0] === /*item*/ ctx[20];

    			if (dirty & /*$$scope, page, items*/ 8389121) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(105:4) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    // (121:4) {#if total > 1}
    function create_if_block$1(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				page: /*total*/ ctx[1],
    				active: /*page*/ ctx[0] === /*total*/ ctx[1] - 1,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationitem.$on("click", /*click_handler_3*/ ctx[18]);

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};
    			if (dirty & /*total*/ 2) paginationitem_changes.page = /*total*/ ctx[1];
    			if (dirty & /*page, total*/ 3) paginationitem_changes.active = /*page*/ ctx[0] === /*total*/ ctx[1] - 1;

    			if (dirty & /*$$scope, page, total*/ 8388611) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(121:4) {#if total > 1}",
    		ctx
    	});

    	return block;
    }

    // (122:6) <PaginationItem         page="{total}"         active="{page === total - 1}"         on:click="{() => (page = total - 1)}"       >
    function create_default_slot$1(ctx) {
    	let t_value = (/*page*/ ctx[0] === /*total*/ ctx[1] - 1
    	? "Active, Page"
    	: "Page") + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*page, total*/ 3 && t_value !== (t_value = (/*page*/ ctx[0] === /*total*/ ctx[1] - 1
    			? "Active, Page"
    			: "Page") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(122:6) <PaginationItem         page=\\\"{total}\\\"         active=\\\"{page === total - 1}\\\"         on:click=\\\"{() => (page = total - 1)}\\\"       >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let nav;
    	let ul;
    	let li0;
    	let button0;
    	let t0;
    	let t1;
    	let paginationoverflow0;
    	let t2;
    	let t3;
    	let paginationoverflow1;
    	let t4;
    	let t5;
    	let li1;
    	let button1;
    	let t6;
    	let div;
    	let t7;
    	let t8_value = /*page*/ ctx[0] + 1 + "";
    	let t8;
    	let t9;
    	let t10;
    	let current;

    	button0 = new Button({
    			props: {
    				hasIconOnly: true,
    				kind: "ghost",
    				tooltipAlignment: "center",
    				tooltipPosition: "bottom",
    				iconDescription: /*backwardText*/ ctx[4],
    				disabled: !/*loop*/ ctx[2] && /*page*/ ctx[0] === 0,
    				icon: CaretLeft16
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[13]);
    	let if_block0 = (/*fit*/ ctx[7] > MIN || /*fit*/ ctx[7] <= MIN && /*page*/ ctx[0] <= 1) && create_if_block_1(ctx);

    	paginationoverflow0 = new PaginationOverflow({
    			props: {
    				fromIndex: /*startOffset*/ ctx[8],
    				count: /*front*/ ctx[5]
    			},
    			$$inline: true
    		});

    	paginationoverflow0.$on("select", /*select_handler*/ ctx[15]);
    	let each_value = /*items*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	paginationoverflow1 = new PaginationOverflow({
    			props: {
    				fromIndex: /*total*/ ctx[1] - /*back*/ ctx[6] - 1,
    				count: /*back*/ ctx[6]
    			},
    			$$inline: true
    		});

    	paginationoverflow1.$on("select", /*select_handler_1*/ ctx[17]);
    	let if_block1 = /*total*/ ctx[1] > 1 && create_if_block$1(ctx);

    	button1 = new Button({
    			props: {
    				hasIconOnly: true,
    				kind: "ghost",
    				tooltipAlignment: "center",
    				tooltipPosition: "bottom",
    				iconDescription: /*forwardText*/ ctx[3],
    				disabled: !/*loop*/ ctx[2] && /*page*/ ctx[0] === /*total*/ ctx[1] - 1,
    				icon: CaretRight16
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_4*/ ctx[19]);
    	let nav_levels = [{ "aria-label": "pagination" }, /*$$restProps*/ ctx[11]];
    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(button0.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(paginationoverflow0.$$.fragment);
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			create_component(paginationoverflow1.$$.fragment);
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			li1 = element("li");
    			create_component(button1.$$.fragment);
    			t6 = space();
    			div = element("div");
    			t7 = text("Page\n    ");
    			t8 = text(t8_value);
    			t9 = text("\n    of\n    ");
    			t10 = text(/*total*/ ctx[1]);
    			toggle_class(li0, "bx--pagination-nav__list-item", true);
    			add_location(li0, file$3, 71, 4, 1928);
    			toggle_class(li1, "bx--pagination-nav__list-item", true);
    			add_location(li1, file$3, 129, 4, 3492);
    			toggle_class(ul, "bx--pagination-nav__list", true);
    			add_location(ul, file$3, 70, 2, 1879);
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "aria-atomic", "true");
    			toggle_class(div, "bx--pagination-nav__accessibility-label", true);
    			add_location(div, file$3, 149, 2, 4021);
    			set_attributes(nav, nav_data);
    			toggle_class(nav, "bx--pagination-nav", true);
    			add_location(nav, file$3, 69, 0, 1796);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			mount_component(button0, li0, null);
    			append_dev(ul, t0);
    			if (if_block0) if_block0.m(ul, null);
    			append_dev(ul, t1);
    			mount_component(paginationoverflow0, ul, null);
    			append_dev(ul, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t3);
    			mount_component(paginationoverflow1, ul, null);
    			append_dev(ul, t4);
    			if (if_block1) if_block1.m(ul, null);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			mount_component(button1, li1, null);
    			append_dev(nav, t6);
    			append_dev(nav, div);
    			append_dev(div, t7);
    			append_dev(div, t8);
    			append_dev(div, t9);
    			append_dev(div, t10);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};
    			if (dirty & /*backwardText*/ 16) button0_changes.iconDescription = /*backwardText*/ ctx[4];
    			if (dirty & /*loop, page*/ 5) button0_changes.disabled = !/*loop*/ ctx[2] && /*page*/ ctx[0] === 0;
    			button0.$set(button0_changes);

    			if (/*fit*/ ctx[7] > MIN || /*fit*/ ctx[7] <= MIN && /*page*/ ctx[0] <= 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*fit, page*/ 129) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(ul, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const paginationoverflow0_changes = {};
    			if (dirty & /*startOffset*/ 256) paginationoverflow0_changes.fromIndex = /*startOffset*/ ctx[8];
    			if (dirty & /*front*/ 32) paginationoverflow0_changes.count = /*front*/ ctx[5];
    			paginationoverflow0.$set(paginationoverflow0_changes);

    			if (dirty & /*items, page*/ 513) {
    				each_value = /*items*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, t3);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const paginationoverflow1_changes = {};
    			if (dirty & /*total, back*/ 66) paginationoverflow1_changes.fromIndex = /*total*/ ctx[1] - /*back*/ ctx[6] - 1;
    			if (dirty & /*back*/ 64) paginationoverflow1_changes.count = /*back*/ ctx[6];
    			paginationoverflow1.$set(paginationoverflow1_changes);

    			if (/*total*/ ctx[1] > 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*total*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(ul, t5);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const button1_changes = {};
    			if (dirty & /*forwardText*/ 8) button1_changes.iconDescription = /*forwardText*/ ctx[3];
    			if (dirty & /*loop, page, total*/ 7) button1_changes.disabled = !/*loop*/ ctx[2] && /*page*/ ctx[0] === /*total*/ ctx[1] - 1;
    			button1.$set(button1_changes);
    			if ((!current || dirty & /*page*/ 1) && t8_value !== (t8_value = /*page*/ ctx[0] + 1 + "")) set_data_dev(t8, t8_value);
    			if (!current || dirty & /*total*/ 2) set_data_dev(t10, /*total*/ ctx[1]);

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				{ "aria-label": "pagination" },
    				dirty & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11]
    			]));

    			toggle_class(nav, "bx--pagination-nav", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(paginationoverflow0.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(paginationoverflow1.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(paginationoverflow0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(paginationoverflow1.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(button0);
    			if (if_block0) if_block0.d();
    			destroy_component(paginationoverflow0);
    			destroy_each(each_blocks, detaching);
    			destroy_component(paginationoverflow1);
    			if (if_block1) if_block1.d();
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const MIN = 4;

    function instance$4($$self, $$props, $$invalidate) {
    	let fit;
    	let startOffset;
    	let items;
    	const omit_props_names = ["page","total","shown","loop","forwardText","backwardText"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PaginationNav", slots, []);
    	let { page = 0 } = $$props;
    	let { total = 10 } = $$props;
    	let { shown = 10 } = $$props;
    	let { loop = false } = $$props;
    	let { forwardText = "Next page" } = $$props;
    	let { backwardText = "Previous page" } = $$props;
    	const dispatch = createEventDispatcher();

    	afterUpdate(() => {
    		dispatch("change", { page });
    	});

    	let front = 0;
    	let back = 0;

    	const click_handler = () => {
    		if (page - 1 < 0) {
    			if (loop) $$invalidate(0, page = total - 1);
    		} else {
    			$$invalidate(0, page--, page);
    		}

    		dispatch("click:button--previous", { page });
    	};

    	const click_handler_1 = () => $$invalidate(0, page = 0);
    	const select_handler = ({ detail }) => $$invalidate(0, page = detail.index);
    	const click_handler_2 = item => $$invalidate(0, page = item);

    	const select_handler_1 = ({ detail }) => {
    		$$invalidate(0, page = detail.index);
    	};

    	const click_handler_3 = () => $$invalidate(0, page = total - 1);

    	const click_handler_4 = () => {
    		if (page + 1 >= total) {
    			if (loop) $$invalidate(0, page = 0);
    		} else {
    			$$invalidate(0, page++, page);
    		}

    		dispatch("click:button--next", { page });
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("page" in $$new_props) $$invalidate(0, page = $$new_props.page);
    		if ("total" in $$new_props) $$invalidate(1, total = $$new_props.total);
    		if ("shown" in $$new_props) $$invalidate(12, shown = $$new_props.shown);
    		if ("loop" in $$new_props) $$invalidate(2, loop = $$new_props.loop);
    		if ("forwardText" in $$new_props) $$invalidate(3, forwardText = $$new_props.forwardText);
    		if ("backwardText" in $$new_props) $$invalidate(4, backwardText = $$new_props.backwardText);
    	};

    	$$self.$capture_state = () => ({
    		page,
    		total,
    		shown,
    		loop,
    		forwardText,
    		backwardText,
    		afterUpdate,
    		createEventDispatcher,
    		CaretLeft16,
    		CaretRight16,
    		PaginationItem,
    		PaginationOverflow,
    		Button,
    		dispatch,
    		MIN,
    		front,
    		back,
    		fit,
    		startOffset,
    		items
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("page" in $$props) $$invalidate(0, page = $$new_props.page);
    		if ("total" in $$props) $$invalidate(1, total = $$new_props.total);
    		if ("shown" in $$props) $$invalidate(12, shown = $$new_props.shown);
    		if ("loop" in $$props) $$invalidate(2, loop = $$new_props.loop);
    		if ("forwardText" in $$props) $$invalidate(3, forwardText = $$new_props.forwardText);
    		if ("backwardText" in $$props) $$invalidate(4, backwardText = $$new_props.backwardText);
    		if ("front" in $$props) $$invalidate(5, front = $$new_props.front);
    		if ("back" in $$props) $$invalidate(6, back = $$new_props.back);
    		if ("fit" in $$props) $$invalidate(7, fit = $$new_props.fit);
    		if ("startOffset" in $$props) $$invalidate(8, startOffset = $$new_props.startOffset);
    		if ("items" in $$props) $$invalidate(9, items = $$new_props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*shown*/ 4096) {
    			$$invalidate(7, fit = shown >= MIN ? shown : MIN);
    		}

    		if ($$self.$$.dirty & /*fit, page*/ 129) {
    			$$invalidate(8, startOffset = fit <= MIN && page > 1 ? 0 : 1);
    		}

    		if ($$self.$$.dirty & /*fit, total*/ 130) {
    			if (fit >= total) {
    				$$invalidate(5, front = 0);
    				$$invalidate(6, back = 0);
    			}
    		}

    		if ($$self.$$.dirty & /*fit, total, page, front, back*/ 227) {
    			if (fit < total) {
    				const split = Math.ceil(fit / 2) - 1;
    				$$invalidate(5, front = page - split + 1);
    				$$invalidate(6, back = total - page - (fit - split) + 1);

    				if (front <= 1) {
    					$$invalidate(6, back -= front <= 0 ? Math.abs(front) + 1 : 0);
    					$$invalidate(5, front = 0);
    				}

    				if (back <= 1) {
    					$$invalidate(5, front -= back <= 0 ? Math.abs(back) + 1 : 0);
    					$$invalidate(6, back = 0);
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*total, startOffset, front, back*/ 354) {
    			$$invalidate(9, items = Array.from({ length: total }).map((e, i) => i).slice(startOffset + front, (back + 1) * -1));
    		}
    	};

    	return [
    		page,
    		total,
    		loop,
    		forwardText,
    		backwardText,
    		front,
    		back,
    		fit,
    		startOffset,
    		items,
    		dispatch,
    		$$restProps,
    		shown,
    		click_handler,
    		click_handler_1,
    		select_handler,
    		click_handler_2,
    		select_handler_1,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class PaginationNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			page: 0,
    			total: 1,
    			shown: 12,
    			loop: 2,
    			forwardText: 3,
    			backwardText: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationNav",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get page() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get total() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set total(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shown() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shown(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loop() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loop(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get forwardText() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set forwardText(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backwardText() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backwardText(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /**
     * marked - a markdown parser
     * Copyright (c) 2011-2021, Christopher Jeffrey. (MIT Licensed)
     * https://github.com/markedjs/marked
     */

    var marked = createCommonjsModule(function (module, exports) {
    /**
     * DO NOT EDIT THIS FILE
     * The code in this file is generated from files in ./src/
     */

    (function (global, factory) {
      module.exports = factory() ;
    }(commonjsGlobal, (function () {
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;

        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

        return arr2;
      }

      function _createForOfIteratorHelperLoose(o, allowArrayLike) {
        var it;

        if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            return function () {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            };
          }

          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }

        it = o[Symbol.iterator]();
        return it.next.bind(it);
      }

      function createCommonjsModule(fn) {
        var module = { exports: {} };
      	return fn(module, module.exports), module.exports;
      }

      var defaults = createCommonjsModule(function (module) {
        function getDefaults() {
          return {
            baseUrl: null,
            breaks: false,
            gfm: true,
            headerIds: true,
            headerPrefix: '',
            highlight: null,
            langPrefix: 'language-',
            mangle: true,
            pedantic: false,
            renderer: null,
            sanitize: false,
            sanitizer: null,
            silent: false,
            smartLists: false,
            smartypants: false,
            tokenizer: null,
            walkTokens: null,
            xhtml: false
          };
        }

        function changeDefaults(newDefaults) {
          module.exports.defaults = newDefaults;
        }

        module.exports = {
          defaults: getDefaults(),
          getDefaults: getDefaults,
          changeDefaults: changeDefaults
        };
      });

      /**
       * Helpers
       */
      var escapeTest = /[&<>"']/;
      var escapeReplace = /[&<>"']/g;
      var escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
      var escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
      var escapeReplacements = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };

      var getEscapeReplacement = function getEscapeReplacement(ch) {
        return escapeReplacements[ch];
      };

      function escape(html, encode) {
        if (encode) {
          if (escapeTest.test(html)) {
            return html.replace(escapeReplace, getEscapeReplacement);
          }
        } else {
          if (escapeTestNoEncode.test(html)) {
            return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
          }
        }

        return html;
      }

      var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

      function unescape(html) {
        // explicitly match decimal, hex, and named HTML entities
        return html.replace(unescapeTest, function (_, n) {
          n = n.toLowerCase();
          if (n === 'colon') return ':';

          if (n.charAt(0) === '#') {
            return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
          }

          return '';
        });
      }

      var caret = /(^|[^\[])\^/g;

      function edit(regex, opt) {
        regex = regex.source || regex;
        opt = opt || '';
        var obj = {
          replace: function replace(name, val) {
            val = val.source || val;
            val = val.replace(caret, '$1');
            regex = regex.replace(name, val);
            return obj;
          },
          getRegex: function getRegex() {
            return new RegExp(regex, opt);
          }
        };
        return obj;
      }

      var nonWordAndColonTest = /[^\w:]/g;
      var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

      function cleanUrl(sanitize, base, href) {
        if (sanitize) {
          var prot;

          try {
            prot = decodeURIComponent(unescape(href)).replace(nonWordAndColonTest, '').toLowerCase();
          } catch (e) {
            return null;
          }

          if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
            return null;
          }
        }

        if (base && !originIndependentUrl.test(href)) {
          href = resolveUrl(base, href);
        }

        try {
          href = encodeURI(href).replace(/%25/g, '%');
        } catch (e) {
          return null;
        }

        return href;
      }

      var baseUrls = {};
      var justDomain = /^[^:]+:\/*[^/]*$/;
      var protocol = /^([^:]+:)[\s\S]*$/;
      var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

      function resolveUrl(base, href) {
        if (!baseUrls[' ' + base]) {
          // we can ignore everything in base after the last slash of its path component,
          // but we might need to add _that_
          // https://tools.ietf.org/html/rfc3986#section-3
          if (justDomain.test(base)) {
            baseUrls[' ' + base] = base + '/';
          } else {
            baseUrls[' ' + base] = rtrim(base, '/', true);
          }
        }

        base = baseUrls[' ' + base];
        var relativeBase = base.indexOf(':') === -1;

        if (href.substring(0, 2) === '//') {
          if (relativeBase) {
            return href;
          }

          return base.replace(protocol, '$1') + href;
        } else if (href.charAt(0) === '/') {
          if (relativeBase) {
            return href;
          }

          return base.replace(domain, '$1') + href;
        } else {
          return base + href;
        }
      }

      var noopTest = {
        exec: function noopTest() {}
      };

      function merge(obj) {
        var i = 1,
            target,
            key;

        for (; i < arguments.length; i++) {
          target = arguments[i];

          for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
              obj[key] = target[key];
            }
          }
        }

        return obj;
      }

      function splitCells(tableRow, count) {
        // ensure that every cell-delimiting pipe has a space
        // before it to distinguish it from an escaped pipe
        var row = tableRow.replace(/\|/g, function (match, offset, str) {
          var escaped = false,
              curr = offset;

          while (--curr >= 0 && str[curr] === '\\') {
            escaped = !escaped;
          }

          if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
          } else {
            // add space before unescaped |
            return ' |';
          }
        }),
            cells = row.split(/ \|/);
        var i = 0;

        if (cells.length > count) {
          cells.splice(count);
        } else {
          while (cells.length < count) {
            cells.push('');
          }
        }

        for (; i < cells.length; i++) {
          // leading or trailing whitespace is ignored per the gfm spec
          cells[i] = cells[i].trim().replace(/\\\|/g, '|');
        }

        return cells;
      } // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
      // /c*$/ is vulnerable to REDOS.
      // invert: Remove suffix of non-c chars instead. Default falsey.


      function rtrim(str, c, invert) {
        var l = str.length;

        if (l === 0) {
          return '';
        } // Length of suffix matching the invert condition.


        var suffLen = 0; // Step left until we fail to match the invert condition.

        while (suffLen < l) {
          var currChar = str.charAt(l - suffLen - 1);

          if (currChar === c && !invert) {
            suffLen++;
          } else if (currChar !== c && invert) {
            suffLen++;
          } else {
            break;
          }
        }

        return str.substr(0, l - suffLen);
      }

      function findClosingBracket(str, b) {
        if (str.indexOf(b[1]) === -1) {
          return -1;
        }

        var l = str.length;
        var level = 0,
            i = 0;

        for (; i < l; i++) {
          if (str[i] === '\\') {
            i++;
          } else if (str[i] === b[0]) {
            level++;
          } else if (str[i] === b[1]) {
            level--;

            if (level < 0) {
              return i;
            }
          }
        }

        return -1;
      }

      function checkSanitizeDeprecation(opt) {
        if (opt && opt.sanitize && !opt.silent) {
          console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
        }
      } // copied from https://stackoverflow.com/a/5450113/806777


      function repeatString(pattern, count) {
        if (count < 1) {
          return '';
        }

        var result = '';

        while (count > 1) {
          if (count & 1) {
            result += pattern;
          }

          count >>= 1;
          pattern += pattern;
        }

        return result + pattern;
      }

      var helpers = {
        escape: escape,
        unescape: unescape,
        edit: edit,
        cleanUrl: cleanUrl,
        resolveUrl: resolveUrl,
        noopTest: noopTest,
        merge: merge,
        splitCells: splitCells,
        rtrim: rtrim,
        findClosingBracket: findClosingBracket,
        checkSanitizeDeprecation: checkSanitizeDeprecation,
        repeatString: repeatString
      };

      var defaults$1 = defaults.defaults;
      var rtrim$1 = helpers.rtrim,
          splitCells$1 = helpers.splitCells,
          _escape = helpers.escape,
          findClosingBracket$1 = helpers.findClosingBracket;

      function outputLink(cap, link, raw) {
        var href = link.href;
        var title = link.title ? _escape(link.title) : null;
        var text = cap[1].replace(/\\([\[\]])/g, '$1');

        if (cap[0].charAt(0) !== '!') {
          return {
            type: 'link',
            raw: raw,
            href: href,
            title: title,
            text: text
          };
        } else {
          return {
            type: 'image',
            raw: raw,
            href: href,
            title: title,
            text: _escape(text)
          };
        }
      }

      function indentCodeCompensation(raw, text) {
        var matchIndentToCode = raw.match(/^(\s+)(?:```)/);

        if (matchIndentToCode === null) {
          return text;
        }

        var indentToCode = matchIndentToCode[1];
        return text.split('\n').map(function (node) {
          var matchIndentInNode = node.match(/^\s+/);

          if (matchIndentInNode === null) {
            return node;
          }

          var indentInNode = matchIndentInNode[0];

          if (indentInNode.length >= indentToCode.length) {
            return node.slice(indentToCode.length);
          }

          return node;
        }).join('\n');
      }
      /**
       * Tokenizer
       */


      var Tokenizer_1 = /*#__PURE__*/function () {
        function Tokenizer(options) {
          this.options = options || defaults$1;
        }

        var _proto = Tokenizer.prototype;

        _proto.space = function space(src) {
          var cap = this.rules.block.newline.exec(src);

          if (cap) {
            if (cap[0].length > 1) {
              return {
                type: 'space',
                raw: cap[0]
              };
            }

            return {
              raw: '\n'
            };
          }
        };

        _proto.code = function code(src) {
          var cap = this.rules.block.code.exec(src);

          if (cap) {
            var text = cap[0].replace(/^ {1,4}/gm, '');
            return {
              type: 'code',
              raw: cap[0],
              codeBlockStyle: 'indented',
              text: !this.options.pedantic ? rtrim$1(text, '\n') : text
            };
          }
        };

        _proto.fences = function fences(src) {
          var cap = this.rules.block.fences.exec(src);

          if (cap) {
            var raw = cap[0];
            var text = indentCodeCompensation(raw, cap[3] || '');
            return {
              type: 'code',
              raw: raw,
              lang: cap[2] ? cap[2].trim() : cap[2],
              text: text
            };
          }
        };

        _proto.heading = function heading(src) {
          var cap = this.rules.block.heading.exec(src);

          if (cap) {
            var text = cap[2].trim(); // remove trailing #s

            if (/#$/.test(text)) {
              var trimmed = rtrim$1(text, '#');

              if (this.options.pedantic) {
                text = trimmed.trim();
              } else if (!trimmed || / $/.test(trimmed)) {
                // CommonMark requires space before trailing #s
                text = trimmed.trim();
              }
            }

            return {
              type: 'heading',
              raw: cap[0],
              depth: cap[1].length,
              text: text
            };
          }
        };

        _proto.nptable = function nptable(src) {
          var cap = this.rules.block.nptable.exec(src);

          if (cap) {
            var item = {
              type: 'table',
              header: splitCells$1(cap[1].replace(/^ *| *\| *$/g, '')),
              align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
              cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : [],
              raw: cap[0]
            };

            if (item.header.length === item.align.length) {
              var l = item.align.length;
              var i;

              for (i = 0; i < l; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              l = item.cells.length;

              for (i = 0; i < l; i++) {
                item.cells[i] = splitCells$1(item.cells[i], item.header.length);
              }

              return item;
            }
          }
        };

        _proto.hr = function hr(src) {
          var cap = this.rules.block.hr.exec(src);

          if (cap) {
            return {
              type: 'hr',
              raw: cap[0]
            };
          }
        };

        _proto.blockquote = function blockquote(src) {
          var cap = this.rules.block.blockquote.exec(src);

          if (cap) {
            var text = cap[0].replace(/^ *> ?/gm, '');
            return {
              type: 'blockquote',
              raw: cap[0],
              text: text
            };
          }
        };

        _proto.list = function list(src) {
          var cap = this.rules.block.list.exec(src);

          if (cap) {
            var raw = cap[0];
            var bull = cap[2];
            var isordered = bull.length > 1;
            var list = {
              type: 'list',
              raw: raw,
              ordered: isordered,
              start: isordered ? +bull.slice(0, -1) : '',
              loose: false,
              items: []
            }; // Get each top-level item.

            var itemMatch = cap[0].match(this.rules.block.item);
            var next = false,
                item,
                space,
                bcurr,
                bnext,
                addBack,
                loose,
                istask,
                ischecked,
                endMatch;
            var l = itemMatch.length;
            bcurr = this.rules.block.listItemStart.exec(itemMatch[0]);

            for (var i = 0; i < l; i++) {
              item = itemMatch[i];
              raw = item;

              if (!this.options.pedantic) {
                // Determine if current item contains the end of the list
                endMatch = item.match(new RegExp('\\n\\s*\\n {0,' + (bcurr[0].length - 1) + '}\\S'));

                if (endMatch) {
                  addBack = item.length - endMatch.index + itemMatch.slice(i + 1).join('\n').length;
                  list.raw = list.raw.substring(0, list.raw.length - addBack);
                  item = item.substring(0, endMatch.index);
                  raw = item;
                  l = i + 1;
                }
              } // Determine whether the next list item belongs here.
              // Backpedal if it does not belong in this list.


              if (i !== l - 1) {
                bnext = this.rules.block.listItemStart.exec(itemMatch[i + 1]);

                if (!this.options.pedantic ? bnext[1].length >= bcurr[0].length || bnext[1].length > 3 : bnext[1].length > bcurr[1].length) {
                  // nested list or continuation
                  itemMatch.splice(i, 2, itemMatch[i] + (!this.options.pedantic && bnext[1].length < bcurr[0].length && !itemMatch[i].match(/\n$/) ? '' : '\n') + itemMatch[i + 1]);
                  i--;
                  l--;
                  continue;
                } else if ( // different bullet style
                !this.options.pedantic || this.options.smartLists ? bnext[2][bnext[2].length - 1] !== bull[bull.length - 1] : isordered === (bnext[2].length === 1)) {
                  addBack = itemMatch.slice(i + 1).join('\n').length;
                  list.raw = list.raw.substring(0, list.raw.length - addBack);
                  i = l - 1;
                }

                bcurr = bnext;
              } // Remove the list item's bullet
              // so it is seen as the next token.


              space = item.length;
              item = item.replace(/^ *([*+-]|\d+[.)]) ?/, ''); // Outdent whatever the
              // list item contains. Hacky.

              if (~item.indexOf('\n ')) {
                space -= item.length;
                item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
              } // trim item newlines at end


              item = rtrim$1(item, '\n');

              if (i !== l - 1) {
                raw = raw + '\n';
              } // Determine whether item is loose or not.
              // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
              // for discount behavior.


              loose = next || /\n\n(?!\s*$)/.test(raw);

              if (i !== l - 1) {
                next = raw.slice(-2) === '\n\n';
                if (!loose) loose = next;
              }

              if (loose) {
                list.loose = true;
              } // Check for task list items


              if (this.options.gfm) {
                istask = /^\[[ xX]\] /.test(item);
                ischecked = undefined;

                if (istask) {
                  ischecked = item[1] !== ' ';
                  item = item.replace(/^\[[ xX]\] +/, '');
                }
              }

              list.items.push({
                type: 'list_item',
                raw: raw,
                task: istask,
                checked: ischecked,
                loose: loose,
                text: item
              });
            }

            return list;
          }
        };

        _proto.html = function html(src) {
          var cap = this.rules.block.html.exec(src);

          if (cap) {
            return {
              type: this.options.sanitize ? 'paragraph' : 'html',
              raw: cap[0],
              pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
              text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0]
            };
          }
        };

        _proto.def = function def(src) {
          var cap = this.rules.block.def.exec(src);

          if (cap) {
            if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
            var tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
            return {
              tag: tag,
              raw: cap[0],
              href: cap[2],
              title: cap[3]
            };
          }
        };

        _proto.table = function table(src) {
          var cap = this.rules.block.table.exec(src);

          if (cap) {
            var item = {
              type: 'table',
              header: splitCells$1(cap[1].replace(/^ *| *\| *$/g, '')),
              align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
              cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
            };

            if (item.header.length === item.align.length) {
              item.raw = cap[0];
              var l = item.align.length;
              var i;

              for (i = 0; i < l; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              l = item.cells.length;

              for (i = 0; i < l; i++) {
                item.cells[i] = splitCells$1(item.cells[i].replace(/^ *\| *| *\| *$/g, ''), item.header.length);
              }

              return item;
            }
          }
        };

        _proto.lheading = function lheading(src) {
          var cap = this.rules.block.lheading.exec(src);

          if (cap) {
            return {
              type: 'heading',
              raw: cap[0],
              depth: cap[2].charAt(0) === '=' ? 1 : 2,
              text: cap[1]
            };
          }
        };

        _proto.paragraph = function paragraph(src) {
          var cap = this.rules.block.paragraph.exec(src);

          if (cap) {
            return {
              type: 'paragraph',
              raw: cap[0],
              text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
            };
          }
        };

        _proto.text = function text(src) {
          var cap = this.rules.block.text.exec(src);

          if (cap) {
            return {
              type: 'text',
              raw: cap[0],
              text: cap[0]
            };
          }
        };

        _proto.escape = function escape(src) {
          var cap = this.rules.inline.escape.exec(src);

          if (cap) {
            return {
              type: 'escape',
              raw: cap[0],
              text: _escape(cap[1])
            };
          }
        };

        _proto.tag = function tag(src, inLink, inRawBlock) {
          var cap = this.rules.inline.tag.exec(src);

          if (cap) {
            if (!inLink && /^<a /i.test(cap[0])) {
              inLink = true;
            } else if (inLink && /^<\/a>/i.test(cap[0])) {
              inLink = false;
            }

            if (!inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
              inRawBlock = true;
            } else if (inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
              inRawBlock = false;
            }

            return {
              type: this.options.sanitize ? 'text' : 'html',
              raw: cap[0],
              inLink: inLink,
              inRawBlock: inRawBlock,
              text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0]
            };
          }
        };

        _proto.link = function link(src) {
          var cap = this.rules.inline.link.exec(src);

          if (cap) {
            var trimmedUrl = cap[2].trim();

            if (!this.options.pedantic && /^</.test(trimmedUrl)) {
              // commonmark requires matching angle brackets
              if (!/>$/.test(trimmedUrl)) {
                return;
              } // ending angle bracket cannot be escaped


              var rtrimSlash = rtrim$1(trimmedUrl.slice(0, -1), '\\');

              if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
                return;
              }
            } else {
              // find closing parenthesis
              var lastParenIndex = findClosingBracket$1(cap[2], '()');

              if (lastParenIndex > -1) {
                var start = cap[0].indexOf('!') === 0 ? 5 : 4;
                var linkLen = start + cap[1].length + lastParenIndex;
                cap[2] = cap[2].substring(0, lastParenIndex);
                cap[0] = cap[0].substring(0, linkLen).trim();
                cap[3] = '';
              }
            }

            var href = cap[2];
            var title = '';

            if (this.options.pedantic) {
              // split pedantic href and title
              var link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

              if (link) {
                href = link[1];
                title = link[3];
              }
            } else {
              title = cap[3] ? cap[3].slice(1, -1) : '';
            }

            href = href.trim();

            if (/^</.test(href)) {
              if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
                // pedantic allows starting angle bracket without ending angle bracket
                href = href.slice(1);
              } else {
                href = href.slice(1, -1);
              }
            }

            return outputLink(cap, {
              href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
              title: title ? title.replace(this.rules.inline._escapes, '$1') : title
            }, cap[0]);
          }
        };

        _proto.reflink = function reflink(src, links) {
          var cap;

          if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
            var link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
            link = links[link.toLowerCase()];

            if (!link || !link.href) {
              var text = cap[0].charAt(0);
              return {
                type: 'text',
                raw: text,
                text: text
              };
            }

            return outputLink(cap, link, cap[0]);
          }
        };

        _proto.emStrong = function emStrong(src, maskedSrc, prevChar) {
          if (prevChar === void 0) {
            prevChar = '';
          }

          var match = this.rules.inline.emStrong.lDelim.exec(src);
          if (!match) return;
          if (match[3] && prevChar.match(/(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDD\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/)) return; // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well

          var nextChar = match[1] || match[2] || '';

          if (!nextChar || nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar))) {
            var lLength = match[0].length - 1;
            var rDelim,
                rLength,
                delimTotal = lLength,
                midDelimTotal = 0;
            var endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
            endReg.lastIndex = 0;
            maskedSrc = maskedSrc.slice(-1 * src.length + lLength); // Bump maskedSrc to same section of string as src (move to lexer?)

            while ((match = endReg.exec(maskedSrc)) != null) {
              rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
              if (!rDelim) continue; // matched the first alternative in rules.js (skip the * in __abc*abc__)

              rLength = rDelim.length;

              if (match[3] || match[4]) {
                // found another Left Delim
                delimTotal += rLength;
                continue;
              } else if (match[5] || match[6]) {
                // either Left or Right Delim
                if (lLength % 3 && !((lLength + rLength) % 3)) {
                  midDelimTotal += rLength;
                  continue; // CommonMark Emphasis Rules 9-10
                }
              }

              delimTotal -= rLength;
              if (delimTotal > 0) continue; // Haven't found enough closing delimiters
              // If this is the last rDelimiter, remove extra characters. *a*** -> *a*

              if (delimTotal + midDelimTotal - rLength <= 0 && !maskedSrc.slice(endReg.lastIndex).match(endReg)) {
                rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
              }

              if (Math.min(lLength, rLength) % 2) {
                return {
                  type: 'em',
                  raw: src.slice(0, lLength + match.index + rLength + 1),
                  text: src.slice(1, lLength + match.index + rLength)
                };
              }

              if (Math.min(lLength, rLength) % 2 === 0) {
                return {
                  type: 'strong',
                  raw: src.slice(0, lLength + match.index + rLength + 1),
                  text: src.slice(2, lLength + match.index + rLength - 1)
                };
              }
            }
          }
        };

        _proto.codespan = function codespan(src) {
          var cap = this.rules.inline.code.exec(src);

          if (cap) {
            var text = cap[2].replace(/\n/g, ' ');
            var hasNonSpaceChars = /[^ ]/.test(text);
            var hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);

            if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
              text = text.substring(1, text.length - 1);
            }

            text = _escape(text, true);
            return {
              type: 'codespan',
              raw: cap[0],
              text: text
            };
          }
        };

        _proto.br = function br(src) {
          var cap = this.rules.inline.br.exec(src);

          if (cap) {
            return {
              type: 'br',
              raw: cap[0]
            };
          }
        };

        _proto.del = function del(src) {
          var cap = this.rules.inline.del.exec(src);

          if (cap) {
            return {
              type: 'del',
              raw: cap[0],
              text: cap[2]
            };
          }
        };

        _proto.autolink = function autolink(src, mangle) {
          var cap = this.rules.inline.autolink.exec(src);

          if (cap) {
            var text, href;

            if (cap[2] === '@') {
              text = _escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
              href = 'mailto:' + text;
            } else {
              text = _escape(cap[1]);
              href = text;
            }

            return {
              type: 'link',
              raw: cap[0],
              text: text,
              href: href,
              tokens: [{
                type: 'text',
                raw: text,
                text: text
              }]
            };
          }
        };

        _proto.url = function url(src, mangle) {
          var cap;

          if (cap = this.rules.inline.url.exec(src)) {
            var text, href;

            if (cap[2] === '@') {
              text = _escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
              href = 'mailto:' + text;
            } else {
              // do extended autolink path validation
              var prevCapZero;

              do {
                prevCapZero = cap[0];
                cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
              } while (prevCapZero !== cap[0]);

              text = _escape(cap[0]);

              if (cap[1] === 'www.') {
                href = 'http://' + text;
              } else {
                href = text;
              }
            }

            return {
              type: 'link',
              raw: cap[0],
              text: text,
              href: href,
              tokens: [{
                type: 'text',
                raw: text,
                text: text
              }]
            };
          }
        };

        _proto.inlineText = function inlineText(src, inRawBlock, smartypants) {
          var cap = this.rules.inline.text.exec(src);

          if (cap) {
            var text;

            if (inRawBlock) {
              text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0];
            } else {
              text = _escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
            }

            return {
              type: 'text',
              raw: cap[0],
              text: text
            };
          }
        };

        return Tokenizer;
      }();

      var noopTest$1 = helpers.noopTest,
          edit$1 = helpers.edit,
          merge$1 = helpers.merge;
      /**
       * Block-Level Grammar
       */

      var block = {
        newline: /^(?: *(?:\n|$))+/,
        code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
        fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
        hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
        heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
        blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
        list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?! {0,3}bull )\n*|\s*$)/,
        html: '^ {0,3}(?:' // optional indentation
        + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
        + '|comment[^\\n]*(\\n+|$)' // (2)
        + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
        + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
        + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
        + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
        + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
        + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
        + ')',
        def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
        nptable: noopTest$1,
        table: noopTest$1,
        lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
        // regex template, placeholders will be replaced according to different paragraph
        // interruption rules of commonmark and the original markdown spec:
        _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
        text: /^[^\n]+/
      };
      block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
      block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
      block.def = edit$1(block.def).replace('label', block._label).replace('title', block._title).getRegex();
      block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
      block.item = /^( *)(bull) ?[^\n]*(?:\n(?! *bull ?)[^\n]*)*/;
      block.item = edit$1(block.item, 'gm').replace(/bull/g, block.bullet).getRegex();
      block.listItemStart = edit$1(/^( *)(bull) */).replace('bull', block.bullet).getRegex();
      block.list = edit$1(block.list).replace(/bull/g, block.bullet).replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))').replace('def', '\\n+(?=' + block.def.source + ')').getRegex();
      block._tag = 'address|article|aside|base|basefont|blockquote|body|caption' + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption' + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe' + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option' + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr' + '|track|ul';
      block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
      block.html = edit$1(block.html, 'i').replace('comment', block._comment).replace('tag', block._tag).replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
      block.paragraph = edit$1(block._paragraph).replace('hr', block.hr).replace('heading', ' {0,3}#{1,6} ').replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('blockquote', ' {0,3}>').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();
      block.blockquote = edit$1(block.blockquote).replace('paragraph', block.paragraph).getRegex();
      /**
       * Normal Block Grammar
       */

      block.normal = merge$1({}, block);
      /**
       * GFM Block Grammar
       */

      block.gfm = merge$1({}, block.normal, {
        nptable: '^ *([^|\\n ].*\\|.*)\\n' // Header
        + ' {0,3}([-:]+ *\\|[-| :]*)' // Align
        + '(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)',
        // Cells
        table: '^ *\\|(.+)\\n' // Header
        + ' {0,3}\\|?( *[-:]+[-| :]*)' // Align
        + '(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells

      });
      block.gfm.nptable = edit$1(block.gfm.nptable).replace('hr', block.hr).replace('heading', ' {0,3}#{1,6} ').replace('blockquote', ' {0,3}>').replace('code', ' {4}[^\\n]').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();
      block.gfm.table = edit$1(block.gfm.table).replace('hr', block.hr).replace('heading', ' {0,3}#{1,6} ').replace('blockquote', ' {0,3}>').replace('code', ' {4}[^\\n]').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();
      /**
       * Pedantic grammar (original John Gruber's loose markdown specification)
       */

      block.pedantic = merge$1({}, block.normal, {
        html: edit$1('^ *(?:comment *(?:\\n|\\s*$)' + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
        + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))').replace('comment', block._comment).replace(/tag/g, '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub' + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)' + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b').getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: noopTest$1,
        // fences not supported
        paragraph: edit$1(block.normal._paragraph).replace('hr', block.hr).replace('heading', ' *#{1,6} *[^\n]').replace('lheading', block.lheading).replace('blockquote', ' {0,3}>').replace('|fences', '').replace('|list', '').replace('|html', '').getRegex()
      });
      /**
       * Inline-Level Grammar
       */

      var inline = {
        escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
        autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
        url: noopTest$1,
        tag: '^comment' + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
        + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
        + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
        + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
        + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
        // CDATA section
        link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
        reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
        nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
        reflinkSearch: 'reflink|nolink(?!\\()',
        emStrong: {
          lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
          //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
          //        () Skip other delimiter (1) #***                (2) a***#, a***                   (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
          rDelimAst: /\_\_[^_]*?\*[^_]*?\_\_|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
          rDelimUnd: /\*\*[^*]*?\_[^*]*?\*\*|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ // ^- Not allowed for _

        },
        code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
        br: /^( {2,}|\\)\n(?!\s*$)/,
        del: noopTest$1,
        text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
        punctuation: /^([\spunctuation])/
      }; // list of punctuation marks from CommonMark spec
      // without * and _ to handle the different emphasis markers * and _

      inline._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
      inline.punctuation = edit$1(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex(); // sequences em should skip over [title](link), `code`, <html>

      inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
      inline.escapedEmSt = /\\\*|\\_/g;
      inline._comment = edit$1(block._comment).replace('(?:-->|$)', '-->').getRegex();
      inline.emStrong.lDelim = edit$1(inline.emStrong.lDelim).replace(/punct/g, inline._punctuation).getRegex();
      inline.emStrong.rDelimAst = edit$1(inline.emStrong.rDelimAst, 'g').replace(/punct/g, inline._punctuation).getRegex();
      inline.emStrong.rDelimUnd = edit$1(inline.emStrong.rDelimUnd, 'g').replace(/punct/g, inline._punctuation).getRegex();
      inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
      inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
      inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
      inline.autolink = edit$1(inline.autolink).replace('scheme', inline._scheme).replace('email', inline._email).getRegex();
      inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
      inline.tag = edit$1(inline.tag).replace('comment', inline._comment).replace('attribute', inline._attribute).getRegex();
      inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
      inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
      inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
      inline.link = edit$1(inline.link).replace('label', inline._label).replace('href', inline._href).replace('title', inline._title).getRegex();
      inline.reflink = edit$1(inline.reflink).replace('label', inline._label).getRegex();
      inline.reflinkSearch = edit$1(inline.reflinkSearch, 'g').replace('reflink', inline.reflink).replace('nolink', inline.nolink).getRegex();
      /**
       * Normal Inline Grammar
       */

      inline.normal = merge$1({}, inline);
      /**
       * Pedantic Inline Grammar
       */

      inline.pedantic = merge$1({}, inline.normal, {
        strong: {
          start: /^__|\*\*/,
          middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
          endAst: /\*\*(?!\*)/g,
          endUnd: /__(?!_)/g
        },
        em: {
          start: /^_|\*/,
          middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
          endAst: /\*(?!\*)/g,
          endUnd: /_(?!_)/g
        },
        link: edit$1(/^!?\[(label)\]\((.*?)\)/).replace('label', inline._label).getRegex(),
        reflink: edit$1(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace('label', inline._label).getRegex()
      });
      /**
       * GFM Inline Grammar
       */

      inline.gfm = merge$1({}, inline.normal, {
        escape: edit$1(inline.escape).replace('])', '~|])').getRegex(),
        _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
        url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
        _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
        text: /^([`~]+|[^`~])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
      });
      inline.gfm.url = edit$1(inline.gfm.url, 'i').replace('email', inline.gfm._extended_email).getRegex();
      /**
       * GFM + Line Breaks Inline Grammar
       */

      inline.breaks = merge$1({}, inline.gfm, {
        br: edit$1(inline.br).replace('{2,}', '*').getRegex(),
        text: edit$1(inline.gfm.text).replace('\\b_', '\\b_| {2,}\\n').replace(/\{2,\}/g, '*').getRegex()
      });
      var rules = {
        block: block,
        inline: inline
      };

      var defaults$2 = defaults.defaults;
      var block$1 = rules.block,
          inline$1 = rules.inline;
      var repeatString$1 = helpers.repeatString;
      /**
       * smartypants text replacement
       */

      function smartypants(text) {
        return text // em-dashes
        .replace(/---/g, "\u2014") // en-dashes
        .replace(/--/g, "\u2013") // opening singles
        .replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018") // closing singles & apostrophes
        .replace(/'/g, "\u2019") // opening doubles
        .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C") // closing doubles
        .replace(/"/g, "\u201D") // ellipses
        .replace(/\.{3}/g, "\u2026");
      }
      /**
       * mangle email addresses
       */


      function mangle(text) {
        var out = '',
            i,
            ch;
        var l = text.length;

        for (i = 0; i < l; i++) {
          ch = text.charCodeAt(i);

          if (Math.random() > 0.5) {
            ch = 'x' + ch.toString(16);
          }

          out += '&#' + ch + ';';
        }

        return out;
      }
      /**
       * Block Lexer
       */


      var Lexer_1 = /*#__PURE__*/function () {
        function Lexer(options) {
          this.tokens = [];
          this.tokens.links = Object.create(null);
          this.options = options || defaults$2;
          this.options.tokenizer = this.options.tokenizer || new Tokenizer_1();
          this.tokenizer = this.options.tokenizer;
          this.tokenizer.options = this.options;
          var rules = {
            block: block$1.normal,
            inline: inline$1.normal
          };

          if (this.options.pedantic) {
            rules.block = block$1.pedantic;
            rules.inline = inline$1.pedantic;
          } else if (this.options.gfm) {
            rules.block = block$1.gfm;

            if (this.options.breaks) {
              rules.inline = inline$1.breaks;
            } else {
              rules.inline = inline$1.gfm;
            }
          }

          this.tokenizer.rules = rules;
        }
        /**
         * Expose Rules
         */


        /**
         * Static Lex Method
         */
        Lexer.lex = function lex(src, options) {
          var lexer = new Lexer(options);
          return lexer.lex(src);
        }
        /**
         * Static Lex Inline Method
         */
        ;

        Lexer.lexInline = function lexInline(src, options) {
          var lexer = new Lexer(options);
          return lexer.inlineTokens(src);
        }
        /**
         * Preprocessing
         */
        ;

        var _proto = Lexer.prototype;

        _proto.lex = function lex(src) {
          src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ');
          this.blockTokens(src, this.tokens, true);
          this.inline(this.tokens);
          return this.tokens;
        }
        /**
         * Lexing
         */
        ;

        _proto.blockTokens = function blockTokens(src, tokens, top) {
          if (tokens === void 0) {
            tokens = [];
          }

          if (top === void 0) {
            top = true;
          }

          if (this.options.pedantic) {
            src = src.replace(/^ +$/gm, '');
          }

          var token, i, l, lastToken;

          while (src) {
            // newline
            if (token = this.tokenizer.space(src)) {
              src = src.substring(token.raw.length);

              if (token.type) {
                tokens.push(token);
              }

              continue;
            } // code


            if (token = this.tokenizer.code(src)) {
              src = src.substring(token.raw.length);
              lastToken = tokens[tokens.length - 1]; // An indented code block cannot interrupt a paragraph.

              if (lastToken && lastToken.type === 'paragraph') {
                lastToken.raw += '\n' + token.raw;
                lastToken.text += '\n' + token.text;
              } else {
                tokens.push(token);
              }

              continue;
            } // fences


            if (token = this.tokenizer.fences(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // heading


            if (token = this.tokenizer.heading(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // table no leading pipe (gfm)


            if (token = this.tokenizer.nptable(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // hr


            if (token = this.tokenizer.hr(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // blockquote


            if (token = this.tokenizer.blockquote(src)) {
              src = src.substring(token.raw.length);
              token.tokens = this.blockTokens(token.text, [], top);
              tokens.push(token);
              continue;
            } // list


            if (token = this.tokenizer.list(src)) {
              src = src.substring(token.raw.length);
              l = token.items.length;

              for (i = 0; i < l; i++) {
                token.items[i].tokens = this.blockTokens(token.items[i].text, [], false);
              }

              tokens.push(token);
              continue;
            } // html


            if (token = this.tokenizer.html(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // def


            if (top && (token = this.tokenizer.def(src))) {
              src = src.substring(token.raw.length);

              if (!this.tokens.links[token.tag]) {
                this.tokens.links[token.tag] = {
                  href: token.href,
                  title: token.title
                };
              }

              continue;
            } // table (gfm)


            if (token = this.tokenizer.table(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // lheading


            if (token = this.tokenizer.lheading(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // top-level paragraph


            if (top && (token = this.tokenizer.paragraph(src))) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // text


            if (token = this.tokenizer.text(src)) {
              src = src.substring(token.raw.length);
              lastToken = tokens[tokens.length - 1];

              if (lastToken && lastToken.type === 'text') {
                lastToken.raw += '\n' + token.raw;
                lastToken.text += '\n' + token.text;
              } else {
                tokens.push(token);
              }

              continue;
            }

            if (src) {
              var errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);

              if (this.options.silent) {
                console.error(errMsg);
                break;
              } else {
                throw new Error(errMsg);
              }
            }
          }

          return tokens;
        };

        _proto.inline = function inline(tokens) {
          var i, j, k, l2, row, token;
          var l = tokens.length;

          for (i = 0; i < l; i++) {
            token = tokens[i];

            switch (token.type) {
              case 'paragraph':
              case 'text':
              case 'heading':
                {
                  token.tokens = [];
                  this.inlineTokens(token.text, token.tokens);
                  break;
                }

              case 'table':
                {
                  token.tokens = {
                    header: [],
                    cells: []
                  }; // header

                  l2 = token.header.length;

                  for (j = 0; j < l2; j++) {
                    token.tokens.header[j] = [];
                    this.inlineTokens(token.header[j], token.tokens.header[j]);
                  } // cells


                  l2 = token.cells.length;

                  for (j = 0; j < l2; j++) {
                    row = token.cells[j];
                    token.tokens.cells[j] = [];

                    for (k = 0; k < row.length; k++) {
                      token.tokens.cells[j][k] = [];
                      this.inlineTokens(row[k], token.tokens.cells[j][k]);
                    }
                  }

                  break;
                }

              case 'blockquote':
                {
                  this.inline(token.tokens);
                  break;
                }

              case 'list':
                {
                  l2 = token.items.length;

                  for (j = 0; j < l2; j++) {
                    this.inline(token.items[j].tokens);
                  }

                  break;
                }
            }
          }

          return tokens;
        }
        /**
         * Lexing/Compiling
         */
        ;

        _proto.inlineTokens = function inlineTokens(src, tokens, inLink, inRawBlock) {
          if (tokens === void 0) {
            tokens = [];
          }

          if (inLink === void 0) {
            inLink = false;
          }

          if (inRawBlock === void 0) {
            inRawBlock = false;
          }

          var token, lastToken; // String with links masked to avoid interference with em and strong

          var maskedSrc = src;
          var match;
          var keepPrevChar, prevChar; // Mask out reflinks

          if (this.tokens.links) {
            var links = Object.keys(this.tokens.links);

            if (links.length > 0) {
              while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
                if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                  maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString$1('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
                }
              }
            }
          } // Mask out other blocks


          while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
            maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString$1('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
          } // Mask out escaped em & strong delimiters


          while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
            maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
          }

          while (src) {
            if (!keepPrevChar) {
              prevChar = '';
            }

            keepPrevChar = false; // escape

            if (token = this.tokenizer.escape(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // tag


            if (token = this.tokenizer.tag(src, inLink, inRawBlock)) {
              src = src.substring(token.raw.length);
              inLink = token.inLink;
              inRawBlock = token.inRawBlock;
              var _lastToken = tokens[tokens.length - 1];

              if (_lastToken && token.type === 'text' && _lastToken.type === 'text') {
                _lastToken.raw += token.raw;
                _lastToken.text += token.text;
              } else {
                tokens.push(token);
              }

              continue;
            } // link


            if (token = this.tokenizer.link(src)) {
              src = src.substring(token.raw.length);

              if (token.type === 'link') {
                token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
              }

              tokens.push(token);
              continue;
            } // reflink, nolink


            if (token = this.tokenizer.reflink(src, this.tokens.links)) {
              src = src.substring(token.raw.length);
              var _lastToken2 = tokens[tokens.length - 1];

              if (token.type === 'link') {
                token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
                tokens.push(token);
              } else if (_lastToken2 && token.type === 'text' && _lastToken2.type === 'text') {
                _lastToken2.raw += token.raw;
                _lastToken2.text += token.text;
              } else {
                tokens.push(token);
              }

              continue;
            } // em & strong


            if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
              src = src.substring(token.raw.length);
              token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
              tokens.push(token);
              continue;
            } // code


            if (token = this.tokenizer.codespan(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // br


            if (token = this.tokenizer.br(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // del (gfm)


            if (token = this.tokenizer.del(src)) {
              src = src.substring(token.raw.length);
              token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
              tokens.push(token);
              continue;
            } // autolink


            if (token = this.tokenizer.autolink(src, mangle)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // url (gfm)


            if (!inLink && (token = this.tokenizer.url(src, mangle))) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // text


            if (token = this.tokenizer.inlineText(src, inRawBlock, smartypants)) {
              src = src.substring(token.raw.length);

              if (token.raw.slice(-1) !== '_') {
                // Track prevChar before string of ____ started
                prevChar = token.raw.slice(-1);
              }

              keepPrevChar = true;
              lastToken = tokens[tokens.length - 1];

              if (lastToken && lastToken.type === 'text') {
                lastToken.raw += token.raw;
                lastToken.text += token.text;
              } else {
                tokens.push(token);
              }

              continue;
            }

            if (src) {
              var errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);

              if (this.options.silent) {
                console.error(errMsg);
                break;
              } else {
                throw new Error(errMsg);
              }
            }
          }

          return tokens;
        };

        _createClass(Lexer, null, [{
          key: "rules",
          get: function get() {
            return {
              block: block$1,
              inline: inline$1
            };
          }
        }]);

        return Lexer;
      }();

      var defaults$3 = defaults.defaults;
      var cleanUrl$1 = helpers.cleanUrl,
          escape$1 = helpers.escape;
      /**
       * Renderer
       */

      var Renderer_1 = /*#__PURE__*/function () {
        function Renderer(options) {
          this.options = options || defaults$3;
        }

        var _proto = Renderer.prototype;

        _proto.code = function code(_code, infostring, escaped) {
          var lang = (infostring || '').match(/\S*/)[0];

          if (this.options.highlight) {
            var out = this.options.highlight(_code, lang);

            if (out != null && out !== _code) {
              escaped = true;
              _code = out;
            }
          }

          _code = _code.replace(/\n$/, '') + '\n';

          if (!lang) {
            return '<pre><code>' + (escaped ? _code : escape$1(_code, true)) + '</code></pre>\n';
          }

          return '<pre><code class="' + this.options.langPrefix + escape$1(lang, true) + '">' + (escaped ? _code : escape$1(_code, true)) + '</code></pre>\n';
        };

        _proto.blockquote = function blockquote(quote) {
          return '<blockquote>\n' + quote + '</blockquote>\n';
        };

        _proto.html = function html(_html) {
          return _html;
        };

        _proto.heading = function heading(text, level, raw, slugger) {
          if (this.options.headerIds) {
            return '<h' + level + ' id="' + this.options.headerPrefix + slugger.slug(raw) + '">' + text + '</h' + level + '>\n';
          } // ignore IDs


          return '<h' + level + '>' + text + '</h' + level + '>\n';
        };

        _proto.hr = function hr() {
          return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
        };

        _proto.list = function list(body, ordered, start) {
          var type = ordered ? 'ol' : 'ul',
              startatt = ordered && start !== 1 ? ' start="' + start + '"' : '';
          return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
        };

        _proto.listitem = function listitem(text) {
          return '<li>' + text + '</li>\n';
        };

        _proto.checkbox = function checkbox(checked) {
          return '<input ' + (checked ? 'checked="" ' : '') + 'disabled="" type="checkbox"' + (this.options.xhtml ? ' /' : '') + '> ';
        };

        _proto.paragraph = function paragraph(text) {
          return '<p>' + text + '</p>\n';
        };

        _proto.table = function table(header, body) {
          if (body) body = '<tbody>' + body + '</tbody>';
          return '<table>\n' + '<thead>\n' + header + '</thead>\n' + body + '</table>\n';
        };

        _proto.tablerow = function tablerow(content) {
          return '<tr>\n' + content + '</tr>\n';
        };

        _proto.tablecell = function tablecell(content, flags) {
          var type = flags.header ? 'th' : 'td';
          var tag = flags.align ? '<' + type + ' align="' + flags.align + '">' : '<' + type + '>';
          return tag + content + '</' + type + '>\n';
        } // span level renderer
        ;

        _proto.strong = function strong(text) {
          return '<strong>' + text + '</strong>';
        };

        _proto.em = function em(text) {
          return '<em>' + text + '</em>';
        };

        _proto.codespan = function codespan(text) {
          return '<code>' + text + '</code>';
        };

        _proto.br = function br() {
          return this.options.xhtml ? '<br/>' : '<br>';
        };

        _proto.del = function del(text) {
          return '<del>' + text + '</del>';
        };

        _proto.link = function link(href, title, text) {
          href = cleanUrl$1(this.options.sanitize, this.options.baseUrl, href);

          if (href === null) {
            return text;
          }

          var out = '<a href="' + escape$1(href) + '"';

          if (title) {
            out += ' title="' + title + '"';
          }

          out += '>' + text + '</a>';
          return out;
        };

        _proto.image = function image(href, title, text) {
          href = cleanUrl$1(this.options.sanitize, this.options.baseUrl, href);

          if (href === null) {
            return text;
          }

          var out = '<img src="' + href + '" alt="' + text + '"';

          if (title) {
            out += ' title="' + title + '"';
          }

          out += this.options.xhtml ? '/>' : '>';
          return out;
        };

        _proto.text = function text(_text) {
          return _text;
        };

        return Renderer;
      }();

      /**
       * TextRenderer
       * returns only the textual part of the token
       */
      var TextRenderer_1 = /*#__PURE__*/function () {
        function TextRenderer() {}

        var _proto = TextRenderer.prototype;

        // no need for block level renderers
        _proto.strong = function strong(text) {
          return text;
        };

        _proto.em = function em(text) {
          return text;
        };

        _proto.codespan = function codespan(text) {
          return text;
        };

        _proto.del = function del(text) {
          return text;
        };

        _proto.html = function html(text) {
          return text;
        };

        _proto.text = function text(_text) {
          return _text;
        };

        _proto.link = function link(href, title, text) {
          return '' + text;
        };

        _proto.image = function image(href, title, text) {
          return '' + text;
        };

        _proto.br = function br() {
          return '';
        };

        return TextRenderer;
      }();

      /**
       * Slugger generates header id
       */
      var Slugger_1 = /*#__PURE__*/function () {
        function Slugger() {
          this.seen = {};
        }

        var _proto = Slugger.prototype;

        _proto.serialize = function serialize(value) {
          return value.toLowerCase().trim() // remove html tags
          .replace(/<[!\/a-z].*?>/ig, '') // remove unwanted chars
          .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '').replace(/\s/g, '-');
        }
        /**
         * Finds the next safe (unique) slug to use
         */
        ;

        _proto.getNextSafeSlug = function getNextSafeSlug(originalSlug, isDryRun) {
          var slug = originalSlug;
          var occurenceAccumulator = 0;

          if (this.seen.hasOwnProperty(slug)) {
            occurenceAccumulator = this.seen[originalSlug];

            do {
              occurenceAccumulator++;
              slug = originalSlug + '-' + occurenceAccumulator;
            } while (this.seen.hasOwnProperty(slug));
          }

          if (!isDryRun) {
            this.seen[originalSlug] = occurenceAccumulator;
            this.seen[slug] = 0;
          }

          return slug;
        }
        /**
         * Convert string to unique id
         * @param {object} options
         * @param {boolean} options.dryrun Generates the next unique slug without updating the internal accumulator.
         */
        ;

        _proto.slug = function slug(value, options) {
          if (options === void 0) {
            options = {};
          }

          var slug = this.serialize(value);
          return this.getNextSafeSlug(slug, options.dryrun);
        };

        return Slugger;
      }();

      var defaults$4 = defaults.defaults;
      var unescape$1 = helpers.unescape;
      /**
       * Parsing & Compiling
       */

      var Parser_1 = /*#__PURE__*/function () {
        function Parser(options) {
          this.options = options || defaults$4;
          this.options.renderer = this.options.renderer || new Renderer_1();
          this.renderer = this.options.renderer;
          this.renderer.options = this.options;
          this.textRenderer = new TextRenderer_1();
          this.slugger = new Slugger_1();
        }
        /**
         * Static Parse Method
         */


        Parser.parse = function parse(tokens, options) {
          var parser = new Parser(options);
          return parser.parse(tokens);
        }
        /**
         * Static Parse Inline Method
         */
        ;

        Parser.parseInline = function parseInline(tokens, options) {
          var parser = new Parser(options);
          return parser.parseInline(tokens);
        }
        /**
         * Parse Loop
         */
        ;

        var _proto = Parser.prototype;

        _proto.parse = function parse(tokens, top) {
          if (top === void 0) {
            top = true;
          }

          var out = '',
              i,
              j,
              k,
              l2,
              l3,
              row,
              cell,
              header,
              body,
              token,
              ordered,
              start,
              loose,
              itemBody,
              item,
              checked,
              task,
              checkbox;
          var l = tokens.length;

          for (i = 0; i < l; i++) {
            token = tokens[i];

            switch (token.type) {
              case 'space':
                {
                  continue;
                }

              case 'hr':
                {
                  out += this.renderer.hr();
                  continue;
                }

              case 'heading':
                {
                  out += this.renderer.heading(this.parseInline(token.tokens), token.depth, unescape$1(this.parseInline(token.tokens, this.textRenderer)), this.slugger);
                  continue;
                }

              case 'code':
                {
                  out += this.renderer.code(token.text, token.lang, token.escaped);
                  continue;
                }

              case 'table':
                {
                  header = ''; // header

                  cell = '';
                  l2 = token.header.length;

                  for (j = 0; j < l2; j++) {
                    cell += this.renderer.tablecell(this.parseInline(token.tokens.header[j]), {
                      header: true,
                      align: token.align[j]
                    });
                  }

                  header += this.renderer.tablerow(cell);
                  body = '';
                  l2 = token.cells.length;

                  for (j = 0; j < l2; j++) {
                    row = token.tokens.cells[j];
                    cell = '';
                    l3 = row.length;

                    for (k = 0; k < l3; k++) {
                      cell += this.renderer.tablecell(this.parseInline(row[k]), {
                        header: false,
                        align: token.align[k]
                      });
                    }

                    body += this.renderer.tablerow(cell);
                  }

                  out += this.renderer.table(header, body);
                  continue;
                }

              case 'blockquote':
                {
                  body = this.parse(token.tokens);
                  out += this.renderer.blockquote(body);
                  continue;
                }

              case 'list':
                {
                  ordered = token.ordered;
                  start = token.start;
                  loose = token.loose;
                  l2 = token.items.length;
                  body = '';

                  for (j = 0; j < l2; j++) {
                    item = token.items[j];
                    checked = item.checked;
                    task = item.task;
                    itemBody = '';

                    if (item.task) {
                      checkbox = this.renderer.checkbox(checked);

                      if (loose) {
                        if (item.tokens.length > 0 && item.tokens[0].type === 'text') {
                          item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;

                          if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                            item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                          }
                        } else {
                          item.tokens.unshift({
                            type: 'text',
                            text: checkbox
                          });
                        }
                      } else {
                        itemBody += checkbox;
                      }
                    }

                    itemBody += this.parse(item.tokens, loose);
                    body += this.renderer.listitem(itemBody, task, checked);
                  }

                  out += this.renderer.list(body, ordered, start);
                  continue;
                }

              case 'html':
                {
                  // TODO parse inline content if parameter markdown=1
                  out += this.renderer.html(token.text);
                  continue;
                }

              case 'paragraph':
                {
                  out += this.renderer.paragraph(this.parseInline(token.tokens));
                  continue;
                }

              case 'text':
                {
                  body = token.tokens ? this.parseInline(token.tokens) : token.text;

                  while (i + 1 < l && tokens[i + 1].type === 'text') {
                    token = tokens[++i];
                    body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
                  }

                  out += top ? this.renderer.paragraph(body) : body;
                  continue;
                }

              default:
                {
                  var errMsg = 'Token with "' + token.type + '" type was not found.';

                  if (this.options.silent) {
                    console.error(errMsg);
                    return;
                  } else {
                    throw new Error(errMsg);
                  }
                }
            }
          }

          return out;
        }
        /**
         * Parse Inline Tokens
         */
        ;

        _proto.parseInline = function parseInline(tokens, renderer) {
          renderer = renderer || this.renderer;
          var out = '',
              i,
              token;
          var l = tokens.length;

          for (i = 0; i < l; i++) {
            token = tokens[i];

            switch (token.type) {
              case 'escape':
                {
                  out += renderer.text(token.text);
                  break;
                }

              case 'html':
                {
                  out += renderer.html(token.text);
                  break;
                }

              case 'link':
                {
                  out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
                  break;
                }

              case 'image':
                {
                  out += renderer.image(token.href, token.title, token.text);
                  break;
                }

              case 'strong':
                {
                  out += renderer.strong(this.parseInline(token.tokens, renderer));
                  break;
                }

              case 'em':
                {
                  out += renderer.em(this.parseInline(token.tokens, renderer));
                  break;
                }

              case 'codespan':
                {
                  out += renderer.codespan(token.text);
                  break;
                }

              case 'br':
                {
                  out += renderer.br();
                  break;
                }

              case 'del':
                {
                  out += renderer.del(this.parseInline(token.tokens, renderer));
                  break;
                }

              case 'text':
                {
                  out += renderer.text(token.text);
                  break;
                }

              default:
                {
                  var errMsg = 'Token with "' + token.type + '" type was not found.';

                  if (this.options.silent) {
                    console.error(errMsg);
                    return;
                  } else {
                    throw new Error(errMsg);
                  }
                }
            }
          }

          return out;
        };

        return Parser;
      }();

      var merge$2 = helpers.merge,
          checkSanitizeDeprecation$1 = helpers.checkSanitizeDeprecation,
          escape$2 = helpers.escape;
      var getDefaults = defaults.getDefaults,
          changeDefaults = defaults.changeDefaults,
          defaults$5 = defaults.defaults;
      /**
       * Marked
       */

      function marked(src, opt, callback) {
        // throw error in case of non string input
        if (typeof src === 'undefined' || src === null) {
          throw new Error('marked(): input parameter is undefined or null');
        }

        if (typeof src !== 'string') {
          throw new Error('marked(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
        }

        if (typeof opt === 'function') {
          callback = opt;
          opt = null;
        }

        opt = merge$2({}, marked.defaults, opt || {});
        checkSanitizeDeprecation$1(opt);

        if (callback) {
          var highlight = opt.highlight;
          var tokens;

          try {
            tokens = Lexer_1.lex(src, opt);
          } catch (e) {
            return callback(e);
          }

          var done = function done(err) {
            var out;

            if (!err) {
              try {
                out = Parser_1.parse(tokens, opt);
              } catch (e) {
                err = e;
              }
            }

            opt.highlight = highlight;
            return err ? callback(err) : callback(null, out);
          };

          if (!highlight || highlight.length < 3) {
            return done();
          }

          delete opt.highlight;
          if (!tokens.length) return done();
          var pending = 0;
          marked.walkTokens(tokens, function (token) {
            if (token.type === 'code') {
              pending++;
              setTimeout(function () {
                highlight(token.text, token.lang, function (err, code) {
                  if (err) {
                    return done(err);
                  }

                  if (code != null && code !== token.text) {
                    token.text = code;
                    token.escaped = true;
                  }

                  pending--;

                  if (pending === 0) {
                    done();
                  }
                });
              }, 0);
            }
          });

          if (pending === 0) {
            done();
          }

          return;
        }

        try {
          var _tokens = Lexer_1.lex(src, opt);

          if (opt.walkTokens) {
            marked.walkTokens(_tokens, opt.walkTokens);
          }

          return Parser_1.parse(_tokens, opt);
        } catch (e) {
          e.message += '\nPlease report this to https://github.com/markedjs/marked.';

          if (opt.silent) {
            return '<p>An error occurred:</p><pre>' + escape$2(e.message + '', true) + '</pre>';
          }

          throw e;
        }
      }
      /**
       * Options
       */


      marked.options = marked.setOptions = function (opt) {
        merge$2(marked.defaults, opt);
        changeDefaults(marked.defaults);
        return marked;
      };

      marked.getDefaults = getDefaults;
      marked.defaults = defaults$5;
      /**
       * Use Extension
       */

      marked.use = function (extension) {
        var opts = merge$2({}, extension);

        if (extension.renderer) {
          (function () {
            var renderer = marked.defaults.renderer || new Renderer_1();

            var _loop = function _loop(prop) {
              var prevRenderer = renderer[prop];

              renderer[prop] = function () {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                var ret = extension.renderer[prop].apply(renderer, args);

                if (ret === false) {
                  ret = prevRenderer.apply(renderer, args);
                }

                return ret;
              };
            };

            for (var prop in extension.renderer) {
              _loop(prop);
            }

            opts.renderer = renderer;
          })();
        }

        if (extension.tokenizer) {
          (function () {
            var tokenizer = marked.defaults.tokenizer || new Tokenizer_1();

            var _loop2 = function _loop2(prop) {
              var prevTokenizer = tokenizer[prop];

              tokenizer[prop] = function () {
                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = arguments[_key2];
                }

                var ret = extension.tokenizer[prop].apply(tokenizer, args);

                if (ret === false) {
                  ret = prevTokenizer.apply(tokenizer, args);
                }

                return ret;
              };
            };

            for (var prop in extension.tokenizer) {
              _loop2(prop);
            }

            opts.tokenizer = tokenizer;
          })();
        }

        if (extension.walkTokens) {
          var walkTokens = marked.defaults.walkTokens;

          opts.walkTokens = function (token) {
            extension.walkTokens(token);

            if (walkTokens) {
              walkTokens(token);
            }
          };
        }

        marked.setOptions(opts);
      };
      /**
       * Run callback for every token
       */


      marked.walkTokens = function (tokens, callback) {
        for (var _iterator = _createForOfIteratorHelperLoose(tokens), _step; !(_step = _iterator()).done;) {
          var token = _step.value;
          callback(token);

          switch (token.type) {
            case 'table':
              {
                for (var _iterator2 = _createForOfIteratorHelperLoose(token.tokens.header), _step2; !(_step2 = _iterator2()).done;) {
                  var cell = _step2.value;
                  marked.walkTokens(cell, callback);
                }

                for (var _iterator3 = _createForOfIteratorHelperLoose(token.tokens.cells), _step3; !(_step3 = _iterator3()).done;) {
                  var row = _step3.value;

                  for (var _iterator4 = _createForOfIteratorHelperLoose(row), _step4; !(_step4 = _iterator4()).done;) {
                    var _cell = _step4.value;
                    marked.walkTokens(_cell, callback);
                  }
                }

                break;
              }

            case 'list':
              {
                marked.walkTokens(token.items, callback);
                break;
              }

            default:
              {
                if (token.tokens) {
                  marked.walkTokens(token.tokens, callback);
                }
              }
          }
        }
      };
      /**
       * Parse Inline
       */


      marked.parseInline = function (src, opt) {
        // throw error in case of non string input
        if (typeof src === 'undefined' || src === null) {
          throw new Error('marked.parseInline(): input parameter is undefined or null');
        }

        if (typeof src !== 'string') {
          throw new Error('marked.parseInline(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
        }

        opt = merge$2({}, marked.defaults, opt || {});
        checkSanitizeDeprecation$1(opt);

        try {
          var tokens = Lexer_1.lexInline(src, opt);

          if (opt.walkTokens) {
            marked.walkTokens(tokens, opt.walkTokens);
          }

          return Parser_1.parseInline(tokens, opt);
        } catch (e) {
          e.message += '\nPlease report this to https://github.com/markedjs/marked.';

          if (opt.silent) {
            return '<p>An error occurred:</p><pre>' + escape$2(e.message + '', true) + '</pre>';
          }

          throw e;
        }
      };
      /**
       * Expose
       */


      marked.Parser = Parser_1;
      marked.parser = Parser_1.parse;
      marked.Renderer = Renderer_1;
      marked.TextRenderer = TextRenderer_1;
      marked.Lexer = Lexer_1;
      marked.lexer = Lexer_1.lex;
      marked.Tokenizer = Tokenizer_1;
      marked.Slugger = Slugger_1;
      marked.parse = marked;
      var marked_1 = marked;

      return marked_1;

    })));
    });

    /* src/Question-Card.svelte generated by Svelte v3.35.0 */
    const file$2 = "src/Question-Card.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (27:4) {#each question.answers as answer}
    function create_each_block$1(ctx) {
    	let button;
    	let t0_value = /*answer*/ ctx[3].char + "";
    	let t0;
    	let t1;
    	let html_tag;
    	let raw_value = marked.parseInline(/*answer*/ ctx[3].text) + "";
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = text(" | ");
    			html_tag = new HtmlTag(null);
    			attr_dev(button, "class", "svelte-kxsme2");
    			toggle_class(button, "correct", /*answer*/ ctx[3].char === /*question*/ ctx[0].correctAnswer && /*question*/ ctx[0].clickedAnswer);
    			toggle_class(button, "incorrect", /*answer*/ ctx[3].char !== /*question*/ ctx[0].correctAnswer && /*answer*/ ctx[3].char === /*question*/ ctx[0].clickedAnswer);
    			toggle_class(button, "clicked", !!/*question*/ ctx[0].clickedAnswer);
    			add_location(button, file$2, 27, 6, 653);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			html_tag.m(raw_value, button);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*click*/ ctx[1](/*answer*/ ctx[3].char))) /*click*/ ctx[1](/*answer*/ ctx[3].char).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*question*/ 1 && t0_value !== (t0_value = /*answer*/ ctx[3].char + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*question*/ 1 && raw_value !== (raw_value = marked.parseInline(/*answer*/ ctx[3].text) + "")) html_tag.p(raw_value);

    			if (dirty & /*question*/ 1) {
    				toggle_class(button, "correct", /*answer*/ ctx[3].char === /*question*/ ctx[0].correctAnswer && /*question*/ ctx[0].clickedAnswer);
    			}

    			if (dirty & /*question*/ 1) {
    				toggle_class(button, "incorrect", /*answer*/ ctx[3].char !== /*question*/ ctx[0].correctAnswer && /*answer*/ ctx[3].char === /*question*/ ctx[0].clickedAnswer);
    			}

    			if (dirty & /*question*/ 1) {
    				toggle_class(button, "clicked", !!/*question*/ ctx[0].clickedAnswer);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(27:4) {#each question.answers as answer}",
    		ctx
    	});

    	return block;
    }

    // (41:6) <AccordionItem disabled={!question.clickedAnswer}>
    function create_default_slot_1(ctx) {
    	let p;
    	let raw_value = marked(/*question*/ ctx[0].explanation) + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "explanation");
    			add_location(p, file$2, 44, 8, 1261);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*question*/ 1 && raw_value !== (raw_value = marked(/*question*/ ctx[0].explanation) + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(41:6) <AccordionItem disabled={!question.clickedAnswer}>",
    		ctx
    	});

    	return block;
    }

    // (42:8) 
    function create_title_slot(ctx) {
    	let div;
    	let h5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "Show explanation";
    			add_location(h5, file$2, 42, 10, 1212);
    			attr_dev(div, "slot", "title");
    			add_location(div, file$2, 41, 8, 1183);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot.name,
    		type: "slot",
    		source: "(42:8) ",
    		ctx
    	});

    	return block;
    }

    // (40:4) <Accordion>
    function create_default_slot(ctx) {
    	let accordionitem;
    	let current;

    	accordionitem = new AccordionItem({
    			props: {
    				disabled: !/*question*/ ctx[0].clickedAnswer,
    				$$slots: {
    					title: [create_title_slot],
    					default: [create_default_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(accordionitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(accordionitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const accordionitem_changes = {};
    			if (dirty & /*question*/ 1) accordionitem_changes.disabled = !/*question*/ ctx[0].clickedAnswer;

    			if (dirty & /*$$scope, question*/ 65) {
    				accordionitem_changes.$$scope = { dirty, ctx };
    			}

    			accordionitem.$set(accordionitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accordionitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accordionitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(accordionitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(40:4) <Accordion>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div2;
    	let h3;
    	let t0;
    	let t1_value = /*question*/ ctx[0].id + "";
    	let t1;
    	let t2;
    	let html_tag;
    	let raw0_value = marked.parseInline(/*question*/ ctx[0].title) + "";
    	let t3;
    	let p;
    	let raw1_value = marked(/*question*/ ctx[0].body) + "";
    	let t4;
    	let div0;
    	let t5;
    	let div1;
    	let accordion;
    	let current;
    	let each_value = /*question*/ ctx[0].answers;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	accordion = new Accordion({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h3 = element("h3");
    			t0 = text("(");
    			t1 = text(t1_value);
    			t2 = text(") ");
    			t3 = space();
    			p = element("p");
    			t4 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div1 = element("div");
    			create_component(accordion.$$.fragment);
    			html_tag = new HtmlTag(null);
    			add_location(h3, file$2, 23, 2, 493);
    			add_location(p, file$2, 24, 2, 563);
    			add_location(div0, file$2, 25, 2, 602);
    			attr_dev(div1, "class", "explanation-wrapper svelte-kxsme2");
    			add_location(div1, file$2, 38, 2, 1068);
    			attr_dev(div2, "class", "card svelte-kxsme2");
    			add_location(div2, file$2, 22, 0, 472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h3);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(h3, t2);
    			html_tag.m(raw0_value, h3);
    			append_dev(div2, t3);
    			append_dev(div2, p);
    			p.innerHTML = raw1_value;
    			append_dev(div2, t4);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			mount_component(accordion, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*question*/ 1) && t1_value !== (t1_value = /*question*/ ctx[0].id + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*question*/ 1) && raw0_value !== (raw0_value = marked.parseInline(/*question*/ ctx[0].title) + "")) html_tag.p(raw0_value);
    			if ((!current || dirty & /*question*/ 1) && raw1_value !== (raw1_value = marked(/*question*/ ctx[0].body) + "")) p.innerHTML = raw1_value;
    			if (dirty & /*question, click, marked*/ 3) {
    				each_value = /*question*/ ctx[0].answers;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const accordion_changes = {};

    			if (dirty & /*$$scope, question*/ 65) {
    				accordion_changes.$$scope = { dirty, ctx };
    			}

    			accordion.$set(accordion_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accordion.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accordion.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			destroy_component(accordion);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Question_Card", slots, []);
    	let { question } = $$props;
    	const dispatch = createEventDispatcher();

    	function click(answer) {
    		if (question.clickedAnswer) {
    			return;
    		}

    		dispatch("answerClicked", {
    			id: question.id,
    			clickedAnswer: answer,
    			isCorrect: answer === question.correctAnswer
    		});
    	}

    	const writable_props = ["question"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Question_Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("question" in $$props) $$invalidate(0, question = $$props.question);
    	};

    	$$self.$capture_state = () => ({
    		marked,
    		createEventDispatcher,
    		Accordion,
    		AccordionItem,
    		question,
    		dispatch,
    		click
    	});

    	$$self.$inject_state = $$props => {
    		if ("question" in $$props) $$invalidate(0, question = $$props.question);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [question, click];
    }

    class Question_Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { question: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Question_Card",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*question*/ ctx[0] === undefined && !("question" in props)) {
    			console.warn("<Question_Card> was created without expected prop 'question'");
    		}
    	}

    	get question() {
    		throw new Error("<Question_Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set question(value) {
    		throw new Error("<Question_Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function deepFreeze(obj) {
        if (obj instanceof Map) {
            obj.clear = obj.delete = obj.set = function () {
                throw new Error('map is read-only');
            };
        } else if (obj instanceof Set) {
            obj.add = obj.clear = obj.delete = function () {
                throw new Error('set is read-only');
            };
        }

        // Freeze self
        Object.freeze(obj);

        Object.getOwnPropertyNames(obj).forEach(function (name) {
            var prop = obj[name];

            // Freeze prop if it is an object
            if (typeof prop == 'object' && !Object.isFrozen(prop)) {
                deepFreeze(prop);
            }
        });

        return obj;
    }

    var deepFreezeEs6 = deepFreeze;
    var _default = deepFreeze;
    deepFreezeEs6.default = _default;

    /** @implements CallbackResponse */
    class Response {
      /**
       * @param {CompiledMode} mode
       */
      constructor(mode) {
        // eslint-disable-next-line no-undefined
        if (mode.data === undefined) mode.data = {};

        this.data = mode.data;
        this.isMatchIgnored = false;
      }

      ignoreMatch() {
        this.isMatchIgnored = true;
      }
    }

    /**
     * @param {string} value
     * @returns {string}
     */
    function escapeHTML(value) {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }

    /**
     * performs a shallow merge of multiple objects into one
     *
     * @template T
     * @param {T} original
     * @param {Record<string,any>[]} objects
     * @returns {T} a single new object
     */
    function inherit(original, ...objects) {
      /** @type Record<string,any> */
      const result = Object.create(null);

      for (const key in original) {
        result[key] = original[key];
      }
      objects.forEach(function(obj) {
        for (const key in obj) {
          result[key] = obj[key];
        }
      });
      return /** @type {T} */ (result);
    }

    /**
     * @typedef {object} Renderer
     * @property {(text: string) => void} addText
     * @property {(node: Node) => void} openNode
     * @property {(node: Node) => void} closeNode
     * @property {() => string} value
     */

    /** @typedef {{kind?: string, sublanguage?: boolean}} Node */
    /** @typedef {{walk: (r: Renderer) => void}} Tree */
    /** */

    const SPAN_CLOSE = '</span>';

    /**
     * Determines if a node needs to be wrapped in <span>
     *
     * @param {Node} node */
    const emitsWrappingTags = (node) => {
      return !!node.kind;
    };

    /** @type {Renderer} */
    class HTMLRenderer {
      /**
       * Creates a new HTMLRenderer
       *
       * @param {Tree} parseTree - the parse tree (must support `walk` API)
       * @param {{classPrefix: string}} options
       */
      constructor(parseTree, options) {
        this.buffer = "";
        this.classPrefix = options.classPrefix;
        parseTree.walk(this);
      }

      /**
       * Adds texts to the output stream
       *
       * @param {string} text */
      addText(text) {
        this.buffer += escapeHTML(text);
      }

      /**
       * Adds a node open to the output stream (if needed)
       *
       * @param {Node} node */
      openNode(node) {
        if (!emitsWrappingTags(node)) return;

        let className = node.kind;
        if (!node.sublanguage) {
          className = `${this.classPrefix}${className}`;
        }
        this.span(className);
      }

      /**
       * Adds a node close to the output stream (if needed)
       *
       * @param {Node} node */
      closeNode(node) {
        if (!emitsWrappingTags(node)) return;

        this.buffer += SPAN_CLOSE;
      }

      /**
       * returns the accumulated buffer
      */
      value() {
        return this.buffer;
      }

      // helpers

      /**
       * Builds a span element
       *
       * @param {string} className */
      span(className) {
        this.buffer += `<span class="${className}">`;
      }
    }

    /** @typedef {{kind?: string, sublanguage?: boolean, children: Node[]} | string} Node */
    /** @typedef {{kind?: string, sublanguage?: boolean, children: Node[]} } DataNode */
    /**  */

    class TokenTree {
      constructor() {
        /** @type DataNode */
        this.rootNode = { children: [] };
        this.stack = [this.rootNode];
      }

      get top() {
        return this.stack[this.stack.length - 1];
      }

      get root() { return this.rootNode; }

      /** @param {Node} node */
      add(node) {
        this.top.children.push(node);
      }

      /** @param {string} kind */
      openNode(kind) {
        /** @type Node */
        const node = { kind, children: [] };
        this.add(node);
        this.stack.push(node);
      }

      closeNode() {
        if (this.stack.length > 1) {
          return this.stack.pop();
        }
        // eslint-disable-next-line no-undefined
        return undefined;
      }

      closeAllNodes() {
        while (this.closeNode());
      }

      toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
      }

      /**
       * @typedef { import("./html_renderer").Renderer } Renderer
       * @param {Renderer} builder
       */
      walk(builder) {
        // this does not
        return this.constructor._walk(builder, this.rootNode);
        // this works
        // return TokenTree._walk(builder, this.rootNode);
      }

      /**
       * @param {Renderer} builder
       * @param {Node} node
       */
      static _walk(builder, node) {
        if (typeof node === "string") {
          builder.addText(node);
        } else if (node.children) {
          builder.openNode(node);
          node.children.forEach((child) => this._walk(builder, child));
          builder.closeNode(node);
        }
        return builder;
      }

      /**
       * @param {Node} node
       */
      static _collapse(node) {
        if (typeof node === "string") return;
        if (!node.children) return;

        if (node.children.every(el => typeof el === "string")) {
          // node.text = node.children.join("");
          // delete node.children;
          node.children = [node.children.join("")];
        } else {
          node.children.forEach((child) => {
            TokenTree._collapse(child);
          });
        }
      }
    }

    /**
      Currently this is all private API, but this is the minimal API necessary
      that an Emitter must implement to fully support the parser.

      Minimal interface:

      - addKeyword(text, kind)
      - addText(text)
      - addSublanguage(emitter, subLanguageName)
      - finalize()
      - openNode(kind)
      - closeNode()
      - closeAllNodes()
      - toHTML()

    */

    /**
     * @implements {Emitter}
     */
    class TokenTreeEmitter extends TokenTree {
      /**
       * @param {*} options
       */
      constructor(options) {
        super();
        this.options = options;
      }

      /**
       * @param {string} text
       * @param {string} kind
       */
      addKeyword(text, kind) {
        if (text === "") { return; }

        this.openNode(kind);
        this.addText(text);
        this.closeNode();
      }

      /**
       * @param {string} text
       */
      addText(text) {
        if (text === "") { return; }

        this.add(text);
      }

      /**
       * @param {Emitter & {root: DataNode}} emitter
       * @param {string} name
       */
      addSublanguage(emitter, name) {
        /** @type DataNode */
        const node = emitter.root;
        node.kind = name;
        node.sublanguage = true;
        this.add(node);
      }

      toHTML() {
        const renderer = new HTMLRenderer(this, this.options);
        return renderer.value();
      }

      finalize() {
        return true;
      }
    }

    /**
     * @param {string} value
     * @returns {RegExp}
     * */
    function escape(value) {
      return new RegExp(value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'm');
    }

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function source$1(re) {
      if (!re) return null;
      if (typeof re === "string") return re;

      return re.source;
    }

    /**
     * @param {...(RegExp | string) } args
     * @returns {string}
     */
    function concat$1(...args) {
      const joined = args.map((x) => source$1(x)).join("");
      return joined;
    }

    /**
     * Any of the passed expresssions may match
     *
     * Creates a huge this | this | that | that match
     * @param {(RegExp | string)[] } args
     * @returns {string}
     */
    function either(...args) {
      const joined = '(' + args.map((x) => source$1(x)).join("|") + ")";
      return joined;
    }

    /**
     * @param {RegExp} re
     * @returns {number}
     */
    function countMatchGroups(re) {
      return (new RegExp(re.toString() + '|')).exec('').length - 1;
    }

    /**
     * Does lexeme start with a regular expression match at the beginning
     * @param {RegExp} re
     * @param {string} lexeme
     */
    function startsWith(re, lexeme) {
      const match = re && re.exec(lexeme);
      return match && match.index === 0;
    }

    // BACKREF_RE matches an open parenthesis or backreference. To avoid
    // an incorrect parse, it additionally matches the following:
    // - [...] elements, where the meaning of parentheses and escapes change
    // - other escape sequences, so we do not misparse escape sequences as
    //   interesting elements
    // - non-matching or lookahead parentheses, which do not capture. These
    //   follow the '(' with a '?'.
    const BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

    // join logically computes regexps.join(separator), but fixes the
    // backreferences so they continue to match.
    // it also places each individual regular expression into it's own
    // match group, keeping track of the sequencing of those match groups
    // is currently an exercise for the caller. :-)
    /**
     * @param {(string | RegExp)[]} regexps
     * @param {string} separator
     * @returns {string}
     */
    function join(regexps, separator = "|") {
      let numCaptures = 0;

      return regexps.map((regex) => {
        numCaptures += 1;
        const offset = numCaptures;
        let re = source$1(regex);
        let out = '';

        while (re.length > 0) {
          const match = BACKREF_RE.exec(re);
          if (!match) {
            out += re;
            break;
          }
          out += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] === '\\' && match[1]) {
            // Adjust the backreference.
            out += '\\' + String(Number(match[1]) + offset);
          } else {
            out += match[0];
            if (match[0] === '(') {
              numCaptures++;
            }
          }
        }
        return out;
      }).map(re => `(${re})`).join(separator);
    }

    // Common regexps
    const MATCH_NOTHING_RE = /\b\B/;
    const IDENT_RE$1 = '[a-zA-Z]\\w*';
    const UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
    const NUMBER_RE = '\\b\\d+(\\.\\d+)?';
    const C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
    const BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
    const RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

    /**
    * @param { Partial<Mode> & {binary?: string | RegExp} } opts
    */
    const SHEBANG = (opts = {}) => {
      const beginShebang = /^#![ ]*\//;
      if (opts.binary) {
        opts.begin = concat$1(
          beginShebang,
          /.*\b/,
          opts.binary,
          /\b.*/);
      }
      return inherit({
        className: 'meta',
        begin: beginShebang,
        end: /$/,
        relevance: 0,
        /** @type {ModeCallback} */
        "on:begin": (m, resp) => {
          if (m.index !== 0) resp.ignoreMatch();
        }
      }, opts);
    };

    // Common modes
    const BACKSLASH_ESCAPE = {
      begin: '\\\\[\\s\\S]', relevance: 0
    };
    const APOS_STRING_MODE = {
      className: 'string',
      begin: '\'',
      end: '\'',
      illegal: '\\n',
      contains: [BACKSLASH_ESCAPE]
    };
    const QUOTE_STRING_MODE = {
      className: 'string',
      begin: '"',
      end: '"',
      illegal: '\\n',
      contains: [BACKSLASH_ESCAPE]
    };
    const PHRASAL_WORDS_MODE = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
    };
    /**
     * Creates a comment mode
     *
     * @param {string | RegExp} begin
     * @param {string | RegExp} end
     * @param {Mode | {}} [modeOptions]
     * @returns {Partial<Mode>}
     */
    const COMMENT = function(begin, end, modeOptions = {}) {
      const mode = inherit(
        {
          className: 'comment',
          begin,
          end,
          contains: []
        },
        modeOptions
      );
      mode.contains.push(PHRASAL_WORDS_MODE);
      mode.contains.push({
        className: 'doctag',
        begin: '(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):',
        relevance: 0
      });
      return mode;
    };
    const C_LINE_COMMENT_MODE = COMMENT('//', '$');
    const C_BLOCK_COMMENT_MODE = COMMENT('/\\*', '\\*/');
    const HASH_COMMENT_MODE = COMMENT('#', '$');
    const NUMBER_MODE = {
      className: 'number',
      begin: NUMBER_RE,
      relevance: 0
    };
    const C_NUMBER_MODE = {
      className: 'number',
      begin: C_NUMBER_RE,
      relevance: 0
    };
    const BINARY_NUMBER_MODE = {
      className: 'number',
      begin: BINARY_NUMBER_RE,
      relevance: 0
    };
    const CSS_NUMBER_MODE = {
      className: 'number',
      begin: NUMBER_RE + '(' +
        '%|em|ex|ch|rem' +
        '|vw|vh|vmin|vmax' +
        '|cm|mm|in|pt|pc|px' +
        '|deg|grad|rad|turn' +
        '|s|ms' +
        '|Hz|kHz' +
        '|dpi|dpcm|dppx' +
        ')?',
      relevance: 0
    };
    const REGEXP_MODE = {
      // this outer rule makes sure we actually have a WHOLE regex and not simply
      // an expression such as:
      //
      //     3 / something
      //
      // (which will then blow up when regex's `illegal` sees the newline)
      begin: /(?=\/[^/\n]*\/)/,
      contains: [{
        className: 'regexp',
        begin: /\//,
        end: /\/[gimuy]*/,
        illegal: /\n/,
        contains: [
          BACKSLASH_ESCAPE,
          {
            begin: /\[/,
            end: /\]/,
            relevance: 0,
            contains: [BACKSLASH_ESCAPE]
          }
        ]
      }]
    };
    const TITLE_MODE = {
      className: 'title',
      begin: IDENT_RE$1,
      relevance: 0
    };
    const UNDERSCORE_TITLE_MODE = {
      className: 'title',
      begin: UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    const METHOD_GUARD = {
      // excludes method names from keyword processing
      begin: '\\.\\s*' + UNDERSCORE_IDENT_RE,
      relevance: 0
    };

    /**
     * Adds end same as begin mechanics to a mode
     *
     * Your mode must include at least a single () match group as that first match
     * group is what is used for comparison
     * @param {Partial<Mode>} mode
     */
    const END_SAME_AS_BEGIN = function(mode) {
      return Object.assign(mode,
        {
          /** @type {ModeCallback} */
          'on:begin': (m, resp) => { resp.data._beginMatch = m[1]; },
          /** @type {ModeCallback} */
          'on:end': (m, resp) => { if (resp.data._beginMatch !== m[1]) resp.ignoreMatch(); }
        });
    };

    var MODES = /*#__PURE__*/Object.freeze({
        __proto__: null,
        MATCH_NOTHING_RE: MATCH_NOTHING_RE,
        IDENT_RE: IDENT_RE$1,
        UNDERSCORE_IDENT_RE: UNDERSCORE_IDENT_RE,
        NUMBER_RE: NUMBER_RE,
        C_NUMBER_RE: C_NUMBER_RE,
        BINARY_NUMBER_RE: BINARY_NUMBER_RE,
        RE_STARTERS_RE: RE_STARTERS_RE,
        SHEBANG: SHEBANG,
        BACKSLASH_ESCAPE: BACKSLASH_ESCAPE,
        APOS_STRING_MODE: APOS_STRING_MODE,
        QUOTE_STRING_MODE: QUOTE_STRING_MODE,
        PHRASAL_WORDS_MODE: PHRASAL_WORDS_MODE,
        COMMENT: COMMENT,
        C_LINE_COMMENT_MODE: C_LINE_COMMENT_MODE,
        C_BLOCK_COMMENT_MODE: C_BLOCK_COMMENT_MODE,
        HASH_COMMENT_MODE: HASH_COMMENT_MODE,
        NUMBER_MODE: NUMBER_MODE,
        C_NUMBER_MODE: C_NUMBER_MODE,
        BINARY_NUMBER_MODE: BINARY_NUMBER_MODE,
        CSS_NUMBER_MODE: CSS_NUMBER_MODE,
        REGEXP_MODE: REGEXP_MODE,
        TITLE_MODE: TITLE_MODE,
        UNDERSCORE_TITLE_MODE: UNDERSCORE_TITLE_MODE,
        METHOD_GUARD: METHOD_GUARD,
        END_SAME_AS_BEGIN: END_SAME_AS_BEGIN
    });

    // Grammar extensions / plugins
    // See: https://github.com/highlightjs/highlight.js/issues/2833

    // Grammar extensions allow "syntactic sugar" to be added to the grammar modes
    // without requiring any underlying changes to the compiler internals.

    // `compileMatch` being the perfect small example of now allowing a grammar
    // author to write `match` when they desire to match a single expression rather
    // than being forced to use `begin`.  The extension then just moves `match` into
    // `begin` when it runs.  Ie, no features have been added, but we've just made
    // the experience of writing (and reading grammars) a little bit nicer.

    // ------

    // TODO: We need negative look-behind support to do this properly
    /**
     * Skip a match if it has a preceding dot
     *
     * This is used for `beginKeywords` to prevent matching expressions such as
     * `bob.keyword.do()`. The mode compiler automatically wires this up as a
     * special _internal_ 'on:begin' callback for modes with `beginKeywords`
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    function skipIfhasPrecedingDot(match, response) {
      const before = match.input[match.index - 1];
      if (before === ".") {
        response.ignoreMatch();
      }
    }


    /**
     * `beginKeywords` syntactic sugar
     * @type {CompilerExt}
     */
    function beginKeywords(mode, parent) {
      if (!parent) return;
      if (!mode.beginKeywords) return;

      // for languages with keywords that include non-word characters checking for
      // a word boundary is not sufficient, so instead we check for a word boundary
      // or whitespace - this does no harm in any case since our keyword engine
      // doesn't allow spaces in keywords anyways and we still check for the boundary
      // first
      mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')(?!\\.)(?=\\b|\\s)';
      mode.__beforeBegin = skipIfhasPrecedingDot;
      mode.keywords = mode.keywords || mode.beginKeywords;
      delete mode.beginKeywords;

      // prevents double relevance, the keywords themselves provide
      // relevance, the mode doesn't need to double it
      // eslint-disable-next-line no-undefined
      if (mode.relevance === undefined) mode.relevance = 0;
    }

    /**
     * Allow `illegal` to contain an array of illegal values
     * @type {CompilerExt}
     */
    function compileIllegal(mode, _parent) {
      if (!Array.isArray(mode.illegal)) return;

      mode.illegal = either(...mode.illegal);
    }

    /**
     * `match` to match a single expression for readability
     * @type {CompilerExt}
     */
    function compileMatch(mode, _parent) {
      if (!mode.match) return;
      if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");

      mode.begin = mode.match;
      delete mode.match;
    }

    /**
     * provides the default 1 relevance to all modes
     * @type {CompilerExt}
     */
    function compileRelevance(mode, _parent) {
      // eslint-disable-next-line no-undefined
      if (mode.relevance === undefined) mode.relevance = 1;
    }

    // keywords that should have no default relevance value
    const COMMON_KEYWORDS = [
      'of',
      'and',
      'for',
      'in',
      'not',
      'or',
      'if',
      'then',
      'parent', // common variable name
      'list', // common variable name
      'value' // common variable name
    ];

    const DEFAULT_KEYWORD_CLASSNAME = "keyword";

    /**
     * Given raw keywords from a language definition, compile them.
     *
     * @param {string | Record<string,string|string[]> | Array<string>} rawKeywords
     * @param {boolean} caseInsensitive
     */
    function compileKeywords(rawKeywords, caseInsensitive, className = DEFAULT_KEYWORD_CLASSNAME) {
      /** @type KeywordDict */
      const compiledKeywords = {};

      // input can be a string of keywords, an array of keywords, or a object with
      // named keys representing className (which can then point to a string or array)
      if (typeof rawKeywords === 'string') {
        compileList(className, rawKeywords.split(" "));
      } else if (Array.isArray(rawKeywords)) {
        compileList(className, rawKeywords);
      } else {
        Object.keys(rawKeywords).forEach(function(className) {
          // collapse all our objects back into the parent object
          Object.assign(
            compiledKeywords,
            compileKeywords(rawKeywords[className], caseInsensitive, className)
          );
        });
      }
      return compiledKeywords;

      // ---

      /**
       * Compiles an individual list of keywords
       *
       * Ex: "for if when while|5"
       *
       * @param {string} className
       * @param {Array<string>} keywordList
       */
      function compileList(className, keywordList) {
        if (caseInsensitive) {
          keywordList = keywordList.map(x => x.toLowerCase());
        }
        keywordList.forEach(function(keyword) {
          const pair = keyword.split('|');
          compiledKeywords[pair[0]] = [className, scoreForKeyword(pair[0], pair[1])];
        });
      }
    }

    /**
     * Returns the proper score for a given keyword
     *
     * Also takes into account comment keywords, which will be scored 0 UNLESS
     * another score has been manually assigned.
     * @param {string} keyword
     * @param {string} [providedScore]
     */
    function scoreForKeyword(keyword, providedScore) {
      // manual scores always win over common keywords
      // so you can force a score of 1 if you really insist
      if (providedScore) {
        return Number(providedScore);
      }

      return commonKeyword(keyword) ? 0 : 1;
    }

    /**
     * Determines if a given keyword is common or not
     *
     * @param {string} keyword */
    function commonKeyword(keyword) {
      return COMMON_KEYWORDS.includes(keyword.toLowerCase());
    }

    // compilation

    /**
     * Compiles a language definition result
     *
     * Given the raw result of a language definition (Language), compiles this so
     * that it is ready for highlighting code.
     * @param {Language} language
     * @param {{plugins: HLJSPlugin[]}} opts
     * @returns {CompiledLanguage}
     */
    function compileLanguage(language, { plugins }) {
      /**
       * Builds a regex with the case sensativility of the current language
       *
       * @param {RegExp | string} value
       * @param {boolean} [global]
       */
      function langRe(value, global) {
        return new RegExp(
          source$1(value),
          'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
        );
      }

      /**
        Stores multiple regular expressions and allows you to quickly search for
        them all in a string simultaneously - returning the first match.  It does
        this by creating a huge (a|b|c) regex - each individual item wrapped with ()
        and joined by `|` - using match groups to track position.  When a match is
        found checking which position in the array has content allows us to figure
        out which of the original regexes / match groups triggered the match.

        The match object itself (the result of `Regex.exec`) is returned but also
        enhanced by merging in any meta-data that was registered with the regex.
        This is how we keep track of which mode matched, and what type of rule
        (`illegal`, `begin`, end, etc).
      */
      class MultiRegex {
        constructor() {
          this.matchIndexes = {};
          // @ts-ignore
          this.regexes = [];
          this.matchAt = 1;
          this.position = 0;
        }

        // @ts-ignore
        addRule(re, opts) {
          opts.position = this.position++;
          // @ts-ignore
          this.matchIndexes[this.matchAt] = opts;
          this.regexes.push([opts, re]);
          this.matchAt += countMatchGroups(re) + 1;
        }

        compile() {
          if (this.regexes.length === 0) {
            // avoids the need to check length every time exec is called
            // @ts-ignore
            this.exec = () => null;
          }
          const terminators = this.regexes.map(el => el[1]);
          this.matcherRe = langRe(join(terminators), true);
          this.lastIndex = 0;
        }

        /** @param {string} s */
        exec(s) {
          this.matcherRe.lastIndex = this.lastIndex;
          const match = this.matcherRe.exec(s);
          if (!match) { return null; }

          // eslint-disable-next-line no-undefined
          const i = match.findIndex((el, i) => i > 0 && el !== undefined);
          // @ts-ignore
          const matchData = this.matchIndexes[i];
          // trim off any earlier non-relevant match groups (ie, the other regex
          // match groups that make up the multi-matcher)
          match.splice(0, i);

          return Object.assign(match, matchData);
        }
      }

      /*
        Created to solve the key deficiently with MultiRegex - there is no way to
        test for multiple matches at a single location.  Why would we need to do
        that?  In the future a more dynamic engine will allow certain matches to be
        ignored.  An example: if we matched say the 3rd regex in a large group but
        decided to ignore it - we'd need to started testing again at the 4th
        regex... but MultiRegex itself gives us no real way to do that.

        So what this class creates MultiRegexs on the fly for whatever search
        position they are needed.

        NOTE: These additional MultiRegex objects are created dynamically.  For most
        grammars most of the time we will never actually need anything more than the
        first MultiRegex - so this shouldn't have too much overhead.

        Say this is our search group, and we match regex3, but wish to ignore it.

          regex1 | regex2 | regex3 | regex4 | regex5    ' ie, startAt = 0

        What we need is a new MultiRegex that only includes the remaining
        possibilities:

          regex4 | regex5                               ' ie, startAt = 3

        This class wraps all that complexity up in a simple API... `startAt` decides
        where in the array of expressions to start doing the matching. It
        auto-increments, so if a match is found at position 2, then startAt will be
        set to 3.  If the end is reached startAt will return to 0.

        MOST of the time the parser will be setting startAt manually to 0.
      */
      class ResumableMultiRegex {
        constructor() {
          // @ts-ignore
          this.rules = [];
          // @ts-ignore
          this.multiRegexes = [];
          this.count = 0;

          this.lastIndex = 0;
          this.regexIndex = 0;
        }

        // @ts-ignore
        getMatcher(index) {
          if (this.multiRegexes[index]) return this.multiRegexes[index];

          const matcher = new MultiRegex();
          this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
          matcher.compile();
          this.multiRegexes[index] = matcher;
          return matcher;
        }

        resumingScanAtSamePosition() {
          return this.regexIndex !== 0;
        }

        considerAll() {
          this.regexIndex = 0;
        }

        // @ts-ignore
        addRule(re, opts) {
          this.rules.push([re, opts]);
          if (opts.type === "begin") this.count++;
        }

        /** @param {string} s */
        exec(s) {
          const m = this.getMatcher(this.regexIndex);
          m.lastIndex = this.lastIndex;
          let result = m.exec(s);

          // The following is because we have no easy way to say "resume scanning at the
          // existing position but also skip the current rule ONLY". What happens is
          // all prior rules are also skipped which can result in matching the wrong
          // thing. Example of matching "booger":

          // our matcher is [string, "booger", number]
          //
          // ....booger....

          // if "booger" is ignored then we'd really need a regex to scan from the
          // SAME position for only: [string, number] but ignoring "booger" (if it
          // was the first match), a simple resume would scan ahead who knows how
          // far looking only for "number", ignoring potential string matches (or
          // future "booger" matches that might be valid.)

          // So what we do: We execute two matchers, one resuming at the same
          // position, but the second full matcher starting at the position after:

          //     /--- resume first regex match here (for [number])
          //     |/---- full match here for [string, "booger", number]
          //     vv
          // ....booger....

          // Which ever results in a match first is then used. So this 3-4 step
          // process essentially allows us to say "match at this position, excluding
          // a prior rule that was ignored".
          //
          // 1. Match "booger" first, ignore. Also proves that [string] does non match.
          // 2. Resume matching for [number]
          // 3. Match at index + 1 for [string, "booger", number]
          // 4. If #2 and #3 result in matches, which came first?
          if (this.resumingScanAtSamePosition()) {
            if (result && result.index === this.lastIndex) ; else { // use the second matcher result
              const m2 = this.getMatcher(0);
              m2.lastIndex = this.lastIndex + 1;
              result = m2.exec(s);
            }
          }

          if (result) {
            this.regexIndex += result.position + 1;
            if (this.regexIndex === this.count) {
              // wrap-around to considering all matches again
              this.considerAll();
            }
          }

          return result;
        }
      }

      /**
       * Given a mode, builds a huge ResumableMultiRegex that can be used to walk
       * the content and find matches.
       *
       * @param {CompiledMode} mode
       * @returns {ResumableMultiRegex}
       */
      function buildModeRegex(mode) {
        const mm = new ResumableMultiRegex();

        mode.contains.forEach(term => mm.addRule(term.begin, { rule: term, type: "begin" }));

        if (mode.terminatorEnd) {
          mm.addRule(mode.terminatorEnd, { type: "end" });
        }
        if (mode.illegal) {
          mm.addRule(mode.illegal, { type: "illegal" });
        }

        return mm;
      }

      /** skip vs abort vs ignore
       *
       * @skip   - The mode is still entered and exited normally (and contains rules apply),
       *           but all content is held and added to the parent buffer rather than being
       *           output when the mode ends.  Mostly used with `sublanguage` to build up
       *           a single large buffer than can be parsed by sublanguage.
       *
       *             - The mode begin ands ends normally.
       *             - Content matched is added to the parent mode buffer.
       *             - The parser cursor is moved forward normally.
       *
       * @abort  - A hack placeholder until we have ignore.  Aborts the mode (as if it
       *           never matched) but DOES NOT continue to match subsequent `contains`
       *           modes.  Abort is bad/suboptimal because it can result in modes
       *           farther down not getting applied because an earlier rule eats the
       *           content but then aborts.
       *
       *             - The mode does not begin.
       *             - Content matched by `begin` is added to the mode buffer.
       *             - The parser cursor is moved forward accordingly.
       *
       * @ignore - Ignores the mode (as if it never matched) and continues to match any
       *           subsequent `contains` modes.  Ignore isn't technically possible with
       *           the current parser implementation.
       *
       *             - The mode does not begin.
       *             - Content matched by `begin` is ignored.
       *             - The parser cursor is not moved forward.
       */

      /**
       * Compiles an individual mode
       *
       * This can raise an error if the mode contains certain detectable known logic
       * issues.
       * @param {Mode} mode
       * @param {CompiledMode | null} [parent]
       * @returns {CompiledMode | never}
       */
      function compileMode(mode, parent) {
        const cmode = /** @type CompiledMode */ (mode);
        if (mode.isCompiled) return cmode;

        [
          // do this early so compiler extensions generally don't have to worry about
          // the distinction between match/begin
          compileMatch
        ].forEach(ext => ext(mode, parent));

        language.compilerExtensions.forEach(ext => ext(mode, parent));

        // __beforeBegin is considered private API, internal use only
        mode.__beforeBegin = null;

        [
          beginKeywords,
          // do this later so compiler extensions that come earlier have access to the
          // raw array if they wanted to perhaps manipulate it, etc.
          compileIllegal,
          // default to 1 relevance if not specified
          compileRelevance
        ].forEach(ext => ext(mode, parent));

        mode.isCompiled = true;

        let keywordPattern = null;
        if (typeof mode.keywords === "object") {
          keywordPattern = mode.keywords.$pattern;
          delete mode.keywords.$pattern;
        }

        if (mode.keywords) {
          mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
        }

        // both are not allowed
        if (mode.lexemes && keywordPattern) {
          throw new Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");
        }

        // `mode.lexemes` was the old standard before we added and now recommend
        // using `keywords.$pattern` to pass the keyword pattern
        keywordPattern = keywordPattern || mode.lexemes || /\w+/;
        cmode.keywordPatternRe = langRe(keywordPattern, true);

        if (parent) {
          if (!mode.begin) mode.begin = /\B|\b/;
          cmode.beginRe = langRe(mode.begin);
          if (mode.endSameAsBegin) mode.end = mode.begin;
          if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
          if (mode.end) cmode.endRe = langRe(mode.end);
          cmode.terminatorEnd = source$1(mode.end) || '';
          if (mode.endsWithParent && parent.terminatorEnd) {
            cmode.terminatorEnd += (mode.end ? '|' : '') + parent.terminatorEnd;
          }
        }
        if (mode.illegal) cmode.illegalRe = langRe(/** @type {RegExp | string} */ (mode.illegal));
        if (!mode.contains) mode.contains = [];

        mode.contains = [].concat(...mode.contains.map(function(c) {
          return expandOrCloneMode(c === 'self' ? mode : c);
        }));
        mode.contains.forEach(function(c) { compileMode(/** @type Mode */ (c), cmode); });

        if (mode.starts) {
          compileMode(mode.starts, parent);
        }

        cmode.matcher = buildModeRegex(cmode);
        return cmode;
      }

      if (!language.compilerExtensions) language.compilerExtensions = [];

      // self is not valid at the top-level
      if (language.contains && language.contains.includes('self')) {
        throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
      }

      // we need a null object, which inherit will guarantee
      language.classNameAliases = inherit(language.classNameAliases || {});

      return compileMode(/** @type Mode */ (language));
    }

    /**
     * Determines if a mode has a dependency on it's parent or not
     *
     * If a mode does have a parent dependency then often we need to clone it if
     * it's used in multiple places so that each copy points to the correct parent,
     * where-as modes without a parent can often safely be re-used at the bottom of
     * a mode chain.
     *
     * @param {Mode | null} mode
     * @returns {boolean} - is there a dependency on the parent?
     * */
    function dependencyOnParent(mode) {
      if (!mode) return false;

      return mode.endsWithParent || dependencyOnParent(mode.starts);
    }

    /**
     * Expands a mode or clones it if necessary
     *
     * This is necessary for modes with parental dependenceis (see notes on
     * `dependencyOnParent`) and for nodes that have `variants` - which must then be
     * exploded into their own individual modes at compile time.
     *
     * @param {Mode} mode
     * @returns {Mode | Mode[]}
     * */
    function expandOrCloneMode(mode) {
      if (mode.variants && !mode.cachedVariants) {
        mode.cachedVariants = mode.variants.map(function(variant) {
          return inherit(mode, { variants: null }, variant);
        });
      }

      // EXPAND
      // if we have variants then essentially "replace" the mode with the variants
      // this happens in compileMode, where this function is called from
      if (mode.cachedVariants) {
        return mode.cachedVariants;
      }

      // CLONE
      // if we have dependencies on parents then we need a unique
      // instance of ourselves, so we can be reused with many
      // different parents without issue
      if (dependencyOnParent(mode)) {
        return inherit(mode, { starts: mode.starts ? inherit(mode.starts) : null });
      }

      if (Object.isFrozen(mode)) {
        return inherit(mode);
      }

      // no special dependency issues, just return ourselves
      return mode;
    }

    var version = "10.7.1";

    // @ts-nocheck

    function hasValueOrEmptyAttribute(value) {
      return Boolean(value || value === "");
    }

    function BuildVuePlugin(hljs) {
      const Component = {
        props: ["language", "code", "autodetect"],
        data: function() {
          return {
            detectedLanguage: "",
            unknownLanguage: false
          };
        },
        computed: {
          className() {
            if (this.unknownLanguage) return "";

            return "hljs " + this.detectedLanguage;
          },
          highlighted() {
            // no idea what language to use, return raw code
            if (!this.autoDetect && !hljs.getLanguage(this.language)) {
              console.warn(`The language "${this.language}" you specified could not be found.`);
              this.unknownLanguage = true;
              return escapeHTML(this.code);
            }

            let result = {};
            if (this.autoDetect) {
              result = hljs.highlightAuto(this.code);
              this.detectedLanguage = result.language;
            } else {
              result = hljs.highlight(this.language, this.code, this.ignoreIllegals);
              this.detectedLanguage = this.language;
            }
            return result.value;
          },
          autoDetect() {
            return !this.language || hasValueOrEmptyAttribute(this.autodetect);
          },
          ignoreIllegals() {
            return true;
          }
        },
        // this avoids needing to use a whole Vue compilation pipeline just
        // to build Highlight.js
        render(createElement) {
          return createElement("pre", {}, [
            createElement("code", {
              class: this.className,
              domProps: { innerHTML: this.highlighted }
            })
          ]);
        }
        // template: `<pre><code :class="className" v-html="highlighted"></code></pre>`
      };

      const VuePlugin = {
        install(Vue) {
          Vue.component('highlightjs', Component);
        }
      };

      return { Component, VuePlugin };
    }

    /* plugin itself */

    /** @type {HLJSPlugin} */
    const mergeHTMLPlugin = {
      "after:highlightElement": ({ el, result, text }) => {
        const originalStream = nodeStream(el);
        if (!originalStream.length) return;

        const resultNode = document.createElement('div');
        resultNode.innerHTML = result.value;
        result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
      }
    };

    /* Stream merging support functions */

    /**
     * @typedef Event
     * @property {'start'|'stop'} event
     * @property {number} offset
     * @property {Node} node
     */

    /**
     * @param {Node} node
     */
    function tag(node) {
      return node.nodeName.toLowerCase();
    }

    /**
     * @param {Node} node
     */
    function nodeStream(node) {
      /** @type Event[] */
      const result = [];
      (function _nodeStream(node, offset) {
        for (let child = node.firstChild; child; child = child.nextSibling) {
          if (child.nodeType === 3) {
            offset += child.nodeValue.length;
          } else if (child.nodeType === 1) {
            result.push({
              event: 'start',
              offset: offset,
              node: child
            });
            offset = _nodeStream(child, offset);
            // Prevent void elements from having an end tag that would actually
            // double them in the output. There are more void elements in HTML
            // but we list only those realistically expected in code display.
            if (!tag(child).match(/br|hr|img|input/)) {
              result.push({
                event: 'stop',
                offset: offset,
                node: child
              });
            }
          }
        }
        return offset;
      })(node, 0);
      return result;
    }

    /**
     * @param {any} original - the original stream
     * @param {any} highlighted - stream of the highlighted source
     * @param {string} value - the original source itself
     */
    function mergeStreams(original, highlighted, value) {
      let processed = 0;
      let result = '';
      const nodeStack = [];

      function selectStream() {
        if (!original.length || !highlighted.length) {
          return original.length ? original : highlighted;
        }
        if (original[0].offset !== highlighted[0].offset) {
          return (original[0].offset < highlighted[0].offset) ? original : highlighted;
        }

        /*
        To avoid starting the stream just before it should stop the order is
        ensured that original always starts first and closes last:

        if (event1 == 'start' && event2 == 'start')
          return original;
        if (event1 == 'start' && event2 == 'stop')
          return highlighted;
        if (event1 == 'stop' && event2 == 'start')
          return original;
        if (event1 == 'stop' && event2 == 'stop')
          return highlighted;

        ... which is collapsed to:
        */
        return highlighted[0].event === 'start' ? original : highlighted;
      }

      /**
       * @param {Node} node
       */
      function open(node) {
        /** @param {Attr} attr */
        function attributeString(attr) {
          return ' ' + attr.nodeName + '="' + escapeHTML(attr.value) + '"';
        }
        // @ts-ignore
        result += '<' + tag(node) + [].map.call(node.attributes, attributeString).join('') + '>';
      }

      /**
       * @param {Node} node
       */
      function close(node) {
        result += '</' + tag(node) + '>';
      }

      /**
       * @param {Event} event
       */
      function render(event) {
        (event.event === 'start' ? open : close)(event.node);
      }

      while (original.length || highlighted.length) {
        let stream = selectStream();
        result += escapeHTML(value.substring(processed, stream[0].offset));
        processed = stream[0].offset;
        if (stream === original) {
          /*
          On any opening or closing tag of the original markup we first close
          the entire highlighted node stack, then render the original tag along
          with all the following original tags at the same offset and then
          reopen all the tags on the highlighted stack.
          */
          nodeStack.reverse().forEach(close);
          do {
            render(stream.splice(0, 1)[0]);
            stream = selectStream();
          } while (stream === original && stream.length && stream[0].offset === processed);
          nodeStack.reverse().forEach(open);
        } else {
          if (stream[0].event === 'start') {
            nodeStack.push(stream[0].node);
          } else {
            nodeStack.pop();
          }
          render(stream.splice(0, 1)[0]);
        }
      }
      return result + escapeHTML(value.substr(processed));
    }

    /*

    For the reasoning behind this please see:
    https://github.com/highlightjs/highlight.js/issues/2880#issuecomment-747275419

    */

    /**
     * @param {string} message
     */
    const error = (message) => {
      console.error(message);
    };

    /**
     * @param {string} message
     * @param {any} args
     */
    const warn = (message, ...args) => {
      console.log(`WARN: ${message}`, ...args);
    };

    /**
     * @param {string} version
     * @param {string} message
     */
    const deprecated = (version, message) => {
      console.log(`Deprecated as of ${version}. ${message}`);
    };

    /*
    Syntax highlighting with language autodetection.
    https://highlightjs.org/
    */

    const escape$1 = escapeHTML;
    const inherit$1 = inherit;
    const NO_MATCH = Symbol("nomatch");

    /**
     * @param {any} hljs - object that is extended (legacy)
     * @returns {HLJSApi}
     */
    const HLJS = function(hljs) {
      // Global internal variables used within the highlight.js library.
      /** @type {Record<string, Language>} */
      const languages = Object.create(null);
      /** @type {Record<string, string>} */
      const aliases = Object.create(null);
      /** @type {HLJSPlugin[]} */
      const plugins = [];

      // safe/production mode - swallows more errors, tries to keep running
      // even if a single syntax or parse hits a fatal error
      let SAFE_MODE = true;
      const fixMarkupRe = /(^(<[^>]+>|\t|)+|\n)/gm;
      const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
      /** @type {Language} */
      const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: 'Plain text', contains: [] };

      // Global options used when within external APIs. This is modified when
      // calling the `hljs.configure` function.
      /** @type HLJSOptions */
      let options = {
        noHighlightRe: /^(no-?highlight)$/i,
        languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
        classPrefix: 'hljs-',
        tabReplace: null,
        useBR: false,
        languages: null,
        // beta configuration options, subject to change, welcome to discuss
        // https://github.com/highlightjs/highlight.js/issues/1086
        __emitter: TokenTreeEmitter
      };

      /* Utility functions */

      /**
       * Tests a language name to see if highlighting should be skipped
       * @param {string} languageName
       */
      function shouldNotHighlight(languageName) {
        return options.noHighlightRe.test(languageName);
      }

      /**
       * @param {HighlightedHTMLElement} block - the HTML element to determine language for
       */
      function blockLanguage(block) {
        let classes = block.className + ' ';

        classes += block.parentNode ? block.parentNode.className : '';

        // language-* takes precedence over non-prefixed class names.
        const match = options.languageDetectRe.exec(classes);
        if (match) {
          const language = getLanguage(match[1]);
          if (!language) {
            warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
            warn("Falling back to no-highlight mode for this block.", block);
          }
          return language ? match[1] : 'no-highlight';
        }

        return classes
          .split(/\s+/)
          .find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
      }

      /**
       * Core highlighting function.
       *
       * OLD API
       * highlight(lang, code, ignoreIllegals, continuation)
       *
       * NEW API
       * highlight(code, {lang, ignoreIllegals})
       *
       * @param {string} codeOrlanguageName - the language to use for highlighting
       * @param {string | HighlightOptions} optionsOrCode - the code to highlight
       * @param {boolean} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
       * @param {CompiledMode} [continuation] - current continuation mode, if any
       *
       * @returns {HighlightResult} Result - an object that represents the result
       * @property {string} language - the language name
       * @property {number} relevance - the relevance score
       * @property {string} value - the highlighted HTML code
       * @property {string} code - the original raw code
       * @property {CompiledMode} top - top of the current mode stack
       * @property {boolean} illegal - indicates whether any illegal matches were found
      */
      function highlight(codeOrlanguageName, optionsOrCode, ignoreIllegals, continuation) {
        let code = "";
        let languageName = "";
        if (typeof optionsOrCode === "object") {
          code = codeOrlanguageName;
          ignoreIllegals = optionsOrCode.ignoreIllegals;
          languageName = optionsOrCode.language;
          // continuation not supported at all via the new API
          // eslint-disable-next-line no-undefined
          continuation = undefined;
        } else {
          // old API
          deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
          deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
          languageName = codeOrlanguageName;
          code = optionsOrCode;
        }

        /** @type {BeforeHighlightContext} */
        const context = {
          code,
          language: languageName
        };
        // the plugin can change the desired language or the code to be highlighted
        // just be changing the object it was passed
        fire("before:highlight", context);

        // a before plugin can usurp the result completely by providing it's own
        // in which case we don't even need to call highlight
        const result = context.result
          ? context.result
          : _highlight(context.language, context.code, ignoreIllegals, continuation);

        result.code = context.code;
        // the plugin can change anything in result to suite it
        fire("after:highlight", result);

        return result;
      }

      /**
       * private highlight that's used internally and does not fire callbacks
       *
       * @param {string} languageName - the language to use for highlighting
       * @param {string} codeToHighlight - the code to highlight
       * @param {boolean?} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
       * @param {CompiledMode?} [continuation] - current continuation mode, if any
       * @returns {HighlightResult} - result of the highlight operation
      */
      function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
        /**
         * Return keyword data if a match is a keyword
         * @param {CompiledMode} mode - current mode
         * @param {RegExpMatchArray} match - regexp match data
         * @returns {KeywordData | false}
         */
        function keywordData(mode, match) {
          const matchText = language.case_insensitive ? match[0].toLowerCase() : match[0];
          return Object.prototype.hasOwnProperty.call(mode.keywords, matchText) && mode.keywords[matchText];
        }

        function processKeywords() {
          if (!top.keywords) {
            emitter.addText(modeBuffer);
            return;
          }

          let lastIndex = 0;
          top.keywordPatternRe.lastIndex = 0;
          let match = top.keywordPatternRe.exec(modeBuffer);
          let buf = "";

          while (match) {
            buf += modeBuffer.substring(lastIndex, match.index);
            const data = keywordData(top, match);
            if (data) {
              const [kind, keywordRelevance] = data;
              emitter.addText(buf);
              buf = "";

              relevance += keywordRelevance;
              if (kind.startsWith("_")) {
                // _ implied for relevance only, do not highlight
                // by applying a class name
                buf += match[0];
              } else {
                const cssClass = language.classNameAliases[kind] || kind;
                emitter.addKeyword(match[0], cssClass);
              }
            } else {
              buf += match[0];
            }
            lastIndex = top.keywordPatternRe.lastIndex;
            match = top.keywordPatternRe.exec(modeBuffer);
          }
          buf += modeBuffer.substr(lastIndex);
          emitter.addText(buf);
        }

        function processSubLanguage() {
          if (modeBuffer === "") return;
          /** @type HighlightResult */
          let result = null;

          if (typeof top.subLanguage === 'string') {
            if (!languages[top.subLanguage]) {
              emitter.addText(modeBuffer);
              return;
            }
            result = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
            continuations[top.subLanguage] = /** @type {CompiledMode} */ (result.top);
          } else {
            result = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
          }

          // Counting embedded language score towards the host language may be disabled
          // with zeroing the containing mode relevance. Use case in point is Markdown that
          // allows XML everywhere and makes every XML snippet to have a much larger Markdown
          // score.
          if (top.relevance > 0) {
            relevance += result.relevance;
          }
          emitter.addSublanguage(result.emitter, result.language);
        }

        function processBuffer() {
          if (top.subLanguage != null) {
            processSubLanguage();
          } else {
            processKeywords();
          }
          modeBuffer = '';
        }

        /**
         * @param {Mode} mode - new mode to start
         */
        function startNewMode(mode) {
          if (mode.className) {
            emitter.openNode(language.classNameAliases[mode.className] || mode.className);
          }
          top = Object.create(mode, { parent: { value: top } });
          return top;
        }

        /**
         * @param {CompiledMode } mode - the mode to potentially end
         * @param {RegExpMatchArray} match - the latest match
         * @param {string} matchPlusRemainder - match plus remainder of content
         * @returns {CompiledMode | void} - the next mode, or if void continue on in current mode
         */
        function endOfMode(mode, match, matchPlusRemainder) {
          let matched = startsWith(mode.endRe, matchPlusRemainder);

          if (matched) {
            if (mode["on:end"]) {
              const resp = new Response(mode);
              mode["on:end"](match, resp);
              if (resp.isMatchIgnored) matched = false;
            }

            if (matched) {
              while (mode.endsParent && mode.parent) {
                mode = mode.parent;
              }
              return mode;
            }
          }
          // even if on:end fires an `ignore` it's still possible
          // that we might trigger the end node because of a parent mode
          if (mode.endsWithParent) {
            return endOfMode(mode.parent, match, matchPlusRemainder);
          }
        }

        /**
         * Handle matching but then ignoring a sequence of text
         *
         * @param {string} lexeme - string containing full match text
         */
        function doIgnore(lexeme) {
          if (top.matcher.regexIndex === 0) {
            // no more regexs to potentially match here, so we move the cursor forward one
            // space
            modeBuffer += lexeme[0];
            return 1;
          } else {
            // no need to move the cursor, we still have additional regexes to try and
            // match at this very spot
            resumeScanAtSamePosition = true;
            return 0;
          }
        }

        /**
         * Handle the start of a new potential mode match
         *
         * @param {EnhancedMatch} match - the current match
         * @returns {number} how far to advance the parse cursor
         */
        function doBeginMatch(match) {
          const lexeme = match[0];
          const newMode = match.rule;

          const resp = new Response(newMode);
          // first internal before callbacks, then the public ones
          const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
          for (const cb of beforeCallbacks) {
            if (!cb) continue;
            cb(match, resp);
            if (resp.isMatchIgnored) return doIgnore(lexeme);
          }

          if (newMode && newMode.endSameAsBegin) {
            newMode.endRe = escape(lexeme);
          }

          if (newMode.skip) {
            modeBuffer += lexeme;
          } else {
            if (newMode.excludeBegin) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (!newMode.returnBegin && !newMode.excludeBegin) {
              modeBuffer = lexeme;
            }
          }
          startNewMode(newMode);
          // if (mode["after:begin"]) {
          //   let resp = new Response(mode);
          //   mode["after:begin"](match, resp);
          // }
          return newMode.returnBegin ? 0 : lexeme.length;
        }

        /**
         * Handle the potential end of mode
         *
         * @param {RegExpMatchArray} match - the current match
         */
        function doEndMatch(match) {
          const lexeme = match[0];
          const matchPlusRemainder = codeToHighlight.substr(match.index);

          const endMode = endOfMode(top, match, matchPlusRemainder);
          if (!endMode) { return NO_MATCH; }

          const origin = top;
          if (origin.skip) {
            modeBuffer += lexeme;
          } else {
            if (!(origin.returnEnd || origin.excludeEnd)) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (origin.excludeEnd) {
              modeBuffer = lexeme;
            }
          }
          do {
            if (top.className) {
              emitter.closeNode();
            }
            if (!top.skip && !top.subLanguage) {
              relevance += top.relevance;
            }
            top = top.parent;
          } while (top !== endMode.parent);
          if (endMode.starts) {
            if (endMode.endSameAsBegin) {
              endMode.starts.endRe = endMode.endRe;
            }
            startNewMode(endMode.starts);
          }
          return origin.returnEnd ? 0 : lexeme.length;
        }

        function processContinuations() {
          const list = [];
          for (let current = top; current !== language; current = current.parent) {
            if (current.className) {
              list.unshift(current.className);
            }
          }
          list.forEach(item => emitter.openNode(item));
        }

        /** @type {{type?: MatchType, index?: number, rule?: Mode}}} */
        let lastMatch = {};

        /**
         *  Process an individual match
         *
         * @param {string} textBeforeMatch - text preceeding the match (since the last match)
         * @param {EnhancedMatch} [match] - the match itself
         */
        function processLexeme(textBeforeMatch, match) {
          const lexeme = match && match[0];

          // add non-matched text to the current mode buffer
          modeBuffer += textBeforeMatch;

          if (lexeme == null) {
            processBuffer();
            return 0;
          }

          // we've found a 0 width match and we're stuck, so we need to advance
          // this happens when we have badly behaved rules that have optional matchers to the degree that
          // sometimes they can end up matching nothing at all
          // Ref: https://github.com/highlightjs/highlight.js/issues/2140
          if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
            // spit the "skipped" character that our regex choked on back into the output sequence
            modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
            if (!SAFE_MODE) {
              /** @type {AnnotatedError} */
              const err = new Error('0 width match regex');
              err.languageName = languageName;
              err.badRule = lastMatch.rule;
              throw err;
            }
            return 1;
          }
          lastMatch = match;

          if (match.type === "begin") {
            return doBeginMatch(match);
          } else if (match.type === "illegal" && !ignoreIllegals) {
            // illegal match, we do not continue processing
            /** @type {AnnotatedError} */
            const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');
            err.mode = top;
            throw err;
          } else if (match.type === "end") {
            const processed = doEndMatch(match);
            if (processed !== NO_MATCH) {
              return processed;
            }
          }

          // edge case for when illegal matches $ (end of line) which is technically
          // a 0 width match but not a begin/end match so it's not caught by the
          // first handler (when ignoreIllegals is true)
          if (match.type === "illegal" && lexeme === "") {
            // advance so we aren't stuck in an infinite loop
            return 1;
          }

          // infinite loops are BAD, this is a last ditch catch all. if we have a
          // decent number of iterations yet our index (cursor position in our
          // parsing) still 3x behind our index then something is very wrong
          // so we bail
          if (iterations > 100000 && iterations > match.index * 3) {
            const err = new Error('potential infinite loop, way more iterations than matches');
            throw err;
          }

          /*
          Why might be find ourselves here?  Only one occasion now.  An end match that was
          triggered but could not be completed.  When might this happen?  When an `endSameasBegin`
          rule sets the end rule to a specific match.  Since the overall mode termination rule that's
          being used to scan the text isn't recompiled that means that any match that LOOKS like
          the end (but is not, because it is not an exact match to the beginning) will
          end up here.  A definite end match, but when `doEndMatch` tries to "reapply"
          the end rule and fails to match, we wind up here, and just silently ignore the end.

          This causes no real harm other than stopping a few times too many.
          */

          modeBuffer += lexeme;
          return lexeme.length;
        }

        const language = getLanguage(languageName);
        if (!language) {
          error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
          throw new Error('Unknown language: "' + languageName + '"');
        }

        const md = compileLanguage(language, { plugins });
        let result = '';
        /** @type {CompiledMode} */
        let top = continuation || md;
        /** @type Record<string,CompiledMode> */
        const continuations = {}; // keep continuations for sub-languages
        const emitter = new options.__emitter(options);
        processContinuations();
        let modeBuffer = '';
        let relevance = 0;
        let index = 0;
        let iterations = 0;
        let resumeScanAtSamePosition = false;

        try {
          top.matcher.considerAll();

          for (;;) {
            iterations++;
            if (resumeScanAtSamePosition) {
              // only regexes not matched previously will now be
              // considered for a potential match
              resumeScanAtSamePosition = false;
            } else {
              top.matcher.considerAll();
            }
            top.matcher.lastIndex = index;

            const match = top.matcher.exec(codeToHighlight);
            // console.log("match", match[0], match.rule && match.rule.begin)

            if (!match) break;

            const beforeMatch = codeToHighlight.substring(index, match.index);
            const processedCount = processLexeme(beforeMatch, match);
            index = match.index + processedCount;
          }
          processLexeme(codeToHighlight.substr(index));
          emitter.closeAllNodes();
          emitter.finalize();
          result = emitter.toHTML();

          return {
            // avoid possible breakage with v10 clients expecting
            // this to always be an integer
            relevance: Math.floor(relevance),
            value: result,
            language: languageName,
            illegal: false,
            emitter: emitter,
            top: top
          };
        } catch (err) {
          if (err.message && err.message.includes('Illegal')) {
            return {
              illegal: true,
              illegalBy: {
                msg: err.message,
                context: codeToHighlight.slice(index - 100, index + 100),
                mode: err.mode
              },
              sofar: result,
              relevance: 0,
              value: escape$1(codeToHighlight),
              emitter: emitter
            };
          } else if (SAFE_MODE) {
            return {
              illegal: false,
              relevance: 0,
              value: escape$1(codeToHighlight),
              emitter: emitter,
              language: languageName,
              top: top,
              errorRaised: err
            };
          } else {
            throw err;
          }
        }
      }

      /**
       * returns a valid highlight result, without actually doing any actual work,
       * auto highlight starts with this and it's possible for small snippets that
       * auto-detection may not find a better match
       * @param {string} code
       * @returns {HighlightResult}
       */
      function justTextHighlightResult(code) {
        const result = {
          relevance: 0,
          emitter: new options.__emitter(options),
          value: escape$1(code),
          illegal: false,
          top: PLAINTEXT_LANGUAGE
        };
        result.emitter.addText(code);
        return result;
      }

      /**
      Highlighting with language detection. Accepts a string with the code to
      highlight. Returns an object with the following properties:

      - language (detected language)
      - relevance (int)
      - value (an HTML string with highlighting markup)
      - second_best (object with the same structure for second-best heuristically
        detected language, may be absent)

        @param {string} code
        @param {Array<string>} [languageSubset]
        @returns {AutoHighlightResult}
      */
      function highlightAuto(code, languageSubset) {
        languageSubset = languageSubset || options.languages || Object.keys(languages);
        const plaintext = justTextHighlightResult(code);

        const results = languageSubset.filter(getLanguage).filter(autoDetection).map(name =>
          _highlight(name, code, false)
        );
        results.unshift(plaintext); // plaintext is always an option

        const sorted = results.sort((a, b) => {
          // sort base on relevance
          if (a.relevance !== b.relevance) return b.relevance - a.relevance;

          // always award the tie to the base language
          // ie if C++ and Arduino are tied, it's more likely to be C++
          if (a.language && b.language) {
            if (getLanguage(a.language).supersetOf === b.language) {
              return 1;
            } else if (getLanguage(b.language).supersetOf === a.language) {
              return -1;
            }
          }

          // otherwise say they are equal, which has the effect of sorting on
          // relevance while preserving the original ordering - which is how ties
          // have historically been settled, ie the language that comes first always
          // wins in the case of a tie
          return 0;
        });

        const [best, secondBest] = sorted;

        /** @type {AutoHighlightResult} */
        const result = best;
        result.second_best = secondBest;

        return result;
      }

      /**
      Post-processing of the highlighted markup:

      - replace TABs with something more useful
      - replace real line-breaks with '<br>' for non-pre containers

        @param {string} html
        @returns {string}
      */
      function fixMarkup(html) {
        if (!(options.tabReplace || options.useBR)) {
          return html;
        }

        return html.replace(fixMarkupRe, match => {
          if (match === '\n') {
            return options.useBR ? '<br>' : match;
          } else if (options.tabReplace) {
            return match.replace(/\t/g, options.tabReplace);
          }
          return match;
        });
      }

      /**
       * Builds new class name for block given the language name
       *
       * @param {HTMLElement} element
       * @param {string} [currentLang]
       * @param {string} [resultLang]
       */
      function updateClassName(element, currentLang, resultLang) {
        const language = currentLang ? aliases[currentLang] : resultLang;

        element.classList.add("hljs");
        if (language) element.classList.add(language);
      }

      /** @type {HLJSPlugin} */
      const brPlugin = {
        "before:highlightElement": ({ el }) => {
          if (options.useBR) {
            el.innerHTML = el.innerHTML.replace(/\n/g, '').replace(/<br[ /]*>/g, '\n');
          }
        },
        "after:highlightElement": ({ result }) => {
          if (options.useBR) {
            result.value = result.value.replace(/\n/g, "<br>");
          }
        }
      };

      const TAB_REPLACE_RE = /^(<[^>]+>|\t)+/gm;
      /** @type {HLJSPlugin} */
      const tabReplacePlugin = {
        "after:highlightElement": ({ result }) => {
          if (options.tabReplace) {
            result.value = result.value.replace(TAB_REPLACE_RE, (m) =>
              m.replace(/\t/g, options.tabReplace)
            );
          }
        }
      };

      /**
       * Applies highlighting to a DOM node containing code. Accepts a DOM node and
       * two optional parameters for fixMarkup.
       *
       * @param {HighlightedHTMLElement} element - the HTML element to highlight
      */
      function highlightElement(element) {
        /** @type HTMLElement */
        let node = null;
        const language = blockLanguage(element);

        if (shouldNotHighlight(language)) return;

        // support for v10 API
        fire("before:highlightElement",
          { el: element, language: language });

        node = element;
        const text = node.textContent;
        const result = language ? highlight(text, { language, ignoreIllegals: true }) : highlightAuto(text);

        // support for v10 API
        fire("after:highlightElement", { el: element, result, text });

        element.innerHTML = result.value;
        updateClassName(element, language, result.language);
        element.result = {
          language: result.language,
          // TODO: remove with version 11.0
          re: result.relevance,
          relavance: result.relevance
        };
        if (result.second_best) {
          element.second_best = {
            language: result.second_best.language,
            // TODO: remove with version 11.0
            re: result.second_best.relevance,
            relavance: result.second_best.relevance
          };
        }
      }

      /**
       * Updates highlight.js global options with the passed options
       *
       * @param {Partial<HLJSOptions>} userOptions
       */
      function configure(userOptions) {
        if (userOptions.useBR) {
          deprecated("10.3.0", "'useBR' will be removed entirely in v11.0");
          deprecated("10.3.0", "Please see https://github.com/highlightjs/highlight.js/issues/2559");
        }
        options = inherit$1(options, userOptions);
      }

      /**
       * Highlights to all <pre><code> blocks on a page
       *
       * @type {Function & {called?: boolean}}
       */
      // TODO: remove v12, deprecated
      const initHighlighting = () => {
        if (initHighlighting.called) return;
        initHighlighting.called = true;

        deprecated("10.6.0", "initHighlighting() is deprecated.  Use highlightAll() instead.");

        const blocks = document.querySelectorAll('pre code');
        blocks.forEach(highlightElement);
      };

      // Higlights all when DOMContentLoaded fires
      // TODO: remove v12, deprecated
      function initHighlightingOnLoad() {
        deprecated("10.6.0", "initHighlightingOnLoad() is deprecated.  Use highlightAll() instead.");
        wantsHighlight = true;
      }

      let wantsHighlight = false;

      /**
       * auto-highlights all pre>code elements on the page
       */
      function highlightAll() {
        // if we are called too early in the loading process
        if (document.readyState === "loading") {
          wantsHighlight = true;
          return;
        }

        const blocks = document.querySelectorAll('pre code');
        blocks.forEach(highlightElement);
      }

      function boot() {
        // if a highlight was requested before DOM was loaded, do now
        if (wantsHighlight) highlightAll();
      }

      // make sure we are in the browser environment
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('DOMContentLoaded', boot, false);
      }

      /**
       * Register a language grammar module
       *
       * @param {string} languageName
       * @param {LanguageFn} languageDefinition
       */
      function registerLanguage(languageName, languageDefinition) {
        let lang = null;
        try {
          lang = languageDefinition(hljs);
        } catch (error$1) {
          error("Language definition for '{}' could not be registered.".replace("{}", languageName));
          // hard or soft error
          if (!SAFE_MODE) { throw error$1; } else { error(error$1); }
          // languages that have serious errors are replaced with essentially a
          // "plaintext" stand-in so that the code blocks will still get normal
          // css classes applied to them - and one bad language won't break the
          // entire highlighter
          lang = PLAINTEXT_LANGUAGE;
        }
        // give it a temporary name if it doesn't have one in the meta-data
        if (!lang.name) lang.name = languageName;
        languages[languageName] = lang;
        lang.rawDefinition = languageDefinition.bind(null, hljs);

        if (lang.aliases) {
          registerAliases(lang.aliases, { languageName });
        }
      }

      /**
       * Remove a language grammar module
       *
       * @param {string} languageName
       */
      function unregisterLanguage(languageName) {
        delete languages[languageName];
        for (const alias of Object.keys(aliases)) {
          if (aliases[alias] === languageName) {
            delete aliases[alias];
          }
        }
      }

      /**
       * @returns {string[]} List of language internal names
       */
      function listLanguages() {
        return Object.keys(languages);
      }

      /**
        intended usage: When one language truly requires another

        Unlike `getLanguage`, this will throw when the requested language
        is not available.

        @param {string} name - name of the language to fetch/require
        @returns {Language | never}
      */
      function requireLanguage(name) {
        deprecated("10.4.0", "requireLanguage will be removed entirely in v11.");
        deprecated("10.4.0", "Please see https://github.com/highlightjs/highlight.js/pull/2844");

        const lang = getLanguage(name);
        if (lang) { return lang; }

        const err = new Error('The \'{}\' language is required, but not loaded.'.replace('{}', name));
        throw err;
      }

      /**
       * @param {string} name - name of the language to retrieve
       * @returns {Language | undefined}
       */
      function getLanguage(name) {
        name = (name || '').toLowerCase();
        return languages[name] || languages[aliases[name]];
      }

      /**
       *
       * @param {string|string[]} aliasList - single alias or list of aliases
       * @param {{languageName: string}} opts
       */
      function registerAliases(aliasList, { languageName }) {
        if (typeof aliasList === 'string') {
          aliasList = [aliasList];
        }
        aliasList.forEach(alias => { aliases[alias.toLowerCase()] = languageName; });
      }

      /**
       * Determines if a given language has auto-detection enabled
       * @param {string} name - name of the language
       */
      function autoDetection(name) {
        const lang = getLanguage(name);
        return lang && !lang.disableAutodetect;
      }

      /**
       * Upgrades the old highlightBlock plugins to the new
       * highlightElement API
       * @param {HLJSPlugin} plugin
       */
      function upgradePluginAPI(plugin) {
        // TODO: remove with v12
        if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
          plugin["before:highlightElement"] = (data) => {
            plugin["before:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
        if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
          plugin["after:highlightElement"] = (data) => {
            plugin["after:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
      }

      /**
       * @param {HLJSPlugin} plugin
       */
      function addPlugin(plugin) {
        upgradePluginAPI(plugin);
        plugins.push(plugin);
      }

      /**
       *
       * @param {PluginEvent} event
       * @param {any} args
       */
      function fire(event, args) {
        const cb = event;
        plugins.forEach(function(plugin) {
          if (plugin[cb]) {
            plugin[cb](args);
          }
        });
      }

      /**
      Note: fixMarkup is deprecated and will be removed entirely in v11

      @param {string} arg
      @returns {string}
      */
      function deprecateFixMarkup(arg) {
        deprecated("10.2.0", "fixMarkup will be removed entirely in v11.0");
        deprecated("10.2.0", "Please see https://github.com/highlightjs/highlight.js/issues/2534");

        return fixMarkup(arg);
      }

      /**
       *
       * @param {HighlightedHTMLElement} el
       */
      function deprecateHighlightBlock(el) {
        deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
        deprecated("10.7.0", "Please use highlightElement now.");

        return highlightElement(el);
      }

      /* Interface definition */
      Object.assign(hljs, {
        highlight,
        highlightAuto,
        highlightAll,
        fixMarkup: deprecateFixMarkup,
        highlightElement,
        // TODO: Remove with v12 API
        highlightBlock: deprecateHighlightBlock,
        configure,
        initHighlighting,
        initHighlightingOnLoad,
        registerLanguage,
        unregisterLanguage,
        listLanguages,
        getLanguage,
        registerAliases,
        requireLanguage,
        autoDetection,
        inherit: inherit$1,
        addPlugin,
        // plugins for frameworks
        vuePlugin: BuildVuePlugin(hljs).VuePlugin
      });

      hljs.debugMode = function() { SAFE_MODE = false; };
      hljs.safeMode = function() { SAFE_MODE = true; };
      hljs.versionString = version;

      for (const key in MODES) {
        // @ts-ignore
        if (typeof MODES[key] === "object") {
          // @ts-ignore
          deepFreezeEs6(MODES[key]);
        }
      }

      // merge all the modes/regexs into our main object
      Object.assign(hljs, MODES);

      // built-in plugins, likely to be moved out of core in the future
      hljs.addPlugin(brPlugin); // slated to be removed in v11
      hljs.addPlugin(mergeHTMLPlugin);
      hljs.addPlugin(tabReplacePlugin);
      return hljs;
    };

    // export an "instance" of the highlighter
    var highlight = HLJS({});

    var core = highlight;

    const IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
    const KEYWORDS = [
      "as", // for exports
      "in",
      "of",
      "if",
      "for",
      "while",
      "finally",
      "var",
      "new",
      "function",
      "do",
      "return",
      "void",
      "else",
      "break",
      "catch",
      "instanceof",
      "with",
      "throw",
      "case",
      "default",
      "try",
      "switch",
      "continue",
      "typeof",
      "delete",
      "let",
      "yield",
      "const",
      "class",
      // JS handles these with a special rule
      // "get",
      // "set",
      "debugger",
      "async",
      "await",
      "static",
      "import",
      "from",
      "export",
      "extends"
    ];
    const LITERALS = [
      "true",
      "false",
      "null",
      "undefined",
      "NaN",
      "Infinity"
    ];

    const TYPES = [
      "Intl",
      "DataView",
      "Number",
      "Math",
      "Date",
      "String",
      "RegExp",
      "Object",
      "Function",
      "Boolean",
      "Error",
      "Symbol",
      "Set",
      "Map",
      "WeakSet",
      "WeakMap",
      "Proxy",
      "Reflect",
      "JSON",
      "Promise",
      "Float64Array",
      "Int16Array",
      "Int32Array",
      "Int8Array",
      "Uint16Array",
      "Uint32Array",
      "Float32Array",
      "Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "ArrayBuffer",
      "BigInt64Array",
      "BigUint64Array",
      "BigInt"
    ];

    const ERROR_TYPES = [
      "EvalError",
      "InternalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError"
    ];

    const BUILT_IN_GLOBALS = [
      "setInterval",
      "setTimeout",
      "clearInterval",
      "clearTimeout",

      "require",
      "exports",

      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "escape",
      "unescape"
    ];

    const BUILT_IN_VARIABLES = [
      "arguments",
      "this",
      "super",
      "console",
      "window",
      "document",
      "localStorage",
      "module",
      "global" // Node.js
    ];

    const BUILT_INS = [].concat(
      BUILT_IN_GLOBALS,
      BUILT_IN_VARIABLES,
      TYPES,
      ERROR_TYPES
    );

    /**
     * @param {string} value
     * @returns {RegExp}
     * */

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function source(re) {
      if (!re) return null;
      if (typeof re === "string") return re;

      return re.source;
    }

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function lookahead(re) {
      return concat('(?=', re, ')');
    }

    /**
     * @param {...(RegExp | string) } args
     * @returns {string}
     */
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }

    /*
    Language: JavaScript
    Description: JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.
    Category: common, scripting
    Website: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    */

    /** @type LanguageFn */
    function javascript(hljs) {
      /**
       * Takes a string like "<Booger" and checks to see
       * if we can find a matching "</Booger" later in the
       * content.
       * @param {RegExpMatchArray} match
       * @param {{after:number}} param1
       */
      const hasClosingTag = (match, { after }) => {
        const tag = "</" + match[0].slice(1);
        const pos = match.input.indexOf(tag, after);
        return pos !== -1;
      };

      const IDENT_RE$1 = IDENT_RE;
      const FRAGMENT = {
        begin: '<>',
        end: '</>'
      };
      const XML_TAG = {
        begin: /<[A-Za-z0-9\\._:-]+/,
        end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
        /**
         * @param {RegExpMatchArray} match
         * @param {CallbackResponse} response
         */
        isTrulyOpeningTag: (match, response) => {
          const afterMatchIndex = match[0].length + match.index;
          const nextChar = match.input[afterMatchIndex];
          // nested type?
          // HTML should not include another raw `<` inside a tag
          // But a type might: `<Array<Array<number>>`, etc.
          if (nextChar === "<") {
            response.ignoreMatch();
            return;
          }
          // <something>
          // This is now either a tag or a type.
          if (nextChar === ">") {
            // if we cannot find a matching closing tag, then we
            // will ignore it
            if (!hasClosingTag(match, { after: afterMatchIndex })) {
              response.ignoreMatch();
            }
          }
        }
      };
      const KEYWORDS$1 = {
        $pattern: IDENT_RE,
        keyword: KEYWORDS,
        literal: LITERALS,
        built_in: BUILT_INS
      };

      // https://tc39.es/ecma262/#sec-literals-numeric-literals
      const decimalDigits = '[0-9](_?[0-9])*';
      const frac = `\\.(${decimalDigits})`;
      // DecimalIntegerLiteral, including Annex B NonOctalDecimalIntegerLiteral
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
      const NUMBER = {
        className: 'number',
        variants: [
          // DecimalLiteral
          { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))` +
            `[eE][+-]?(${decimalDigits})\\b` },
          { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },

          // DecimalBigIntegerLiteral
          { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },

          // NonDecimalIntegerLiteral
          { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
          { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
          { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },

          // LegacyOctalIntegerLiteral (does not include underscore separators)
          // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
          { begin: "\\b0[0-7]+n?\\b" },
        ],
        relevance: 0
      };

      const SUBST = {
        className: 'subst',
        begin: '\\$\\{',
        end: '\\}',
        keywords: KEYWORDS$1,
        contains: [] // defined later
      };
      const HTML_TEMPLATE = {
        begin: 'html`',
        end: '',
        starts: {
          end: '`',
          returnEnd: false,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            SUBST
          ],
          subLanguage: 'xml'
        }
      };
      const CSS_TEMPLATE = {
        begin: 'css`',
        end: '',
        starts: {
          end: '`',
          returnEnd: false,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            SUBST
          ],
          subLanguage: 'css'
        }
      };
      const TEMPLATE_STRING = {
        className: 'string',
        begin: '`',
        end: '`',
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ]
      };
      const JSDOC_COMMENT = hljs.COMMENT(
        /\/\*\*(?!\/)/,
        '\\*/',
        {
          relevance: 0,
          contains: [
            {
              className: 'doctag',
              begin: '@[A-Za-z]+',
              contains: [
                {
                  className: 'type',
                  begin: '\\{',
                  end: '\\}',
                  relevance: 0
                },
                {
                  className: 'variable',
                  begin: IDENT_RE$1 + '(?=\\s*(-)|$)',
                  endsParent: true,
                  relevance: 0
                },
                // eat spaces (not newlines) so we can find
                // types or variables
                {
                  begin: /(?=[^\n])\s/,
                  relevance: 0
                }
              ]
            }
          ]
        }
      );
      const COMMENT = {
        className: "comment",
        variants: [
          JSDOC_COMMENT,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.C_LINE_COMMENT_MODE
        ]
      };
      const SUBST_INTERNALS = [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        HTML_TEMPLATE,
        CSS_TEMPLATE,
        TEMPLATE_STRING,
        NUMBER,
        hljs.REGEXP_MODE
      ];
      SUBST.contains = SUBST_INTERNALS
        .concat({
          // we need to pair up {} inside our subst to prevent
          // it from ending too early by matching another }
          begin: /\{/,
          end: /\}/,
          keywords: KEYWORDS$1,
          contains: [
            "self"
          ].concat(SUBST_INTERNALS)
        });
      const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
      const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
        // eat recursive parens in sub expressions
        {
          begin: /\(/,
          end: /\)/,
          keywords: KEYWORDS$1,
          contains: ["self"].concat(SUBST_AND_COMMENTS)
        }
      ]);
      const PARAMS = {
        className: 'params',
        begin: /\(/,
        end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: KEYWORDS$1,
        contains: PARAMS_CONTAINS
      };

      return {
        name: 'Javascript',
        aliases: ['js', 'jsx', 'mjs', 'cjs'],
        keywords: KEYWORDS$1,
        // this will be extended by TypeScript
        exports: { PARAMS_CONTAINS },
        illegal: /#(?![$_A-z])/,
        contains: [
          hljs.SHEBANG({
            label: "shebang",
            binary: "node",
            relevance: 5
          }),
          {
            label: "use_strict",
            className: 'meta',
            relevance: 10,
            begin: /^\s*['"]use (strict|asm)['"]/
          },
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE,
          HTML_TEMPLATE,
          CSS_TEMPLATE,
          TEMPLATE_STRING,
          COMMENT,
          NUMBER,
          { // object attr container
            begin: concat(/[{,\n]\s*/,
              // we need to look ahead to make sure that we actually have an
              // attribute coming up so we don't steal a comma from a potential
              // "value" container
              //
              // NOTE: this might not work how you think.  We don't actually always
              // enter this mode and stay.  Instead it might merely match `,
              // <comments up next>` and then immediately end after the , because it
              // fails to find any actual attrs. But this still does the job because
              // it prevents the value contain rule from grabbing this instead and
              // prevening this rule from firing when we actually DO have keys.
              lookahead(concat(
                // we also need to allow for multiple possible comments inbetween
                // the first key:value pairing
                /(((\/\/.*$)|(\/\*(\*[^/]|[^*])*\*\/))\s*)*/,
                IDENT_RE$1 + '\\s*:'))),
            relevance: 0,
            contains: [
              {
                className: 'attr',
                begin: IDENT_RE$1 + lookahead('\\s*:'),
                relevance: 0
              }
            ]
          },
          { // "value" container
            begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
            keywords: 'return throw case',
            contains: [
              COMMENT,
              hljs.REGEXP_MODE,
              {
                className: 'function',
                // we have to count the parens to make sure we actually have the
                // correct bounding ( ) before the =>.  There could be any number of
                // sub-expressions inside also surrounded by parens.
                begin: '(\\(' +
                '[^()]*(\\(' +
                '[^()]*(\\(' +
                '[^()]*' +
                '\\)[^()]*)*' +
                '\\)[^()]*)*' +
                '\\)|' + hljs.UNDERSCORE_IDENT_RE + ')\\s*=>',
                returnBegin: true,
                end: '\\s*=>',
                contains: [
                  {
                    className: 'params',
                    variants: [
                      {
                        begin: hljs.UNDERSCORE_IDENT_RE,
                        relevance: 0
                      },
                      {
                        className: null,
                        begin: /\(\s*\)/,
                        skip: true
                      },
                      {
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: true,
                        excludeEnd: true,
                        keywords: KEYWORDS$1,
                        contains: PARAMS_CONTAINS
                      }
                    ]
                  }
                ]
              },
              { // could be a comma delimited list of params to a function call
                begin: /,/, relevance: 0
              },
              {
                className: '',
                begin: /\s/,
                end: /\s*/,
                skip: true
              },
              { // JSX
                variants: [
                  { begin: FRAGMENT.begin, end: FRAGMENT.end },
                  {
                    begin: XML_TAG.begin,
                    // we carefully check the opening tag to see if it truly
                    // is a tag and not a false positive
                    'on:begin': XML_TAG.isTrulyOpeningTag,
                    end: XML_TAG.end
                  }
                ],
                subLanguage: 'xml',
                contains: [
                  {
                    begin: XML_TAG.begin,
                    end: XML_TAG.end,
                    skip: true,
                    contains: ['self']
                  }
                ]
              }
            ],
            relevance: 0
          },
          {
            className: 'function',
            beginKeywords: 'function',
            end: /[{;]/,
            excludeEnd: true,
            keywords: KEYWORDS$1,
            contains: [
              'self',
              hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1 }),
              PARAMS
            ],
            illegal: /%/
          },
          {
            // prevent this from getting swallowed up by function
            // since they appear "function like"
            beginKeywords: "while if switch catch for"
          },
          {
            className: 'function',
            // we have to count the parens to make sure we actually have the correct
            // bounding ( ).  There could be any number of sub-expressions inside
            // also surrounded by parens.
            begin: hljs.UNDERSCORE_IDENT_RE +
              '\\(' + // first parens
              '[^()]*(\\(' +
                '[^()]*(\\(' +
                  '[^()]*' +
                '\\)[^()]*)*' +
              '\\)[^()]*)*' +
              '\\)\\s*\\{', // end parens
            returnBegin:true,
            contains: [
              PARAMS,
              hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1 }),
            ]
          },
          // hack: prevents detection of keywords in some circumstances
          // .keyword()
          // $keyword = x
          {
            variants: [
              { begin: '\\.' + IDENT_RE$1 },
              { begin: '\\$' + IDENT_RE$1 }
            ],
            relevance: 0
          },
          { // ES6 class
            className: 'class',
            beginKeywords: 'class',
            end: /[{;=]/,
            excludeEnd: true,
            illegal: /[:"[\]]/,
            contains: [
              { beginKeywords: 'extends' },
              hljs.UNDERSCORE_TITLE_MODE
            ]
          },
          {
            begin: /\b(?=constructor)/,
            end: /[{;]/,
            excludeEnd: true,
            contains: [
              hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1 }),
              'self',
              PARAMS
            ]
          },
          {
            begin: '(get|set)\\s+(?=' + IDENT_RE$1 + '\\()',
            end: /\{/,
            keywords: "get set",
            contains: [
              hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1 }),
              { begin: /\(\)/ }, // eat to avoid empty params
              PARAMS
            ]
          },
          {
            begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
          }
        ]
      };
    }

    var javascript_1 = javascript;

    /* src/Question-Handler.svelte generated by Svelte v3.35.0 */
    const file$1 = "src/Question-Handler.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (35:4) {#each $questions.slice(page * questionsPerPage, (page + 1) * questionsPerPage) as question (question.id)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let questioncard;
    	let current;

    	questioncard = new Question_Card({
    			props: { question: /*question*/ ctx[7] },
    			$$inline: true
    		});

    	questioncard.$on("answerClicked", handleAnswer);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(questioncard.$$.fragment);
    			attr_dev(div, "class", "card-wrapper svelte-1e6txcn");
    			add_location(div, file$1, 35, 6, 1239);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(questioncard, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const questioncard_changes = {};
    			if (dirty & /*$questions, page*/ 5) questioncard_changes.question = /*question*/ ctx[7];
    			questioncard.$set(questioncard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(questioncard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(questioncard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(questioncard);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(35:4) {#each $questions.slice(page * questionsPerPage, (page + 1) * questionsPerPage) as question (question.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let div0;
    	let paginationnav0;
    	let updating_page;
    	let t0;
    	let div2;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t1;
    	let div1;
    	let paginationnav1;
    	let updating_page_1;
    	let current;

    	function paginationnav0_page_binding(value) {
    		/*paginationnav0_page_binding*/ ctx[5](value);
    	}

    	let paginationnav0_props = {
    		total: Math.ceil(/*$counter*/ ctx[1].questions / /*questionsPerPage*/ ctx[3]),
    		shown: /*pageShown*/ ctx[4]
    	};

    	if (/*page*/ ctx[0] !== void 0) {
    		paginationnav0_props.page = /*page*/ ctx[0];
    	}

    	paginationnav0 = new PaginationNav({
    			props: paginationnav0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(paginationnav0, "page", paginationnav0_page_binding));
    	let each_value = /*$questions*/ ctx[2].slice(/*page*/ ctx[0] * /*questionsPerPage*/ ctx[3], (/*page*/ ctx[0] + 1) * /*questionsPerPage*/ ctx[3]);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*question*/ ctx[7].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	function paginationnav1_page_binding(value) {
    		/*paginationnav1_page_binding*/ ctx[6](value);
    	}

    	let paginationnav1_props = {
    		total: Math.ceil(/*$counter*/ ctx[1].questions / /*questionsPerPage*/ ctx[3]),
    		shown: /*pageShown*/ ctx[4]
    	};

    	if (/*page*/ ctx[0] !== void 0) {
    		paginationnav1_props.page = /*page*/ ctx[0];
    	}

    	paginationnav1 = new PaginationNav({
    			props: paginationnav1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(paginationnav1, "page", paginationnav1_page_binding));

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			create_component(paginationnav0.$$.fragment);
    			t0 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div1 = element("div");
    			create_component(paginationnav1.$$.fragment);
    			attr_dev(div0, "class", "pagination-wrapper svelte-1e6txcn");
    			add_location(div0, file$1, 26, 2, 925);
    			attr_dev(div1, "class", "pagination-wrapper svelte-1e6txcn");
    			add_location(div1, file$1, 40, 4, 1364);
    			attr_dev(div2, "class", "container svelte-1e6txcn");
    			add_location(div2, file$1, 33, 2, 1098);
    			attr_dev(div3, "class", "container-wrapper svelte-1e6txcn");
    			add_location(div3, file$1, 25, 0, 891);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			mount_component(paginationnav0, div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(paginationnav1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const paginationnav0_changes = {};
    			if (dirty & /*$counter*/ 2) paginationnav0_changes.total = Math.ceil(/*$counter*/ ctx[1].questions / /*questionsPerPage*/ ctx[3]);

    			if (!updating_page && dirty & /*page*/ 1) {
    				updating_page = true;
    				paginationnav0_changes.page = /*page*/ ctx[0];
    				add_flush_callback(() => updating_page = false);
    			}

    			paginationnav0.$set(paginationnav0_changes);

    			if (dirty & /*$questions, page, questionsPerPage, handleAnswer*/ 13) {
    				each_value = /*$questions*/ ctx[2].slice(/*page*/ ctx[0] * /*questionsPerPage*/ ctx[3], (/*page*/ ctx[0] + 1) * /*questionsPerPage*/ ctx[3]);
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div2, outro_and_destroy_block, create_each_block, t1, get_each_context);
    				check_outros();
    			}

    			const paginationnav1_changes = {};
    			if (dirty & /*$counter*/ 2) paginationnav1_changes.total = Math.ceil(/*$counter*/ ctx[1].questions / /*questionsPerPage*/ ctx[3]);

    			if (!updating_page_1 && dirty & /*page*/ 1) {
    				updating_page_1 = true;
    				paginationnav1_changes.page = /*page*/ ctx[0];
    				add_flush_callback(() => updating_page_1 = false);
    			}

    			paginationnav1.$set(paginationnav1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationnav0.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(paginationnav1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationnav0.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(paginationnav1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(paginationnav0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			destroy_component(paginationnav1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $counter;
    	let $questions;
    	validate_store(counter, "counter");
    	component_subscribe($$self, counter, $$value => $$invalidate(1, $counter = $$value));
    	validate_store(questions, "questions");
    	component_subscribe($$self, questions, $$value => $$invalidate(2, $questions = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Question_Handler", slots, []);
    	getQuestions();
    	let page;
    	let questionsPerPage = window.innerWidth > 600 ? 10 : 5;
    	let pageShown = window.innerWidth > 600 ? 7 : 4;
    	core.registerLanguage("javascript", javascript_1);

    	afterUpdate(() => {
    		core.highlightAll();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Question_Handler> was created with unknown prop '${key}'`);
    	});

    	function paginationnav0_page_binding(value) {
    		page = value;
    		$$invalidate(0, page);
    	}

    	function paginationnav1_page_binding(value) {
    		page = value;
    		$$invalidate(0, page);
    	}

    	$$self.$capture_state = () => ({
    		questions,
    		counter,
    		getQuestions,
    		handleAnswer,
    		PaginationNav,
    		afterUpdate,
    		QuestionCard: Question_Card,
    		hljs: core,
    		javascript: javascript_1,
    		page,
    		questionsPerPage,
    		pageShown,
    		$counter,
    		$questions
    	});

    	$$self.$inject_state = $$props => {
    		if ("page" in $$props) $$invalidate(0, page = $$props.page);
    		if ("questionsPerPage" in $$props) $$invalidate(3, questionsPerPage = $$props.questionsPerPage);
    		if ("pageShown" in $$props) $$invalidate(4, pageShown = $$props.pageShown);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*page*/ 1) {
    			// Whenever `page` changes, it scrolls up. This comma notation may look strange, but it was recommended by the creator of Svelte:
    			//  https://twitter.com/liyuanqiu/status/1149235193296773122
    			(window.scrollTo(0, 0));
    		}
    	};

    	return [
    		page,
    		$counter,
    		$questions,
    		questionsPerPage,
    		pageShown,
    		paginationnav0_page_binding,
    		paginationnav1_page_binding
    	];
    }

    class Question_Handler extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Question_Handler",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.35.0 */
    const file = "src/Footer.svelte";

    function create_fragment$1(ctx) {
    	let footer;
    	let div;
    	let span0;
    	let a0;
    	let t1;
    	let span1;
    	let a1;
    	let img;
    	let img_src_value;
    	let t2;
    	let span2;
    	let a2;
    	let t4;
    	let span3;
    	let a3;
    	let t6;
    	let span4;
    	let a4;
    	let t8;
    	let span5;
    	let a5;
    	let t10;
    	let span6;
    	let a6;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			span0 = element("span");
    			a0 = element("a");
    			a0.textContent = "by nclskfm";
    			t1 = space();
    			span1 = element("span");
    			a1 = element("a");
    			img = element("img");
    			t2 = space();
    			span2 = element("span");
    			a2 = element("a");
    			a2.textContent = "source code";
    			t4 = space();
    			span3 = element("span");
    			a3 = element("a");
    			a3.textContent = "questions by lydiahallie";
    			t6 = space();
    			span4 = element("span");
    			a4 = element("a");
    			a4.textContent = "made with svelte";
    			t8 = space();
    			span5 = element("span");
    			a5 = element("a");
    			a5.textContent = "settings";
    			t10 = space();
    			span6 = element("span");
    			a6 = element("a");
    			a6.textContent = "impressum";
    			attr_dev(a0, "href", "https://github.com/nclskfm");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener");
    			add_location(a0, file, 13, 7, 230);
    			attr_dev(span0, "class", "svelte-y4myz");
    			add_location(span0, file, 12, 4, 217);
    			if (img.src !== (img_src_value = "https://cdn.buymeacoffee.com/buttons/v2/default-blue.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Buy Me A Coffee");
    			attr_dev(img, "height", "40px");
    			add_location(img, file, 22, 9, 469);
    			attr_dev(a1, "href", "https://www.buymeacoffee.com/nclskfm");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener");
    			add_location(a1, file, 18, 6, 358);
    			attr_dev(span1, "class", "svelte-y4myz");
    			add_location(span1, file, 17, 4, 345);
    			attr_dev(a2, "href", "https://github.com/nclskfm/javascript-quiz");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noopener");
    			add_location(a2, file, 30, 7, 654);
    			attr_dev(span2, "class", "svelte-y4myz");
    			add_location(span2, file, 29, 4, 641);
    			attr_dev(a3, "href", "https://github.com/lydiahallie/javascript-questions/");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noopener");
    			add_location(a3, file, 37, 7, 814);
    			attr_dev(span3, "class", "svelte-y4myz");
    			add_location(span3, file, 36, 4, 801);
    			attr_dev(a4, "href", "https://svelte.dev/");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "rel", "noopener");
    			add_location(a4, file, 44, 7, 997);
    			attr_dev(span4, "class", "svelte-y4myz");
    			add_location(span4, file, 43, 4, 984);
    			attr_dev(a5, "href", "/#");
    			add_location(a5, file, 48, 10, 1117);
    			attr_dev(span5, "class", "svelte-y4myz");
    			add_location(span5, file, 48, 4, 1111);
    			attr_dev(a6, "href", "https://www.niclaskaufmann.de/impressum.html");
    			attr_dev(a6, "target", "_blank");
    			attr_dev(a6, "rel", "noopener");
    			add_location(a6, file, 50, 7, 1191);
    			attr_dev(span6, "class", "svelte-y4myz");
    			add_location(span6, file, 49, 4, 1178);
    			attr_dev(div, "class", "container svelte-y4myz");
    			add_location(div, file, 11, 2, 189);
    			attr_dev(footer, "class", "svelte-y4myz");
    			add_location(footer, file, 10, 0, 178);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    			append_dev(div, span0);
    			append_dev(span0, a0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(span1, a1);
    			append_dev(a1, img);
    			append_dev(div, t2);
    			append_dev(div, span2);
    			append_dev(span2, a2);
    			append_dev(div, t4);
    			append_dev(div, span3);
    			append_dev(span3, a3);
    			append_dev(div, t6);
    			append_dev(div, span4);
    			append_dev(span4, a4);
    			append_dev(div, t8);
    			append_dev(div, span5);
    			append_dev(span5, a5);
    			append_dev(div, t10);
    			append_dev(div, span6);
    			append_dev(span6, a6);

    			if (!mounted) {
    				dispose = listen_dev(a5, "click", /*openSettings*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const dispatch = createEventDispatcher();

    	function openSettings() {
    		dispatch("openSettings");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		openSettings
    	});

    	return [openSettings];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.35.0 */

    // (15:0) {:else}
    function create_else_block(ctx) {
    	let header;
    	let t0;
    	let questionhandler;
    	let t1;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	questionhandler = new Question_Handler({ $$inline: true });
    	footer = new Footer({ $$inline: true });
    	footer.$on("openSettings", /*openSettings_handler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(questionhandler.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(questionhandler, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(questionhandler.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(questionhandler.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(questionhandler, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(15:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (13:0) {#if showSettings}
    function create_if_block(ctx) {
    	let settings;
    	let current;
    	settings = new Settings({ $$inline: true });
    	settings.$on("close", /*close_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(settings.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(settings, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(settings, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(13:0) {#if showSettings}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*showSettings*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let showSettings = !getCookie("cookiesAllowed");
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const close_handler = () => $$invalidate(0, showSettings = false);
    	const openSettings_handler = () => $$invalidate(0, showSettings = true);

    	$$self.$capture_state = () => ({
    		Header,
    		Settings,
    		QuestionHandler: Question_Handler,
    		Footer,
    		getCookie,
    		showSettings
    	});

    	$$self.$inject_state = $$props => {
    		if ("showSettings" in $$props) $$invalidate(0, showSettings = $$props.showSettings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showSettings, close_handler, openSettings_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {},
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
