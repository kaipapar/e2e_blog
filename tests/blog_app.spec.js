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
})