import {createNewPost, insertBlock, ensureSidebarOpened} from '@wordpress/e2e-test-utils'

describe('Handle Autocomplete Logic', () => {
  test("Class can be remembered", async() => {
    await createNewPost();
    await insertBlock('Paragraph');

    await ensureSidebarOpened();
    await page.waitForSelector('.bccfg-class-input input')

    await page.focus('.bccfg-class-input input')
    await page.keyboard.type('test-class,')

    let isAlreadyStarred = (await page.$('.bccfg-unstar')) || null;

    if(isAlreadyStarred) {
      await page.click("svg.bccfg-unstar")
    }

    // Click remember button
    await page.click("svg.bccfg-star")

    await insertBlock('Paragraph');

    await ensureSidebarOpened();
    await page.waitForSelector('.bccfg-class-input input')

    // trigger autocomplete
    await page.focus('.bccfg-class-input input')
    await page.keyboard.type('test-class')

    // check innertext of suggestion
    const suggestion = await page.$eval('.bccfg-suggestions li', e => e.innerText)
    console.log(suggestion)
    expect(suggestion).toBe('test-class')
  })

})