﻿// >> frame-require
import { Frame, getFrameById, topmost, NavigationEntry } from "tns-core-modules/ui/frame";
// << frame-require

import { getRootView } from "tns-core-modules/application";
import { Label } from "tns-core-modules/ui/label";
import { Page } from "tns-core-modules/ui/page";
import * as helper from "../helper";
import * as TKUnit from "../../TKUnit";

const NAV_WAIT = 8;

export function ignore_test_DummyTestForSnippetOnly0() {
    // >> frame-navigating
    const frame = topmost();
    frame.navigate("details-page");
    // << frame-navigating
}

export function ignore_test_DummyTestForSnippetOnly1() {
    // >> frame-factory-func
    const func = function () {
        const label = new Label();
        label.text = "Hello, world!";
        const page = new Page();
        page.content = label;
        return page;
    };
    const frame = topmost();
    frame.navigate(func);
    // <<frame-factory-func
}

export function ignore_test_DummyTestForSnippetOnly2() {
    // >> frame-naventry
    const navigationEntry = {
        moduleName: "details-page",
        context: { info: "something you want to pass to your page" },
        animated: false
    };
    const frame = topmost();
    frame.navigate(navigationEntry);
    // << frame-naventry
}

export function ignore_test_DummyTestForSnippetOnly3() {
    // >> frame-naventrycontext
    const navigationEntry: NavigationEntry = {
        moduleName: "details-page",
        bindingContext: { info: "something you want to pass as binding context to your page" },
        animated: false
    };
    const frame = topmost();
    frame.navigate(navigationEntry);
    // << frame-naventrycontext
}

export function ignore_test_DummyTestForSnippetOnly4() {
    // >> frame-back
    const frame = topmost();
    frame.goBack();
    // << frame-back
}

export function test_can_go_back() {
    const frame = topmost();

    frame.navigate({ create: () => new Page(), clearHistory: true });
    TKUnit.waitUntilReady(() => frame.navigationQueueIsEmpty());

    frame.navigate(() => new Page());
    frame.navigate(() => new Page());
    frame.navigate({ create: () => new Page(), backstackVisible: false });
    frame.navigate(() => new Page());

    TKUnit.assertTrue(frame.canGoBack(), "1");
    frame.goBack();

    TKUnit.assertTrue(frame.canGoBack(), "2");
    frame.goBack();

    TKUnit.assertTrue(frame.canGoBack(), "3");
    frame.goBack();

    TKUnit.assertFalse(frame.canGoBack(), "4");
    frame.goBack();

    frame.navigate({ create: () => new Page(), backstackVisible: false });
    frame.navigate(() => new Page());

    TKUnit.assertTrue(frame.canGoBack(), "5");
    frame.goBack();

    TKUnit.assertFalse(frame.canGoBack(), "6");
    frame.goBack();

    frame.navigate(() => new Page());
    frame.navigate({ create: () => new Page(), clearHistory: true });

    TKUnit.assertFalse(frame.canGoBack(), "7");
    frame.goBack();

    frame.navigate(() => new Page());
    frame.navigate({ create: () => new Page(), backstackVisible: false });

    TKUnit.assertTrue(frame.canGoBack(), "8");
    frame.goBack();

    TKUnit.assertTrue(frame.canGoBack(), "9");
    frame.goBack();

    TKUnit.assertFalse(frame.canGoBack(), "10");
    frame.goBack();

    frame.navigate(() => new Page());
    frame.navigate({ create: () => new Page(), clearHistory: true });
    frame.navigate({ create: () => new Page(), backstackVisible: false });

    TKUnit.assertTrue(frame.canGoBack(), "11");
    frame.goBack();

    TKUnit.assertFalse(frame.canGoBack(), "12");
    frame.goBack();

    frame.navigate({ create: () => new Page(), clearHistory: true });
    frame.navigate({ create: () => new Page(), backstackVisible: false });
    frame.navigate(() => new Page());

    TKUnit.assertTrue(frame.canGoBack(), "13");
    frame.goBack();

    TKUnit.assertFalse(frame.canGoBack(), "14");
    frame.goBack();
    TKUnit.waitUntilReady(() => frame.navigationQueueIsEmpty(), NAV_WAIT);
}

export function test_go_back_to_backstack_entry() {
    const frame = topmost();
    frame.navigate(() => new Page());
    TKUnit.waitUntilReady(() => frame.navigationQueueIsEmpty());

    frame.navigate(() => new Page());
    frame.navigate(() => new Page());
    frame.navigate({ create: () => new Page(), backstackVisible: false });
    frame.navigate(() => new Page());

    TKUnit.assertTrue(frame.canGoBack(), "1");
    frame.goBack(frame.backStack[0]);

    TKUnit.assertFalse(frame.canGoBack(), "2");
    frame.goBack();
    TKUnit.waitUntilReady(() => frame.navigationQueueIsEmpty(), NAV_WAIT);
}

export function test_page_parent_when_backstackVisible_is_false() {
    const frame = topmost();

    const pages = new Array<Page>();
    const create = () => {
        const page = new Page();
        pages.push(page);
        return page;
    };

    frame.navigate({ create: () => new Page(), clearHistory: true });
    frame.navigate({ create, backstackVisible: false });
    frame.navigate(() => new Page());
    TKUnit.waitUntilReady(() => frame.navigationQueueIsEmpty(), NAV_WAIT);

    TKUnit.assertEqual(pages.length, 1);
    TKUnit.assertEqual(frame.backStack.length, 1);
    pages.forEach(p => {
        TKUnit.assertNull(p.parent);
        TKUnit.assertNull(p.frame);
    });

    pages.length = 0;
}

export function test_page_parent_when_navigate_with_clear_history() {
    const frame = topmost();

    const pages = new Array<Page>();
    const create = () => {
        const page = new Page();
        pages.push(page);
        return page;
    };

    frame.navigate({ create });
    frame.navigate({ create, backstackVisible: false });
    frame.navigate({ create });
    frame.navigate({ create: () => new Page(), clearHistory: true });
    TKUnit.waitUntilReady(() => frame.navigationQueueIsEmpty(), NAV_WAIT);

    TKUnit.assertEqual(pages.length, 3);
    TKUnit.assertEqual(frame.backStack.length, 0);
    pages.forEach(p => {
        TKUnit.assertNull(p.parent);
        TKUnit.assertNull(p.frame);
    });

    pages.length = 0;
}

export function test_page_parent_when_navigate_back() {
    const frame = topmost();

    const pages = new Array<Page>();
    const create = () => {
        const page = new Page();
        pages.push(page);
        return page;
    };

    frame.navigate({ create: () => new Page(), clearHistory: true });
    frame.navigate({ create });
    frame.goBack();
    TKUnit.waitUntilReady(() => frame.navigationQueueIsEmpty(), NAV_WAIT);

    TKUnit.assertEqual(pages.length, 1);
    TKUnit.assertEqual(frame.backStack.length, 0);
    pages.forEach(p => {
        TKUnit.assertNull(p.parent);
        TKUnit.assertNull(p.frame);
    });

    pages.length = 0;
}

export function test_frame_retrieval_API_when_navigating() {
    const rootView = getRootView();

    const initialFrame = new Frame();
    initialFrame.id = "initialFrame";
    initialFrame.navigate(() => new Page());

    const initialTopmost = topmost();
    const initialFrameById = getFrameById("initialFrame");

    TKUnit.assertEqual(initialTopmost, initialFrame);
    TKUnit.assertEqual(initialFrameById, initialFrame);

    const newFrame = new Frame();
    newFrame.id = "newFrame";
    newFrame.navigate(() => new Page());

    const newTopmost = topmost();
    const newFrameById = getFrameById("newFrame");

    TKUnit.assertEqual(newTopmost, newFrame);
    TKUnit.assertEqual(newFrameById, newFrame);

    initialFrame.navigate(() => new Page());

    const previousTopmost = topmost();
    const previousFrameById = getFrameById("initialFrame");

    TKUnit.assertEqual(previousTopmost, initialFrame);
    TKUnit.assertEqual(previousFrameById, initialFrame);

    // clean up the frame stack
    initialFrame._removeFromFrameStack();
    newFrame._removeFromFrameStack();
}