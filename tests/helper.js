const loginWith = async (page, username, password) => {
    const login_btn = await page.getByRole('button', { name: 'login' })
    const textboxes = await page.getByRole('textbox').all()
    await textboxes[0].fill(username)
    await textboxes[1].fill(password)
    await login_btn.click()
}

const addNewBlogWith = async (page, blog) => {
    await page.getByRole('button', {name: 'create'}).click()
    const forms = await page.getByRole('textbox').all()
    await forms[0].fill(blog.title)
    await forms[1].fill(blog.author)
    await forms[2].fill(blog.url)

    await page.getByRole('button', {name: 'create'}).click()
}

export {loginWith, addNewBlogWith}