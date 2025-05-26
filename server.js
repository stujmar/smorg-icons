import express from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = 3005

app.use(express.json())
app.use(cors())

const THEME_FILE = path.join(__dirname, 'user-themes.json')

// Ensure the theme file exists
async function ensureThemeFile() {
  try {
    await fs.access(THEME_FILE)
  } catch {
    await fs.writeFile(THEME_FILE, '{}')
  }
}

// Load themes
app.get('/api/themes', async (req, res) => {
  try {
    await ensureThemeFile()
    const data = await fs.readFile(THEME_FILE, 'utf8')
    res.json(JSON.parse(data))
  } catch (error) {
    console.error('Error loading themes:', error)
    res.status(500).json({ error: 'Failed to load themes' })
  }
})

// Save themes
app.post('/api/themes', async (req, res) => {
  try {
    const themes = req.body
    await fs.writeFile(THEME_FILE, JSON.stringify(themes, null, 2))
    res.json({ success: true })
  } catch (error) {
    console.error('Error saving themes:', error)
    res.status(500).json({ error: 'Failed to save themes' })
  }
})

app.listen(port, () => {
  console.log(`Theme server running at http://localhost:${port}`)
}) 