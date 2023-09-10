
import {createNewPost, insertBlock, ensureSidebarOpened} from '@wordpress/e2e-test-utils'

describe('Editor Functionality', () => {
  test("Panel is present in editor", async() => {
    await createNewPost();
    await insertBlock('Paragraph');

    await ensureSidebarOpened();
    await page.waitForSelector('.bccfg-class-input input')

    expect(
      await page.$('.bccfg-class-input input')
    ).not.toBeNull()
  })

  test("Class can be inserted", async() => {
    await page.focus('.bccfg-class-input input')
    await page.keyboard.type('test-class,')

    expect(
      await page.$('.better-custom-classes__pill')
    ).not.toBeNull()
  })

  test("Class can be deleted", async() => {
    await page.click('.better-custom-classes__pill .better-custom-classes__pill-delete')

    expect(
      await page.$('.better-custom-classes__pill')
    ).toBeNull()
  })

})

describe('Handle Blocks without support', () => {
  test("Panel does not show up when not supported", async() => {
    await insertBlock('More');
    await ensureSidebarOpened();

    expect(
      await page.$('.bccfg-class-input')
    ).toBeNull()
  })
})

