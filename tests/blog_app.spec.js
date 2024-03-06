const { test, expect, beforeEach, describe } = require('@playwright/test')
const Helper = require('./helper')
import { addNewBlogWith, loginWith } from './helper'
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
        await Helper.loginWith(page, 'mluukkai', 'salainen')
        const locator = await page.getByText('blogs')
        await expect(locator).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await Helper.loginWith(page, 'blih', 'bloh')
        const locator = await page.getByText('blogs')
        await expect(locator).toBeHidden()    
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        Helper.loginWith(page, 'mluukkai', 'salainen')
    })

    const new_blog = {
        title: 'new title',
        author: 'its a me',
        url: 'http://localhost:5173/',
    }  
    test('a new blog can be created', async ({ page }) => {
        await Helper.addNewBlogWith(page, new_blog)
        const vis_blog = await page.getByText(new_blog.title)
        await expect(vis_blog).toBeVisible()
    })        
    test('liking a blog post is possible', async({page}) => {
            await Helper.addNewBlogWith(page, new_blog)
            await page.getByRole('button', {name: 'Show'}).click()
            const likes_before = await page.getByTestId('likes')
            await page.getByRole('button', {name: 'Like'}).click()
            const likes_after = await page.getByTestId('likes')
            await expect(likes_after).not.toBe(likes_before)

        })
  })    
})