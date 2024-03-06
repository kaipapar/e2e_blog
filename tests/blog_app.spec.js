const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    }) 

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    const login_btn = await page.getByRole('button', { name: 'login' })
    const username = await page.getByRole('textbox').first()
    const password = await page.getByRole('textbox').last()
    await expect(locator).toBeVisible()
    await expect(login_btn).toBeVisible()
    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        const login_btn = await page.getByRole('button', { name: 'login' })
        await page.getByRole('textbox').first().fill('mluukkai')
        await page.getByRole('textbox').last().fill('salainen')
        await login_btn.click()
        const locator = await page.getByText('blogs')
        await expect(locator).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        const login_btn = await page.getByRole('button', { name: 'login' })
        await page.getByRole('textbox').first().fill('bloh')
        await page.getByRole('textbox').last().fill('blih')
        await login_btn.click()
        const locator = await page.getByText('blogs')
        await expect(locator).toBeHidden()    
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        const login_btn = await page.getByRole('button', { name: 'login' })
        await page.getByRole('textbox').first().fill('mluukkai')
        await page.getByRole('textbox').last().fill('salainen')
        await login_btn.click()
    })

    const new_blog = {
        title: 'new title',
        author: 'its a me',
        url: 'http://localhost:5173/',
    }  
    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', {name: 'create'}).click()
        const forms = await page.getByRole('textbox').all()
        await forms[0].fill(new_blog.title)
        await forms[1].fill(new_blog.author)
        await forms[2].fill(new_blog.url)

        await page.getByRole('button', {name: 'create'}).click()

        const vis_blog = await page.getByText(new_blog.title)
        await expect(vis_blog).toBeVisible()


    })
  })    
})